import React from 'react';
import { Metadata } from 'next';
import { Calculator, Users, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About Us - calcbz.com | Free US Financial Calculators',
    description: 'Learn about calcbz.com, your trusted source for free financial calculators. We help Americans make informed decisions about mortgages, loans, interest, and taxes.',
    alternates: {
        canonical: 'https://calcbz.com/info/about'
    }
};

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                About Calcbz
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                    We're on a mission to make financial planning accessible to everyone in the United States—completely free, no strings attached.
                </p>

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Calcbz was born from a simple frustration: why is it so hard to get straightforward answers about money? Whether you're buying your first home, taking out a car loan, or trying to understand how compound interest works, the financial world can feel unnecessarily complicated.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        We built Calcbz to change that. Our calculators cut through the jargon and give you clear, accurate numbers you can trust. No hidden fees, no email required, no credit card needed—just honest tools that help you make better financial decisions.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                        Every calculator is designed specifically for the US market, accounting for how mortgages, taxes, and interest actually work in America. We're not just converting formulas from other countries—we're building tools that reflect the real financial landscape Americans navigate every day.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                        <Calculator className="w-10 h-10 text-blue-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Always Free</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            No subscriptions, no paywalls, no premium features. Everything is free, forever.
                        </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800">
                        <Users className="w-10 h-10 text-green-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Privacy First</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Your data stays on your device. We don't track, sell, or share your information.
                        </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
                        <TrendingUp className="w-10 h-10 text-purple-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">US-Focused</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Built for Americans, with US tax rates, mortgage types, and financial standards.
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What We Offer</h2>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span><strong>Mortgage Calculator:</strong> Estimate monthly payments including principal, interest, taxes, and insurance. Model ARM rate changes and prepayments.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span><strong>Loan Calculator:</strong> Calculate payments for personal loans, auto loans, and student loans with complete amortization schedules.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span><strong>Interest Calculators:</strong> Understand simple and compound interest with APY calculations and yearly breakdowns.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span><strong>Tax Calculators:</strong> Estimate sales tax and property tax based on US state and local rates.</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Commitment</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        We're committed to keeping Calcbz free and accessible. We don't sell your data, show intrusive ads, or require you to create an account. Our calculators work offline once loaded, and your calculations stay private on your device.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                        While our calculators are accurate and based on standard financial formulas, they're for informational purposes only. For personalized financial advice, please consult with a licensed financial advisor or tax professional.
                    </p>
                </div>
            </div>
        </div>
    );
}
