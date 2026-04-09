import { useRef, useState, useCallback, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Network, Star, ZoomIn } from 'lucide-react';

const RELATION_COLORS = {
  가족: '#7C3AED',
  동료: '#2563EB',
  친구: '#16A34A',
  적대: '#DC2626',
  연인: '#DB2777',
  기타: '#6B7280',
};

export default function SynapseMap({ characters, relations }) {
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  const [width, setWidth] = useState(800);
  const [selectedId, setSelectedId] = useState(null);
  const [showFavoriteOnly, setShowFavoriteOnly] = useState(false);

  const visibleCharacters = showFavoriteOnly
    ? characters.filter((c) => c.is_favorite)
    : characters;

  const visibleCharacterIds = new Set(visibleCharacters.map((c) => c.id));

  const visibleRelations = relations.filter((r) => (
    visibleCharacterIds.has(r.source) && visibleCharacterIds.has(r.target)
  ));

  const selectedCharacter = visibleCharacters.find((c) => c.id === selectedId) || null;

  const selectedRelations = selectedCharacter
    ? visibleRelations.filter((r) => r.source === selectedCharacter.id || r.target === selectedCharacter.id)
    : [];

  const getCharacterName = (id) => (
    visibleCharacters.find((c) => c.id === id)?.name || '(알 수 없음)'
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedId && !visibleCharacters.some((c) => c.id === selectedId)) {
      setSelectedId(null);
    }
  }, [showFavoriteOnly, selectedId, visibleCharacters]);

  const graphData = {
    nodes: visibleCharacters.map((c) => ({
      id: c.id,
      name: c.name,
      color: c.group_color || '#6B7280',
      val: c.importance || 1,
      is_favorite: !!c.is_favorite,
    })),
    links: visibleRelations.map((r) => ({
      id: r.id,
      source: r.source,
      target: r.target,
      color: RELATION_COLORS[r.type] || RELATION_COLORS['기타'],
      width: Math.max(1, Number(r.strength || 1)),
      type: r.type || '기타',
    })),
  };

  const nodeCanvasObject = useCallback(
    (node, ctx) => {
      const radius = 4 + (node.val || 1) * 2;
      const isSelected = node.id === selectedId;
      const isFavorite = !!node.is_favorite;

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();

      if (isFavorite) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 2, 0, 2 * Math.PI);
        ctx.strokeStyle = '#EAB308';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      if (isSelected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 5, 0, 2 * Math.PI);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(node.name, node.x, node.y + radius + 3);

      if (isFavorite) {
        ctx.font = '11px sans-serif';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#EAB308';
        ctx.fillText('★', node.x, node.y - radius - 2);
      }
    },
    [selectedId]
  );

  const handleNodeClick = useCallback((node) => {
    setSelectedId((prev) => (prev === node.id ? null : node.id));
  }, []);

  if (characters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-500">
        <Network className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-lg">인물이 없습니다.</p>
        <p className="text-sm mt-1">인물 탭에서 인물을 추가한 후 맵을 확인하세요.</p>
      </div>
    );
  }

  const handleZoomToFit = () => {
    if (!graphRef.current) return;
    graphRef.current.zoomToFit(500, 60);
  };

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowFavoriteOnly((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
            showFavoriteOnly
              ? 'bg-yellow-500/20 text-yellow-300'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <Star className="h-4 w-4" />
          즐겨찾기만 보기
        </button>
        <button
          onClick={handleZoomToFit}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-gray-700"
        >
          <ZoomIn className="h-4 w-4" />
          전체 보기
        </button>
      </div>

      {visibleCharacters.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Star className="mb-3 h-10 w-10 opacity-30" />
          <p className="text-lg">즐겨찾기 인물이 없습니다.</p>
          <p className="mt-1 text-sm">인물 탭에서 즐겨찾기를 지정한 뒤 다시 확인하세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
          <div
            ref={containerRef}
            className="overflow-hidden rounded-xl border border-gray-800"
            style={{ height: '600px' }}
          >
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              width={width || 800}
              height={600}
              backgroundColor="#030712"
              nodeCanvasObject={nodeCanvasObject}
              nodeCanvasObjectMode={() => 'replace'}
              linkColor={(link) => link.color}
              linkWidth={(link) => Math.max(1, link.width)}
              linkLineDash={(link) => (link.type === '적대' || link.type === '기타' ? [6, 4] : [])}
              cooldownTicks={100}
              onNodeClick={handleNodeClick}
            />
          </div>

          <aside className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
            {selectedCharacter ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">{selectedCharacter.name}</h3>
                  {selectedCharacter.is_favorite ? (
                    <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-300">즐겨찾기</span>
                  ) : null}
                </div>
                {selectedCharacter.alias ? (
                  <p className="text-sm text-gray-400">{selectedCharacter.alias}</p>
                ) : null}
                {selectedCharacter.group_name ? (
                  <p className="text-sm text-gray-300">소속: {selectedCharacter.group_name}</p>
                ) : null}
                {selectedCharacter.desc ? (
                  <p className="text-sm text-gray-300">{selectedCharacter.desc}</p>
                ) : null}
                {selectedCharacter.memo ? (
                  <p className="text-sm text-gray-400">메모: {selectedCharacter.memo}</p>
                ) : null}

                <div className="border-t border-gray-800 pt-3">
                  <p className="mb-2 text-sm font-medium text-gray-300">연결 관계</p>
                  {selectedRelations.length === 0 ? (
                    <p className="text-sm text-gray-500">연결된 관계가 없습니다.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedRelations.map((rel) => {
                        const peerId = rel.source === selectedCharacter.id ? rel.target : rel.source;
                        return (
                          <div key={rel.id} className="rounded-lg bg-gray-800/60 px-3 py-2 text-sm text-gray-200">
                            <div className="flex items-center gap-2">
                              <span>{getCharacterName(peerId)}</span>
                              <span
                                className="rounded px-1.5 py-0.5 text-xs"
                                style={{
                                  color: RELATION_COLORS[rel.type] || RELATION_COLORS['기타'],
                                  backgroundColor: `${RELATION_COLORS[rel.type] || RELATION_COLORS['기타']}22`,
                                }}
                              >
                                {rel.type}
                              </span>
                              <span className="text-xs text-gray-400">강도 {rel.strength}</span>
                            </div>
                            {rel.memo ? <p className="mt-1 text-xs text-gray-400">{rel.memo}</p> : null}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-center text-gray-500">
                <p className="text-sm">노드를 클릭하면 인물 상세와 연결 관계가 표시됩니다.</p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
