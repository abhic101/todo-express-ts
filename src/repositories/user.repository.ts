import type { IUserDocument } from '@models/user.model.js';
import type { Query, Model} from 'mongoose';

class UserRepository {
    public User: Model<IUserDocument>;
    constructor (UserModel: Model<IUserDocument>) {
        this.User = UserModel;
    }

    /**
     * @returns Unexecuted query to the user with given username
     */
    findByUsername(username: string): Query<IUserDocument | null, IUserDocument> {
        const userQuery = this.User.findOne({username: username, isActive: true});
        return userQuery;
    }

    async findFirstnameById(userId: string): Promise<string | null> {
        const user = await this.User.findOne({_id: userId, isActive: true}).select('firstname').lean();
        return user ? user.firstname : null;
    }

    /**
     * @returns Unexecuted query to the complete user document with given id
     */
    findById(userId: string): Query<IUserDocument | null, IUserDocument> {
        const userQuery = this.User.findOne({_id: userId, isActive: true});
        return userQuery;
    }
}

export default UserRepository;