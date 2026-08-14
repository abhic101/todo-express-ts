import { Model } from 'mongoose';
import type { IUserDocument } from '@models/user.model.js';
import type UserRepository from '@repositories/user.repository.js';
import type { UserProfileO, UpdateProfileI, WholeUserO } from './account.types.js';
import { NotFoundError, AppError } from '@errors/app.error.js';

class AccountRepository {
    public User: Model<IUserDocument>;
    public userRepository: UserRepository;

    constructor (UserModel: Model<IUserDocument>, userRepository: UserRepository) {
        this.User = UserModel;
        this.userRepository = userRepository;
    }

    async findUserProfileById(userId: string): Promise<UserProfileO | null> {
        const user = await this.userRepository.findById(userId).select('firstname lastname -_id').lean<UserProfileO>();
        return user;
    }

    async findByIdAndUpdateProfile(userId: string, updateProfileRI: UpdateProfileI): Promise<UserProfileO> {
        try {
            const user = await this.User.findOneAndUpdate({_id: userId},
                { $set: updateProfileRI },
                { returnDocument: 'after' }
            ).select('username firstname lastname -_id').lean<UserProfileO>();
            if (user) return user;
            else throw new AppError('findOneAndUpdate returned null value');
        } catch (err: any) {
            if (err.name === 'DocumentNotFoundError') {
                throw new NotFoundError('User Not Found', {cause: err});
            } else {
                throw err;
            }
        }
    }

    async findUserById(userId: string): Promise<WholeUserO | null> {
        const user = await this.userRepository.findById(userId).select('-isActive').lean<WholeUserO>();
        return user;
    }

    async findByIdAndChangeUsername(userId: string, newUsername: string): Promise<UserProfileO> {
        try {
            const user = await this.User.findOneAndUpdate({_id: userId},
                { $set: {username: newUsername} },
                { returnDocument: 'after'}
            ).select('username firstname lastname -_id').lean<UserProfileO>();
            if (user) return user;
            else throw new AppError('findOneAndUpdate returned null value');
        } catch (err: any) {
            if (err.name === 'DocumentNotFoundError') {
                throw new NotFoundError('User Not Found', {cause: err});
            } else {
                throw err;
            }
        }
    }

    async findByIdAndChangePassword(userId: string, newPasswordHash: string) {
        try {
            await this.User.findOneAndUpdate({_id: userId},
                { $set: {passwordHash: newPasswordHash} },
            )
        } catch(err: any) {
            if (err.name === 'DocumentNotFoundError') {
                throw new NotFoundError('User not found', {cause: err});
            } else {
                throw err;
            }
        }
    }
}

export default AccountRepository;