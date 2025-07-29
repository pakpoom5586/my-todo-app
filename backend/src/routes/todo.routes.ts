// src/routes/todo.routes.ts
import { Router } from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todo.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect); // Protect all todo routes

router.route('/')
    .get(getTodos)
    .post(createTodo);

router.route('/:id')
    .put(updateTodo)
    .delete(deleteTodo);

export default router;