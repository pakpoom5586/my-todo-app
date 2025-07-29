// src/components/todo/TodoFilterControls.tsx
import type { Category } from "../../types";
import { Filter, ArrowUpDown, ChevronDown, X, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface FilterControlsProps {
    filters: { status: string; priority: string; categoryId: string; };
    setFilters: React.Dispatch<React.SetStateAction<any>>;
    sortBy: string;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
    categories: Category[];
}

const filterOptions = {
    status: [
        { value: 'ALL', label: 'All Tasks', icon: '📋' },
        { value: 'TODO', label: 'To Do', icon: '⭕' },
        { value: 'IN_PROGRESS', label: 'In Progress', icon: '🔄' },
        { value: 'DONE', label: 'Completed', icon: '✅' },
    ],
    priority: [
        { value: 'ALL', label: 'All Priorities', icon: '🎯' },
        { value: 'HIGH', label: 'High Priority', icon: '🔴', color: 'text-red-600 dark:text-red-400' },
        { value: 'MEDIUM', label: 'Medium Priority', icon: '🟡', color: 'text-yellow-600 dark:text-yellow-400' },
        { value: 'LOW', label: 'Low Priority', icon: '🟢', color: 'text-green-600 dark:text-green-400' },
    ],
};

const sortOptions = [
    { value: 'createdAt:desc', label: 'Newest First', icon: '🆕' },
    { value: 'createdAt:asc', label: 'Oldest First', icon: '📅' },
    { value: 'dueDate:asc', label: 'Due Date', icon: '⏰' },
    { value: 'priority:desc', label: 'Priority High to Low', icon: '🔥' },
    { value: 'priority:asc', label: 'Priority Low to High', icon: '📌' },
    { value: 'title:asc', label: 'Title A-Z', icon: '🔤' },
];

interface DropdownProps {
    label: string;
    value: string;
    options: any[];
    onChange: (value: string) => void;
    getOptionLabel?: (option: any) => string;
    getOptionIcon?: (option: any) => string;
    getOptionColor?: (option: any) => string;
    placeholder?: string;
}

function Dropdown({ 
    label, 
    value, 
    options, 
    onChange, 
    getOptionLabel = (opt) => opt.label,
    getOptionIcon = (opt) => opt.icon || '',
    getOptionColor = (opt) => opt.color || '',
    placeholder = 'Select...'
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {label}
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
                <span className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    {selectedOption ? (
                        <>
                            <span>{getOptionIcon(selectedOption)}</span>
                            <span className={getOptionColor(selectedOption) || 'text-slate-900 dark:text-slate-100'}>
                                {getOptionLabel(selectedOption)}
                            </span>
                        </>
                    ) : (
                        <span className="text-slate-500 dark:text-slate-400">{placeholder}</span>
                    )}
                </span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-64 overflow-auto">
                    <div className="py-2">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150 ${
                                    value === option.value ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                }`}
                            >
                                <span className="flex items-center gap-3">
                                    <span>{getOptionIcon(option)}</span>
                                    <span className={getOptionColor(option) || 'text-slate-900 dark:text-slate-100'}>
                                        {getOptionLabel(option)}
                                    </span>
                                </span>
                                {value === option.value && (
                                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TodoFilterControls({ filters, setFilters, sortBy, setSortBy, categories }: FilterControlsProps) {
    const handleFilterChange = (filterType: string, value: string) => {
        setFilters((prev: any) => ({ ...prev, [filterType]: value }));
    };

    const clearAllFilters = () => {
        setFilters({ status: 'ALL', priority: 'ALL', categoryId: 'ALL' });
        setSortBy('createdAt:desc');
    };

    const hasActiveFilters = filters.status !== 'ALL' || filters.priority !== 'ALL' || filters.categoryId !== 'ALL' || sortBy !== 'createdAt:desc';

    // Prepare category options
    const categoryOptions = [
        { value: 'ALL', label: 'All Categories', icon: '📁' },
        ...categories.map(cat => ({
            value: cat.id,
            label: cat.name,
            icon: '🏷️'
        }))
    ];

    return (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                        <Filter className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">กรองและ เรียงลำดับ</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">ปรับแต่งมุมมองงานของคุณ</p>
                    </div>
                </div>
                
                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 hover:scale-105"
                    >
                        <X className="h-4 w-4" />
                        ล้างกรอง ทั้งหมด
                    </button>
                )}
            </div>

            {/* Filter Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Status Dropdown */}
                <Dropdown
                    label="สถานะ"
                    value={filters.status}
                    options={filterOptions.status}
                    onChange={(value) => handleFilterChange('status', value)}
                    placeholder="Select status..."
                />

                {/* Priority Dropdown */}
                <Dropdown
                    label="ลำดับความสําคัญ"
                    value={filters.priority}
                    options={filterOptions.priority}
                    onChange={(value) => handleFilterChange('priority', value)}
                    getOptionColor={(option) => option.color}
                    placeholder="Select priority..."
                />

                {/* Category Dropdown */}
                <Dropdown
                    label="หมวดหมู่"
                    value={filters.categoryId}
                    options={categoryOptions}
                    onChange={(value) => handleFilterChange('categoryId', value)}
                    placeholder="Select category..."
                />

                {/* Sort Dropdown */}
                <Dropdown
                    label="จัดเรียงลำดับ"
                    value={sortBy}
                    options={sortOptions}
                    onChange={setSortBy}
                    placeholder="Select sorting..."
                />
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Active filters:</span>
                        
                        {filters.status !== 'ALL' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                                Status: {filterOptions.status.find(s => s.value === filters.status)?.label}
                                <button
                                    onClick={() => handleFilterChange('status', 'ALL')}
                                    className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        
                        {filters.priority !== 'ALL' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium">
                                Priority: {filterOptions.priority.find(p => p.value === filters.priority)?.label}
                                <button
                                    onClick={() => handleFilterChange('priority', 'ALL')}
                                    className="ml-1 hover:bg-yellow-200 dark:hover:bg-yellow-800 rounded-full p-0.5"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        
                        {filters.categoryId !== 'ALL' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                                Category: {categories.find(c => c.id === filters.categoryId)?.name || 'Unknown'}
                                <button
                                    onClick={() => handleFilterChange('categoryId', 'ALL')}
                                    className="ml-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        
                        {sortBy !== 'createdAt:desc' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                                Sort: {sortOptions.find(s => s.value === sortBy)?.label}
                                <button
                                    onClick={() => setSortBy('createdAt:desc')}
                                    className="ml-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}