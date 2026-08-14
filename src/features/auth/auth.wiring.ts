import AuthRepository from './auth.repository.js';
import AuthService from './auth.service.js';
import AuthController from './auth.controller.js';
import type UserRepository from '@repositories/user.repository.js';
import type UserModel from '@models/user.model.js';

function wireAuthFeature(userModel: typeof UserModel, userRepository: UserRepository): AuthController {
    const authRepository = new AuthRepository(userModel, userRepository);
    const authService = new AuthService(authRepository);
    const authController = new AuthController(authService);

    return authController;
}

export default wireAuthFeature;