// src/components/todo/CategoryManager.tsx
import { useState } from 'react';
import type { Category } from '../../types';
import api from '../../lib/api';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CategoryManagerProps {
    categories: Category[];
    onUpdate: () => void; // ฟังก์ชันสำหรับสั่งให้ re-fetch ข้อมูล
}

export default function CategoryManager({ categories, onUpdate }: CategoryManagerProps) {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        setIsAdding(true);
        try {
            await api.post('/categories', { name: newCategoryName });
            toast.success(`Category "${newCategoryName}" created!`);
            setNewCategoryName('');
            onUpdate(); // สั่งให้ Dashboard re-fetch
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create category.');
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteCategory = async (catId: string, catName: string) => {
        if (window.confirm(`Are you sure you want to delete the category "${catName}"? This will not delete the tasks in it.`)) {
            try {
                await api.delete(`/categories/${catId}`);
                toast.success(`Category "${catName}" deleted.`);
                onUpdate();
            } catch (error) {
                toast.error('Failed to delete category.');
            }
        }
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-2">Manage Categories</h3>
            <div className="flex flex-wrap gap-2 mb-4">
                {categories.map(cat => (
                    <div key={cat.id} className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm">
                        <span>{cat.name}</span>
                        <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="ml-2 text-gray-500 hover:text-red-500">
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
            <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                    className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                <button type="submit" disabled={isAdding} className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400">
                    <Plus />
                </button>
            </form>
        </div>
    );
}