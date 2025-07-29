// src/controllers/todo.controller.ts
import { Response } from 'express';
import { Prisma, PrismaClient, Priority, Status } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();


export const getTodos = async (req: AuthRequest, res: Response) => {
    try {
        const { isCompleted, priority, categoryId, sortBy, sortOrder, status } = req.query;

        // Build a dynamic 'where' clause for Prisma
        const where: Prisma.TodoWhereInput = {
            userId: req.user!.userId,
        };
        if (isCompleted) where.isCompleted = isCompleted === 'true';
        if (status) where.status = status as Status;
        if (priority) where.priority = priority as Priority;
        if (categoryId) where.categoryId = categoryId as string;

        // Build a dynamic 'orderBy' clause
        const orderBy: Prisma.TodoOrderByWithRelationInput = {};
        if (sortBy) {
                (orderBy as { [key: string]: 'asc' | 'desc' })[sortBy as string] = sortOrder === 'desc' ? 'desc' : 'asc';
        } else {
                orderBy.createdAt = 'desc'; // Default sort
        }

        const todos = await prisma.todo.findMany({
            where,
            orderBy,
            include: {
                category: true, // Include category details in the response
            },
        });

        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// @desc    Create a new todo
// @route   POST /api/todos
export const createTodo = async (req: AuthRequest, res: Response) => {
    const { title, priority, dueDate, categoryId, status } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const newTodo = await prisma.todo.create({
            data: {
                title,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
                status,
                userId: req.user!.userId,
                categoryId,
            },
        });
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
export const updateTodo = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { title, priority, dueDate, categoryId, isCompleted, status } = req.body;

    try {
        // Verify that the todo belongs to the user
        const todo = await prisma.todo.findFirst({
            where: { id, userId: req.user!.userId },
        });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found or permission denied' });
        }

        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: {
                title,
                priority,
                dueDate: dueDate ? new Date(dueDate) : (dueDate === null ? null : undefined), // Handle clearing the date
                categoryId,
                isCompleted,
                status,
            },
        });
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
export const deleteTodo = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
         // Verify that the todo belongs to the user
        const todo = await prisma.todo.findFirst({
            where: { id, userId: req.user!.userId },
        });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found or permission denied' });
        }
        
        await prisma.todo.delete({ where: { id } });
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};