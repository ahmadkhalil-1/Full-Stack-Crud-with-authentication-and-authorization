import express from 'express';
import { CreateTodos, DeleteTodo, getTodo, updateTodo } from '../controller/todoController.js';
import { authentication } from '../middleware/authentication.js';


const router = express.Router();

router.post('/create-todo', authentication, CreateTodos);
router.get('/get-todo', getTodo);
router.delete('/delete-todo/:id', authentication, DeleteTodo);
router.put('/update-todo/:id', authentication, updateTodo);

export default router;