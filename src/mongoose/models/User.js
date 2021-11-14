const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    date: {
        type: Date,
        default: Date.now(),
    },
    username: {
        type: String,
        required: true,
    },
});

const UserModel = model('User', UserSchema);

module.exports = {
    UserSchema,
    UserModel,
};
