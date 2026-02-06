const fs = require('fs');
const path = require('path');
const db = require('./db');

// JSON Dosya Yolları
const dataDir = path.resolve(__dirname, '../data');
const airportsFile = path.join(dataDir, 'airports.json');
const requestsFile = path.join(dataDir, 'requests.json');
const usersFile = path.join(dataDir, 'user.json');

const migrate = () => {
    console.log('Veri göçü başlatılıyor...');

    // 1. Airports Migration
    if (fs.existsSync(airportsFile)) {
        const airports = JSON.parse(fs.readFileSync(airportsFile, 'utf8'));
        const stmt = db.prepare("INSERT OR IGNORE INTO airports (code, name, city, latitude, longitude) VALUES (?, ?, ?, ?, ?)");

        airports.forEach(airport => {
            stmt.run(airport.code, airport.name, airport.city, airport.lat, airport.lon);
        });
        stmt.finalize();
        console.log(`${airports.length} havalimanı aktarıldı/kontrol edildi.`);
    }

    // 2. Users Migration
    if (fs.existsSync(usersFile)) {
        const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
        // JSON yapısı bazen array bazen obje olabiliyor, kontrol edelim
        const userList = Array.isArray(users) ? users : [users];

        const stmt = db.prepare("INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)");
        userList.forEach(user => {
            stmt.run(user.username, user.password, 'admin');
        });
        stmt.finalize();
        console.log(`${userList.length} kullanıcı aktarıldı.`);
    }

    // 3. Requests Migration
    if (fs.existsSync(requestsFile)) {
        const requests = JSON.parse(fs.readFileSync(requestsFile, 'utf8'));
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO requests 
            (id, customer_name, email, phone, note, departure_code, arrival_code, flight_date, passengers, status, created_at, terms_accepted) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        requests.forEach(req => {
            // Eski verilerde tarih formatı farklı olabilir, basit bir kontrol
            const createdAt = req.receivedAt || new Date().toISOString();
            const phone = req.contact?.phone || ''; // Eski kayıtlarda telefon olmayabilir

            stmt.run(
                req.id,
                req.contact.name,
                req.contact.email,
                phone,
                req.contact.note,
                req.plan.departure,
                req.plan.arrival,
                req.plan.date,
                req.plan.passengers,
                req.status,
                createdAt,
                req.contact.termsAccepted ? 1 : 0
            );
        });
        stmt.finalize();
        console.log(`${requests.length} talep aktarıldı.`);
    }

    console.log('Göç tamamlandı.');
};

// Database bağlantısı asenkron olduğu için kısa bir gecikme ile çalıştıralım
setTimeout(migrate, 1000);
