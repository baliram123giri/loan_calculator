'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, currencies } from '@/context/CurrencyContext';
import { ChevronDown, Check } from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';

export default function CurrencySelector() {
    const { currency, setCurrency } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getFlagComponent = (countryCode: string) => {
        const FlagComponent = (Flags as any)[countryCode];
        return FlagComponent ? <FlagComponent className="w-6 h-4 rounded-sm shadow-sm object-cover" /> : null;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                aria-label="Select Currency"
            >
                <div className="flex items-center justify-center w-6 h-4 overflow-hidden rounded-sm bg-gray-100">
                    {getFlagComponent(currency.countryCode)}
                </div>
                <span className="hidden sm:inline font-semibold">{currency.code}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 rounded-xl bg-white dark:bg-gray-800 shadow-xl focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="pb-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-gray-800 z-10">
                            Select Currency
                        </div>
                        {currencies.map((c) => (
                            <button
                                key={c.code}
                                onClick={() => {
                                    setCurrency(c);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${currency.code === c.code
                                    ? 'bg-blue-50/50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                    : 'text-gray-700 dark:text-gray-200'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-6 rounded shadow-sm overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
                                        {getFlagComponent(c.countryCode)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold leading-none mb-1">{c.code}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px]">{c.country}</span>
                                    </div>
                                </div>
                                {currency.code === c.code && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
