const express = require('express');
const { checkJwt } = require('../../authz/check-jwt');
const { FeatureModel } = require('../../mongoose/models/Feature');

const featureRouter = express.Router();

featureRouter.get('/', (req, res) => {
    FeatureModel.find()
        .then((features) => {
            res.send({ type: 'FeatureCollection', features });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

module.exports = {
    featureRouter,
};
