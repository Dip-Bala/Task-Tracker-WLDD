import {Router} from 'express';
import {addTask, getAllTask, updateTask, deleteTask} from '../controllers/taskController';
import {verifyToken} from '../middleware/auth';

const taskRouter = Router();

taskRouter.use(verifyToken);

taskRouter.post('/', addTask);
taskRouter.get('/', getAllTask);
taskRouter.put('/:id', updateTask);
taskRouter.delete('/:id', deleteTask);


export default taskRouter;
