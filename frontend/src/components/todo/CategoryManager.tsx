// src/components/todo/CategoryManager.tsx
import { useState } from 'react';
import type { Category } from '../../types';
import api from '../../lib/api';
import { Plus, Trash2, Tag, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

interface CategoryManagerProps {
    categories: Category[];
    onUpdate: () => void;
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
            onUpdate();
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
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            {/* Header Section */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Palette className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">จัดการหมวดหมู่</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">จัดระเบียบงานของคุณตามหมวดหมู่</p>
                </div>
            </div>

            {/* Categories Display */}
            {categories.length > 0 ? (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Tag className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            หมวดหมู่ของคุณ ({categories.length})
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <div 
                                key={cat.id} 
                                className="group flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-full px-4 py-2 transition-all duration-200 hover:shadow-md hover:scale-105"
                            >
                                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                    {cat.name}
                                </span>
                                <button 
                                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500"
                                    aria-label={`Delete ${cat.name} category`}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                    <Tag className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">ยังไม่มีหมวดหมู่ สร้างหมวดหมู่แรกของคุณด้านล่าง!</p>
                </div>
            )}

            {/* Add Category Form */}
            <form onSubmit={handleAddCategory} className="space-y-3">
                <div className="flex gap-3">
                    <div className="flex-grow">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={e => setNewCategoryName(e.target.value)}
                            placeholder="กรอกชื่อหมวดหมู่"
                            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500"
                            disabled={isAdding}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isAdding || !newCategoryName.trim()}
                        className="px-5 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isAdding ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                            <Plus className="h-4 w-5" />
                        )}
                        <span className="hidden sm:inline">เพิ่มหมวดหมู่</span>
                    </button>
                </div>
            </form>
        </div>
    );
}