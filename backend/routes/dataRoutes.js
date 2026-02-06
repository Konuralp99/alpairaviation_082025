const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.get('/airports', dataController.getAirports);
router.get('/fleet', dataController.getFleet);
router.get('/testimonials', dataController.getTestimonials);
router.get('/faq', dataController.getFaq);
router.get('/services', dataController.getServices);
router.get('/veriler', dataController.getVeriler);

// Requests için GET metodunu burada değil requestRoutes'da tanımlayacağız, 
// ancak orijinal server.js'de /api/requests vardı. 
// Tutarlılık için hepsini ayırıyorum.

module.exports = router;
