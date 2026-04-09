import { create } from 'zustand';
import { api } from '../api/client';

const useStore = create((set, get) => ({
  // ── 인증 ──────────────────────────────────────
  token: localStorage.getItem('cm_token') || null,
  isAuthenticated: !!localStorage.getItem('cm_token'),

  login: async (password) => {
    const { token } = await api.login(password);
    localStorage.setItem('cm_token', token);
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('cm_token');
    set({ token: null, isAuthenticated: false });
  },

  // ── 작품 ──────────────────────────────────────
  works: [],

  fetchWorks: async () => {
    const works = await api.getWorks();
    set({ works });
  },

  addWork: async (work) => {
    const newWork = await api.createWork(work);
    set((s) => ({ works: [...s.works, newWork] }));
  },

  updateWork: async (id, work) => {
    const updated = await api.updateWork(id, work);
    set((s) => ({ works: s.works.map((w) => (w.id === id ? updated : w)) }));
  },

  deleteWork: async (id) => {
    await api.deleteWork(id);
    set((s) => ({ works: s.works.filter((w) => w.id !== id) }));
  },

  // ── 현재 선택된 작품 ──────────────────────────
  selectedWorkId: null,
  setSelectedWorkId: (id) => set({ selectedWorkId: id }),

  // ── 인물 ──────────────────────────────────────
  characters: [],

  fetchCharacters: async (workId) => {
    const characters = await api.getCharacters(workId);
    set({ characters });
  },

  addCharacter: async (workId, char) => {
    const newChar = await api.createCharacter(workId, char);
    set((s) => ({
      characters: [...s.characters, newChar],
      works: s.works.map((w) => (
        w.id === workId
          ? { ...w, character_count: (w.character_count || 0) + 1 }
          : w
      )),
    }));
  },

  updateCharacter: async (id, char) => {
    const updated = await api.updateCharacter(id, char);
    set((s) => ({ characters: s.characters.map((c) => (c.id === id ? updated : c)) }));
  },

  toggleFavorite: async (id) => {
    const updated = await api.toggleFavorite(id);
    set((s) => ({ characters: s.characters.map((c) => (c.id === id ? updated : c)) }));
  },

  deleteCharacter: async (id) => {
    await api.deleteCharacter(id);
    set((s) => {
      const target = s.characters.find((c) => c.id === id);
      const nextCharacters = s.characters.filter((c) => c.id !== id);
      const nextWorks = !target
        ? s.works
        : s.works.map((w) => (
          w.id === target.work_id
            ? { ...w, character_count: Math.max(0, (w.character_count || 0) - 1) }
            : w
        ));

      return { characters: nextCharacters, works: nextWorks };
    });
  },

  // ── 관계 ──────────────────────────────────────
  relations: [],

  fetchRelations: async (workId) => {
    const relations = await api.getRelations(workId);
    set({ relations });
  },

  addRelation: async (workId, rel) => {
    const newRel = await api.createRelation(workId, rel);
    set((s) => ({ relations: [...s.relations, newRel] }));
  },

  updateRelation: async (id, rel) => {
    const updated = await api.updateRelation(id, rel);
    set((s) => ({ relations: s.relations.map((r) => (r.id === id ? updated : r)) }));
  },

  deleteRelation: async (id) => {
    await api.deleteRelation(id);
    set((s) => ({ relations: s.relations.filter((r) => r.id !== id) }));
  },

  // ── UI 상태 ───────────────────────────────────
  selectedCharacterId: null,
  setSelectedCharacterId: (id) => set({ selectedCharacterId: id }),
}));

export default useStore;
