const { mapNumberToScale } = require('../../database-init/databaseInitializer');
const { FeatureModel } = require('../../mongoose/models/Feature');
const { queryFeaturesByIdAndRange } = require('../checkIn/check-in.service');

async function getFeaturesByType(featureType) {
    const features = await FeatureModel.find({ featureType });

    return features;
}

function formatFeature(feature) {
    const {
        _id,
        featureType,
        geometry,
        name,
        traffic,
        trailNumber,
        island,
        district,
        features,
        amenities,
        hazards,
        climate,
        elevationGain,
        difficulty,
        startPoint,
        endPoint,
    } = feature;

    return {
        type: 'Feature',
        properties: {
            id: _id,
            featureType,
            name,
            traffic,
            difficulty,
            trailNumber,
            island,
            district,
            features: features.join(', '),
            amenities: amenities.join(', '),
            hazards: hazards.join(', '),
            climate: climate.join(', '),
            elevationGain,
            startPoint,
            endPoint,
        },
        geometry,
    };
}

module.exports = {
    getFeaturesByType,
    formatFeature,
};
