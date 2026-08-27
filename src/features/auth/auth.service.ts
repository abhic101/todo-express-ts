import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import type AuthRepository from './auth.repository.js';
import type { ResponseTypes, RequestTypes } from './auth.types.js';
import { ACCESS_TOKEN_LIFESPAN } from '@/constants/auth.constants.js';
import { createRefreshToken } from '@/utils/refreshToken.utils.js';
import { UnauthorizedError, InvalidCredentialsError, ConflictError } from '@errors/app.error.js'

class AuthService {
    public repository: AuthRepository;

    constructor(repository: AuthRepository) {
        this.repository = repository;
    }

    /**
     * @param signupData Data provided by client for creating new account
     */
    async signup(signupData: RequestTypes.SignupInput) {
        // Password hashing
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(signupData.password, salt);
        const  {password, ...userData} = {...signupData, passwordHash}
        await this.repository.createUser(userData);
    }

    /**
     * @param loginData Data sent by the client request for login
     * @returns Access token for auth concerns
     */
    async login(loginData: RequestTypes.LoginInput) {
        const user = await this.repository.findUserByUsername(loginData.username);
        if (!user) {
            throw new InvalidCredentialsError('Invalid Username', 'username');
        }
        const isPasswordMatch = await bcrypt.compare(loginData.password, user.passwordHash);
        if (!isPasswordMatch) {
            throw new InvalidCredentialsError('Invalid Password', 'password');
        }
        const { passwordHash, ...userProfile } = user;

        // Creating refresh token and saving hashed value
        const {refreshTokenHash, refreshTokenValue} = await createRefreshToken();
        const refreshTokenId = await this.repository.insertRefreshToken({
            token: refreshTokenHash,
            user: user._id.toString()
        });
        
        // Creating access token (jwt) with payload
        const payload = {
            userId: user._id,
            username: user.username
        }
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {expiresIn: ACCESS_TOKEN_LIFESPAN});

        return {
            user: userProfile,
            accessToken: accessToken,
            refreshToken: {
                tokenId: refreshTokenId.toString(),
                token: refreshTokenValue
            }
        }
    }

    async getMe(userId: string): Promise<ResponseTypes.UserProfile> {
        const user = await this.repository.findProfileById(userId);
        if (!user) {
            throw new UnauthorizedError('Invalid Username, please login to proceed');
        }
        return user;
    }

    async checkUsernameConflict(username: string) {
        const user = await this.repository.checkUserExistsByUsername(username);
        if (user) throw new ConflictError('Username already taken', [{field: 'username', message: `Username ${username} is not available`}]);
    }

    async logout(refreshTokenId: string) {
        await this.repository.refreshTokenRepository.invalidateOne(refreshTokenId);
    }

}

export default AuthService;