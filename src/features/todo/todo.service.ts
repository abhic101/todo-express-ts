import type TodoRepository from './todo.repository.js';
import { NotFoundError, ConflictError } from '@errors/app.error.js';
import type { TaskO, TaskI, PartialTaskO } from './todo.types.js';

class TodoService {
    public repository: TodoRepository;

    constructor(todoRepository: TodoRepository) {
        this.repository = todoRepository;
    }

    async verifyUserAgainstTask (userId: string, taskId: string): Promise<TaskO> {
        const task = await this.repository.getOneTaskById(taskId);
        if (!task || task.user?.toString() !== userId) {
            throw new NotFoundError(`Task with id: ${taskId} is not found`);
        }
        return task;
    }

    async getAllTasks(userId: string): Promise<TaskO[]> {
        const allTasks = await this.repository.getAllTasksByUserId(userId);
        if (!allTasks) {
            throw new NotFoundError('User Task not found');
        }
        return allTasks;
    }

    async getOneTask(userId: string, taskId: string): Promise<TaskO> {
        const task = await this.verifyUserAgainstTask(userId, taskId);
        return task;
    }

    async addTask(userId: string, addTaskI: TaskI): Promise<TaskO> {
        const task = await this.repository.addOne(userId, addTaskI);
        return task;
    }

    async updateTask(userId: string, taskId: string, updateTaskI: PartialTaskO): Promise<TaskO> {
        const task = await this.verifyUserAgainstTask(userId, taskId);

        // Check if there are any changes
        const keys = Object.keys(updateTaskI) as (keyof PartialTaskO)[];
        const details = [];
        for (let key of keys) {
            if (updateTaskI[key] === task[key]) {
                details.push({
                    field: key,
                    message: `Duplicate Value for ${key}: ${task[key]}`
                })
                delete updateTaskI[key];
            }
        }
        if (Object.keys(updateTaskI).length <= 0) {
            throw new ConflictError('New values are same as old values', details);
        }
        const updatedTask = await this.repository.updateOneById(taskId, updateTaskI);
        return updatedTask;
    }

    async deleteTask(userId: string, taskId: string): Promise<void> {
        const task = await this.verifyUserAgainstTask(userId, taskId);
        await this.repository.deleteOneById(taskId);
    }
}

export default TodoService;