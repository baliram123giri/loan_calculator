import React, { useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value: number;
    onChange: (value: number) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    min?: number;
    max?: number;
}

export default function CurrencyInput({
    value,
    onChange,
    label,
    placeholder = '0',
    className = '',
    min,
    max,
    ...props
}: CurrencyInputProps) {
    const [displayValue, setDisplayValue] = useState(value.toString());
    const [isFocused, setIsFocused] = useState(false);

    const { currency } = useCurrency();

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
        // Clear the field if it's 0, otherwise sync with current value
        if (value === 0) {
            setDisplayValue('');
        } else {
            setDisplayValue(value.toString());
        }
        e.target.select();
    };

    const handleBlur = () => {
        setIsFocused(false);
        setDisplayValue(value.toString());
    };

    const id = React.useId();

    return (
        <div>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <div className={`flex items-center w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-shadow ${className}`}>
                <span className="text-gray-500 dark:text-gray-400 mr-2 whitespace-nowrap select-none">{currency.symbol}</span>
                <input
                    id={id}
                    type="text"
                    inputMode="numeric"
                    value={isFocused ? displayValue : value.toLocaleString()}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 p-0"
                    {...props}
                />
            </div>
        </div>
    );
}
