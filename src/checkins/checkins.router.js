const express = require('express');
const { postCheckin } = require('./checkins.service');
const { checkJwt } = require('../authz/check-jwt');

const checkinsRouter = express.Router();

// POST /messages

checkinsRouter.post('/checkin', checkJwt, (req, res) => {
    // TODO: Figure out why not able to receive body from client
    console.log(req.body);
    const { user, trail } = req.body;
    const message = postCheckin(user, trail);
    res.status(200).send(message);
});

module.exports = {
    checkinsRouter,
};
