 const express = require("express");
 const cors = require("cors");
 const helmet = require("helmet");
 const { clientOrigins, serverPort } = require("./config/env.dev");
 
 
 const app = express();
 const apiRouter = express.Router();
 
 app.use(helmet());
 app.use(cors({ origin: clientOrigins }));
 app.use(express.json());
 
 app.use("/api", apiRouter);
 
 apiRouter.use("/messages", messagesRouter);
 
 app.use((err, req, res, next) => {
   console.log(err);
   res.status(500).send(err.message);
 });
 
 app.listen(serverPort, () =>
   console.log(`API Server listening on port ${serverPort}`)
 );