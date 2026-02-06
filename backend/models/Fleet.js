const mongoose = require('mongoose');

const FleetSchema = new mongoose.Schema({
    externalId: { type: Number, unique: true }, // JSON'daki id (1, 2, 3...)
    model: { type: String, required: true },
    description: { type: String },
    specs: {
        capacity: String,
        speed: String,
        range: String
    },
    imageUrl: { type: String },
    gallery: [String],
    detailedSpecs: {
        type: Map,
        of: String
    },
    usageAreas: [String]
}, { timestamps: true });

module.exports = mongoose.model('Fleet', FleetSchema);
