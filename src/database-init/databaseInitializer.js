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

async function fixStringsField() {
    // Find all features
    const features = await FeatureModel.find({});

    let data = [];
    for (const feature of features) {
        const { id, features, amenities, hazards, climate } = feature;

        const newFeatures = [];
        const newAmenities = [];
        const newHazards = [];
        const newClimate = [];

        for (const feature of features) {
            const str = camelCaseToRegular(feature);
            if (str.length > 0) {
                newFeatures.push(str);
            }
        }

        for (const amenity of amenities) {
            const str = camelCaseToRegular(amenity);
            if (str.length > 0) {
                newAmenities.push(str);
            }
        }

        for (const hazard of hazards) {
            const str = camelCaseToRegular(hazard);
            if (str.length > 0) {
                newHazards.push(str);
            }
        }

        for (const climateItem of climate) {
            const str = camelCaseToRegular(climateItem);
            if (str.length > 0) {
                newClimate.push(str);
            }
        }

        // Update the feature
        const update = {
            features: newFeatures,
            amenities: newAmenities,
            hazards: newHazards,
            climate: newClimate,
        };

        const result = await FeatureModel.findOneAndUpdate(
            { _id: id },
            update,
            {
                new: true,
            }
        );

        if (result) {
            console.log(`Updated Feature: ${result._id}`);
        }
    }

    // console.dir([...new Set(data)].sort(), { maxArrayLength: null });
}

// Convert CamelCase to Camel Case
function camelCaseToRegular(str) {
    str = str
        // insert a space before all caps
        .replace(/([A-Z])/g, ' $1')
        // uppercase the first character
        .replace(/^./, function (str) {
            return str.toUpperCase();
        })
        .trim();

    // Spelling errors/edge cases
    switch (str) {
        case '4 W D':
            return '4WD';
        case 'Cabiins':
            return 'Cabins';
        case 'Narowtrl':
            return 'Narrow Trail';
        case 'Narow Trl':
            return 'Narrow Trail';
        case 'Narrowtrail':
            return 'Narrow Trail';
        case 'Naturestudy':
            return 'Nature Study';
        case 'Nataure Study':
            return 'Nature Study';
        case 'Blindcorner':
            return 'Blind Corner';
        case 'Cool/ Cold':
            return 'Cool/Cold';
        case 'Parkingatturnout17.4mipoint':
            return 'Parking at turn out 17.4 mi point';
        case 'Potablewater':
            return 'Potable Water';
        default:
            return str;
    }
}

module.exports = {
    initializeDatabase,
    assignTrafficData,
    fixStringsField,
};
