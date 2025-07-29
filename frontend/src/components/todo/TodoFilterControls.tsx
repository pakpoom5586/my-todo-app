import type { Category } from "../../types";

interface FilterControlsProps {
    filters: { status: string; priority: string; categoryId: string; };
    setFilters: React.Dispatch<React.SetStateAction<any>>;
    sortBy: string;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
    categories: Category[];
}

export default function TodoFilterControls({ filters, setFilters, sortBy, setSortBy, categories }: FilterControlsProps) {
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev: any) => ({ ...prev, [name]: value }));
    };

    return (
        
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-center">
            {/* Filter by Status */}
            <select name="status" value={filters.status} onChange={handleFilterChange} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                <option value="ALL">All Statuses</option>
                <option value="INCOMPLETE">Incomplete</option>
                <option value="COMPLETED">Completed</option>
            </select>

            {/* Filter by Priority */}
            <select name="priority" value={filters.priority} onChange={handleFilterChange} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
            </select>

            {/* Filter by Category */}
            <select name="categoryId" value={filters.categoryId} onChange={handleFilterChange} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                <option value="ALL">All Categories</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            
            <div className="flex-grow"></div>

            {/* Sort By */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                <option value="createdAt:desc">Newest First</option>
                <option value="dueDate:asc">Due Date</option>
                <option value="priority:desc">Priority (High-Low)</option>
            </select>
        </div>
    );
}