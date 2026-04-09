import { useRef, useState, useCallback, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Network } from 'lucide-react';

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
  const [width, setWidth] = useState(800);
  const [selectedId, setSelectedId] = useState(null);

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

  const graphData = {
    nodes: characters.map((c) => ({
      id: c.id,
      name: c.name,
      color: c.group_color || '#6B7280',
      val: c.importance || 1,
    })),
    links: relations.map((r) => ({
      source: r.source,
      target: r.target,
      color: RELATION_COLORS[r.type] || RELATION_COLORS['기타'],
      width: r.strength || 1,
    })),
  };

  const nodeCanvasObject = useCallback(
    (node, ctx) => {
      const radius = 4 + (node.val || 1) * 2;
      const isSelected = node.id === selectedId;

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();

      if (isSelected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 3, 0, 2 * Math.PI);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(node.name, node.x, node.y + radius + 3);
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

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl overflow-hidden border border-gray-800"
      style={{ height: '600px' }}
    >
      <ForceGraph2D
        graphData={graphData}
        width={width || 800}
        height={600}
        backgroundColor="#030712"
        nodeCanvasObject={nodeCanvasObject}
        nodeCanvasObjectMode={() => 'replace'}
        linkColor={(link) => link.color}
        linkWidth={(link) => link.width}
        cooldownTicks={100}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
}
