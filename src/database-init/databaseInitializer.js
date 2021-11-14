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

async function initializeDatabase() {
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

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function assignTrafficData() {
    const features = await FeatureModel.find();

    for (const feature of features) {
        const { id } = feature;

        const update = {
            traffic: randomNumber(0, 100),
        };

        const result = await FeatureModel.findOneAndUpdate(
            { _id: id },
            update,
            {
                new: true,
            }
        );

        if (result) {
            console.log(`Updated traffic to :${update.traffic}`);
        }
    }
}

module.exports = {
    initializeDatabase,
    assignTrafficData,
};
