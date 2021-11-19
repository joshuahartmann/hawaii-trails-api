const express = require('express');
const { checkJwt } = require('../../authz/check-jwt');
const { FeatureModel } = require('../../mongoose/models/Feature');
const { queryFeaturesByIdAndRange } = require('../checkIn/check-in.service');
const { getFeaturesByType, formatFeature } = require('./features.service');
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

    const fields =
        'features featureType amenities hazards climate _id name trailNumber island district lengthMi difficulty startPoint endPoint rating traffic';

    if (featureId && featureId !== 'undefined') {
        const feature = await FeatureModel.findById(featureId, fields).exec();
        res.send(feature);
    } else {
        res.status(400).send('No featureId provided');
    }
});

module.exports = {
    featureRouter,
};
