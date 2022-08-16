import { Express } from 'express';
import { IError } from '../../dtos/error';
import posts from './posts';

const routes: (app: Express) => void = (app: Express) => {
  app.use('/api', posts);
  app.use('*', (req, res) => {
    const notFound: IError = {
      error: `Requested resource [${req.originalUrl}] does not exist`,
      from: 'posts-api',
      timestamp: Date.now(),
    };
    res.status(404).send(notFound);
  });
};

export default routes;
