// backend/server.js
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, '../data');

const serveJsonFile = (fileName) => async (req, res) => {
  try {
    const data = await fs.readFile(path.join(dataPath, fileName), 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    res.status(500).json({ message: `Server error: Could not fetch data from ${fileName}.` });
  }
};

app.get('/api/airports', serveJsonFile('airports.json'));
app.get('/api/veriler', serveJsonFile('veriler.json'));
app.get('/api/fleet', serveJsonFile('fleet.json'));
app.get('/api/testimonials', serveJsonFile('testimonials.json'));
app.get('/api/faq', serveJsonFile('faq.json'));
app.get('/api/services', serveJsonFile('services.json'));
app.get('/api/requests', serveJsonFile('requests.json'));

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userData = await fs.readFile(path.join(dataPath, 'user.json'), 'utf-8');
        const user = JSON.parse(userData);
        if (user.username === username && user.password === password) {
            res.json({ success: true, message: 'Giriş başarılı.' });
        } else {
            res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası.' });
    }
});

app.post('/api/request', async (req, res) => {
  const newRequest = req.body;
  if (!newRequest.plan || !newRequest.contact || !newRequest.contact.termsAccepted) {
    return res.status(400).json({ message: 'Invalid request data.' });
  }
  const requestsFilePath = path.join(dataPath, 'requests.json');
  try {
    let requests = [];
    try {
      const requestsData = await fs.readFile(requestsFilePath, 'utf-8');
      if (requestsData.trim()) { requests = JSON.parse(requestsData); }
    } catch (readError) {
      if (readError.code !== 'ENOENT') throw readError;
    }
    // YENİ TALEP İÇİN STATÜ EKLENDİ
    const requestToSave = { 
        id: `req_${Date.now()}`, 
        receivedAt: new Date().toISOString(),
        status: 'Yeni', // Varsayılan durum
        ...newRequest 
    };
    requests.push(requestToSave);
    await fs.writeFile(requestsFilePath, JSON.stringify(requests, null, 2), 'utf-8');
    res.status(201).json({ success: true, message: 'Talebiniz başarıyla alınmıştır.' });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ success: false, message: 'Talebiniz işlenirken bir hata oluştu.' });
  }
});

// YENİ ENDPOINT: Talep durumunu güncellemek için
app.patch('/api/requests/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
    }

    const requestsFilePath = path.join(dataPath, 'requests.json');
    try {
        const requestsData = await fs.readFile(requestsFilePath, 'utf-8');
        let requests = JSON.parse(requestsData);

        const requestIndex = requests.findIndex(req => req.id === id);

        if (requestIndex === -1) {
            return res.status(404).json({ message: 'Request not found.' });
        }

        requests[requestIndex].status = status;

        await fs.writeFile(requestsFilePath, JSON.stringify(requests, null, 2), 'utf-8');
        res.json({ success: true, request: requests[requestIndex] });

    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ success: false, message: 'Durum güncellenirken bir hata oluştu.' });
    }
});


app.listen(PORT, () => {
  console.log(`ALPAIR AVIATION backend server is running on http://localhost:${PORT}`);
});
