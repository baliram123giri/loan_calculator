import React, { useState, useEffect } from 'react';

interface NumberInputProps {
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
    className?: string;
    min?: number;
    max?: number;
    suffix?: string;
    decimalScale?: number;
}

export default function NumberInput({
    value,
    onChange,
    placeholder = '0',
    className = '',
    min,
    max,
    suffix,
    decimalScale = 2
}: NumberInputProps) {
    const [displayValue, setDisplayValue] = useState(value.toString());
    const [isFocused, setIsFocused] = useState(false);

    // Sync display value when prop value changes externally (and not focused)
    useEffect(() => {
        if (!isFocused) {
            setDisplayValue(value === 0 ? '0' : value.toString());
        }
    }, [value, isFocused]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Allow digits and a single decimal point
        if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
            setDisplayValue(inputValue);

            const numValue = inputValue === '' ? 0 : parseFloat(inputValue);

            if (!isNaN(numValue)) {
                // Apply min/max constraints only on blur or if it's a valid complete number
                // For typing, we just pass the value if it's valid
                onChange(numValue);
            }
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        e.target.select();
    };

    const handleBlur = () => {
        setIsFocused(false);

        // Format on blur
        let numValue = parseFloat(displayValue);
        if (isNaN(numValue)) numValue = 0;

        if (min !== undefined && numValue < min) numValue = min;
        if (max !== undefined && numValue > max) numValue = max;

        // Update parent if changed by constraints
        if (numValue !== value) {
            onChange(numValue);
        }

        setDisplayValue(numValue.toString());
    };

    return (
        <div className="relative">
            <input
                type="text"
                inputMode="decimal"
                value={displayValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                className={`w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border ${suffix ? 'pr-8' : ''} ${className}`}
            />
            {suffix && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">{suffix}</span>
                </div>
            )}
        </div>
    );
}
