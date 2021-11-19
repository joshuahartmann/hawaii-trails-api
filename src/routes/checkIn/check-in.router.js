const express = require('express');
const { checkJwt } = require('../../authz/check-jwt');
const { CheckInModel } = require('../../mongoose/models/CheckIn');
const { UserModel } = require('../../mongoose/models/User');
const {
    isUserInDatabase,
    findUser,
    isTrailInDatabase,
} = require('./check-in.service');

const checkInRouter = express.Router();

checkInRouter.use(checkJwt);
checkInRouter.post('/', async (req, res) => {
    const { user, featureId } = req.body;

    if (req.user) {
        const CheckIn = {};

        const userExists = await isUserInDatabase(user.email);
        const featureExists = await isTrailInDatabase(featureId);

        let userDoc;

        if (!featureExists) {
            return res.status(400).send('Trail does not exist');
        }

        if (userExists) {
            // Find the user
            userDoc = await findUser(user.email);
        } else {
            // Create the user if it doesn't exist
            const newUser = {};
            newUser.username = user.email;
            userDoc = await UserModel.create(newUser);
        }

        CheckIn.userId = userDoc._id;
        CheckIn.featureId = featureId;

        const checkInDoc = await CheckInModel.create(CheckIn);

        console.log(`User #${userDoc._id} checked into feature #${featureId}`);

        res.send({ status: 'success', checkIn: checkInDoc });
    } else {
        res.send({ status: 'failure' });
    }
});

module.exports = {
    checkInRouter,
};
