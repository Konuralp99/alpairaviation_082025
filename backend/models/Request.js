const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    // Frontend'den gelen 'id' string formatında (örn: "req_1765457409525")
    // MongoDB kendi '_id'sini oluşturur, ancak mevcut id yapısını korumak için ayrı bir alan tutuyoruz.
    originalId: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: ['Yeni', 'İnceleniyor', 'Onaylandı', 'Reddedildi', 'Tamamlandı'],
        default: 'Yeni'
    },
    plan: {
        departure: { type: String, required: true },
        arrival: { type: String, required: true },
        date: { type: Date, required: true },
        passengers: { type: Number, required: true }
    },
    contact: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        note: { type: String },
        termsAccepted: { type: Boolean, required: true }
    },
    receivedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);
