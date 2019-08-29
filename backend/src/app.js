import express from 'express';
import routes from './routes';
import ErrorHandler from './app/middlewares/errorHandler';
import Database from './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.errorMiddlewares();
    this.database();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  errorMiddlewares() {
    this.server.use(ErrorHandler.catchNotFound);
    this.server.use(ErrorHandler.catchErrors);
  }

  database() {
    this.database = new Database();
  }
}

export default new App().server;
