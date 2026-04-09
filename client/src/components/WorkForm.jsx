import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import useStore from '../store/useStore';

const TYPE_OPTIONS = ['책', '영화', '드라마', '애니', '기타'];
const STATUS_OPTIONS = ['감상중', '완료'];

export default function WorkForm({ work, onClose }) {
  const addWork = useStore((s) => s.addWork);
  const updateWork = useStore((s) => s.updateWork);

  const [form, setForm] = useState({
    title: work?.title || '',
    type: work?.type || '기타',
    status: work?.status || '감상중',
    genre: work?.genre || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!work;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('제목을 입력하세요.'); return; }
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await updateWork(work.id, form);
      } else {
        await addWork(form);
      }
      onClose();
    } catch {
      setError('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-900 h-full flex flex-col shadow-2xl animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">
            {isEdit ? '작품 수정' : '작품 추가'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6 py-6 gap-5 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400">제목 *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="작품 제목"
              autoFocus
              className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400">유형</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400">상태</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400">장르</label>
            <input
              name="genre"
              value={form.genre}
              onChange={handleChange}
              placeholder="판타지, 로맨스, SF..."
              className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 mt-auto pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg py-2.5 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg py-2.5 transition-colors"
            >
              {loading ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
