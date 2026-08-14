import AccountRepository from './account.repository.js';
import AccountService from './account.service.js';
import AccountController from './account.controller.js'
import type UserModel from '@models/user.model.js';
import type UserRepository from '@repositories/user.repository.js';

function wireAccountFeature (User: typeof UserModel, userRepository: UserRepository): AccountController {
    const accountRepository = new AccountRepository(User, userRepository);
    const accountService = new AccountService(accountRepository);
    const accountController = new AccountController(accountService);

    return accountController;
}

export default wireAccountFeature;