import type { Model, Types } from 'mongoose';
import type { IUser, IUserDocument} from '@models/user.model.js';
import type UserRepository from '@repositories/user.repository.js';
import type { SignupRepositoryInput, UserProfileO } from './auth.dto.js';
import { ConflictError } from '@errors/app.error.js'

class AuthRepository {
    public UserModel: Model<IUserDocument>;
    public userRepository: UserRepository;

    constructor (UserModel: Model<IUserDocument>, userRepository: UserRepository) {
        this.UserModel = UserModel;
        this.userRepository = userRepository;
    }

    async addNewUser(signupRI: SignupRepositoryInput): Promise<void> {
        try {
            await this.UserModel.create(signupRI);
        } catch(err: any) {
            if (err.code == 11000) {    // Map MongoError to ConflictError
                const details: Array<any> = Object.keys(err.keyPattern).map((field) =>
                    ({field: field, message: `${err.keyValue[field]} already exists`})
                )
                throw new ConflictError(`Duplicate value for ${details[0].field} field`, details);
            } else {
                throw err;
            }
        }
    }

    async findUserByUsername(username: string): Promise<any> {
        const user = await this.userRepository.findByUsername(username).select('_id username passwordHash firstname lastname').lean();
        return user;
    }

    async findUserProfileById(userId: string): Promise<UserProfileO | null> {
        const user: any = await this.userRepository.findById(userId).select('_id firstname username').lean();
        if (!user) return null;
        const userProfile: UserProfileO = {
            userId: user._id.toString(),
            firstname: user.firstname
        }
        return userProfile;
    }

    async checkUserExistsByUsername(username: string) {
        const user = await this.UserModel.exists({username: username, isActive: true});
        return user;
    }
}

export default AuthRepository;