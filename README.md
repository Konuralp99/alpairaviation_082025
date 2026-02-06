# 🚁 AlpAir Aviation

AlpAir Aviation, modern ve lüks helikopter kiralama hizmetleri için geliştirilmiş tam kapsamlı bir web uygulamasıdır. Kullanıcıların helikopter filosunu incelemesine, hizmetler hakkında bilgi almasına ve uçuş talebi oluşturmasına olanak tanır.

![AlpAir Aviation Screenshot](https://via.placeholder.com/800x400?text=AlpAir+Aviation+Preview)

## 🌟 Özellikler

- **Modern Arayüz:** React, Tailwind CSS ve Framer Motion ile geliştirilmiş akıcı ve duyarlı (responsive) tasarım.
- **Dinamik İçerik:** Backend üzerinden yönetilen filo, hizmetler ve SSS verileri.
- **Güvenli Admin Paneli:** JWT kimlik doğrulama ile korunan yönetim paneli.
- **Talep Yönetimi:** Kullanıcı taleplerini toplama, doğrulama (Express-Validator) ve statü takibi.
- **Güvenlik:** Helmet ile HTTP başlık güvenliği, CORS yapılandırması.

## 🛠️ Teknolojiler

### Frontend
- **Framework:** React (Vite)
- **Stil:** Tailwind CSS
- **Animasyon:** Framer Motion
- **Bildirimler:** React Hot Toast

### Backend
- **Sunucu:** Node.js, Express
- **Veritabanı:** SQLite (Yerel dosya tabanlı JSON/SQLite yapısı)
- **Güvenlik:** Helmet, JSON Web Token (JWT), BCrypt
- **Test:** Jest, Supertest

## 🚀 Kurulum

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin.

### Ön Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/Konuralp99/ALPAIRAVIATION.git
cd ALPAIRAVIATION
```

### 2. Backend Kurulumu
```bash
cd backend
npm install
```
`.env` dosyası oluşturun:
```
PORT=3001
DB_PATH=database.sqlite
JWT_SECRET=supersecretkey_change_this_in_production
```
Sunucuyu başlatın:
```bash
npm start
# Geliştirme modu için: npm run dev
```

### 3. Frontend Kurulumu
Yeni bir terminal açın ve frontend klasörüne gidin:
```bash
cd frontend
npm install
```
`.env` dosyası oluşturun:
```
VITE_API_URL=http://localhost:3001
```
Uygulamayı başlatın:
```bash
npm run dev
```

## 🧪 Testler
Backend testlerini çalıştırmak için:
```bash
cd backend
npm test
```

## 📜 Lisans
Bu proje özel mülkiyettir. İzinsiz kopyalanamaz veya dağıtılamaz.
