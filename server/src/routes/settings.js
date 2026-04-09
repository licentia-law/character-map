const express = require('express');
const db = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/export', (req, res) => {
  const works = db.prepare('SELECT * FROM works ORDER BY created_at DESC').all();
  const characters = db.prepare('SELECT * FROM characters').all();
  const relations = db.prepare('SELECT * FROM relations').all();

  res.json({
    exportedAt: new Date().toISOString(),
    version: '2.0',
    works,
    characters,
    relations,
  });
});

router.post('/import', (req, res) => {
  const isValidBackup =
    req.body &&
    Array.isArray(req.body.works) &&
    Array.isArray(req.body.characters) &&
    Array.isArray(req.body.relations);

  if (!isValidBackup) {
    return res.status(400).json({
      message: '전체 백업 파일 형식이 아닙니다. works/characters/relations 배열이 필요합니다.',
    });
  }

  const works = req.body.works;
  const characters = req.body.characters;
  const relations = req.body.relations;

  const trx = db.transaction(() => {
    db.prepare('DELETE FROM relations').run();
    db.prepare('DELETE FROM characters').run();
    db.prepare('DELETE FROM works').run();

    for (const work of works) {
      db.prepare(
        'INSERT INTO works (id, title, type, status, genre, created_at) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(
        work.id,
        work.title,
        work.type || '기타',
        work.status || '감상중',
        work.genre || '',
        work.created_at || new Date().toISOString()
      );
    }

    for (const char of characters) {
      db.prepare(
        'INSERT INTO characters (id, work_id, name, alias, desc, group_name, group_color, importance, appeared_at, memo, is_favorite) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).run(
        char.id,
        char.work_id,
        char.name,
        char.alias || '',
        char.desc || '',
        char.group_name || '',
        char.group_color || '',
        char.importance || 1,
        char.appeared_at || '',
        char.memo || '',
        char.is_favorite || 0
      );
    }

    for (const rel of relations) {
      db.prepare(
        'INSERT INTO relations (id, work_id, source, target, type, strength, memo) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).run(
        rel.id,
        rel.work_id,
        rel.source,
        rel.target,
        rel.type || '기타',
        rel.strength || 1,
        rel.memo || ''
      );
    }
  });

  trx();

  res.json({
    message: '데이터를 불러왔습니다.',
    counts: {
      works: works.length,
      characters: characters.length,
      relations: relations.length,
    },
  });
});

router.delete('/reset', (req, res) => {
  db.prepare('DELETE FROM relations').run();
  db.prepare('DELETE FROM characters').run();
  db.prepare('DELETE FROM works').run();
  res.json({ message: '전체 데이터가 초기화되었습니다.' });
});

module.exports = router;
