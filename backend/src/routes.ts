import { Router } from 'express';
import {
  Register,
  Login,
  Logout,
  AuthenticatedUser,
  Refresh,
  Status,
} from './controller/auth.controller';
import { ForgotPassword, ResetPassword } from './controller/forgot.controller';

export const routes = (router: Router) => {
  router.post('/api/register', Register);
  router.post('/api/login', Login);
  router.post('/api/logout', Logout);
  router.get('/api/user', AuthenticatedUser);
  router.post('/api/refresh', Refresh);
  router.get('/api/status', Status);

  router.post('/api/forgot', ForgotPassword);
  router.post('/api/reset', ResetPassword);
};
