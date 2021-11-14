const { Schema, model } = require('mongoose');

const FeatureSchema = new Schema({
    date: {
        type: Date,
        default: Date.now(),
    },
    rating: Number,
    name: String,
    description: String,
    features: [String],
    amenities: [String],
    lengthMi: Number, // length in miles
    elevationGain: Number,
    difficulty: String,
    image: String,
    traffic: Number, // Number of check-ins
    coordinates: {
        type: [[Number, Number]],
    },
});

const FeatureModel = model('Feature', FeatureSchema);

module.exports = {
    FeatureSchema,
    FeatureModel,
};
