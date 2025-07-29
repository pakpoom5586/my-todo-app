// src/routes/category.routes.ts
import { Router } from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/category.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// ทุก Route ในไฟล์นี้จะถูกป้องกันด้วย middleware 'protect'
router.use(protect);

router.route('/')
    .get(getCategories)
    .post(createCategory);

router.route('/:id')
    .delete(deleteCategory);

export default router;