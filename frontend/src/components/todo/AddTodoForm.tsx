// src/components/todo/AddTodoForm.tsx
import { useState } from 'react';
import api from '../../lib/api';
import type { Todo, Category } from '../../types';
import toast from 'react-hot-toast'
interface AddTodoFormProps {
    onTodoAdded: (todo: Todo) => void;
    categories: Category[]
}

export default function AddTodoForm({ onTodoAdded }: AddTodoFormProps) {
    const [title, setTitle] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            
            const response = await api.post('/todos', { title, priority: 'MEDIUM' });
            onTodoAdded(response.data);
            setTitle(''); // Reset a form
            toast.success('Task added successfully!');
        } catch (error) {
            toast.error('Failed to add task.');
            console.error('Failed to add todo', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 ... flex flex-wrap items-end gap-4">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                เพิ่มงาน
            </button>
        </form>
    );
}