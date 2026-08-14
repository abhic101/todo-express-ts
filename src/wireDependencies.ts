import UserModel from './models/user.model.js';
import UserRepository from './repositories/user.repository.js'
import TaskModel from './models/task.model.js';
import TaskRepository from '@repositories/task.repository.js';
import wireAuthFeature from './features/auth/auth.wiring.js';
import wireAccountFeature from './features/account/account.wiring.js';
import wireTodoFeature from './features/todo/todo.wiring.js';

function wireDependencies(): Array<any> {
    const userRepository = new UserRepository(UserModel);
    const taskRepository = new TaskRepository(TaskModel);

    const authController = wireAuthFeature(UserModel, userRepository);
    const accountController = wireAccountFeature(UserModel, userRepository);
    const todoController = wireTodoFeature(TaskModel, taskRepository);

    return [authController, accountController, todoController];
}

export default wireDependencies;