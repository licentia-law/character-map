import { useState } from 'react';
import { X } from 'lucide-react';
import useStore from '../store/useStore';

const GROUP_COLORS = [
  '#7C3AED', '#2563EB', '#16A34A', '#DC2626', '#DB2777',
  '#F59E0B', '#06B6D4', '#EC4899', '#6B7280',
];

export default function CharacterForm({ character, workId, onClose }) {
  const addCharacter = useStore((s) => s.addCharacter);
  const updateCharacter = useStore((s) => s.updateCharacter);

  const [form, setForm] = useState({
    name: character?.name || '',
    alias: character?.alias || '',
    desc: character?.desc || '',
    group_name: character?.group_name || '',
    group_color: character?.group_color || '',
    importance: character?.importance || 3,
    appeared_at: character?.appeared_at || '',
    memo: character?.memo || '',
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (character) {
      await updateCharacter(character.id, form);
    } else {
      await addCharacter(workId, form);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50" onClick={onClose} />
      <div className="w-full max-w-md bg-gray-900 border-l border-gray-800 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">{character ? '인물 수정' : '인물 추가'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">이름 *</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">별칭</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              value={form.alias}
              onChange={(e) => set('alias', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">설명</label>
            <textarea
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
              rows={3}
              value={form.desc}
              onChange={(e) => set('desc', e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">그룹명</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                value={form.group_name}
                onChange={(e) => set('group_name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">그룹 색상</label>
              <div className="flex gap-1.5 flex-wrap pt-1">
                {GROUP_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => set('group_color', c)}
                    className="w-6 h-6 rounded-full border-2 transition-all"
                    style={{
                      backgroundColor: c,
                      borderColor: form.group_color === c ? '#fff' : 'transparent',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">중요도: {form.importance}</label>
            <input
              type="range"
              min={1}
              max={5}
              value={form.importance}
              onChange={(e) => set('importance', Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">등장 시점</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              value={form.appeared_at}
              onChange={(e) => set('appeared_at', e.target.value)}
              placeholder="예: 1화, 2권 등"
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
              {character ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
