const { Schema, model } = require('mongoose');

const FeatureSchema = new Schema({
    date: {
        type: Date,
        default: Date.now(),
    },
    name: String,
    trailNumber: String,
    island: String,
    district: String,
    rating: Number,
    description: String,
    features: [String],
    amenities: [String],
    hazards: [String],
    lengthMi: Number, // length in miles
    elevationGain: Number,
    difficulty: String,
    image: String,
    traffic: Number, // Number of check-ins
    startPoint: String,
    endPoint: String,
    climate: String,
    geometry: {
        geometryType: String, // 'LineString' / 'Polygon' etc.
        coordinates: [Number], // [longitude, latitude]
    },
});

const FeatureModel = model('Feature', FeatureSchema);

module.exports = {
    FeatureSchema,
    FeatureModel,
};
