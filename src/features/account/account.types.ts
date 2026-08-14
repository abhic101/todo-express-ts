import { Types } from 'mongoose';

interface UserProfileO {
    firstname: string;
    lastname?: string;
}

interface UpdateProfileI {
    firstname?: string;
    lastname?: string;
}

interface ChangeUsernameI {
    newUsername: string;
    password: string;
}

interface WholeUserO extends UserProfileO {
    _id: Types.ObjectId;
    username: string;
    passwordHash: string;
}

interface ChangePasswordI {
    currentPassword: string;
    newPassword: string;
}

export type {
    UserProfileO,
    UpdateProfileI,
    ChangeUsernameI,
    WholeUserO,
    ChangePasswordI
}