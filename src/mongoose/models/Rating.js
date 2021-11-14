const { Schema, model } = require('mongoose');

const RatingSchema = new Schema({
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
    rating: {
        type: Number,
        required: true,
    },
});

const RatingModel = model('Rating', RatingSchema);

module.exports = {
    RatingSchema,
    RatingModel,
};
