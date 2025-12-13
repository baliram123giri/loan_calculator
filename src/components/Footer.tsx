import React from 'react';
import Link from 'next/link';
import { Calculator, Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white border-t border-gray-800 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <Calculator className="w-8 h-8 text-blue-500" />
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                                Calcbz
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                            Empowering your financial journey with precise, privacy-focused tools. master your money with our suite of free calculators for mortgages, loans, investments, and taxes.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-all">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="mailto:support@calcbz.com" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-white">Mortgages & Loans</h3>
                        <ul className="space-y-4">
                            <li><Link href="/calculators/mortgage" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Mortgage Calculator</Link></li>
                            <li><Link href="/calculators/loan" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Amortization Schedule</Link></li>
                            <li><Link href="/calculators/refinance-calculator" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Refinance Calculator</Link></li>
                            <li><Link href="/calculators/fha-loan-calculator" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">FHA Loan</Link></li>
                            <li><Link href="/calculators/va-mortgage-calculator" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">VA Mortgage</Link></li>
                            <li><Link href="/calculators/compare" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Compare Loans</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6 text-white">Invest & Grow</h3>
                        <ul className="space-y-4">
                            <li><Link href="/calculators/investment-calculator" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Investment Calculator</Link></li>
                            <li><Link href="/calculators/compound-interest" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Compound Interest</Link></li>
                            <li><Link href="/calculators/simple-interest" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Simple Interest</Link></li>
                            <li><Link href="/calculators/roi-calculator" className="text-gray-400 hover:text-green-400 transition-colors text-sm">ROI Calculator</Link></li>
                            <li><Link href="/calculators/average-return-calculator" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Average Return</Link></li>
                            <li><Link href="/calculators/inflation-calculator" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Inflation Impact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6 text-white">Support & Legal</h3>
                        <ul className="space-y-4">
                            <li><Link href="/info/about" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">About Calcbz</Link></li>
                            <li><Link href="/info/contact" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Contact Us</Link></li>
                            <li><Link href="/info/faq" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">FAQ / Help</Link></li>
                            <li><Link href="/info/privacy" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Privacy Policy</Link></li>
                            <li><Link href="/info/terms" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Terms of Service</Link></li>
                            <li><Link href="/sitemap.xml" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Sitemap</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-sm">
                        © {currentYear} Calcbz. All rights reserved.
                    </p>
                    <p className="text-gray-600 text-xs max-w-md text-center md:text-right">
                        Disclaimer: All calculations are for informational purposes only. figures are estimates and may vary based on market conditions. Consult a financial advisor for professional advice.
                    </p>
                </div>
            </div>
        </footer>
    );
}
