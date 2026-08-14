import { Schema, model, Document, Types} from 'mongoose';

// Interface to define shape for ts typechecking
interface ITask {
    user: Types.ObjectId;
    task_name: string;
    task_details?: string;
    status: boolean;
    is_deleted: boolean;
}

// Document interface with proper mongo methods, again for ts
interface ITaskDocument extends ITask, Document {}

// Schema
const TaskSchema = new Schema<ITaskDocument>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    task_name: {
        type: String,
        trim: true,
        required: true
    },
    task_details: {
        type: String,
        trim: true,
    },
    status: {
        type: Boolean,
        default: false
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

TaskSchema.index({user: 1, is_deleted: 1});

const Task = model<ITaskDocument>('Task', TaskSchema);

export default Task;
export type {ITask, ITaskDocument};