// src/components/todo/EditTodoModal.tsx
import { useEffect, useState } from 'react';
import type { Category, Todo } from '../../types';
import api from '../../lib/api';
import Modal from '../ui/Modal';

interface EditTodoModalProps {
    isOpen: boolean;
    onClose: () => void;
    todo: Todo | null;
    onUpdate: (updatedTodo: Todo) => void;
    categories: Category[];
}

export default function EditTodoModal({ isOpen, onClose, todo, onUpdate, categories }: EditTodoModalProps) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<Todo['priority']>('MEDIUM');
    const [dueDate, setDueDate] = useState('');
    const [categoryId, setCategoryId] = useState('');

    useEffect(() => {
        if (todo) {
            setTitle(todo.title);
            setPriority(todo.priority);
            setDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().substring(0, 10) : '');
            setCategoryId(todo.categoryId || '');
        }
    }, [todo]);

    if (!todo) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.put(`/todos/${todo.id}`, {
                title,
                priority,
                dueDate: dueDate || null,
                categoryId: categoryId || null,
            });
            onUpdate(response.data);
            onClose();
        } catch (error) {
            console.error('Failed to update todo', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        required
                    />
                </div>
                {/* Priority, Due Date, Category fields will be added here */}
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium mb-1">Priority</label>
                    <select id="priority" value={priority} onChange={e => setPriority(e.target.value as Todo['priority'])} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium mb-1">Due Date</label>
                    <input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                    <select id="category" value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option value="">-- No Category --</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Save Changes</button>
                </div>
            </form>
        </Modal>
    );
}