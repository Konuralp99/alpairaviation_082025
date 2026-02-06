const mongoose = require('mongoose');

const AirportSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    name: String,
    city: String
});

const TestimonialSchema = new mongoose.Schema({
    id: Number,
    name: String,
    title: String,
    quote: String,
    avatarUrl: String
});

const FaqSchema = new mongoose.Schema({
    id: Number,
    question: String,
    answer: String
});

const ServiceSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    icon: String
});

module.exports = {
    Airport: mongoose.model('Airport', AirportSchema),
    Testimonial: mongoose.model('Testimonial', TestimonialSchema),
    Faq: mongoose.model('Faq', FaqSchema),
    Service: mongoose.model('Service', ServiceSchema)
};
