// backend/server.js
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

app.use(cors());
app.use(express.json());

// --- DB Setup ---
let db;
(async () => {
  db = await open({
    filename: './data/alpair.db',
    driver: sqlite3.Database
  });

  // Users tablosu
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  // Requests tablosu
  await db.exec(`CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    departure TEXT,
    arrival TEXT,
    date TEXT,
    passengers INTEGER,
    name TEXT,
    email TEXT,
    phone TEXT,
    note TEXT,
    status TEXT DEFAULT 'Yeni',
    createdAt TEXT
  )`);

  // Fleet tablosu
  await db.exec(`CREATE TABLE IF NOT EXISTS fleet (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    capacity INTEGER,
    range TEXT,
    image TEXT
  )`);

  // FAQ tablosu
  await db.exec(`CREATE TABLE IF NOT EXISTS faq (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    question  TEXT NOT NULL,
    answer    TEXT NOT NULL,
    isActive  INTEGER DEFAULT 1,
    createdAt TEXT    DEFAULT (datetime('now'))
  )`);
})();

// --- Middleware ---
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token yok' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token geçersiz' });
    req.user = user;
    next();
  });
}

// --- Auth Routes ---
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Eksik bilgi' });
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);
    res.json({ success: true, message: 'Kullanıcı oluşturuldu' });
  } catch {
    res.status(400).json({ success: false, message: 'Kullanıcı adı zaten kayıtlı' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
  if (!user) return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Şifre hatalı' });
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ success: true, token });
});

// --- Requests Routes ---
app.post('/api/request', async (req, res) => {
  const { plan, contact } = req.body;
  if (!plan || !contact) return res.status(400).json({ message: 'Eksik alanlar var' });
  const { departure, arrival, date, passengers } = plan;
  const { name, email, phone, note } = contact;

  try {
    await db.run(
      `INSERT INTO requests (departure, arrival, date, passengers, name, email, phone, note, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [departure, arrival, date, passengers, name, email, phone, note]
    );
    res.status(201).json({ success: true, message: 'Talep kaydedildi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Hata oluştu' });
  }
});

app.get('/api/requests', authMiddleware, async (req, res) => {
  const rows = await db.all('SELECT * FROM requests ORDER BY createdAt DESC');
  res.json(rows);
});

app.patch('/api/requests/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: 'Durum gerekli' });
  try {
    await db.run('UPDATE requests SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Hata oluştu' });
  }
});

// --- Fleet Routes ---
app.get('/api/fleet', async (req, res) => {
  const rows = await db.all('SELECT * FROM fleet');
  res.json(rows);
});

app.post('/api/fleet', authMiddleware, async (req, res) => {
  const { name, type, capacity, range, image } = req.body;
  if (!name || !type) return res.status(400).json({ message: 'Eksik bilgi' });
  try {
    await db.run(
      'INSERT INTO fleet (name, type, capacity, range, image) VALUES (?, ?, ?, ?, ?)',
      [name, type, capacity, range, image]
    );
    res.json({ success: true, message: 'Uçak/helikopter eklendi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Hata oluştu' });
  }
});

// --- FAQ Routes ---
app.get('/api/faq', async (req, res) => {
  try {
    const rows = await db.all(
      'SELECT id, question, answer, isActive, createdAt FROM faq WHERE isActive = 1 ORDER BY id ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Hata oluştu' });
  }
});

app.post('/api/faq', authMiddleware, async (req, res) => {
  const { question, answer, isActive = 1 } = req.body || {};
  if (!question || !answer) return res.status(400).json({ message: 'Eksik bilgi' });
  try {
    const result = await db.run(
      'INSERT INTO faq (question, answer, isActive) VALUES (?, ?, ?)',
      [question, answer, isActive ? 1 : 0]
    );
    res.json({ success: true, id: result.lastID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Hata oluştu' });
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
