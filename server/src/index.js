require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initDb = require('./db/init');

const authRoutes = require('./routes/auth');
const worksRoutes = require('./routes/works');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

initDb();

app.use('/api/auth', authRoutes);
app.use('/api/works', worksRoutes);

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
