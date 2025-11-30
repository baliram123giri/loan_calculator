import React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    valueDisplay?: string | number;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, label, valueDisplay, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-2">
                {(label || valueDisplay) && (
                    <div className="flex justify-between items-center">
                        {label && (
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {label}
                            </label>
                        )}
                        {valueDisplay && (
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                {valueDisplay}
                            </span>
                        )}
                    </div>
                )}
                <input
                    type="range"
                    className={cn(
                        "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
Slider.displayName = "Slider";
