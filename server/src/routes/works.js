const express = require('express');
const { randomUUID } = require('crypto');
const db = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
  const works = db.prepare(`
    SELECT w.*, COUNT(c.id) as character_count
    FROM works w
    LEFT JOIN characters c ON c.work_id = w.id
    GROUP BY w.id
    ORDER BY w.created_at DESC
  `).all();
  res.json(works);
});

router.post('/', (req, res) => {
  const { title, type, status, genre } = req.body;
  if (!title) return res.status(400).json({ message: '제목은 필수입니다.' });

  const id = randomUUID();
  const created_at = new Date().toISOString();

  db.prepare(
    'INSERT INTO works (id, title, type, status, genre, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, title, type || '기타', status || '감상중', genre || '', created_at);

  const work = db.prepare('SELECT *, 0 as character_count FROM works WHERE id = ?').get(id);
  res.status(201).json(work);
});

router.put('/:id', (req, res) => {
  const { title, type, status, genre } = req.body;
  if (!title) return res.status(400).json({ message: '제목은 필수입니다.' });

  const result = db.prepare(
    'UPDATE works SET title = ?, type = ?, status = ?, genre = ? WHERE id = ?'
  ).run(title, type, status, genre, req.params.id);

  if (result.changes === 0) return res.status(404).json({ message: '작품을 찾을 수 없습니다.' });

  const work = db.prepare(`
    SELECT w.*, COUNT(c.id) as character_count
    FROM works w
    LEFT JOIN characters c ON c.work_id = w.id
    WHERE w.id = ?
    GROUP BY w.id
  `).get(req.params.id);
  res.json(work);
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM works WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ message: '작품을 찾을 수 없습니다.' });
  res.json({ message: '삭제되었습니다.' });
});

router.get('/:id/export', (req, res) => {
  const work = db.prepare('SELECT * FROM works WHERE id = ?').get(req.params.id);
  if (!work) return res.status(404).json({ message: '작품을 찾을 수 없습니다.' });

  const characters = db.prepare('SELECT * FROM characters WHERE work_id = ?').all(req.params.id);
  const relations = db.prepare('SELECT * FROM relations WHERE work_id = ?').all(req.params.id);

  res.json({ work, characters, relations });
});

router.post('/import', (req, res) => {
  const { work, characters, relations } = req.body;

  const newWorkId = randomUUID();
  const created_at = new Date().toISOString();

  db.prepare(
    'INSERT INTO works (id, title, type, status, genre, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(newWorkId, work.title, work.type || '기타', work.status || '감상중', work.genre || '', created_at);

  const idMap = {};
  for (const char of (characters || [])) {
    const newCharId = randomUUID();
    idMap[char.id] = newCharId;
    db.prepare(
      'INSERT INTO characters (id, work_id, name, alias, desc, group_name, group_color, importance, appeared_at, memo, is_favorite) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(newCharId, newWorkId, char.name, char.alias || '', char.desc || '', char.group_name || '', char.group_color || '', char.importance || 1, char.appeared_at || '', char.memo || '', char.is_favorite || 0);
  }

  for (const rel of (relations || [])) {
    db.prepare(
      'INSERT INTO relations (id, work_id, source, target, type, strength, memo) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(randomUUID(), newWorkId, idMap[rel.source] || rel.source, idMap[rel.target] || rel.target, rel.type || '기타', rel.strength || 1, rel.memo || '');
  }

  const newWork = db.prepare('SELECT *, 0 as character_count FROM works WHERE id = ?').get(newWorkId);
  res.status(201).json(newWork);
});

module.exports = router;
