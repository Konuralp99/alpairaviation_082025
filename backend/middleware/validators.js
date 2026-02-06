const { body, validationResult } = require('express-validator');

exports.validateLogin = [
    body('username').notEmpty().trim().escape().withMessage('Kullanıcı adı gerekli'),
    body('password').notEmpty().trim().withMessage('Şifre gerekli'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

exports.validateRequest = [
    body('plan').notEmpty().withMessage('Plan bilgisi gerekli'),
    body('contact.name').notEmpty().trim().escape().withMessage('İsim gerekli'),
    body('contact.email').isEmail().normalizeEmail().withMessage('Geçerli bir e-posta adresi gerekli'),
    body('contact.termsAccepted').isBoolean().withMessage('Şartları kabul etmelisiniz'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];
