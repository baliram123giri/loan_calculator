import React from 'react';
import type { Metadata } from 'next';
import InterestCalculator from '@/components/InterestCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Calculator, TrendingUp, DollarSign, HelpCircle, Percent } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Interest Calculator | Simple & Compound Interest with Charts',
    description: 'Calculate simple and compound interest with our advanced, free calculator. Visualize your savings growth, compare rates, and get smart investment insights.',
    keywords: 'interest calculator, simple interest calculator, compound interest calculator, investment calculator, savings calculator, interest rate calculator',
};

export default function InterestCalculatorPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Hero Section */}
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-900/50 border-b border-gray-200 dark:border-gray-800 pb-12 pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto mb-12">
                        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Master Your Money with Our <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                Smart Interest Calculator
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            Visualize your wealth growth with our advanced Simple & Compound Interest calculator.
                            See how small contributions can lead to massive returns.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Calculator Component */}
                {/* Calculator Component */}
                <div className="-mt-20 relative z-10">
                    <InterestCalculator />
                </div>

                {/* SEO Content */}
                <div className="mt-24 flex flex-col lg:flex-row gap-12">

                    {/* Main Content */}
                    <div className="flex-1 space-y-12">

                        {/* Introduction */}
                        <section className="prose dark:prose-invert max-w-none">
                            <h2 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                🧠 Understanding Interest: The Engine of Wealth
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                Interest is essentially the cost of borrowing money or the reward for saving it. When you deposit money in a bank, the bank pays you interest for using your funds. Conversely, when you take a loan, you pay interest to the lender.
                            </p>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                                Albert Einstein famously called compound interest the "eighth wonder of the world." Understanding how it works is the first step towards financial freedom.
                            </p>
                        </section>

                        {/* Simple vs Compound */}
                        <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                ⚖️ Simple vs. Compound Interest: What's the Difference?
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-semibold text-blue-600 mb-3">Simple Interest</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Calculated only on the principal amount. It remains constant throughout the tenure.
                                    </p>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                        <code className="text-blue-800 dark:text-blue-200 font-mono text-sm">
                                            Formula: SI = (P × R × T) / 100
                                        </code>
                                    </div>
                                    <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <li>• Best for short-term loans</li>
                                        <li>• Predictable returns</li>
                                        <li>• No growth on interest earned</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-purple-600 mb-3">Compound Interest</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Calculated on the principal PLUS the accumulated interest. Your interest earns interest!
                                    </p>
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                                        <code className="text-purple-800 dark:text-purple-200 font-mono text-sm">
                                            Formula: A = P(1 + r/n)^(nt)
                                        </code>
                                    </div>
                                    <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <li>• Best for long-term investments</li>
                                        <li>• Exponential growth</li>
                                        <li>• Wealth multiplier effect</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Tips */}
                        <section>
                            <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                🚀 3 Tips to Maximize Your Returns
                            </h2>
                            <div className="grid gap-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold mr-4">1</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">Start Early</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Time is the most powerful factor in compounding. Starting 5 years earlier can double your final corpus.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold mr-4">2</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">Increase Frequency</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Opt for more frequent compounding (e.g., quarterly vs. yearly) if available. It adds up significantly over time.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold mr-4">3</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">Reinvest Earnings</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Don't withdraw your interest payouts. Let them stay invested to generate more wealth.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* FAQ */}
                        <section>
                            <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                ❓ Frequently Asked Questions
                            </h2>
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">What is the Rule of 72?</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        The Rule of 72 is a quick way to estimate how long it will take to double your investment. Simply divide 72 by your annual interest rate. For example, at 8% interest, your money doubles in approximately 9 years (72 ÷ 8 = 9).
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Does inflation affect my returns?</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Yes. Real returns are calculated by subtracting the inflation rate from your nominal interest rate. If you earn 7% interest but inflation is 5%, your real purchasing power only grows by 2%.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">What is APY vs APR?</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        APR (Annual Percentage Rate) is the simple interest rate. APY (Annual Percentage Yield) includes the effect of compounding. APY is always higher than or equal to APR and is the true measure of what you earn.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Related Tools */}

                </div>
                <div className="w-[80%] mx-auto space-y-8 mt-5">
                    <RelatedCalculators
                        links={[
                            {
                                href: "/calculators/loan",
                                title: "Loan Calculator",
                                description: "Calculate EMI & Amortization",
                                icon: DollarSign,
                                iconColorClass: "text-blue-600",
                                iconBgClass: "bg-blue-100",
                                hoverBgClass: "group-hover:bg-blue-600"
                            },
                            {
                                href: "/calculators/mortgage",
                                title: "Mortgage Calculator",
                                description: "Plan your home loan",
                                icon: TrendingUp,
                                iconColorClass: "text-purple-600",
                                iconBgClass: "bg-purple-100",
                                hoverBgClass: "group-hover:bg-purple-600"
                            },
                            {
                                href: "/calculators/apr",
                                title: "APR Calculator",
                                description: "Find true cost of borrowing",
                                icon: Percent,
                                iconColorClass: "text-green-600",
                                iconBgClass: "bg-green-100",
                                hoverBgClass: "group-hover:bg-green-600"
                            }
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
