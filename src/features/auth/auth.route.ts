import express from 'express';
import { zodParser, auth } from '@middlewares';
import { loginSchema, signupSchema, usernameSchema } from './auth.schema.js';
import type AuthController from './auth.controller.js';

function createAuthRoute(authController: AuthController): express.Router {
    const router = express.Router();

    router.post('/login', zodParser(loginSchema), authController.loginHandler);
    router.post('/logout', auth, authController.logoutHandler);
    router.post('/signup', zodParser(signupSchema), authController.signupHandler);
    router.get('/me', auth, authController.getMeHandler);
    router.post('/username-availability', zodParser(usernameSchema), authController.checkUsernameHandler);

    return router;
}

export default createAuthRoute;