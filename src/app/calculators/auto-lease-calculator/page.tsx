import React from 'react';
import type { Metadata } from 'next';
import AutoLeaseCalculator from '@/components/AutoLeaseCalculator';

export const metadata: Metadata = {
    title: 'Auto Lease Calculator | Estimate Monthly Payments & Costs',
    description: 'Calculate your monthly car lease payments with our advanced Auto Lease Calculator. Includes taxes, fees, money factor conversion, and AI-driven lease tips.',
    keywords: 'auto lease calculator, car lease estimator, lease vs buy, money factor to apr, residual value calculator, lease payments',
};

export default function AutoLeaseCalculatorPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Auto Lease Calculator
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Estimate your monthly lease payments, analyze total costs, and get smart tips to negotiate a better deal.
                </p>
            </div>

            <AutoLeaseCalculator />

            {/* SEO Content */}
            <div className="max-w-4xl mx-auto mt-16 space-y-12">
                {/* Introduction Section */}
                <section className="prose dark:prose-invert max-w-none">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Understanding Your Car Lease
                    </h2>

                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        Leasing a car can be complex, with terms like "Money Factor," "Residual Value," and "Cap Cost" often confusing buyers. Unlike a loan where you pay for the entire car, a lease only charges you for the portion of the car's value you use (depreciation) plus a rent charge.
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Our <strong>Auto Lease Calculator</strong> breaks down these costs, showing you exactly where your money goes. Whether you're eyeing a luxury sedan or a practical SUV, use this tool to verify dealer quotes and ensure you're getting a fair deal.
                    </p>
                </section>

                {/* Key Factors Section */}
                <section className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Key Leasing Terms Explained
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">Capitalized Cost (Cap Cost)</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                This is the negotiated price of the vehicle. Just like buying, you should negotiate this! A lower Cap Cost means lower monthly payments.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">Residual Value</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                The estimated value of the car at the end of the lease. This is set by the bank and usually non-negotiable. A higher residual value is better for leasing because you pay for less depreciation.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">Money Factor</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Essentially the interest rate for a lease. To convert it to an APR, multiply by 2400. For example, a money factor of 0.0025 is equivalent to 6% APR.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="prose dark:prose-invert max-w-none">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Should I put money down on a lease?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Generally, no. If you put a large down payment (Cap Cost Reduction) and the car is totaled or stolen in the first few months, you likely won't get that money back. It's safer to pay a higher monthly payment and keep your cash in the bank.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                What happens if I go over my mileage limit?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                You will be charged a penalty fee, typically between $0.15 and $0.30 per mile. If you know you drive a lot, it's usually cheaper to negotiate a higher mileage limit upfront (e.g., 15k miles/year instead of 12k).
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Can I end my lease early?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Yes, but it can be expensive. You may have to pay the remaining payments or a termination fee. Some people use lease swap websites to transfer their lease to someone else to avoid these penalties.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Related Tools Section */}
                <section className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        More Auto Finance Tools
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <a
                            href="/calculators/auto-loan-calculator"
                            className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                        >
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Auto Loan Calculator</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Calculate monthly loan payments</p>
                        </a>
                        <a
                            href="/calculators/cash-back-vs-low-interest"
                            className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                        >
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Rebate vs. Interest</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Compare cash back to low APR</p>
                        </a>
                        <a
                            href="/calculators/apr"
                            className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                        >
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">APR Calculator</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Find the true cost of borrowing</p>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
