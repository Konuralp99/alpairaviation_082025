const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Not: Gerçek uygulamada password hash'lenmeli (bcrypt)
        // Şimdilik düz metin karşılaştırması yapıyoruz (eski sistem uyumu)
        const user = await User.findOne({ username });

        if (user && user.password === password) {
            const token = jwt.sign(
                { username: user.username, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.json({
                success: true,
                message: 'Giriş başarılı.',
                token,
                user: { username: user.username, role: user.role }
            });
        } else {
            res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası.' });
    }
};
