const express = require('express');
const { randomUUID } = require('crypto');
const db = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

function getWork(id) {
  return db.prepare('SELECT id FROM works WHERE id = ?').get(id);
}

function getCharacter(id) {
  return db.prepare('SELECT id, work_id FROM characters WHERE id = ?').get(id);
}

function getRelationWithWork(id) {
  return db.prepare(`
    SELECT r.*
    FROM relations r
    JOIN works w ON w.id = r.work_id
    WHERE r.id = ?
  `).get(id);
}

router.get('/works/:workId/relations', (req, res) => {
  const work = getWork(req.params.workId);
  if (!work) return res.status(404).json({ message: '작품을 찾을 수 없습니다.' });

  const relations = db.prepare(`
    SELECT *
    FROM relations
    WHERE work_id = ?
    ORDER BY id DESC
  `).all(req.params.workId);

  res.json(relations);
});

router.post('/works/:workId/relations', (req, res) => {
  const work = getWork(req.params.workId);
  if (!work) return res.status(404).json({ message: '작품을 찾을 수 없습니다.' });

  const { source, target, type, strength, memo } = req.body;

  if (!source || !target) {
    return res.status(400).json({ message: '출발/도착 인물은 필수입니다.' });
  }
  if (source === target) {
    return res.status(400).json({ message: '같은 인물끼리는 연결할 수 없습니다.' });
  }

  const sourceChar = getCharacter(source);
  const targetChar = getCharacter(target);
  if (!sourceChar || !targetChar) {
    return res.status(404).json({ message: '인물을 찾을 수 없습니다.' });
  }
  if (sourceChar.work_id !== req.params.workId || targetChar.work_id !== req.params.workId) {
    return res.status(400).json({ message: '같은 작품의 인물만 연결할 수 있습니다.' });
  }

  const id = randomUUID();

  db.prepare(`
    INSERT INTO relations (id, work_id, source, target, type, strength, memo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    req.params.workId,
    source,
    target,
    type || '기타',
    strength || 3,
    memo || ''
  );

  const relation = db.prepare('SELECT * FROM relations WHERE id = ?').get(id);
  res.status(201).json(relation);
});

router.put('/relations/:id', (req, res) => {
  const existing = getRelationWithWork(req.params.id);
  if (!existing) return res.status(404).json({ message: '관계를 찾을 수 없습니다.' });

  const { source, target, type, strength, memo } = req.body;
  if (!source || !target) {
    return res.status(400).json({ message: '출발/도착 인물은 필수입니다.' });
  }
  if (source === target) {
    return res.status(400).json({ message: '같은 인물끼리는 연결할 수 없습니다.' });
  }

  const sourceChar = getCharacter(source);
  const targetChar = getCharacter(target);
  if (!sourceChar || !targetChar) {
    return res.status(404).json({ message: '인물을 찾을 수 없습니다.' });
  }
  if (sourceChar.work_id !== existing.work_id || targetChar.work_id !== existing.work_id) {
    return res.status(400).json({ message: '같은 작품의 인물만 연결할 수 있습니다.' });
  }

  db.prepare(`
    UPDATE relations
    SET source = ?, target = ?, type = ?, strength = ?, memo = ?
    WHERE id = ?
  `).run(
    source,
    target,
    type || '기타',
    strength || 3,
    memo || '',
    req.params.id
  );

  const relation = db.prepare('SELECT * FROM relations WHERE id = ?').get(req.params.id);
  res.json(relation);
});

router.delete('/relations/:id', (req, res) => {
  const relation = getRelationWithWork(req.params.id);
  if (!relation) return res.status(404).json({ message: '관계를 찾을 수 없습니다.' });

  db.prepare('DELETE FROM relations WHERE id = ?').run(req.params.id);
  res.json({ message: '삭제되었습니다.' });
});

module.exports = router;
