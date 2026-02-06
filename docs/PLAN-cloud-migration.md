# Proje Planı: Bulut Göçü (Cloud Migration)

**Hedef:** File-system tabanlı (yerel dosya) veri saklama yapısını, ölçeklenebilir bir Bulut Veritabanı (MongoDB) yapısına dönüştürmek ve uygulamayı canlıya almak.

## 📋 Gereksinimler
- **Veritabanı:** MongoDB Atlas (Ücretsiz Tier)
- **Backend Hosting:** Render.com
- **Frontend Hosting:** Vercel

## 📅 Fazlar

### Faz 1: Veritabanı Mimarisi
1.  **Mongoose Kurulumu:** Backend projesine `mongoose` paketi eklenecek.
2.  **Şema Tasarımı:** Mevcut JSON yapılarına uygun Mongoose şemaları oluşturulacak:
    - `UserSchema` (Admin girişi için)
    - `RequestSchema` (Müşteri talepleri için)
    - `FleetSchema`, `ServiceSchema` vb. (Statik içerik için)
3.  **Veri Göçü (Migration Script):** `data/*.json` dosyalarındaki verileri MongoDB'ye aktaran bir sihirbaz script (`scripts/seed.js`) yazılacak.

### Faz 2: Backend Refactoring
1.  **Bağlantı:** `db.js` dosyası MongoDB bağlantısını yönetecek şekilde güncellenecek.
2.  **Controller Güncellemeleri:**
    - `fs.readFile` / `fs.writeFile` metodları kaldırılacak.
    - Yerine `Model.find()`, `Model.create()`, `Model.findByIdAndUpdate()` metodları gelecek.
3.  **Test:** Mevcut testler MongoDB (veya `mongodb-memory-server`) ile uyumlu hale getirilecek.

### Faz 3: Deployment (Canlıya Alma)
1.  **Backend (Render):**
    - GitHub reposu Render'a bağlanacak.
    - `DB_URI` ve `JWT_SECRET` ortam değişkenleri tanımlanacak.
2.  **Frontend (Vercel):**
    - `VITE_API_URL` ortam değişkeni Render URL'i olacak şekilde ayarlanacak.
    - Kullanıcının özel domaini (DNS) yapılandırılacak.

## ✅ Doğrulama Kriterleri
- [ ] Admin kullanıcısı MongoDB üzerinden giriş yapabiliyor.
- [ ] Yeni talep oluşturulduğunda MongoDB'ye kaydediliyor.
- [ ] Frontend, canlı backend'den veri çekebiliyor.
