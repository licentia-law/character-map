import { useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, BookOpen, LogOut, Users, Upload, Download, RotateCcw } from 'lucide-react';
import useStore from '../store/useStore';
import WorkForm from '../components/WorkForm';
import { api } from '../api/client';

const TYPE_FILTERS = ['전체', '책', '영화', '드라마', '애니', '기타'];
const STATUS_FILTERS = ['전체', '감상중', '완료'];

const STATUS_BADGE = {
  감상중: 'bg-indigo-500/20 text-indigo-300',
  완료: 'bg-green-500/20 text-green-300',
};

export default function Home() {
  const works = useStore((s) => s.works);
  const fetchWorks = useStore((s) => s.fetchWorks);
  const deleteWork = useStore((s) => s.deleteWork);
  const setSelectedWorkId = useStore((s) => s.setSelectedWorkId);
  const logout = useStore((s) => s.logout);

  const [typeFilter, setTypeFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [formTarget, setFormTarget] = useState(undefined);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchWorks();
  }, []);

  const filtered = works.filter((w) => {
    if (typeFilter !== '전체' && w.type !== typeFilter) return false;
    if (statusFilter !== '전체' && w.status !== statusFilter) return false;
    return true;
  });

  const openAdd = () => { setFormTarget(undefined); setShowForm(true); };
  const openEdit = (work) => { setFormTarget(work); setShowForm(true); };
  const closeForm = () => setShowForm(false);

  const handleDelete = async (id) => {
    if (!confirm('이 작품을 삭제하시겠습니까?')) return;
    await deleteWork(id);
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const data = JSON.parse(ev.target.result);
      const isValidBackup =
        data &&
        Array.isArray(data.works) &&
        Array.isArray(data.characters) &&
        Array.isArray(data.relations);

      if (!isValidBackup) {
        alert('전체 백업 파일 형식이 아닙니다. 홈의 전체 내보내기 파일을 선택하세요.');
        e.target.value = '';
        return;
      }

      await api.importAll(data);
      await fetchWorks();
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportAll = async () => {
    const data = await api.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `character-map-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetAll = async () => {
    if (!confirm('전체 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    await api.resetAll();
    await fetchWorks();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 헤더 */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold">Character Map</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* 상단 툴바 */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* 유형 필터 */}
          <div className="flex gap-1.5">
            {TYPE_FILTERS.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  typeFilter === t
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* 상태 필터 */}
          <div className="flex gap-1.5 ml-2">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  statusFilter === s
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportFile}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Upload className="w-4 h-4" />
              전체 가져오기
            </button>
            <button
              onClick={handleExportAll}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              전체 내보내기
            </button>
            <button
              onClick={handleResetAll}
              className="flex items-center gap-2 bg-red-900/40 hover:bg-red-900/60 text-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              전체 초기화
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              작품 추가
            </button>
          </div>
        </div>

        {/* 작품 그리드 */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-500">
            <BookOpen className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg">작품이 없습니다.</p>
            <p className="text-sm mt-1">상단의 작품 추가 버튼으로 시작하세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((work) => (
              <div
                key={work.id}
                onClick={() => setSelectedWorkId(work.id)}
                className="relative bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors group cursor-pointer"
              >
                {/* 수정·삭제 버튼 */}
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEdit(work); }}
                    className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(work.id); }}
                    className="p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 유형 + 상태 */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                    {work.type}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${STATUS_BADGE[work.status] || 'bg-gray-700 text-gray-400'}`}>
                    {work.status}
                  </span>
                </div>

                {/* 제목 */}
                <h3 className="font-semibold text-white leading-snug mb-1 pr-10">
                  {work.title}
                </h3>

                {/* 장르 */}
                {work.genre && (
                  <p className="text-xs text-gray-500 mb-3">{work.genre}</p>
                )}

                {/* 인물 수 */}
                <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-auto pt-3 border-t border-gray-800">
                  <Users className="w-3.5 h-3.5" />
                  <span>인물 {work.character_count}명</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <WorkForm work={formTarget} onClose={closeForm} />
      )}
    </div>
  );
}
