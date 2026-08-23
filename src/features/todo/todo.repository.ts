import {Model, Types} from 'mongoose';
import type { ITask, ITaskDocument } from '@models/task.model.js';
import type TaskRepository from '@repositories/task.repository.js';
import type { TaskI, TaskO } from './todo.types.js';
import { AppError, NotFoundError } from '@errors/app.error.js';

class TodoRepository {
    public Task: Model<ITaskDocument>;
    public taskRepository: TaskRepository;

    constructor(TaskModel: Model<ITaskDocument>, taskRepository: TaskRepository) {
        this.Task = TaskModel;
        this.taskRepository = taskRepository;
    }

    async getAllTasksByUserId(userId: string): Promise<TaskO[]> {
        const allTasks = await this.taskRepository.findAllByUserId(userId).select('_id task_name task_details status').lean<TaskO[]>();
        return allTasks;
    }

    async getOneTaskById(taskId: string): Promise<TaskO | null> {
        const task = await this.taskRepository.findOneById(taskId).select('user task_name task_details status').lean<TaskO>();
        return task;
    }

    async addOne(userId: string, addTaskI: TaskI): Promise<TaskO> {
        const newTask = new this.Task({
            user: new Types.ObjectId(userId),
            task_name: addTaskI.task_name,
            task_details: addTaskI.task_details
        });
        await newTask.save();
        const task = await this.taskRepository.findOneById(newTask._id.toString()).select('user task_name task_details status').lean<TaskO>();
        if (!task) {
            throw new AppError('Cannot fetch task after creation');
        }
        return task;
    }

    async addMany(userId: string, tasks: TaskI[]) {
        const transformedTasks = tasks.map((task) => {
            return {...task, user: userId};
        })
        const addedTasks = await this.Task.insertMany(transformedTasks);
        const flatTasks = addedTasks.map((task) => {
            return {
                _id: task._id,
                task_name: task.task_name,
                task_details: task.task_details,
                status: task.status
            };
        })
        return flatTasks;
    }

    async updateOneById(taskId: string, updateTaskI: Partial<Omit<TaskO, '_id' | 'user'>>): Promise<TaskO> {
        try {
            const updatedTask = await this.Task.findOneAndUpdate({_id: taskId},
                { $set: updateTaskI },
                { returnDocument: 'after' }
            ).select('-is_deleted').lean<TaskO>();
            if (!updatedTask) {
                throw new AppError('Cannot fetch task after creation');
            }
            return updatedTask;
        } catch(err: any) {
            if (err.name === 'DocumentNotFoundError') {
                throw new NotFoundError('Given task not found', {cause: err});
            } else {
                throw err;
            }
        }
    }

    async deleteOneById(taskId: string): Promise<void> {
        try {
            const deletedTask = await this.Task.findOneAndUpdate({_id: taskId},
                { $set: { is_deleted: true }},
                { returnDocument: 'after'}
            );
        } catch(err: any) {
            if (err.name === 'DocumentNotFoundError') {
                throw new NotFoundError('Given task not found', {cause: err});
            } else {
                throw err;
            }
        }
    }
}

export default TodoRepository;