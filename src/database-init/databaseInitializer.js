const data = require('./Na_Ala_Hele_Trails.json');
const { FeatureModel } = require('../mongoose/models/Feature');

const keyValueMap = {
    Trailname: 'name',
    TRAIL_NUM: 'trailNumber',
    ISLAND: 'island',
    DISTRICT: 'district',
    LENGTH_MI: 'lengthMi',
    ELEV_RANGE: 'elevationRange',
    STANDARD: 'difficulty',
    START_PT: 'startPoint',
    END_PT: 'endPoint',
};

String.prototype.removeWhitespace = function () {
    return this.trim().replace(/\s+/g, '');
};

async function main() {
    const { type, features } = data;
    console.log(type, features);

    for (const feature of features) {
        const { properties } = feature;

        const Feature = {};

        const rating = 0;
        const traffic = 0;
        const features = properties.FEATURES?.removeWhitespace().split(',');
        const amenities = properties.AMENITIES?.removeWhitespace().split(',');
        const hazards = properties.HAZARDS?.removeWhitespace().split(',');
        const climate = properties.CLIMATE?.removeWhitespace().split(',');

        const geometry = {
            type: feature.geometry.type,
            coordinates: feature.geometry.coordinates,
        };

        for (const [key, value] of Object.entries(keyValueMap)) {
            Feature[value] = properties[key];
        }

        Feature.rating = rating;
        Feature.traffic = traffic;
        Feature.features = features;
        Feature.amenities = amenities;
        Feature.hazards = hazards;
        Feature.climate = climate;
        Feature.geometry = geometry;

        console.log(Feature);

        await FeatureModel.create(Feature);
    }
}

module.exports = {
    main,
};
