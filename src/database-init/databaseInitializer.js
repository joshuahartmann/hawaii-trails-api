const NaAlaHeleTrailsData = require('./Na_Ala_Hele_Trails.json');
const OahuCountyParksData = require('./Parks.json');
const { FeatureModel } = require('../mongoose/models/Feature');
const { CheckInModel } = require('../mongoose/models/CheckIn');
const {
    queryFeaturesByIdAndRange,
} = require('../routes/checkIn/check-in.service');

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
    const { type, features } = NaAlaHeleTrailsData;
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

async function populateFeatureTypeField() {
    const features = await FeatureModel.find({});

    for (const feature of features) {
        const { id } = feature;

        const update = {
            featureType: 'trail',
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
}

async function initializeParksData() {
    const { features } = OahuCountyParksData;

    for (const feature of features) {
        const { name, park_type } = feature.properties;
        const { geometry } = feature;

        const Feature = {};

        Feature.name = name;
        Feature.featureType = 'park';
        Feature.island = 'Oahu';
        Feature.features = [getParkType(park_type)];
        Feature.traffic = randomNumber(0, 100);
        Feature.geometry = geometry;

        await FeatureModel.create(Feature);
    }
}

function getParkType(parkType) {
    // https://honolulu-cchnl.opendata.arcgis.com/datasets/cchnl::parks/about
    switch (parkType) {
        case 1:
            return 'Mini Park';
        case 2:
            return 'Neighborhood Park';
        case 3:
            return 'Community Park';
        case 4:
            return 'District Park';
        case 5:
            return 'Urban';
        case 6:
            return 'Regional Park';
        case 7:
            return 'Beach Park';
        case 8:
            return 'Nature/Preserve';
        case 9:
            return 'Botanical Garden';
        case 10:
            return 'Zoo';
        case 11:
            return 'Pedestrian Mall';
        case 12:
            return 'Other';
        case 13:
            return 'Golf Course';
        case 14:
            return 'Shoreline Access';
        case 15:
            return 'Community Park/Garden';
        case 16:
            return 'Slide Areas';
        default:
            return 'Park';
    }
}

/*
   start, end       Date objects to generate a new date between.
   n                Number of date objects to generate.

   example usage:
        generateNDateObjects(new Date(2020, 10, 15, 7, 0 ,0), new Date(2021, 10, 15, 19, 0, 0), 10);
*/
function generateNDateObjects(start, end, n) {
    let ret = [];

    for (let i = 0; i < n; i++) {
        let day = new Date(
            Math.floor(
                Math.random() * (end.getTime() - start.getTime() + 1) +
                    start.getTime()
            )
        );
        day.setHours(Math.floor(Math.random() * (19 - 7 + 1) + 7)); // set hours between 7am-7pm
        ret.push(day);
    }

    return ret;
}

function mapNumberToScale(min, max, scaleMin, scaleMax, traffic) {
    let num = -1;

    if (min < max && min <= traffic && traffic <= max) {
        if (scaleMin < scaleMax) {
            if (traffic === min) {
                num = scaleMin;
            } else {
                num = Math.round(
                    ((traffic - min) / (max - min)) * (scaleMax - scaleMin) +
                        scaleMin
                );
            }

            if (scaleMin > num || num > scaleMax) {
                num = -1;
            }
        }
    }

    return num;
}

async function generateCheckIns() {
    const features = await FeatureModel.find({}, '_id');
    const janUserId = '6197127ba2e1e732c506b41d';

    console.dir(features.map((feature) => feature._id));

    for (const feature of features) {
        const { _id } = feature;

        const checkIns = generateNDateObjects(
            new Date(2021, 9, 15, 7, 0, 0),
            new Date(2021, 9, 30, 18, 0, 0),
            randomNumber(0, 15)
        ).map((date) => {
            return {
                userId: janUserId,
                featureId: _id,
                date: date,
            };
        });

        await CheckInModel.insertMany(checkIns);
    }
}

async function calculateTrafficData() {
    const features = await FeatureModel.find();

    const checkInNumbers = [];
    let numFeaturesUpdated = 0;
    let numFeaturesNotUpdated = 0;

    // For each feature get the number of check ins and push into array
    for (const feature of features) {
        const checkInDocs = await queryFeaturesByIdAndRange(
            feature._id,
            new Date(2021, 9, 1),
            new Date(2021, 9, 31)
        );

        checkInNumbers.push(checkInDocs.length);
    }

    // Calculate the min and max
    const min = Math.min(...checkInNumbers);
    const max = Math.max(...checkInNumbers);

    for (const feature of features) {
        const { id, traffic } = feature;

        // Get the number of check ins for the feature in order to calculate the traffic
        const checkInDocs = await queryFeaturesByIdAndRange(
            feature._id,
            new Date(2021, 9, 1),
            new Date(2021, 9, 31)
        );

        const calculatedTraffic = mapNumberToScale(
            min,
            max,
            0,
            100,
            checkInDocs.length
        );

        const update = {
            traffic: calculatedTraffic,
        };

        const result = await FeatureModel.findOneAndUpdate(
            { _id: id },
            update,
            {
                new: true,
            }
        );

        if (result) {
            numFeaturesUpdated++;
            console.log(`Updated traffic from ${traffic} :${result.traffic}`);
        } else {
            numFeaturesNotUpdated++;
            console.log('Error updating traffic');
        }
    }

    console.log(
        `Updated: ${numFeaturesUpdated} Not Updated: ${numFeaturesNotUpdated}`
    );
}

function dateToHST(date) {
    return date.toLocaleString('en-US', { timeZone: 'HST' });
}

async function main() {}

module.exports = {
    main,
    initializeDatabase,
    assignTrafficData,
    fixStringsField,
    initializeParksData,
    populateFeatureTypeField,
    mapNumberToScale,
};
