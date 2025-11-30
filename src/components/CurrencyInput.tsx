import React, { useState } from 'react';

interface CurrencyInputProps {
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
    className?: string;
    min?: number;
    max?: number;
}

export default function CurrencyInput({
    value,
    onChange,
    placeholder = '0',
    className = '',
    min,
    max
}: CurrencyInputProps) {
    const [displayValue, setDisplayValue] = useState(value.toString());
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setDisplayValue(inputValue);

        // Remove any non-digit characters
        const cleanedValue = inputValue.replace(/[^\d]/g, '');

        // Convert to number
        const numValue = cleanedValue === '' ? 0 : parseInt(cleanedValue, 10);

        // Apply min/max constraints if provided
        let finalValue = numValue;
        if (min !== undefined && numValue < min) finalValue = min;
        if (max !== undefined && numValue > max) finalValue = max;

        onChange(finalValue);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        // Clear the field if it's 0
        if (value === 0) {
            setDisplayValue('');
        }
        e.target.select();
    };

    const handleBlur = () => {
        setIsFocused(false);
        setDisplayValue(value.toString());
    };

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400">$</span>
            </div>
            <input
                type="text"
                inputMode="numeric"
                value={isFocused ? displayValue : value.toLocaleString()}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                className={`w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none ${className}`}
            />
        </div>
    );
}
