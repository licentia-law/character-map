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

module.exports = router;
