const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const { clientOrigins, serverPort } = require('./config/env.dev');
// const { checkinsRouter } = require('./routes/checkins/checkins.router');
const { checkInRouter } = require('./routes/checkIn/check-in.router');
const { featureRouter } = require('./routes/feature/feature.router');
const { connectToDatabase } = require('./mongoose/mongoose');
const { main } = require('./database-init/databaseInitializer');

const app = express();
const apiRouter = express.Router();

app.use(helmet());
app.use(cors({ origin: clientOrigins }));
app.use(express.json());

app.use('/api', apiRouter);

// routes
apiRouter.use('/check-in', checkInRouter);
apiRouter.use('/features', featureRouter);

app.get('/', (req, res) => {
    res.send(`Hawai'i Trails API`);
});
app.get('/trails/:trailColor', (req, res) => {
    const { trailColor } = req.params;

    const options = {
        root: path.join(__dirname, 'sample-data'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true,
        },
    };

    const fileName = `${trailColor}-trails.geojson`;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});

app.listen(serverPort, async () => {
    await connectToDatabase();
    await main();
    console.log(`API Server listening on port ${serverPort}`);
});
