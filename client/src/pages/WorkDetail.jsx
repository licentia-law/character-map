import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Pencil, Trash2, Star, Users, ArrowRight, LogOut, BookOpen, Network, Download } from 'lucide-react';
import useStore from '../store/useStore';
import CharacterForm from '../components/CharacterForm';
import RelationForm from '../components/RelationForm';
import SynapseMap from '../components/SynapseMap';
import { api } from '../api/client';

const RELATION_COLORS = {
  가족: '#7C3AED',
  동료: '#2563EB',
  친구: '#16A34A',
  적대: '#DC2626',
  연인: '#DB2777',
  기타: '#6B7280',
};

export default function WorkDetail() {
  const works = useStore((s) => s.works);
  const selectedWorkId = useStore((s) => s.selectedWorkId);
  const setSelectedWorkId = useStore((s) => s.setSelectedWorkId);
  const logout = useStore((s) => s.logout);

  const characters = useStore((s) => s.characters);
  const fetchCharacters = useStore((s) => s.fetchCharacters);
  const deleteCharacter = useStore((s) => s.deleteCharacter);
  const toggleFavorite = useStore((s) => s.toggleFavorite);

  const relations = useStore((s) => s.relations);
  const fetchRelations = useStore((s) => s.fetchRelations);
  const deleteRelation = useStore((s) => s.deleteRelation);

  const work = works.find((w) => w.id === selectedWorkId);

  const [tab, setTab] = useState('인물');
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [charFormTarget, setCharFormTarget] = useState(undefined);
  const [showCharForm, setShowCharForm] = useState(false);
  const [relFormTarget, setRelFormTarget] = useState(undefined);
  const [showRelForm, setShowRelForm] = useState(false);

  useEffect(() => {
    fetchCharacters(selectedWorkId);
    fetchRelations(selectedWorkId);
  }, [selectedWorkId]);

  const displayedChars = showFavOnly ? characters.filter((c) => c.is_favorite) : characters;

  const openAddChar = () => { setCharFormTarget(undefined); setShowCharForm(true); };
  const openEditChar = (char) => { setCharFormTarget(char); setShowCharForm(true); };

  const openAddRel = () => { setRelFormTarget(undefined); setShowRelForm(true); };
  const openEditRel = (rel) => { setRelFormTarget(rel); setShowRelForm(true); };

  const handleDeleteChar = async (id) => {
    if (!confirm('이 인물을 삭제하시겠습니까?')) return;
    await deleteCharacter(id);
  };

  const handleDeleteRel = async (id) => {
    if (!confirm('이 관계를 삭제하시겠습니까?')) return;
    await deleteRelation(id);
  };

  const getCharName = (id) => characters.find((c) => c.id === id)?.name || '(알 수 없음)';

  const handleExport = async () => {
    const data = await api.exportWork(selectedWorkId);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${work?.title || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedWorkId(null)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">{work?.title}</span>
            {work?.genre && (
              <span className="text-xs text-gray-500 ml-1">{work.genre}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            내보내기
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1">
            {['인물', '관계', '맵'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === '인물' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFavOnly((v) => !v)}
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  showFavOnly ? 'bg-yellow-500/20 text-yellow-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Star className="w-4 h-4" />
                즐겨찾기
              </button>
              <button
                onClick={openAddChar}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                인물 추가
              </button>
            </div>
          )}

          {tab === '관계' && (
            <button
              onClick={openAddRel}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              관계 추가
            </button>
          )}
        </div>

        {tab === '인물' && (
          <>
            {displayedChars.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-gray-500">
                <Users className="w-12 h-12 mb-4 opacity-30" />
                <p className="text-lg">{showFavOnly ? '즐겨찾기한 인물이 없습니다.' : '인물이 없습니다.'}</p>
                {!showFavOnly && <p className="text-sm mt-1">인물 추가 버튼으로 시작하세요.</p>}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedChars.map((char) => (
                  <div
                    key={char.id}
                    className="relative bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors group"
                  >
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleFavorite(char.id)}
                        className={`p-1.5 rounded-md transition-colors ${
                          char.is_favorite
                            ? 'text-yellow-400 hover:bg-gray-700'
                            : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5" fill={char.is_favorite ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => openEditChar(char)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteChar(char.id)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-1 pr-20">
                      {char.group_color && (
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: char.group_color }}
                        />
                      )}
                      <h3 className="font-semibold text-white leading-snug truncate">{char.name}</h3>
                    </div>

                    {char.alias && (
                      <p className="text-xs text-gray-500 mb-2">{char.alias}</p>
                    )}

                    {char.group_name && (
                      <span className="inline-block text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 mb-2">
                        {char.group_name}
                      </span>
                    )}

                    {char.desc && (
                      <p className="text-sm text-gray-400 line-clamp-2">{char.desc}</p>
                    )}

                    <div className="flex gap-0.5 mt-3 pt-3 border-t border-gray-800">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className="w-3.5 h-3.5"
                          fill={n <= char.importance ? '#EAB308' : 'none'}
                          stroke={n <= char.importance ? '#EAB308' : '#6B7280'}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === '관계' && (
          <>
            {relations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-gray-500">
                <ArrowRight className="w-12 h-12 mb-4 opacity-30" />
                <p className="text-lg">관계가 없습니다.</p>
                <p className="text-sm mt-1">관계 추가 버튼으로 인물 간 관계를 설정하세요.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {relations.map((rel) => (
                  <div
                    key={rel.id}
                    className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-center gap-3 hover:border-gray-700 transition-colors group"
                  >
                    <span className="font-medium text-white min-w-0 truncate flex-1">
                      {getCharName(rel.source)}
                    </span>

                    <ArrowRight className="w-4 h-4 text-gray-600 flex-shrink-0" />

                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: `${RELATION_COLORS[rel.type] || RELATION_COLORS['기타']}22`,
                        color: RELATION_COLORS[rel.type] || RELATION_COLORS['기타'],
                      }}
                    >
                      {rel.type}
                    </span>

                    <ArrowRight className="w-4 h-4 text-gray-600 flex-shrink-0" />

                    <span className="font-medium text-white min-w-0 truncate flex-1">
                      {getCharName(rel.target)}
                    </span>

                    <div className="flex gap-0.5 flex-shrink-0">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div
                          key={n}
                          className={`w-1.5 h-1.5 rounded-full ${n <= rel.strength ? 'bg-indigo-400' : 'bg-gray-700'}`}
                        />
                      ))}
                    </div>

                    {rel.memo && (
                      <span className="text-xs text-gray-500 max-w-[140px] truncate">{rel.memo}</span>
                    )}

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={() => openEditRel(rel)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRel(rel.id)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === '맵' && (
          <SynapseMap characters={characters} relations={relations} />
        )}
      </main>

      {showCharForm && (
        <CharacterForm
          character={charFormTarget}
          workId={selectedWorkId}
          onClose={() => setShowCharForm(false)}
        />
      )}

      {showRelForm && (
        <RelationForm
          relation={relFormTarget}
          workId={selectedWorkId}
          onClose={() => setShowRelForm(false)}
        />
      )}
    </div>
  );
}
