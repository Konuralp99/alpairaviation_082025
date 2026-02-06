const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../../data');

const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const userData = await fs.readFile(path.join(dataPath, 'user.json'), 'utf-8');
        const user = JSON.parse(userData);
        if (user.username === username && user.password === password) {
            const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ success: true, message: 'Giriş başarılı.', token, user: { username: user.username, role: user.role } });
        } else {
            res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası.' });
    }
};
