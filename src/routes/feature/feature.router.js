const express = require('express');
const { checkJwt } = require('../../authz/check-jwt');
const { CheckInModel } = require('../../mongoose/models/CheckIn');
const { FeatureModel } = require('../../mongoose/models/Feature');
const { queryFeaturesByIdAndRange } = require('../checkIn/check-in.service');
const { getFeaturesByType, formatFeature } = require('./features.service');
const { mapNumberToScale } = require('../../database-init/databaseInitializer');

const featureRouter = express.Router();

featureRouter.get('/', async (req, res) => {
    let trails;
    try {
        trails = await getFeaturesByType('trail');
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

    const formattedTrails = trails.map(formatFeatures);

    res.send({
        type: 'FeatureCollection',
        features: formattedTrails,
    });
});

featureRouter.get('/trails', async (req, res) => {
    let trails;
    try {
        trails = await getFeaturesByType('trail');
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

    const trailObjects = [];
    const checkInNumbers = [];

    try {
        for (let i = 0; i < trails.length; i++) {
            const checkInDocs = await queryFeaturesByIdAndRange(
                trails[i]._id,
                new Date(2021, 9, 1),
                new Date(2021, 9, 31)
            );

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
            } = trails[i];

            const Feature = {};

            Feature.traffic = checkInDocs.length;
            Feature._id = _id;
            Feature.featureType = featureType;
            Feature.geometry = geometry;
            Feature.name = name;
            Feature.trailNumber = trailNumber;
            Feature.island = island;
            Feature.district = district;
            Feature.features = features;
            Feature.amenities = amenities;
            Feature.hazards = hazards;
            Feature.climate = climate;
            Feature.elevationGain = elevationGain;
            Feature.difficulty = difficulty;
            Feature.startPoint = startPoint;
            Feature.endPoint = endPoint;

            trailObjects.push(Feature);
            checkInNumbers.push(checkInDocs.length);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

    const min = Math.min(...checkInNumbers);
    const max = Math.max(...checkInNumbers);

    const formattedTrails = trailObjects.map((trail) =>
        formatFeature(trail, min, max)
    );

    res.send({
        type: 'FeatureCollection',
        features: formattedTrails,
    });
});

featureRouter.get('/parks', async (req, res) => {
    let parks;
    try {
        parks = await getFeaturesByType('park');
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

    const parkObjects = [];
    const checkInNumbers = [];

    try {
        for (let i = 0; i < parks.length; i++) {
            const checkInDocs = await queryFeaturesByIdAndRange(
                parks[i]._id,
                new Date(2021, 9, 1),
                new Date(2021, 9, 31)
            );

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
            } = parks[i];

            const Feature = {};

            Feature.traffic = checkInDocs.length;
            Feature._id = _id;
            Feature.featureType = featureType;
            Feature.geometry = geometry;
            Feature.name = name;
            Feature.trailNumber = trailNumber;
            Feature.island = island;
            Feature.district = district;
            Feature.features = features;
            Feature.amenities = amenities;
            Feature.hazards = hazards;
            Feature.climate = climate;
            Feature.elevationGain = elevationGain;
            Feature.difficulty = difficulty;
            Feature.startPoint = startPoint;
            Feature.endPoint = endPoint;

            parkObjects.push(Feature);
            checkInNumbers.push(checkInDocs.length);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

    const min = Math.min(...checkInNumbers);
    const max = Math.max(...checkInNumbers);

    const formattedParks = parkObjects.map((park) =>
        formatFeature(park, min, max)
    );

    res.send({
        type: 'FeatureCollection',
        features: formattedParks,
    });
});

featureRouter.get('/feature/:featureId', async (req, res) => {
    const { featureId } = req.params;

    if (!featureId || featureId === 'undefined') {
        res.status(400).send('No featureId provided');
    }

    const fields =
        'features featureType amenities hazards climate _id name trailNumber island district lengthMi difficulty startPoint endPoint rating';

    const feature = await FeatureModel.findById(featureId, fields).exec();

    const checkInDocs = await queryFeaturesByIdAndRange(
        feature._id,
        new Date(2021, 9, 1),
        new Date(2021, 9, 31)
    );

    const features = await FeatureModel.find(
        { featureType: feature.featureType },
        '_id'
    );

    const checkInNumbers = [];

    for (const f of features) {
        const checkInDocs = await CheckInModel.find(
            { featureId: f._id },
            '_id'
        );
        checkInNumbers.push(checkInDocs.length);
    }

    const min = Math.min(...checkInNumbers);
    const max = Math.max(...checkInNumbers);

    const traffic = mapNumberToScale(min, max, 0, 100, checkInDocs.length);

    const Feature = {};

    const keys = [
        'features',
        'featureType',
        'amenities',
        'hazards',
        'climate',
        '_id',
        'name',
        'trailNumber',
        'island',
        'district',
        'lengthMi',
        'difficulty',
        'startPoint',
        'endPoint',
        'rating',
    ];

    for (const key of keys) {
        Feature[key] = feature[key];
    }

    Feature.traffic = traffic;

    res.send(Feature);
});

module.exports = {
    featureRouter,
};
