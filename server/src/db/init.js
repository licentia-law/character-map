const db = require('./database');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS works (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      genre TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      work_id TEXT NOT NULL,
      name TEXT NOT NULL,
      alias TEXT,
      desc TEXT,
      group_name TEXT,
      group_color TEXT,
      importance INTEGER DEFAULT 1,
      appeared_at TEXT,
      memo TEXT,
      is_favorite INTEGER DEFAULT 0,
      FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS relations (
      id TEXT PRIMARY KEY,
      work_id TEXT NOT NULL,
      source TEXT NOT NULL,
      target TEXT NOT NULL,
      type TEXT NOT NULL,
      strength INTEGER DEFAULT 1,
      memo TEXT,
      FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE,
      FOREIGN KEY (source) REFERENCES characters(id) ON DELETE CASCADE,
      FOREIGN KEY (target) REFERENCES characters(id) ON DELETE CASCADE
    );
  `);

  console.log('DB 초기화 완료');
}

module.exports = initDb;
