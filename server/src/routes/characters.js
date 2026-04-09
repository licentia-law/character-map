const express = require('express');
const { randomUUID } = require('crypto');
const db = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

function getCharacterWithWork(id) {
  return db.prepare(`
    SELECT c.*
    FROM characters c
    JOIN works w ON w.id = c.work_id
    WHERE c.id = ?
  `).get(id);
}

router.get('/works/:workId/characters', (req, res) => {
  const work = db.prepare('SELECT id FROM works WHERE id = ?').get(req.params.workId);
  if (!work) return res.status(404).json({ message: '작품을 찾을 수 없습니다.' });

  const characters = db.prepare(`
    SELECT *
    FROM characters
    WHERE work_id = ?
    ORDER BY name ASC
  `).all(req.params.workId);

  res.json(characters);
});

router.post('/works/:workId/characters', (req, res) => {
  const work = db.prepare('SELECT id FROM works WHERE id = ?').get(req.params.workId);
  if (!work) return res.status(404).json({ message: '작품을 찾을 수 없습니다.' });

  const {
    name,
    alias,
    desc,
    group_name,
    group_color,
    importance,
    appeared_at,
    memo,
    is_favorite,
  } = req.body;

  if (!name || !name.trim()) return res.status(400).json({ message: '이름은 필수입니다.' });

  const id = randomUUID();

  db.prepare(`
    INSERT INTO characters (
      id, work_id, name, alias, desc, group_name, group_color,
      importance, appeared_at, memo, is_favorite
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    req.params.workId,
    name.trim(),
    alias || '',
    desc || '',
    group_name || '',
    group_color || '',
    importance || 3,
    appeared_at || '',
    memo || '',
    is_favorite ? 1 : 0
  );

  const character = db.prepare('SELECT * FROM characters WHERE id = ?').get(id);
  res.status(201).json(character);
});

router.put('/characters/:id', (req, res) => {
  const existing = getCharacterWithWork(req.params.id);
  if (!existing) return res.status(404).json({ message: '인물을 찾을 수 없습니다.' });

  const {
    name,
    alias,
    desc,
    group_name,
    group_color,
    importance,
    appeared_at,
    memo,
  } = req.body;

  if (!name || !name.trim()) return res.status(400).json({ message: '이름은 필수입니다.' });

  db.prepare(`
    UPDATE characters
    SET name = ?, alias = ?, desc = ?, group_name = ?, group_color = ?,
        importance = ?, appeared_at = ?, memo = ?
    WHERE id = ?
  `).run(
    name.trim(),
    alias || '',
    desc || '',
    group_name || '',
    group_color || '',
    importance || 3,
    appeared_at || '',
    memo || '',
    req.params.id
  );

  const character = db.prepare('SELECT * FROM characters WHERE id = ?').get(req.params.id);
  res.json(character);
});

router.patch('/characters/:id/favorite', (req, res) => {
  const character = getCharacterWithWork(req.params.id);
  if (!character) return res.status(404).json({ message: '인물을 찾을 수 없습니다.' });

  const nextValue = character.is_favorite ? 0 : 1;
  db.prepare('UPDATE characters SET is_favorite = ? WHERE id = ?').run(nextValue, req.params.id);

  const updated = db.prepare('SELECT * FROM characters WHERE id = ?').get(req.params.id);
  res.json(updated);
});

router.delete('/characters/:id', (req, res) => {
  const character = getCharacterWithWork(req.params.id);
  if (!character) return res.status(404).json({ message: '인물을 찾을 수 없습니다.' });

  db.prepare('DELETE FROM characters WHERE id = ?').run(req.params.id);
  res.json({ message: '삭제되었습니다.' });
});

module.exports = router;
