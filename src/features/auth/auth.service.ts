import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type AuthRepository from './auth.repository.js';
import type { SignupServiceInput, SignupRepositoryInput, LoginServiceInput, JwtPayload, UserProfileO } from './auth.dto.js';
import { UnauthorizedError, InvalidCredentialsError, ConflictError } from '@errors/app.error.js'

class AuthService {
    public repository: AuthRepository;

    constructor(repository: AuthRepository) {
        this.repository = repository;
    }

    async signup(signupSI: SignupServiceInput): Promise<void> {
        // Password hashing
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(signupSI.password, salt);
        const signupRI: SignupRepositoryInput = {
            username: signupSI.username,
            passwordHash: passwordHash,
            firstname: signupSI.firstname,
        }
        signupSI.lastname ? signupRI.lastname = signupSI.lastname : {} ;
        await this.repository.addNewUser(signupRI);
    }

    async login(loginSI: LoginServiceInput): Promise<{jwtToken: string, user: Object}> {
        const user = await this.repository.findUserByUsername(loginSI.username);
        if (!user) {
            throw new InvalidCredentialsError('Invalid Username', 'username');
        }
        const isPasswordMatch = await bcrypt.compare(loginSI.password, user.passwordHash);
        if (!isPasswordMatch) {
            throw new InvalidCredentialsError('Invalid Password', 'password');
        }

        const payload: JwtPayload = {
            userId: user._id,
            username: user.username
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {expiresIn: '1d'});
        delete user.passwordHash;
        return {
            user: user,
            jwtToken: token
        }
    }

    async getMe(userId: string): Promise<UserProfileO> {
        const user = await this.repository.findUserProfileById(userId);
        if (!user) {
            throw new UnauthorizedError('Invalid Username, please login to proceed');
        }
        return user;
    }

    async checkUsernameConflict(username: string) {
        const user = await this.repository.checkUserExistsByUsername(username);
        if (user) throw new ConflictError('Username already taken', [{field: 'username', message: `Username ${username} is not available`}]);
    }

}

export default AuthService;