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

async function extractTimeData(checkInDocs) {
    const fullDay = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    const day = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    const hour = [
        '7am',
        '8am',
        '9am',
        '10am',
        '11am',
        '12pm',
        '1pm',
        '2pm',
        '3pm',
        '4pm',
        '5pm',
        '6pm',
        '7pm',
    ];
    // number of checkins per day of week, index 0 = Sun, 1 = Mon, ..., 6 = Sat
    const docsToDays = [0, 0, 0, 0, 0, 0, 0];
    // min and max number of checkins among the hours of the day
    const minmax = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
    ];
    // number of checkins per hour of each day of week
    const hours = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    // scaled number of checkins per hour of each day of week
    const scaledHours = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    // get the number of checkins per hour per day
    // get the number of checkins per day

    for (let i = 0; i < checkInDocs.length; i++) {
        let hour = checkInDocs[i].date.getHours();
        hour = hour - 7;
        docsToDays[checkInDocs[i].date.getDay()]++;
        hours[checkInDocs[i].date.getDay()][hour]++;
    }

    // get the min and max checkins per day amongst the hours of the day
    for (let i = 0; i < minmax.length; i++) {
        minmax[i][0] = Math.min(...hours[i]);
        minmax[i][1] = Math.max(...hours[i]);
    }
    // for each hour of each day, get the scaled number of checkins
    for (let i = 0; i < hours.length; i++) {
        for (let j = 0; j < hours[i].length; j++) {
            scaledHours[i][j] = mapNumberToScale(
                minmax[i][0],
                minmax[i][1],
                0,
                100,
                hours[i][j]
            );
        }
    }
    const formattedData = [];

    // create the data object
    for (let i = 0; i < fullDay.length; i++) {
        let data = [];
        for (let j = 0; j < scaledHours[i].length; j++) {
            data.push({ name: hour[j], value: scaledHours[i][j] });
            //console.log('here');
        }
        formattedData.push({ day: day[i], fullDay: fullDay[i], data: data });
    }

    return formattedData;
}

module.exports = {
    getFeaturesByType,
    formatFeature,
    extractTimeData,
};
