const Fleet = require('../models/Fleet');
const { Airport, Testimonial, Faq, Service } = require('../models/StaticContent');
const path = require('path');
const fs = require('fs').promises; // Sadece veriler.json için (Statik)

// Factory function to get all items from a Mongoose model
const getAll = (Model) => async (req, res) => {
  try {
    const items = await Model.find();
    res.json(items);
  } catch (error) {
    console.error(`Error fetching data for ${Model.modelName}:`, error);
    res.status(500).json({ message: 'Sunucu hatası: Veriler alınamadı.' });
  }
};

exports.getAirports = getAll(Airport);
exports.getFleet = getAll(Fleet);
exports.getTestimonials = getAll(Testimonial);
exports.getFaq = getAll(Faq);
exports.getServices = getAll(Service);

// veriler.json (Site geneli ayarlar) için hala dosyadan okuyabiliriz
// Veya bunu da MongoDB'ye taşıyabiliriz. Şimdilik dosyadan devam edelim, 
// çünkü bu çok sık değişmeyen yapılandırma verisi.
exports.getVeriler = async (req, res) => {
  try {
    const dataPath = path.join(__dirname, '../../data/veriler.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading veriler.json:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};
