const { Schema, model } = require('mongoose');

const CheckInSchema = new Schema({
    date: {
        type: Date,
        default: Date.now(),
    },
    email: {
        type: String,
        minLength: 4,
        maxLength: 100,
        required: true,
        unique: true,
    },
    trail: {
        type: String,
        maxLength: 250,
        required: true,
    },
});

const CheckInModel = model('CheckIn', CheckInSchema);

module.exports = {
    CheckInSchema,
    CheckInModel,
};
