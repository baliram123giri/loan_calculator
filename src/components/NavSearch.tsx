'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchItem {
    href: string;
    label: string;
    description: string;
    category: string;
}

interface NavSearchProps {
    items: SearchItem[];
}

export default function NavSearch({ items }: NavSearchProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 0) {
            const filtered = items.filter(item =>
                item.label.toLowerCase().includes(value.toLowerCase()) ||
                item.description.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setIsOpen(true);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setSuggestions([]);
        setIsOpen(false);
    };

    const handleSelect = (href: string) => {
        router.push(href);
        clearSearch();
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md mx-4 lg:mx-8 hidden md:block">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    onFocus={() => query.length > 0 && setIsOpen(true)}
                    placeholder="Search calculators..."
                    className="block w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-gray-700 rounded-full leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all shadow-sm group-hover:shadow-md"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {isOpen && suggestions.length > 0 && (
                <div className="absolute mt-2 w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-[60vh] overflow-y-auto py-2">
                        {suggestions.map((item, index) => (
                            <div key={`${item.href}-${index}`}>
                                {index > 0 && suggestions[index - 1].category !== item.category && (
                                    <div className="px-4 py-1.5 bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        {item.category}
                                    </div>
                                )}
                                {(index === 0) && (
                                    <div className="px-4 py-1.5 bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        {item.category}
                                    </div>
                                )}
                                <button
                                    onClick={() => handleSelect(item.href)}
                                    className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/10 flex items-start justify-between group transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0 cursor-pointer"
                                >
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {item.label}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                                            {item.description}
                                        </div>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-100 dark:border-gray-800">
                        Top {suggestions.length} results matching "{query}"
                    </div>
                </div>
            )}
            {isOpen && query.length > 0 && suggestions.length === 0 && (
                <div className="absolute mt-2 w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 text-center z-50">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No results found for "{query}"</p>
                </div>
            )}
        </div>
    );
}
