// src/components/todo/TodoItem.tsx
import type { Todo } from "../../types";
import { Trash2, Edit, Tag, Calendar, Clock, CheckCircle2, Circle } from 'lucide-react';
import api from "../../lib/api";
import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from 'date-fns';
import toast from 'react-hot-toast';

interface TodoItemProps {
    todo: Todo;
    onUpdate: (updatedTodo: Todo) => void;
    onDelete: (todoId: string) => void;
    onEdit: () => void;
}

const priorityConfig = {
    HIGH: {
        borderClass: 'border-l-4 border-red-500',
        bgClass: 'bg-gradient-to-r from-red-50 to-red-25 dark:from-red-900/10 dark:to-red-900/5',
        badgeClass: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        icon: '🔥'
    },
    MEDIUM: {
        borderClass: 'border-l-4 border-yellow-500',
        bgClass: 'bg-gradient-to-r from-yellow-50 to-yellow-25 dark:from-yellow-900/10 dark:to-yellow-900/5',
        badgeClass: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
        icon: '⚡'
    },
    LOW: {
        borderClass: 'border-l-4 border-green-500',
        bgClass: 'bg-gradient-to-r from-green-50 to-green-25 dark:from-green-900/10 dark:to-green-900/5',
        badgeClass: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        icon: '📌'
    },
};

export default function TodoItem({ todo, onUpdate, onDelete, onEdit }: TodoItemProps) {
    const toggleComplete = async () => {
        const promise = api.put(`/todos/${todo.id}`, {
            isCompleted: !todo.isCompleted
       });

       toast.promise(promise, {
           loading: 'Updating task...',
           success: (response) => {
               onUpdate(response.data);
               return todo.isCompleted ? 'Task marked as incomplete!' : 'Task completed! 🎉';
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
                   onDelete(todo.id);
                   return 'Task deleted successfully!';
               },
               error: 'Could not delete task.',
           });
       }
   };

   const formatDueDate = (dueDate: string) => {
       const date = new Date(dueDate);
       if (isToday(date)) return 'Due Today';
       if (isTomorrow(date)) return 'Due Tomorrow';
       if (isPast(date)) return `Overdue (${format(date, 'MMM d')})`;
       return `Due ${format(date, 'MMM d, yyyy')}`;
   };

   const getDueDateColor = (dueDate: string) => {
       const date = new Date(dueDate);
       if (isPast(date) && !todo.isCompleted) return 'text-red-600 dark:text-red-400';
       if (isToday(date)) return 'text-orange-600 dark:text-orange-400';
       return 'text-gray-600 dark:text-gray-400';
   };

   const prioritySettings = priorityConfig[todo.priority];

   return (
       <div className={`group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] ${prioritySettings.borderClass} ${prioritySettings.bgClass}`}>
           {/* Completion Status Indicator */}
           {todo.isCompleted && (
               <div className="absolute top-3 right-3 opacity-20">
                   <CheckCircle2 className="h-8 w-8 text-green-500" />
               </div>
           )}

           <div className="p-5">
               <div className="flex items-start gap-4">
                   {/* Checkbox */}
                   <button
                       onClick={toggleComplete}
                       className="mt-1 flex-shrink-0 transition-transform duration-200 hover:scale-110"
                   >
                       {todo.isCompleted ? (
                           <CheckCircle2 className="h-6 w-6 text-green-500 fill-current" />
                       ) : (
                           <Circle className="h-6 w-6 text-gray-400 hover:text-blue-500 transition-colors" />
                       )}
                   </button>

                   {/* Content */}
                   <div className="flex-grow min-w-0">
                       {/* Title and Priority Badge */}
                       <div className="flex items-start justify-between gap-3 mb-3">
                           <h3 className={`text-lg font-semibold leading-tight transition-all duration-200 ${
                               todo.isCompleted 
                                   ? 'line-through text-gray-400 dark:text-gray-500' 
                                   : 'text-gray-900 dark:text-gray-100'
                           }`}>
                               {todo.title}
                           </h3>
                           <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${prioritySettings.badgeClass}`}>
                               <span>{prioritySettings.icon}</span>
                               {todo.priority}
                           </span>
                       </div>

                       {/* Meta Information */}
                       <div className="flex flex-wrap items-center gap-4 text-sm">
                           {/* Category */}
                           {todo.category && (
                               <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
                                   <Tag className="h-3.5 w-3.5" />
                                   <span className="font-medium">{todo.category.name}</span>
                               </div>
                           )}

                           {/* Due Date */}
                           {todo.dueDate && (
                               <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-800 ${getDueDateColor(todo.dueDate)}`}>
                                   <Calendar className="h-3.5 w-3.5" />
                                   <span className="font-medium">{formatDueDate(todo.dueDate)}</span>
                               </div>
                           )}

                           {/* Created Time */}
                           {(todo as any).createdAt && (
                               <div className="hidden md:flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                   <Clock className="h-3.5 w-3.5" />
                                   <span>Created {formatDistanceToNow(new Date((todo as any).createdAt), { addSuffix: true })}</span>
                               </div>
                           )}
                       </div>
                   </div>

                   {/* Action Buttons */}
                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                       <button
                           onClick={onEdit}
                           className="p-2.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 transform hover:scale-105"
                           aria-label="Edit task"
                       >
                           <Edit className="h-4 w-4" />
                       </button>
                       <button
                           onClick={handleDelete}
                           className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 transform hover:scale-105"
                           aria-label="Delete task"
                       >
                           <Trash2 className="h-4 w-4" />
                       </button>
                   </div>
               </div>
           </div>

           {/* Progress Bar for Overdue Tasks */}
           {todo.dueDate && isPast(new Date(todo.dueDate)) && !todo.isCompleted && (
               <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-200 dark:bg-red-900/50">
                   <div className="h-full bg-red-500 animate-pulse"></div>
               </div>
           )}
       </div>
   );
}