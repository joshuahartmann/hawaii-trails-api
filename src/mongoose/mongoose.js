const mongoose = require('mongoose');
const { mongo_uri } = require('../config/env.dev');

async function connectToDatabase() {
    console.log('Connecting to MongoDB');

    // Read: https://mongoosejs.com/docs/deprecations.html#findandmodify
    //mongoose.set('useFindAndModify', false);

    try {
        await mongoose.connect(mongo_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Successfully connected to MongoDB');
    } catch (err) {
        console.error.bind(err, 'MongoDB error:');
    }
}

module.exports = {
    connectToDatabase,
};
