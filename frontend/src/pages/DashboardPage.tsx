// src/pages/DashboardPage.tsx

import { useEffect, useState } from "react";
import type { Todo, Category } from "../types";
import api from "../lib/api";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Plus, Filter, SortAsc } from "lucide-react";

// Import Components
import TodoItem from "../components/todo/TodoItem";
import AddTodoForm from "../components/todo/AddTodoForm";
import EditTodoModal from "../components/todo/EditTodoModal";
import TodoFilterControls from "../components/todo/TodoFilterControls";
import Spinner from "../components/ui/Spinner";
import CategoryManager from '../components/todo/CategoryManager';

// Type สำหรับโครงสร้างข้อมูลแบบคอลัมน์
type ColumnData = {
    name: string;
    items: Todo[];
    color: string;
    bgColor: string;
    textColor: string;
};

export default function DashboardPage() {
    // --- STATE MANAGEMENT ---

    const [columns, setColumns] = useState<Record<string, ColumnData>>({
        'TODO': { 
            name: 'สิ่งที่ต้องทํา', 
            items: [], 
            color: 'border-slate-300 dark:border-slate-600',
            bgColor: 'bg-slate-50/50 dark:bg-slate-800/50',
            textColor: 'text-slate-700 dark:text-slate-300'
        },
        'IN_PROGRESS': { 
            name: 'กำลังทำอยู่', 
            items: [], 
            color: 'border-amber-300 dark:border-amber-600',
            bgColor: 'bg-amber-50/50 dark:bg-amber-900/20',
            textColor: 'text-amber-700 dark:text-amber-300'
        },
        'DONE': { 
            name: 'เสร็จแล้ว', 
            items: [], 
            color: 'border-emerald-300 dark:border-emerald-600',
            bgColor: 'bg-emerald-50/50 dark:bg-emerald-900/20',
            textColor: 'text-emerald-700 dark:text-emerald-300'
        },
    });
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // State สำหรับ Filters
    const [filters, setFilters] = useState({
        status: 'ALL', 
        priority: 'ALL',
        categoryId: 'ALL',
    });
    
    // State สำหรับ Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
    const [sortBy, setSortBy] = useState('');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.priority !== 'ALL') params.append('priority', filters.priority);
            if (filters.categoryId !== 'ALL') params.append('categoryId', filters.categoryId);
            
            params.append('sortBy', 'createdAt');
            params.append('sortOrder', 'desc');

            const [todosRes, categoriesRes] = await Promise.all([
                api.get(`/todos?${params.toString()}`),
                api.get('/categories'),
            ]);

            const todos: Todo[] = todosRes.data;
            setCategories(categoriesRes.data);

            const newColumns = { ...columns };
            // Reset items
            Object.keys(newColumns).forEach(key => {
                newColumns[key].items = [];
            });
            
            todos.forEach(todo => {
                if (newColumns[todo.status]) {
                    newColumns[todo.status].items.push(todo);
                }
            });
            setColumns(newColumns);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters]);

    // --- EVENT HANDLERS ---

    const handleTodoAdded = (newTodo: Todo) => {
        setColumns(prev => ({
            ...prev,
            'TODO': { ...prev['TODO'], items: [newTodo, ...prev['TODO'].items] },
        }));
        setShowAddForm(false);
    };

   const handleTodoUpdated = (updatedTodo: Todo) => {
    const newColumns = { ...columns };
    Object.keys(newColumns).forEach(columnId => {
        newColumns[columnId].items = newColumns[columnId].items.map(todo => {
            if (todo.id === updatedTodo.id) {
                return updatedTodo;
            }
            return todo;
        });
    });
    setColumns(newColumns);
    setIsEditModalOpen(false);
};
    const handleTodoDeleted = (todoId: string) => {
        const newColumns = { ...columns };
        Object.keys(newColumns).forEach(columnId => {
            newColumns[columnId].items = newColumns[columnId].items.filter(
                todo => todo.id !== todoId
            );
        });
        setColumns(newColumns);
    };

    const handleOpenEditModal = (todo: Todo) => {
        setSelectedTodo(todo);
        setIsEditModalOpen(true);
    };

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceColId = source.droppableId;
        const destColId = destination.droppableId;
        const startCol = columns[sourceColId];
        const endCol = columns[destColId];
        const sourceItems = [...startCol.items];
        const [removed] = sourceItems.splice(source.index, 1);

        if (startCol !== endCol) {
            const endItems = [...endCol.items];
            endItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [sourceColId]: { ...startCol, items: sourceItems },
                [destColId]: { ...endCol, items: endItems },
            });
            api.put(`/todos/${removed.id}`, { status: destColId }).catch(() => fetchData());
        } else {
            sourceItems.splice(destination.index, 0, removed);
            setColumns({ ...columns, [sourceColId]: { ...startCol, items: sourceItems } });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="container mx-auto px-4 py-6">
                
                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                งานของฉัน
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
                                จัดระเบียบและ ติดตามผลงานของคุณ
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    showFilters 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                ตัวกรอง
                            </button>
                            
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-200 hover:scale-105"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                เพิ่มงาน
                            </button>
                        </div>
                    </div>

                    {/* Collapsible Controls - EDITED: Added relative z-20 */}
                    <div className={`relative z-20 transition-all duration-300 ease-in-out ${showFilters ? 'opacity-100 max-h-[600px] mt-4' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-4">
                            <TodoFilterControls
                                filters={filters}
                                setFilters={setFilters}
                                categories={categories}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                            />
                        </div>
                    </div>

                    {/* Collapsible Add Form - EDITED: Added relative z-10 */}
                    <div className={`relative z-10 transition-all duration-300 ease-in-out ${showAddForm ? 'opacity-100 max-h-96 mt-4' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-4">
                            <AddTodoForm onTodoAdded={handleTodoAdded} categories={categories} />
                        </div>
                    </div>
                </div>

                {/* Kanban Board - เพิ่ม margin-top แบบ dynamic */}
                <div className={`transition-all duration-300 ease-in-out ${(showFilters || showAddForm) ? 'mt-6' : 'mt-0'}`}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {Object.entries(columns).map(([columnId, column]) => (
                                <Droppable key={columnId} droppableId={columnId}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`relative rounded-xl border-2 transition-all duration-300 ${
                                                snapshot.isDraggingOver 
                                                    ? `${column.color} bg-white/90 dark:bg-slate-800/90 shadow-xl scale-[1.02]` 
                                                    : `${column.color} ${column.bgColor} shadow-md`
                                            } backdrop-blur-sm`}
                                        >
                                            {/* Column Header */}
                                            <div className="p-4 pb-2">
                                                <div className="flex items-center justify-between">
                                                    <h2 className={`text-base font-semibold ${column.textColor}`}>
                                                        {column.name}
                                                    </h2>
                                                    <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${column.textColor} ${column.bgColor} border ${column.color}`}>
                                                        {column.items.length}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Tasks Container */}
                                            <div className="px-3 pb-4">
                                                <div className="space-y-2 min-h-[300px]">
                                                    {column.items.map((item, index) => (
                                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                                            {(providedDraggable, snapshotDraggable) => (
                                                                <div
                                                                    ref={providedDraggable.innerRef}
                                                                    {...providedDraggable.draggableProps}
                                                                    {...providedDraggable.dragHandleProps}
                                                                    className={`transition-all duration-200 ${
                                                                        snapshotDraggable.isDragging 
                                                                            ? "shadow-xl scale-105 rotate-1" 
                                                                            : "shadow-sm hover:shadow-md"
                                                                    }`}
                                                                >
                                                                    <TodoItem
                                                                        todo={item}
                                                                        onUpdate={handleTodoUpdated}
                                                                        onDelete={handleTodoDeleted}
                                                                        onEdit={() => handleOpenEditModal(item)}
                                                                    />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                    
                                                    {/* Empty State */}
                                                    {column.items.length === 0 && (
                                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                                            <div className={`w-12 h-12 rounded-full ${column.bgColor} flex items-center justify-center mb-2`}>
                                                                <div className={`w-6 h-6 rounded-full border-2 border-dashed ${column.color}`} />
                                                            </div>
                                                            <p className={`text-xs ${column.textColor} opacity-60`}>
                                                                ยังไม่มีงาน
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </div>
                    </DragDropContext>
                </div>

                {/* Category Manager Section */}
                <div className="mt-8">
                    <div className="bg-ส่วนนี้/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
                            จัดการหมวดหมู่
                        </h3>
                        <CategoryManager categories={categories} onUpdate={fetchData} />
                    </div>
                </div>
            </div>

            {/* Modal for editing tasks */}
            <EditTodoModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                todo={selectedTodo}
                onUpdate={handleTodoUpdated}
                categories={categories}
            />
        </div>
    );
}