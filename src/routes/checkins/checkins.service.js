const {
    CheckInSchema,
    CheckInModel,
} = require('../../mongoose/models/CheckIn');

const classifyPoint = require('robust-point-in-polygon');

const postCheckin = async (user, trail) => {
    await CheckinsModel.create({ email: user.email, trail });
    return {
        message: 'Successfully checked in to a trail.',
    };
};

const createCheckin = async (userId, featureId, date) => {
    await CheckinsModel.create({ userId, featureId, date });
    return {
        message: 'Successfully checked in to a trail.',
    };
};

const queryRange = async (start, end) => {
    const ret = await CheckinsModel.find({ date: { $gt: start, $lt: end } });
    return {
        message: 'Successfully queried check ins.',
        data: ret,
    };
};

const pointInRange = (polygon, point) => {
    let ret = false;
    const points = polygon.coordinates[0];

    if (polygon.type === 'MultiPolygon') {
        for (let i = 0; i < points.length; i++) {
            if (ret === false) {
                let inside = classifyPoint(points[i], point);

                if (inside === 0 || inside === -1) {
                    ret = true;
                }
            }
        }
    }
    return ret;
};

module.exports = {
    postCheckin,
    createCheckin,
    queryRange,
    pointInRange,
};
