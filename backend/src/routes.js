import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import Auth from './app/middlewares/Auth';
import UserValidation from './app/middlewares/UserValidation';
import SessionValidation from './app/middlewares/SessionValidation';

const routes = Router();

routes.post('/users', UserValidation.validateStoreUser, UserController.store);
routes.put(
  '/users',
  Auth.checkToken,
  UserValidation.validateUpdateUser,
  UserController.update
);

routes.post(
  '/session',
  SessionValidation.validateStoreUser,
  SessionController.store
);

export default routes;
