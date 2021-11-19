const { mapNumberToScale } = require('../../database-init/databaseInitializer');
const { FeatureModel } = require('../../mongoose/models/Feature');
const { queryFeaturesByIdAndRange } = require('../checkIn/check-in.service');

async function getFeaturesByType(featureType) {
    const features = await FeatureModel.find({ featureType });

    return features;
}

async function formatFeature(feature, min, max) {
    const {
        _id,
        featureType,
        geometry,
        name,
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
    const traffic = await queryFeaturesByIdAndRange(
        _id,
        new Date(2021, 9, 1),
        new Date(2021, 9, 31)
    );
    return {
        type: 'Feature',
        properties: {
            id: _id,
            featureType,
            name,
            traffic: mapNumberToScale(min, max, 0, 100, traffic.length),
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
