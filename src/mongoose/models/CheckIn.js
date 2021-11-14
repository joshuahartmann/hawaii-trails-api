const { Schema, model } = require('mongoose');

const CheckInSchema = new Schema({
    date: {
        type: Date,
        default: Date.now(),
    },
    userId: {
        type: 'ObjectId',
        ref: 'User',
        required: true,
    },
    featureId: {
        type: 'ObjectId',
        ref: 'Feature',
        required: true,
    },
    ratingId: {
        type: 'ObjectId',
        ref: 'Rating',
    },
});

const CheckInModel = model('CheckIn', CheckInSchema);

module.exports = {
    CheckInSchema,
    CheckInModel,
};
