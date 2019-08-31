import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import AuthMiddleware from './app/middlewares/Auth';
import UserValidation from './app/middlewares/UserValidation';
import SessionValidation from './app/middlewares/SessionValidation';
import MeetupValidation from './app/middlewares/MeetupValidation';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/users', UserValidation.validateStoreUser, UserController.store);
routes.put(
  '/users',
  AuthMiddleware,
  UserValidation.validateUpdateUser,
  UserController.update
);

routes.post('/sessions', SessionValidation, SessionController.store);

routes.get('/meetups', AuthMiddleware, MeetupController.index);
routes.post(
  '/meetups',
  AuthMiddleware,
  MeetupValidation.validate,
  MeetupController.store
);
routes.put(
  '/meetups/:id',
  AuthMiddleware,
  MeetupValidation.validate,
  MeetupController.update
);
routes.delete('/meetups/:id', AuthMiddleware, MeetupController.delete);

routes.get('/subscriptions', AuthMiddleware, SubscriptionController.index);
routes.post(
  '/subscriptions/:meetupId',
  AuthMiddleware,
  SubscriptionController.store
);

routes.post(
  '/files',
  AuthMiddleware,
  upload.single('file'),
  FileController.store
);

export default routes;
