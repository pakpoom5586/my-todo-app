// src/components/todo/TodoItem.tsx

import type { Todo } from "../../types";
import { Trash2, Edit, Tag, Calendar } from 'lucide-react';
import api from "../../lib/api";
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast'; // 1. Import toast

// Interface สำหรับ Props (เหมือนเดิม)
interface TodoItemProps {
    todo: Todo;
    onUpdate: (updatedTodo: Todo) => void;
    onDelete: (todoId: string) => void;
    onEdit: () => void;
}

// Class สำหรับ Priority Border (เหมือนเดิม)
const priorityClasses = {
    HIGH: 'border-l-4 border-red-500',
    MEDIUM: 'border-l-4 border-yellow-500',
    LOW: 'border-l-4 border-green-500',
};

export default function TodoItem({ todo, onUpdate, onDelete, onEdit }: TodoItemProps) {

    // --- EVENT HANDLERS ---

    const toggleComplete = async () => {
        // ใช้ toast.promise เพื่อให้มี Loading, Success, Error state โดยอัตโนมัติ
        const promise = api.put(`/todos/${todo.id}`, {
            isCompleted: !todo.isCompleted
        });

        toast.promise(promise, {
            loading: 'Updating task...',
            success: (response) => {
                onUpdate(response.data); // อัปเดต State หลังจากสำเร็จ
                return 'Task updated!';
            },
            error: 'Could not update task.',
        });
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
            const promise = api.delete(`/todos/${todo.id}`);
            
            toast.promise(promise, {
                loading: 'Deleting task...',
                success: () => {
                    onDelete(todo.id); // อัปเดต State หลังจากสำเร็จ
                    return 'Task deleted!';
                },
                error: 'Could not delete task.',
            });
        }
    };
    
    return (
        <div
            className={`p-4 bg-white dark:bg-gray-700 rounded-lg transition-shadow hover:shadow-lg ${priorityClasses[todo.priority]}`}
        >
            <div className="flex items-start justify-between gap-4">
                
                {/* === Left Section: Checkbox and Title/Details === */}
                <div className="flex items-start flex-grow">
                    {/* Checkbox */}
                    <input
                        type="checkbox"
                        checked={todo.isCompleted}
                        onChange={toggleComplete}
                        className="h-5 w-5 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0 cursor-pointer"
                        aria-label={`Mark ${todo.title} as ${todo.isCompleted ? 'incomplete' : 'complete'}`}
                    />
                    
                    {/* Title and Details */}
                    <div className="ml-3 flex-grow">
                        <p className={`text-lg font-medium leading-tight ${todo.isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                            {todo.title}
                        </p>
                        
                        {/* Meta Info: Category, Due Date, etc. */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {todo.category && (
                                <span className="flex items-center gap-1">
                                    <Tag size={14}/> {todo.category.name}
                                </span>
                            )}
                            {todo.dueDate && (
                                <span className="flex items-center gap-1">
                                    <Calendar size={14}/> {format(new Date(todo.dueDate), 'dd MMM yyyy')}
                                </span>
                            )}
                            {/* แสดง CreatedAt สำหรับจอใหญ่ (Desktop) */}
                            {(todo as any).createdAt && (
                                <span className="hidden md:flex items-center gap-1">
                                    Created: {formatDistanceToNow(new Date(todo.createdAt), { addSuffix: true })}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* === Right Section: Action Buttons === */}
                <div className="flex items-center space-x-1 flex-shrink-0">
                    <button onClick={onEdit} className="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600" aria-label="Edit task">
                        <Edit size={18} />
                    </button>
                    <button onClick={handleDelete} className="p-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600" aria-label="Delete task">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}