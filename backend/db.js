const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/alpair', {
            // Mongoose 6+ için bu seçenekler artık varsayılan, ama açıklık için comment:
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log(`MongoDB Bağlantısı Başarılı: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB Bağlantı Hatası:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
