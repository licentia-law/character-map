const BASE_URL = '/api';

function getToken() {
  return localStorage.getItem('cm_token');
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem('cm_token');
    window.location.href = '/';
    return;
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || '요청 실패');
  return data;
}

export const api = {
  // 인증
  login: (password) => request('POST', '/auth/login', { password }),
  logout: () => request('POST', '/auth/logout'),

  // 작품
  getWorks: () => request('GET', '/works'),
  createWork: (work) => request('POST', '/works', work),
  updateWork: (id, work) => request('PUT', `/works/${id}`, work),
  deleteWork: (id) => request('DELETE', `/works/${id}`),

  // 인물
  getCharacters: (workId) => request('GET', `/works/${workId}/characters`),
  createCharacter: (workId, char) => request('POST', `/works/${workId}/characters`, char),
  updateCharacter: (id, char) => request('PUT', `/characters/${id}`, char),
  toggleFavorite: (id) => request('PATCH', `/characters/${id}/favorite`),
  deleteCharacter: (id) => request('DELETE', `/characters/${id}`),

  // 관계
  getRelations: (workId) => request('GET', `/works/${workId}/relations`),
  createRelation: (workId, rel) => request('POST', `/works/${workId}/relations`, rel),
  updateRelation: (id, rel) => request('PUT', `/relations/${id}`, rel),
  deleteRelation: (id) => request('DELETE', `/relations/${id}`),

  // export / import
  exportWork: (id) => request('GET', `/works/${id}/export`),
  importWork: (data) => request('POST', '/works/import', data),
};
