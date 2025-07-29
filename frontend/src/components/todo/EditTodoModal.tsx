// src/components/todo/EditTodoModal.tsx
import { useEffect, useState } from 'react';
import type { Category, Todo } from '../../types';
import api from '../../lib/api';
import Modal from '../ui/Modal';
import toast from 'react-hot-toast';
import { Calendar, Flag, Tag, Save, X, Clock, ChevronDown } from 'lucide-react';

interface EditTodoModalProps {
    isOpen: boolean;
    onClose: () => void;
    todo: Todo | null;
    onUpdate: (updatedTodo: Todo) => void;
    categories: Category[];
}

const priorityOptions = [
    { value: 'LOW', label: 'Low', color: 'text-green-600', bgColor: 'bg-green-50 border-green-200', icon: '🟢' },
    { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-200', icon: '🟡' },
    { value: 'HIGH', label: 'High', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200', icon: '🔴' },
];

// Quick date options
const quickDateOptions = [
    { label: 'Today', days: 0, icon: '📅' },
    { label: 'Tomorrow', days: 1, icon: '⏰' },
    { label: 'Week', days: 7, icon: '📊' },
    { label: 'Month', days: 30, icon: '📆' },
];

export default function EditTodoModal({ isOpen, onClose, todo, onUpdate, categories }: EditTodoModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Todo['priority']>('MEDIUM');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCustomDate, setShowCustomDate] = useState(false);

    useEffect(() => {
        if (todo) {
            setTitle(todo.title);
            setDescription(todo.description || '');
            setPriority(todo.priority);
            
            if (todo.dueDate) {
                const date = new Date(todo.dueDate);
                setDueDate(date.toISOString().substring(0, 10));
                setDueTime(date.toTimeString().substring(0, 5));
                setShowCustomDate(true);
            } else {
                setDueDate('');
                setDueTime('09:00');
                setShowCustomDate(false);
            }
            setCategoryId(todo.categoryId || '');
        }
    }, [todo]);

    if (!todo) return null;

    const handleQuickDate = (days: number) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        setDueDate(date.toISOString().substring(0, 10));
        setShowCustomDate(false);
    };

    const clearDueDate = () => {
        setDueDate('');
        setDueTime('09:00');
        setShowCustomDate(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        let dueDatetime = null;
        if (dueDate) {
            dueDatetime = new Date(`${dueDate}T${dueTime || '09:00'}`).toISOString();
        }

        const promise = api.put(`/todos/${todo.id}`, {
            title,
            description,
            priority,
            dueDate: dueDatetime,
            categoryId: categoryId || null,
        });

        toast.promise(promise, {
            loading: 'Saving...',
            success: (response) => {
                onUpdate(response.data);
                onClose();
                setIsSubmitting(false);
                return 'Task updated!';
            },
            error: (error) => {
                setIsSubmitting(false);
                return 'Failed to save.';
            },
        });
    };

    const formatSelectedDate = () => {
        if (!dueDate) return null;
        const date = new Date(`${dueDate}T${dueTime}`);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="w-full max-w-lg mx-auto max-h-[95vh] flex flex-col">
                {/* Header - ลดขนาด */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                            <Save className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Task</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Update details</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form Content - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        {/* Title Field */}
                        <div className="space-y-2">
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Task Title *
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 dark:text-white"
                                placeholder="What needs to be done?"
                                required
                            />
                        </div>

                        {/* Description Field */}
                        <div className="space-y-2">
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 dark:text-white resize-none"
                                placeholder="Add details..."
                            />
                        </div>

                        {/* Priority Field */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <Flag className="h-3.5 w-3.5" />
                                Priority
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {priorityOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setPriority(option.value as Todo['priority'])}
                                        className={`p-2.5 rounded-lg border-2 transition-all duration-200 ${
                                            priority === option.value
                                                ? `${option.bgColor} dark:bg-opacity-20 border-current ${option.color} shadow-md`
                                                : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600'
                                        }`}
                                    >
                                        <div className="text-center space-y-0.5">
                                            <div className="text-lg">{option.icon}</div>
                                            <div className="text-xs font-medium">{option.label}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Due Date Field */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Due Date
                                </label>
                                {dueDate && (
                                    <button
                                        type="button"
                                        onClick={clearDueDate}
                                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            {/* Selected Date Display */}
                            {dueDate && (
                                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                        <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                                            {formatSelectedDate()}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Quick Date Options */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {quickDateOptions.map((option) => (
                                    <button
                                        key={option.label}
                                        type="button"
                                        onClick={() => handleQuickDate(option.days)}
                                        className="flex flex-col items-center gap-1 p-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg transition-all duration-200"
                                    >
                                        <span className="text-sm">{option.icon}</span>
                                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                            {option.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Custom Date Picker */}
                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCustomDate(!showCustomDate)}
                                    className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                >
                                    <Calendar className="h-3.5 w-3.5" />
                                    Custom Date
                                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showCustomDate ? 'rotate-180' : ''}`} />
                                </button>

                                {showCustomDate && (
                                    <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                value={dueDate}
                                                onChange={(e) => setDueDate(e.target.value)}
                                                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                                Time
                                            </label>
                                            <input
                                                type="time"
                                                value={dueTime}
                                                onChange={(e) => setDueTime(e.target.value)}
                                                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Category Field */}
                        <div className="space-y-2">
                            <label htmlFor="category" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <Tag className="h-3.5 w-3.5" />
                                Category
                            </label>
                            <select
                                id="category"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 dark:text-white"
                            >
                                <option value="">🏷️ No Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        📁 {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </form>
                </div>

                {/* Action Buttons - Fixed at bottom */}
                <div className="flex gap-3 p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg font-medium transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="edit-todo-form"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !title.trim()}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}