import React from 'react';
import Link from 'next/link';
import { Calculator, TrendingUp, DollarSign, Home } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Calculator className="w-6 h-6 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Loanly</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Free financial calculators for smart money decisions. Calculate mortgages, loans, interest, and taxes with ease.
                        </p>
                    </div>

                    {/* Loan Calculators */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            Loan Calculators
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/calculators/mortgage" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Mortgage Calculator
                                </Link>
                            </li>
                            <li>
                                <Link href="/calculators/loan" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Loan Calculator
                                </Link>
                            </li>
                            <li>
                                <Link href="/calculators/compare" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Loan Comparison
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Interest & Tax Calculators */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Interest & Tax
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/calculators/simple-interest" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Simple Interest
                                </Link>
                            </li>
                            <li>
                                <Link href="/calculators/compound-interest" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Compound Interest
                                </Link>
                            </li>
                            <li>
                                <Link href="/calculators/sales-tax" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Sales Tax
                                </Link>
                            </li>
                            <li>
                                <Link href="/calculators/property-tax" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Property Tax
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal & Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Information
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/info/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/info/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/info/faq" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/info/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/info/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/info/disclaimer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Disclaimer
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            © {currentYear} Loanly. All rights reserved.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            Calculators are for informational purposes only. Consult a financial advisor for personalized advice.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
