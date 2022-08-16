import express, { Express } from 'express';
import routes from './routes/api/index';
import 'dotenv/config';
import cors from 'cors';
import { errorHandler } from './helpers/middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const swagger = YAML.load('./posts.swagger.yaml');

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));
routes(app);
app.use(errorHandler);

export default app;
