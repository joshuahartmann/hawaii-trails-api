const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const { clientOrigins, serverPort } = require('./config/env.dev');

const { checkinsRouter } = require('./checkins/checkins.router');

const { connectToDatabase } = require('./mongoose/mongoose');

const app = express();
const apiRouter = express.Router();

app.use(helmet());
app.use(cors({ origin: clientOrigins }));
app.use(express.json());

app.use('/api', apiRouter);

// routes
apiRouter.use('/checkins', checkinsRouter);

app.get('/green', (req, res) => {
    const options = {
        root: path.join(__dirname, 'sample-data'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true,
        },
    };

    const fileName = 'Green_Trails.geojson';
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
    console.log(`API Server listening on port ${serverPort}`);
});
