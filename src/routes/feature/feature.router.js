const express = require('express');
const { checkJwt } = require('../../authz/check-jwt');
const { FeatureModel } = require('../../mongoose/models/Feature');
const { getFeaturesByType, formatFeatures } = require('./features.service');
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

    const formattedTrails = trails.map(formatFeatures);

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

    const formattedTrails = parks.map(formatFeatures);

    res.send({
        type: 'FeatureCollection',
        features: formattedParks,
    });
});

featureRouter.get('/:featureId', async (req, res) => {
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
