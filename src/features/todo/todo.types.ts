import { Types } from 'mongoose';

interface TaskO {
    _id: Types.ObjectId;
    user?: Types.ObjectId;
    task_name: string;
    task_details?: string;
    status: boolean
}

interface TaskI {
    task_name: string;
    task_details?: string;
}

type PartialTaskO = Partial<Omit<TaskO, '_id' | 'user'>>

export {
    type TaskO,
    type TaskI,
    type PartialTaskO
}