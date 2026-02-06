const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Veritabanı dosyası backend klasöründe oluşturulacak
const dbPath = path.resolve(__dirname, process.env.DB_PATH || 'database.sqlite');


const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Veritabanına bağlanılamadı:', err.message);
    } else {
        console.log('SQLite veritabanına bağlanıldı.');
    }
});

// Tabloları oluştur
db.serialize(() => {
    // Users Tablosu
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin'
    )`);

    // Airports Tablosu
    db.run(`CREATE TABLE IF NOT EXISTS airports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        city TEXT,
        latitude REAL,
        longitude REAL
    )`);

    // Requests Tablosu
    db.run(`CREATE TABLE IF NOT EXISTS requests (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        note TEXT,
        departure_code TEXT,
        arrival_code TEXT,
        flight_date TEXT,
        passengers INTEGER,
        status TEXT DEFAULT 'Yeni',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        terms_accepted INTEGER DEFAULT 0
    )`);
});

module.exports = db;
