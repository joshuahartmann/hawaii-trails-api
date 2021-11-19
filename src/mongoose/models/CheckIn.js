const { Schema, model } = require('mongoose');

const CheckInSchema = new Schema({
    date: {
        type: Date,
        default: Date.now(),
    },
    userId: {
        type: 'ObjectId',
        required: true,
    },
    featureId: {
        type: 'ObjectId',
        required: true,
    },
    ratingId: {
        type: 'ObjectId',
    },
});

const CheckInModel = model('CheckIn', CheckInSchema);

module.exports = {
    CheckInSchema,
    CheckInModel,
};
