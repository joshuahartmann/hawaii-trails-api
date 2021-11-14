const express = require('express');
const { checkJwt } = require('../../authz/check-jwt');
const { FeatureModel } = require('../../mongoose/models/Feature');
const featureRouter = express.Router();

featureRouter.get('/', (req, res) => {
    FeatureModel.find({})
        .then((features) => {
            const formattedFeatures = features.map((feature) => {
                return {
                    type: 'Feature',
                    geometry: feature.geometry,
                    properties: {
                        name: feature.name,
                        traffic: feature.traffic,
                    },
                };
            });

            res.send({
                type: 'FeatureCollection',
                features: formattedFeatures,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
});

module.exports = {
    featureRouter,
};
