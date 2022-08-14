import app from "./app"
import { connect } from './infrastructure/dbConfig';
import logger from './helpers/logger';
import { populate } from "./infrastructure/populateDatabase";
import Posts from "./models/posts";

const port: string = process.env.PORT || "3000";

app.listen(port, async () => {
  // Start and populate a mongodb memory server
  await connect();
  await populate(Posts)
  logger.info("listening on port " + port, {action: "HTTP Server created"});
})