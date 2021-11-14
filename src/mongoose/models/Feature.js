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
    climate: [String],
    lengthMi: Number, // length in miles
    elevationGain: Number,
    difficulty: String,
    image: String,
    traffic: Number, // Number of check-ins
    startPoint: String,
    endPoint: String,
    geometry: {
        type: { type: String }, // "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", and "GeometryCollection"
        coordinates: 'Mixed', // [longitude, latitude]
    },
});

const FeatureModel = model('Feature', FeatureSchema);

module.exports = {
    FeatureSchema,
    FeatureModel,
};
