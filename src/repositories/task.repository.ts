import { Model, Query } from 'mongoose';
import type { ITask, ITaskDocument } from '@/models/task.model.js';

class TaskRepository {
    public Task: Model<ITaskDocument>;

    constructor (TaskModel: Model<ITaskDocument>) {
        this.Task = TaskModel;
    }

    /**
     * 
     * @param userId ObjectId of the user (foreign key in Task table to user)
     * @returns Array of Unexecuted Query documents
     */
    findAllByUserId(userId: string): Query<ITaskDocument[], ITaskDocument> {
        const tasks = this.Task.find({ user: userId, is_deleted: false });
        return tasks;
    }

    /**
     * 
     * @param taskId ObjectId of the the task
     * @returns Unexecuted query to the document with given _id
     */
    findOneById (taskId: string): Query<ITaskDocument | null, ITaskDocument> {
        const task = this.Task.findOne({_id: taskId, is_deleted: false});
        return task;
    }
}

export default TaskRepository;