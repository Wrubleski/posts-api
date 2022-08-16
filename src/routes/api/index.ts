import express, { Express } from 'express';
import posts from './posts';

const routes = (app: Express) => {
  app.use('/api', express.json(), posts);
};

export default routes;
