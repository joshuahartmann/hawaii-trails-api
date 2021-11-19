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

    let max = 0;
    let min = 100;

    try {
        for (let i = 0; i < trails.length; i++) {
            let numCheckIns = await queryFeaturesByIdAndRange(
                trails[i]._id,
                new Date(2021, 9, 1),
                new Date(2021, 9, 31)
            );

            if (numCheckIns.length > max) max = numCheckIns.length;
            if (numCheckIns.length < min) min = numCheckIns.length;
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

    const formattedTrails = trails.map(
        (trail) => await formatFeature(trail, min, max)
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

    let max = 0;
    let min = 100;

    try {
        for (let i = 0; i < parks.length; i++) {
            let numCheckIns = await queryFeaturesByIdAndRange(
                parks[i]._id,
                new Date(2021, 9, 1),
                new Date(2021, 9, 31)
            );

            if (numCheckIns.length > max) max = numCheckIns.length;
            if (numCheckIns.length < min) min = numCheckIns.length;
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

    const formattedParks = parks.map(
        (park) => await formatFeatures(park, min, max)
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
