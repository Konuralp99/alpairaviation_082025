const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../../data');

const serveJsonFile = (fileName) => async (req, res) => {
  try {
    const data = await fs.readFile(path.join(dataPath, fileName), 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    res.status(500).json({ message: `Server error: Could not fetch data from ${fileName}.` });
  }
};

exports.getAirports = serveJsonFile('airports.json');
exports.getFleet = serveJsonFile('fleet.json');
exports.getTestimonials = serveJsonFile('testimonials.json');
exports.getFaq = serveJsonFile('faq.json');
exports.getServices = serveJsonFile('services.json');
exports.getVeriler = serveJsonFile('veriler.json');
