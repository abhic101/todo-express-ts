import AuthRepository from './auth.repository.js';
import AuthService from './auth.service.js';
import AuthController from './auth.controller.js';
import type UserRepository from '@repositories/user.repository.js';
import type UserModel from '@models/user.model.js';
import type RefreshToken from '@models/refreshToken.model.js';
import type RefreshTokenRepository from '@/repositories/refreshToken.repository.js';

function wireAuthFeature(userModel: typeof UserModel,
    userRepository: UserRepository,
    refreshTokenModel: typeof RefreshToken,
    refreshTokenRepository: RefreshTokenRepository
    ): AuthController {
    const authRepository = new AuthRepository(userModel, userRepository, refreshTokenModel, refreshTokenRepository);
    const authService = new AuthService(authRepository);
    const authController = new AuthController(authService);

    return authController;
}

export default wireAuthFeature;