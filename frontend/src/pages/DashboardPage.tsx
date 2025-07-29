// src/pages/DashboardPage.tsx

import { useEffect, useState } from "react";
import type { Todo, Category } from "../types";
import api from "../lib/api";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";

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
};

export default function DashboardPage() {
    // --- STATE MANAGEMENT ---

    const [columns, setColumns] = useState<Record<string, ColumnData>>({
        'TODO': { name: 'To Do', items: [] },
        'IN_PROGRESS': { name: 'In Progress', items: [] },
        'DONE': { name: 'Done', items: [] },
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
            
            // การเรียงลำดับพื้นฐาน
            params.append('sortBy', 'createdAt');
            params.append('sortOrder', 'desc');

            const [todosRes, categoriesRes] = await Promise.all([
                api.get(`/todos?${params.toString()}`),
                api.get('/categories'),
            ]);

            const todos: Todo[] = todosRes.data;
            setCategories(categoriesRes.data);

            // จัดเรียง Todos เข้าไปใน Columns
            const newColumns: Record<string, ColumnData> = {
                'TODO': { name: 'To Do', items: [] },
                'IN_PROGRESS': { name: 'In Progress', items: [] },
                'DONE': { name: 'Done', items: [] },
            };
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
    }, [filters]); // ดึงข้อมูลใหม่เมื่อ filter เปลี่ยน

    // --- EVENT HANDLERS ---

    const handleTodoAdded = (newTodo: Todo) => {
        setColumns(prev => ({
            ...prev,
            'TODO': { ...prev['TODO'], items: [newTodo, ...prev['TODO'].items] },
        }));
    };

    const handleTodoUpdated = (updatedTodo: Todo) => {
        // ดึงข้อมูลใหม่ทั้งหมดเพื่อให้แน่ใจว่าทุกอย่างถูกต้อง (สถานะ, ลำดับ)
        // เป็นวิธีที่ง่ายและปลอดภัยที่สุดหลังจากมีการแก้ไข
        fetchData();
        setIsEditModalOpen(false); // ปิด Modal หลังจากอัปเดต
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
        return <Spinner />;
    }
    

    return (
        <>
            <div className="flex flex-col lg:flex-row lg:gap-8">
                
                <aside className="w-full lg:w-80 lg:flex-shrink-0">
                    <div className="lg:sticky lg:top-24 space-y-6">
                        <AddTodoForm onTodoAdded={handleTodoAdded} categories={categories} />
                        <CategoryManager categories={categories} onUpdate={fetchData} />
                    </div>
                </aside>

              
                <main className="flex-grow mt-8 lg:mt-0">
                    <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <h1 className="text-3xl font-bold">My Tasks</h1>
                         <div className="mt-4 md:mt-0">
                            <TodoFilterControls
                            filters={filters}
                            setFilters={setFilters}
                            categories={categories}
                            sortBy={sortBy} // add this line
                            setSortBy={setSortBy} // add this line
                        />
                        </div>
                    </header>
                    
                    {/* Kanban Board */}
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {Object.entries(columns).map(([columnId, column]) => (
                                <Droppable key={columnId} droppableId={columnId}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`p-4 rounded-lg bg-gray-100 dark:bg-gray-800 transition-colors ${snapshot.isDraggingOver ? "bg-blue-100 dark:bg-blue-900" : ""}`}
                                        >
                                            <h2 className="text-xl font-semibold mb-4 text-center">
                                                {column.name} ({column.items.length})
                                            </h2>
                                            <div className="space-y-4 min-h-[200px]">
                                                {column.items.map((item, index) => (
                                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                                        {(providedDraggable, snapshotDraggable) => (
                                                            <div
                                                                ref={providedDraggable.innerRef}
                                                                {...providedDraggable.draggableProps}
                                                                {...providedDraggable.dragHandleProps}
                                                                className={`${snapshotDraggable.isDragging ? "shadow-2xl scale-105" : "shadow-md"}`}
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
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </div>
                    </DragDropContext>
                </main>
            </div>

            {/* Modal for editing tasks */}
            <EditTodoModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                todo={selectedTodo}
                onUpdate={handleTodoUpdated}
                categories={categories}
            />
        </>
    );
}