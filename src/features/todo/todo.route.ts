import express from 'express';
import { auth, zodParser } from '@middlewares';
import { taskIdSchema, addTaskSchema, updateTaskSchema } from './todo.schema.js';
import type TodoController from './todo.controller.js';

function createTodoRoute(todoController: TodoController) {
    const router = express.Router();

    router.get('/', auth, todoController.getAllHandler);
    router.post('/', zodParser(addTaskSchema), auth, todoController.addTaskHandler);
    router.get('/:taskId', zodParser(taskIdSchema, 'params'), auth, todoController.getOneHandler);
    router.patch('/:taskId', zodParser(taskIdSchema, 'params'), zodParser(updateTaskSchema), auth, todoController.updateTaskHandler);
    router.delete('/:taskId', zodParser(taskIdSchema, 'params'), auth, todoController.deleteTaskHandler);

    return router;
}

export default createTodoRoute;