// src/types/index.ts
export interface Category {
    id: string;
    name: string;
}

export interface Todo {
    id: string;
    title: string;
    description: string
    isCompleted: boolean;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    dueDate?: string;
    category?: Category;
    categoryId?: string;
    createdAt: Date; 
    updatedAt: Date; 
}