const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { password } = req.body;

  if (!password || password !== process.env.APP_PASSWORD) {
    return res.status(401).json({ message: '비밀번호가 올바르지 않습니다.' });
  }

  const token = jwt.sign({ auth: true }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: '로그아웃 되었습니다.' });
});

module.exports = router;
