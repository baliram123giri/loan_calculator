import React, { useRef } from 'react';

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, className = "", ...props }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (inputRef.current) {
            try {
                // This is the modern standard way to open the picker programmatically
                inputRef.current.showPicker();
            } catch (error) {
                // Fallback for browsers that don't support showPicker (though most modern ones do)
                // or if it fails for some reason.
                console.warn('showPicker not supported or failed', error);
            }
        }
    };

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <input
                ref={inputRef}
                type="date"
                onClick={handleClick}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer ${className}`}
                {...props}
            />
        </div>
    );
};
