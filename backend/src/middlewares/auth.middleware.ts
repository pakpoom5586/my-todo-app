// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ขยาย Type ของ Request ใน Express เพื่อให้มี property 'user'
export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. ตรวจสอบว่า `req.cookies` มีอยู่หรือไม่ และ `req.cookies.token` มีค่าหรือไม่
    const token = req.cookies.token; 

    if (!token) {
        // ถ้าคุณได้ 401 ปัญหาน่าจะเกิดก่อนบรรทัดนี้ หรือในบรรทัดนี้เลย
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // 2. ตรวจสอบว่า Token ที่ได้มาถูกต้องและยังไม่หมดอายุหรือไม่
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string };
        
        // 3. (Optional but good) ตรวจสอบว่า userId ใน token ยังมีอยู่ในฐานข้อมูลจริง
        const userExists = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!userExists) {
             return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        
        // ถ้าทุกอย่างผ่าน ให้แนบข้อมูล user ไปกับ request แล้วไปต่อ
        req.user = decoded;
        next();

    } catch (error) {
        // ถ้า Token ไม่ถูกต้อง (เช่น โดนแก้ไข, หมดอายุ, secret ไม่ตรง) จะเข้ามาที่นี่
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// (Optional) Middleware สำหรับ Admin เท่านั้น
export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};