const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const fs = require('fs').promises;

// Modelleri İmport Et
const User = require('../models/User');
const Request = require('../models/Request');
const Fleet = require('../models/Fleet');
const { Airport, Testimonial, Faq, Service } = require('../models/StaticContent');

const dataPath = path.join(__dirname, '../../data');

async function seedDatabase() {
    try {
        if (!process.env.DB_URI) {
            throw new Error("DB_URI is not defined in .env file");
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.DB_URI);
        console.log('Connected!');

        // 1. Users
        const userData = JSON.parse(await fs.readFile(path.join(dataPath, 'user.json'), 'utf-8'));
        // Tekil obje ise array yap
        const users = Array.isArray(userData) ? userData : [userData];
        await User.deleteMany({});
        await User.insertMany(users);
        console.log('Users seeded');

        // 2. Requests
        const requestData = JSON.parse(await fs.readFile(path.join(dataPath, 'requests.json'), 'utf-8'));
        // Request modelinde id yerine originalId kullandık, mapping yapalım
        const mappedRequests = requestData.map(req => ({
            ...req,
            originalId: req.id, // Eski ID'yi sakla
            _id: undefined // Mongo ID üretsin
        }));
        await Request.deleteMany({});
        await Request.insertMany(mappedRequests);
        console.log('Requests seeded');

        // 3. Fleet
        const fleetData = JSON.parse(await fs.readFile(path.join(dataPath, 'fleet.json'), 'utf-8'));
        const mappedFleet = fleetData.map(item => ({ ...item, externalId: item.id, _id: undefined }));
        await Fleet.deleteMany({});
        await Fleet.insertMany(mappedFleet);
        console.log('Fleet seeded');

        // 4. Static Content
        const airports = JSON.parse(await fs.readFile(path.join(dataPath, 'airports.json'), 'utf-8'));
        await Airport.deleteMany({});
        await Airport.insertMany(airports);

        const testimonials = JSON.parse(await fs.readFile(path.join(dataPath, 'testimonials.json'), 'utf-8'));
        await Testimonial.deleteMany({});
        await Testimonial.insertMany(testimonials);

        const faq = JSON.parse(await fs.readFile(path.join(dataPath, 'faq.json'), 'utf-8'));
        await Faq.deleteMany({});
        await Faq.insertMany(faq);

        const services = JSON.parse(await fs.readFile(path.join(dataPath, 'services.json'), 'utf-8'));
        await Service.deleteMany({});
        await Service.insertMany(services);

        console.log('Static content seeded');

        console.log('✅ All data seeded successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seedDatabase();
