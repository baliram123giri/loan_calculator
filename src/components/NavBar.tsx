'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Calculator,
    Home,
    Percent,
    Receipt,
    TrendingUp,
    ChevronDown,
    Menu,
    X,
    Scale,
    DollarSign,
    Building2,
    CreditCard
} from 'lucide-react';

interface CalculatorItem {
    href: string;
    label: string;
    description: string;
}

interface Category {
    label: string;
    icon: React.ElementType;
    items: CalculatorItem[];
}

export default function NavBar() {
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const categories: Category[] = [
        {
            label: 'Loans & Debt',
            icon: CreditCard,
            items: [
                { href: '/calculators/loan', label: 'Loan Calculator', description: 'Calculate loan payments' },
                { href: '/calculators/payment', label: 'Payment Calculator', description: 'Calculate payment or term' },
                { href: '/calculators/dti-calculator', label: 'DTI Ratio', description: 'Debt-to-income ratio' },
            ]
        },
        {
            label: 'Real Estate',
            icon: Home,
            items: [
                { href: '/calculators/mortgage', label: 'Mortgage', description: 'Monthly mortgage payments' },
                { href: '/calculators/house-affordability', label: 'Affordability', description: 'How much house you can afford' },
                { href: '/calculators/rent-calculator', label: 'Rent Calculator', description: 'Rent vs buy analysis' },
                { href: '/calculators/real-estate-calculator', label: 'Real Estate Calculator', description: 'Analyze rental properties' },
                { href: '/calculators/rental-property-calculator', label: 'Rental Property', description: 'Rental property ROI analysis' },
                { href: '/calculators/refinance-calculator', label: 'Refinance Calculator', description: 'Refinance savings & break-even' },
            ]
        },
        {
            label: 'Taxes',
            icon: Receipt,
            items: [
                { href: '/calculators/sales-tax', label: 'Sales Tax', description: 'Calculate sales tax' },
                { href: '/calculators/property-tax', label: 'Property Tax', description: 'Estimate property taxes' },
            ]
        },
        {
            label: 'Interest',
            icon: TrendingUp,
            items: [
                { href: '/calculators/simple-interest', label: 'Simple Interest', description: 'Simple interest calculator' },
                { href: '/calculators/compound-interest', label: 'Compound Interest', description: 'Compound interest with APY' },
            ]
        },
    ];

    const standaloneLinks = [
        { href: '/calculators/compare', label: 'Compare', icon: Scale },
    ];

    const isActiveCategory = (items: CalculatorItem[]) => {
        return items.some(item => pathname === item.href);
    };

    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                            L
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Loanly
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const isActive = isActiveCategory(category.items);

                            return (
                                <div
                                    key={category.label}
                                    className="relative"
                                    onMouseEnter={() => setOpenDropdown(category.label)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    <button
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive || openDropdown === category.label
                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <Icon size={16} />
                                        {category.label}
                                        <ChevronDown size={14} className={`transition-transform ${openDropdown === category.label ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {openDropdown === category.label && (
                                        <div className="absolute top-full left-0 pt-2 w-64 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2">
                                                {category.items.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setOpenDropdown(null)}
                                                        className={`block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${pathname === item.href ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                                            }`}
                                                    >
                                                        <div className="font-medium text-sm text-gray-900 dark:text-white">
                                                            {item.label}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                            {item.description}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Standalone Links */}
                        {standaloneLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 py-4 animate-in slide-in-from-top duration-200">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const isOpen = openDropdown === category.label;

                            return (
                                <div key={category.label} className="mb-2">
                                    <button
                                        onClick={() => setOpenDropdown(isOpen ? null : category.label)}
                                        className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon size={18} />
                                            {category.label}
                                        </div>
                                        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isOpen && (
                                        <div className="mt-1 ml-4 space-y-1">
                                            {category.items.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`block px-4 py-2 text-sm rounded-lg transition-colors ${pathname === item.href
                                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                        }`}
                                                >
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Standalone Links in Mobile */}
                        {standaloneLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <Icon size={18} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </header>
    );
}
