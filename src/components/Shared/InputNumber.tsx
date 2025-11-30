import React from 'react';
import { cn } from '@/lib/utils';

interface InputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    symbol?: string;
    error?: string;
}

export const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
    ({ className, label, symbol, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
                <div className="relative">
                    {symbol && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {symbol}
                        </div>
                    )}
                    <input
                        type="number"
                        className={cn(
                            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-50",
                            symbol && "pl-8",
                            error && "border-red-500 focus:ring-red-500",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && <span className="text-xs text-red-500">{error}</span>}
            </div>
        );
    }
);
InputNumber.displayName = "InputNumber";
