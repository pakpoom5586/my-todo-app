// src/controllers/category.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

// @desc    Get all categories for a user
// @route   GET /api/categories
export const getCategories = async (req: AuthRequest, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            where: { userId: req.user!.userId },
            orderBy: { name: 'asc' },
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// @desc    Create a new category
// @route   POST /api/categories
export const createCategory = async (req: AuthRequest, res: Response) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    try {
        const newCategory = await prisma.category.create({
            data: {
                name,
                userId: req.user!.userId,
            },
        });
        res.status(201).json(newCategory);
    } catch (error: any) {
        // Prisma error code for unique constraint violation
        if (error.code === 'P2002') {
            return res.status(409).json({ message: `Category '${name}' already exists.` });
        }
        res.status(500).json({ message: 'Server error', error });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        // Ensure the category belongs to the user trying to delete it
        const category = await prisma.category.findFirst({
            where: { id, userId: req.user!.userId },
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found or you do not have permission to delete it.' });
        }
        
        await prisma.category.delete({ where: { id } });
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};