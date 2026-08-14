import type { Request, Response, NextFunction } from 'express';
import type TodoService from './todo.service.js';

class TodoController {
    public service: TodoService;

    constructor(todoService: TodoService) {
        this.service = todoService;
    }

    getAllHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allTasks = await this.service.getAllTasks(req.user.userId);
            res.status(200).json({
                message: 'All tasks fetched successfully',
                tasks: allTasks
            });
        } catch(err) {
            next(err);
        }
    }

    getOneHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task = await this.service.getOneTask(req.user.userId, req.params.taskId as string);
            res.status(200).json({
                message: 'Task with given id fetched successfully',
                task: task
            });
        } catch (err) {
            next(err);
        }
    }

    addTaskHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task = await this.service.addTask(req.user.userId, req.body);
            res.status(201).json({
                message: 'Task added successfully',
                task: task
            });
        } catch (err) {
            next(err);
        }
    }

    updateTaskHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updatedTask = await this.service.updateTask(req.user.userId, req.params.taskId as string, req.body);
            res.status(200).json({
                message: 'Task updated successfully',
                task: updatedTask
            });
        } catch(err) {
            next(err);
        }
    }

    deleteTaskHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.service.deleteTask(req.user.userId, req.params.taskId as string);
            res.status(200).json({
                message: 'Task deleted successfully'
            })
        } catch(err) {
            next(err);
        }
    }
}

export default TodoController;