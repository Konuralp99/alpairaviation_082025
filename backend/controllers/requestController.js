const Request = require('../models/Request');

exports.getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find().sort({ receivedAt: -1 });
        // Mongoose result objelerini JSON'a çevirip gönderir
        res.json(requests);
    } catch (error) {
        console.error('Error reading requests:', error);
        res.status(500).json({ message: 'Sunucu hatası: Talepler alınamadı.' });
    }
};

exports.createRequest = async (req, res) => {
    const newRequestData = req.body;

    // Basit validasyon (Middleware zaten yapıyor olabilir ama ekstra güvenlik)
    if (!newRequestData.plan || !newRequestData.contact || !newRequestData.contact.termsAccepted) {
        return res.status(400).json({ message: 'Geçersiz talep verisi.' });
    }

    try {
        // Yeni talep oluştur
        const request = new Request({
            ...newRequestData,
            status: 'Yeni',
            receivedAt: new Date()
        });

        await request.save();
        res.status(201).json({ success: true, message: 'Talebiniz başarıyla alınmıştır.', id: request.id });
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
        // Hem MongoDB _id hem de eski text id (req_...) ile bulmaya çalışalım
        let request;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            // Valid Mongo ID
            request = await Request.findByIdAndUpdate(id, { status }, { new: true });
        } else {
            // Legacy ID (req_...)
            request = await Request.findOneAndUpdate({ originalId: id }, { status }, { new: true });
        }

        if (!request) {
            return res.status(404).json({ message: 'Talep bulunamadı.' });
        }

        res.json({ success: true, request });

    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ success: false, message: 'Durum güncellenirken bir hata oluştu.' });
    }
};
