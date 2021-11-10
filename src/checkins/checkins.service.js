const { CheckInSchema, CheckInModel } = require('../mongoose/models/CheckIn');

const postCheckin = async (user, trail) => {
    await CheckinsModel.create({ email: user.email, trail });
    return {
        message: 'Successfully checked in to a trail.',
    };
};

module.exports = {
    postCheckin,
};
