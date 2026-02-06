const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();


const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const requestRoutes = require('./routes/requestRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());


// Rotalar
app.use('/api', authRoutes);
app.use('/api', dataRoutes);
app.use('/api', requestRoutes);

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`ALPAIR AVIATION backend sunucusu http://localhost:${PORT} adresinde çalışıyor`);
    });
}

module.exports = app;

