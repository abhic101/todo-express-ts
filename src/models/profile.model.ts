import { Schema, model, Document, Types } from 'mongoose';

interface IProfile {
    userId: Types.ObjectId;
    firstname: string;
    lastname: string;
}

interface IProfileDocument extends IProfile, Document {};

const Profile = new Schema<IProfileDocument> ({
    userId: {
        type:  Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstname: {
        type: String,
        trim: true,
        required: true
    },
    lastname: {
        type: String,
        trim: true
    }
});