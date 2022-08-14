import express, { Express } from 'express';
import routes from "./routes/api/index"
import 'dotenv/config'
import { connect } from './infrastructure/dbConnection';
import cors from 'cors';
import { errorHandler } from './helpers/middlewares/defaultErrorHandler';
import logger from './helpers/logger';

const app: Express = express()
app.use(cors())
routes(app)

app.use(errorHandler)

const port: string = process.env.PORT || "3000";

app.listen(port, async () => {
  await connect();
  logger.info("listening on port " + port, {action: "HTTP Server created"});
})