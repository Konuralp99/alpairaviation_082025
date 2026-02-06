const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../../data');
const requestsFilePath = path.join(dataPath, 'requests.json');

exports.getAllRequests = async (req, res) => {
    try {
        const data = await fs.readFile(requestsFilePath, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading requests:', error);
        res.status(500).json({ message: 'Sunucu hatası: Talepler alınamadı.' });
    }
};

exports.createRequest = async (req, res) => {
    const newRequest = req.body;
    if (!newRequest.plan || !newRequest.contact || !newRequest.contact.termsAccepted) {
        return res.status(400).json({ message: 'Geçersiz talep verisi.' });
    }

    try {
        let requests = [];
        try {
            const requestsData = await fs.readFile(requestsFilePath, 'utf-8');
            if (requestsData.trim()) { requests = JSON.parse(requestsData); }
        } catch (readError) {
            if (readError.code !== 'ENOENT') throw readError;
        }

        const requestToSave = {
            id: `req_${Date.now()}`,
            receivedAt: new Date().toISOString(),
            status: 'Yeni',
            ...newRequest
        };
        requests.push(requestToSave);
        await fs.writeFile(requestsFilePath, JSON.stringify(requests, null, 2), 'utf-8');
        res.status(201).json({ success: true, message: 'Talebiniz başarıyla alınmıştır.' });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ success: false, message: 'Talebiniz işlenirken bir hata oluştu.' });
    }
};

exports.updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Durum bilgisi gerekli.' });
    }

    try {
        const requestsData = await fs.readFile(requestsFilePath, 'utf-8');
        let requests = JSON.parse(requestsData);

        const requestIndex = requests.findIndex(req => req.id === id);

        if (requestIndex === -1) {
            return res.status(404).json({ message: 'Talep bulunamadı.' });
        }

        requests[requestIndex].status = status;

        await fs.writeFile(requestsFilePath, JSON.stringify(requests, null, 2), 'utf-8');
        res.json({ success: true, request: requests[requestIndex] });

    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ success: false, message: 'Durum güncellenirken bir hata oluştu.' });
    }
};
