import React from 'react';
import { RotateCcw } from 'lucide-react';

interface ResetButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    onClick: () => void;
}

export const ResetButton: React.FC<ResetButtonProps> = ({ label = "Reset", className = "", onClick, ...props }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer whitespace-nowrap px-3 py-1 rounded-md hover:bg-blue-50 ${className}`}
            title="Reset to defaults"
            {...props}
        >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            {label}
        </button>
    );
};
