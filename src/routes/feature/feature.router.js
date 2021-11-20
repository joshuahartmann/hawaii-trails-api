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

    const formattedTrails = trails.map(formatFeature);

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

    const formattedParks = parks.map(formatFeature);

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
        'features featureType amenities hazards climate _id name trailNumber island district lengthMi difficulty startPoint endPoint rating traffic';

    const feature = await FeatureModel.findById(featureId, fields).exec();

    res.send(feature);
});

module.exports = {
    featureRouter,
};
