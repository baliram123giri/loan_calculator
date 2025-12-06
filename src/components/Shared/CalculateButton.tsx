import React from 'react';

interface CalculateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    icon?: React.ReactNode;
}

export const CalculateButton: React.FC<CalculateButtonProps> = ({
    label = "Calculate",
    icon = "⚡",
    className = "",
    ...props
}) => {
    return (
        <button
            className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2 ${className}`}
            {...props}
        >
            <span className="text-xl">{icon}</span>
            {label}
        </button>
    );
};
