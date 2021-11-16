const { Schema, model } = require('mongoose');

const FeatureSchema = new Schema({
    date: {
        type: Date,
        default: Date.now(),
    },
    featureType: {
        type: String, // 'trail', 'park', etc.
        required: true,
    },
    name: { type: String, default: '' },
    trailNumber: { type: String, default: '' },
    island: { type: String, default: '' },
    district: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    description: { type: String, default: '' },
    features: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    hazards: { type: [String], default: [] },
    climate: { type: [String], default: [] },
    lengthMi: { type: Number, default: 0 }, // length in miles
    elevationGain: { type: Number, default: 0 },
    difficulty: { type: String, default: 'N/A' },
    image: { type: String, default: '' },
    traffic: { type: Number, default: 0 }, // Number of check-ins
    startPoint: { type: String, default: '' },
    endPoint: { type: String, default: '' },
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
