import express, { Express } from 'express';
import routes from "./routes/api/index"
import 'dotenv/config'

const app: Express = express()
routes(app)

const port: string = process.env.PORT || "3000";

app.listen(port, () => {
  console.log("listening on port " + port)
})