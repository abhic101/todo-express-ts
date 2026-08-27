import express from 'express';
import type AccountController from './account.controller.js';
import { zodParser} from '@middlewares';
import { profileUpdateSchema, passwordUpdateSchema, usernameUpdateSchema } from './account.schema.js';
import { auth } from '@/wireDependencies.js';

function createAccountRoute(accountController: AccountController): express.Router{
    const router = express.Router();

    router.get('/', auth, accountController.getUser);
    router.patch('/', zodParser(profileUpdateSchema), auth, accountController.updateProfile);
    router.put('/username', zodParser(usernameUpdateSchema), auth, accountController.changeUsername);
    router.put('/password', zodParser(passwordUpdateSchema), auth, accountController.changePassword);
    return router;
}

export default createAccountRoute;