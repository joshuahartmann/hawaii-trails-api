const express = require('express');
const { checkJwt } = require('../../authz/check-jwt');
const { FeatureModel } = require('../../mongoose/models/Feature');
const featureRouter = express.Router();

featureRouter.get('/', (req, res) => {
    FeatureModel.find({})
        .then((features) => {
            const formattedFeatures = features.map((feature) => {
                const {
                    _id,
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
