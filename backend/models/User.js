const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String, // Şifreler hash'lenmiş olmalı, ancak mevcut sistem düz metin kullanıyorsa geçici olarak böyle kalabilir.
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    name: {
        type: String
    },
    lastLogin: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
