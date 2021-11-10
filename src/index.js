const express = require('express');
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

app.listen(serverPort, async () => {
    await connectToDatabase();
    console.log(`API Server listening on port ${serverPort}`);
});
