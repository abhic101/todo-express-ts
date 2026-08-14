import TodoRepository from './todo.repository.js';
import TodoService from './todo.service.js';
import TodoController from './todo.controller.js'
import type TaskModel from '@models/task.model.js';
import type TaskRepository from '@/repositories/task.repository.js';

function wireTodoFeature(Task: typeof TaskModel, taskRepository: TaskRepository): TodoController {
    const todoRepository = new TodoRepository(Task, taskRepository);
    const todoService = new TodoService(todoRepository);
    const todoController = new TodoController(todoService);

    return todoController;
}

export default wireTodoFeature;