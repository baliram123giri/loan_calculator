'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calculator, Scale, Percent, Receipt, PiggyBank, Home } from 'lucide-react';

export default function NavBar() {
    const pathname = usePathname();

    const tabs = [
        { href: '/calculators/mortgage', label: 'Mortgage', icon: Home },
        { href: '/calculators/loan', label: 'Loan', icon: Calculator },
        { href: '/calculators/compare', label: 'Compare', icon: Scale },
        { href: '/calculators/simple-interest', label: 'Simple Interest', icon: Percent },
        { href: '/calculators/compound-interest', label: 'Compound Interest', icon: Percent },
        { href: '/calculators/house-affordability', label: 'Affordability', icon: Home },
        { href: '/calculators/rent-calculator', label: 'Rent', icon: Home },
        // { href: '/calculators/gst', label: 'GST', icon: Receipt },
        // { href: '/calculators/chit', label: 'Chit Fund', icon: PiggyBank },
    ];

    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        L
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Loanly
                    </h1>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Mobile Navigation (Scrollable) */}
            <div className="md:hidden overflow-x-auto border-t border-gray-100 dark:border-gray-800">
                <div className="flex p-2 gap-2 min-w-max">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive
                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </header>
    );
}
