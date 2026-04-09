import { useState } from 'react';
import { X } from 'lucide-react';
import useStore from '../store/useStore';

const RELATION_TYPES = ['가족', '동료', '친구', '적대', '연인', '기타'];

export default function RelationForm({ relation, workId, onClose }) {
  const characters = useStore((s) => s.characters);
  const addRelation = useStore((s) => s.addRelation);
  const updateRelation = useStore((s) => s.updateRelation);

  const [form, setForm] = useState({
    source: relation?.source || '',
    target: relation?.target || '',
    type: relation?.type || '기타',
    strength: relation?.strength || 3,
    memo: relation?.memo || '',
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (relation) {
      await updateRelation(relation.id, form);
    } else {
      await addRelation(workId, form);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50" onClick={onClose} />
      <div className="w-full max-w-md bg-gray-900 border-l border-gray-800 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">{relation ? '관계 수정' : '관계 추가'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">출발 인물 *</label>
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              value={form.source}
              onChange={(e) => set('source', e.target.value)}
              required
            >
              <option value="">선택하세요</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">도착 인물 *</label>
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              value={form.target}
              onChange={(e) => set('target', e.target.value)}
              required
            >
              <option value="">선택하세요</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">관계 유형</label>
            <div className="flex flex-wrap gap-2">
              {RELATION_TYPES.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => set('type', t)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    form.type === t
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">관계 강도: {form.strength}</label>
            <input
              type="range"
              min={1}
              max={5}
              value={form.strength}
              onChange={(e) => set('strength', Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">메모</label>
            <textarea
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
              rows={3}
              value={form.memo}
              onChange={(e) => set('memo', e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white text-sm transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
            >
              {relation ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
