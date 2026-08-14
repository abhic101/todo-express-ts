import type AccountRepository from './account.repository.js';
import type { UserProfileO, UpdateProfileI, ChangeUsernameI, ChangePasswordI } from './account.types.js'
import { NotFoundError, ConflictError, UnauthorizedError } from '@errors/app.error.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class AccountService {
    public repository: AccountRepository;

    constructor(accountRepository: AccountRepository) {
        this.repository = accountRepository;
    }

    async getUser(userId: string): Promise<UserProfileO> {
        const user = await this.repository.findUserProfileById(userId);
        if (!user) {
            throw new NotFoundError('User not found. Please login with correct User ID');
        }
        return user;
    }

    async updateProfile(userId: string, updateProfileI: UpdateProfileI): Promise<UserProfileO> {
        const updatedUser = await this.repository.findByIdAndUpdateProfile(userId, updateProfileI);
        return updatedUser;
    }

    async changeUsername(userId: string, changeUsernameI: ChangeUsernameI) {
        // Verify password first
        const user = await this.repository.findUserById(userId);
        if (!user) {
            throw new NotFoundError('User not Found. Please login with correct User ID');
        }
        if (changeUsernameI.newUsername === user.username) {
            const details = [{
                field: 'username',
                message: 'New Username cannot be same as old username'
            }]
            throw new ConflictError('Invalid New Username', details);
        }
        const isPasswordMatch = await bcrypt.compare(changeUsernameI.password, user.passwordHash);
        if (!isPasswordMatch) {
            throw new UnauthorizedError('Incorrect Password');
        }
        const updatedUser = await this.repository.findByIdAndChangeUsername(userId, changeUsernameI.newUsername);
        const payload = {username: changeUsernameI.newUsername, userId: user._id};
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {expiresIn: '1d'});
        return token;
    }

    async changePassword(userId: string, changePasswordI: ChangePasswordI) {
        const user = await this.repository.findUserById(userId);
        if (!user) {
            throw new NotFoundError('User not Found. Please login with correct user ID');
        }
        const isPasswordMatch = await bcrypt.compare(changePasswordI.currentPassword, user.passwordHash);
        if (!isPasswordMatch) {
            throw new UnauthorizedError('Incorrect Password');
        }
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(changePasswordI.newPassword, salt);
        await this.repository.findByIdAndChangePassword(userId, newPasswordHash);
    }
}

export default AccountService;