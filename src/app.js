import express from "express"
import routes from "./routes/api/index.js"
import 'dotenv/config'

const app = express()
routes(app)

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("listening on port " + port)
})