import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface InputNumberProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label: string;
    symbol?: string;
    error?: string;
    helperText?: string;
    value?: number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
    ({ className, label, symbol, error, helperText, value, onChange, ...props }, ref) => {
        const [displayValue, setDisplayValue] = useState(value?.toString() || '');
        const [isFocused, setIsFocused] = useState(false);
        const isCurrency = symbol === '$' || symbol === '₹' || symbol === '€' || symbol === '£';

        useEffect(() => {
            if (!isFocused && value !== undefined) {
                setDisplayValue(value.toString());
            }
        }, [value, isFocused]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (isCurrency) {
                const inputValue = e.target.value;
                setDisplayValue(inputValue);

                // Remove any non-digit characters
                const cleanedValue = inputValue.replace(/[^\d]/g, '');
                const numValue = cleanedValue === '' ? 0 : parseInt(cleanedValue, 10);

                // Create a synthetic event with the numeric value
                const syntheticEvent = {
                    ...e,
                    target: {
                        ...e.target,
                        value: numValue.toString()
                    }
                } as React.ChangeEvent<HTMLInputElement>;

                onChange?.(syntheticEvent);
            } else {
                setDisplayValue(e.target.value);
                onChange?.(e);
            }
        };

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            if (isCurrency && value === 0) {
                setDisplayValue('');
            }
            e.target.select();
        };

        const handleBlur = () => {
            setIsFocused(false);
            if (value !== undefined) {
                setDisplayValue(value.toString());
            }
        };

        const inputValue = isCurrency && !isFocused && value !== undefined
            ? value.toLocaleString()
            : displayValue;

        return (
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
                <div className="relative">
                    {symbol && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                            {symbol}
                        </div>
                    )}
                    <input
                        type={isCurrency ? "text" : "number"}
                        inputMode={isCurrency ? "numeric" : undefined}
                        className={cn(
                            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-50",
                            symbol && "pl-8",
                            error && "border-red-500 focus:ring-red-500",
                            className
                        )}
                        value={inputValue}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        ref={ref}
                        {...props}
                    />
                </div>
                {helperText && !error && <span className="text-xs text-gray-500">{helperText}</span>}
                {error && <span className="text-xs text-red-500">{error}</span>}
            </div>
        );
    }
);
InputNumber.displayName = "InputNumber";
