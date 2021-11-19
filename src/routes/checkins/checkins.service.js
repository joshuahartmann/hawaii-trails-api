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
    await CheckInModel.create({ userId, featureId, date });
    return {
        message: 'Successfully checked in to a trail.',
    };
};

const queryRange = async (start, end) => {
    const ret = await CheckInModel.find({ date: { $gt: start, $lt: end } });
    return {
        message: 'Successfully queried check ins.',
        data: ret,
    };
};

const pointInPolygon = (polygon, point) => {
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

const distance = (a, b) => {
    let p1 = b[0] - a[0];
    let p2 = b[1] - a[1];
    let distance = 0;

    p1 = p1 * p1;
    p2 = p2 * p2;

    distance = Math.sqrt(p1 + p2);

    if (distance < 0) {
        distance = distance * -1;
    }

    return distance;
};

const pointNearLine = (geometry, point) => {
    let ret = false;
    const points = geometry.coordinates;

    if (geometry.type === 'LineString') {
        // if (classifyPoint(points[i], point) === 0) {
        //     ret = true;
        // }
        for (let i = 0; i < points.length; i++) {
            // checks if approx. 36ft away from trail
            if (distance(point, points[i]) <= 0.000109) {
                ret = true;
            }
        }
    }

    return ret;
};

module.exports = {
    postCheckin,
    createCheckin,
    queryRange,
    pointInPolygon,
    pointNearLine,
};
