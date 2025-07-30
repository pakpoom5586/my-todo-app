// src/controllers/todo.controller.ts
import { Response } from 'express';
import { Prisma, PrismaClient, Priority, Status } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

// @desc    Get all todos for a user with filtering and sorting
// @route   GET /api/todos
export const getTodos = async (req: AuthRequest, res: Response) => {
    try {
        // ดึงค่าจาก query params
        const { isCompleted, priority, categoryId, sortBy, sortOrder, status } = req.query;

        // สร้าง 'where' clause แบบ dynamic สำหรับการกรองข้อมูล
        const where: Prisma.TodoWhereInput = {
            userId: req.user!.userId, // ! สำคัญ: กรองเฉพาะ todo ของผู้ใช้ที่ล็อกอินอยู่
        };

        if (isCompleted !== undefined) where.isCompleted = isCompleted === 'true';
        if (status) where.status = status as Status;
        if (priority) where.priority = priority as Priority;
        if (categoryId) where.categoryId = categoryId as string;

        // สร้าง 'orderBy' clause แบบ dynamic สำหรับการเรียงลำดับ
        const orderBy: Prisma.TodoOrderByWithRelationInput = {};
        if (sortBy) {
            (orderBy as { [key: string]: 'asc' | 'desc' })[sortBy as string] = sortOrder === 'desc' ? 'desc' : 'asc';
        } else {
            orderBy.createdAt = 'desc'; // เรียงตามวันที่สร้างล่าสุดเป็นค่าเริ่มต้น
        }

        const todos = await prisma.todo.findMany({
            where,
            orderBy,
            include: {
                category: true, // ส่งข้อมูล category กลับไปด้วยเสมอ
            },
        });

        res.status(200).json(todos);
    } catch (error) {
        console.error("Get Todos Error:", error);
        res.status(500).json({ message: 'Server error while fetching todos' });
    }
};

// @desc    Create a new todo
// @route   POST /api/todos
export const createTodo = async (req: AuthRequest, res: Response) => {
    // เพิ่ม description เข้ามา
    const { title, description, priority, dueDate, categoryId, status } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const newTodo = await prisma.todo.create({
            data: {
                title,
                description: description || null, // เพิ่ม description, ถ้าไม่มีให้เป็น null
                priority,
                status,
                dueDate: dueDate ? new Date(dueDate) : null,
                user: {
                    connect: { id: req.user!.userId }
                },
                // เชื่อมกับ category ถ้ามี categoryId ส่งมา
                ...(categoryId && { category: { connect: { id: categoryId } } }),
            },
            include: {
                category: true, // ส่งข้อมูล category กลับไปทันที
            },
        });
        res.status(201).json(newTodo);
    } catch (error) {
        console.error("Create Todo Error:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // เช่น หา categoryId ไม่เจอ
            if (error.code === 'P2025') {
                return res.status(404).json({ message: 'Category not found.' });
            }
        }
        res.status(500).json({ message: 'Server error while creating todo' });
    }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
export const updateTodo = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { title, description, priority, dueDate, categoryId, isCompleted, status } = req.body;

    try {
        // ตรวจสอบว่า todo นี้มีอยู่จริง และเป็นของผู้ใช้คนนี้หรือไม่
        const todo = await prisma.todo.findFirst({
            where: { id, userId: req.user!.userId },
        });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found or permission denied' });
        }

        // สร้าง data object ที่จะอัปเดตเฉพาะฟิลด์ที่ส่งมา (ป้องกันการเขียนทับด้วย undefined)
        const dataToUpdate: Prisma.TodoUpdateInput = {};
        if (title !== undefined) dataToUpdate.title = title;
        if (description !== undefined) dataToUpdate.description = description;
        if (priority !== undefined) dataToUpdate.priority = priority;
        if (status !== undefined) dataToUpdate.status = status;
        if (isCompleted !== undefined) dataToUpdate.isCompleted = isCompleted;
        
        // จัดการ dueDate: ถ้าเป็น null คือการล้างค่า, ถ้า undefined คือไม่แก้ไข
        if (dueDate !== undefined) {
            dataToUpdate.dueDate = dueDate ? new Date(dueDate) : null;
        }

        // จัดการ categoryId: ถ้าเป็น null คือยกเลิกการเชื่อม, ถ้า undefined คือไม่แก้ไข
        if (categoryId !== undefined) {
            dataToUpdate.category = categoryId ? { connect: { id: categoryId } } : { disconnect: true };
        }

        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: dataToUpdate,
            include: {
                category: true, // ส่งข้อมูล category กลับไปทันที
            },
        });
        res.status(200).json(updatedTodo);
    } catch (error) {
        console.error("Update Todo Error:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return res.status(404).json({ message: 'Todo or Category not found.' });
            }
        }
        res.status(500).json({ message: 'Server error while updating todo' });
    }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
export const deleteTodo = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        // ตรวจสอบสิทธิ์ก่อนลบ
        const todo = await prisma.todo.findFirst({
            where: { id, userId: req.user!.userId },
        });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found or permission denied' });
        }
        
        await prisma.todo.delete({ where: { id } });
        // ส่งกลับ id ของ todo ที่ถูกลบ เพื่อให้ Frontend นำไปใช้ update state ได้ง่าย
        res.status(200).json({ message: 'Todo deleted successfully', deletedTodoId: id });
    } catch (error) {
        console.error("Delete Todo Error:", error);
        res.status(500).json({ message: 'Server error while deleting todo' });
    }
};