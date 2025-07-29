// src/components/ui/Modal.tsx
import { X } from 'lucide-react';
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        // Backdrop
        <div 
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
        >
            {/* Modal Content */}
            <div
                onClick={(e) => e.stopPropagation()} // ป้องกันการปิด modal เมื่อคลิกข้างใน
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4 z-50"
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}