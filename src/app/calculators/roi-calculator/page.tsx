import React from 'react';
import type { Metadata } from 'next';
import ROICalculator from '@/components/ROICalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import {
    Calculator,
    TrendingUp,
    DollarSign,
    Target,
    HelpCircle,
    LineChart,
    PieChart,
    Briefcase
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Free ROI Calculator | Return on Investment Calculator',
    description: 'Calculate Return on Investment (ROI) and annualized ROI with our free, advanced ROI calculator. Get smart insights, visualizations, and PDF reports for your investments.',
    keywords: 'ROI calculator, return on investment calculator, annualized ROI, investment return, profit calculator, financial calculator, marketing ROI, real estate ROI',
};

export default function ROICalculatorPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-900/50 border-b border-gray-200 dark:border-gray-800 pb-12 pt-16 mb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto mb-12">
                        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Master Your Returns with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                                Precision ROI Analysis
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            Instantly calculate your Return on Investment (ROI) and Annualized ROI.
                            Gain actionable insights with our smart tools designed for investors, marketers, and business owners.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Calculator Component */}
                <div className="-mt-20 relative z-10">
                    <ROICalculator />
                </div>

                {/* SEO Content */}
                <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-12 space-y-12">

                        {/* Intro */}
                        <section className="prose dark:prose-invert max-w-none">
                            <h2 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                <Calculator className="w-8 h-8 mr-3 text-blue-600" />
                                Understanding Return on Investment (ROI)
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                Return on Investment (ROI) is the ultimate performance metric. Whether you're evaluating a stock purchase,
                                a real estate deal, a marketing campaign, or a new business venture, knowing your ROI helps you
                                answer the most critical question: <strong>Is this investment worth it?</strong>
                            </p>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                                Our calculator goes beyond simple division. It computes <strong>Annualized ROI</strong> to help you compare
                                investments of different lengths, and provides <strong>Inflation-Adjusted</strong> metrics for a realistic view of your purchasing power.
                            </p>
                        </section>

                        {/* Formula Section */}
                        <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                🧮 The Mathematics of Profit
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Standard ROI Formula
                                    </h4>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm text-blue-600 dark:text-blue-400 mb-4 overflow-x-auto">
                                        ROI = ((Net Profit) / Amount Invested) × 100
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Simple, effective, and universally understood. It tells you the total percentage gain or loss.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Annualized ROI (CAGR) Formula
                                    </h4>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm text-purple-600 dark:text-purple-400 mb-4 overflow-x-auto">
                                        Annualized ROI = [(Ending Value / Beginning Value)^(1/Years) - 1] × 100
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Crucial for comparing long-term investments. A 50% return over 10 years is very different from a 50% return over 2 years.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Strategies */}
                        <section>
                            <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                <TrendingUp className="w-6 h-6 mr-3 text-green-600" />
                                🚀 Strategies to Maximize Your ROI
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <Briefcase className="w-8 h-8 text-blue-500 mb-4" />
                                    <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Reduce Costs</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Every dollar saved in fees, taxes, or overhead is a dollar added directly to your bottom line.
                                        Low-cost index funds often beat expensive active funds simply due to lower expense ratios.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <PieChart className="w-8 h-8 text-purple-500 mb-4" />
                                    <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Reinvest Earnings</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Compound interest is your best friend. Reinvesting dividends and profits allows your money
                                        to earn money on itself, accelerating ROI exponentially over time.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <LineChart className="w-8 h-8 text-green-500 mb-4" />
                                    <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Time is Money</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        The longer you stay invested, the more you smooth out volatility. While short-term ROI can fluctuate,
                                        long-term trends historically lean upwards for diversified assets.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* FAQ */}
                        <section>
                            <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-8">
                                <HelpCircle className="w-6 h-6 mr-3 text-gray-600" />
                                ❓ Frequently Asked Questions
                            </h2>
                            <div className="space-y-4">
                                <details className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-gray-900 dark:text-white">
                                        What is a "good" ROI?
                                        <span className="transition-transform group-open:rotate-180">▼</span>
                                    </summary>
                                    <div className="px-6 pb-6 text-gray-600 dark:text-gray-400">
                                        It depends on the risk. For the safe S&P 500, historically ~10% annually is considered good.
                                        For real estate, 8-12% is often targeted. For risky startups, venture capitalists might look for 1000%+!
                                        Always compare ROI relative to the risk taken.
                                    </div>
                                </details>
                                <details className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-gray-900 dark:text-white">
                                        How does inflation affect my ROI?
                                        <span className="transition-transform group-open:rotate-180">▼</span>
                                    </summary>
                                    <div className="px-6 pb-6 text-gray-600 dark:text-gray-400">
                                        Inflation eats purchasing power. If your investment grew by 5% but inflation was 3%, your "Real ROI" is only roughly 2%.
                                        Our calculator's "Advanced Options" lets you factor this in to see if you're truly getting richer or just keeping pace.
                                    </div>
                                </details>
                                <details className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-gray-900 dark:text-white">
                                        Why is Annualized ROI important?
                                        <span className="transition-transform group-open:rotate-180">▼</span>
                                    </summary>
                                    <div className="px-6 pb-6 text-gray-600 dark:text-gray-400">
                                        Imagine Investment A made 20% in 1 year, and Investment B made 30% in 5 years.
                                        Investment B looks bigger, but Investment A is far superior annually! Annualized ROI standardizes these
                                        so you can compare apples to apples.
                                    </div>
                                </details>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <div className="w-[80%] mx-auto space-y-8 mt-12 bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                <RelatedCalculators
                    links={[
                        {
                            href: "/calculators/investment-calculator",
                            title: "Investment Calculator",
                            description: "Plan SIPs & goals",
                            icon: TrendingUp,
                            iconColorClass: "text-blue-600",
                            iconBgClass: "bg-blue-100",
                            hoverBgClass: "group-hover:bg-blue-600"
                        },
                        {
                            href: "/calculators/compound-interest",
                            title: "Compound Interest",
                            description: "See your money grow",
                            icon: DollarSign,
                            iconColorClass: "text-green-600",
                            iconBgClass: "bg-green-100",
                            hoverBgClass: "group-hover:bg-green-600"
                        },
                        {
                            href: "/calculators/real-estate-calculator",
                            title: "Real Estate ROI",
                            description: "Property specific returns",
                            icon: Target,
                            iconColorClass: "text-purple-600",
                            iconBgClass: "bg-purple-100",
                            hoverBgClass: "group-hover:bg-purple-600"
                        }
                    ]}
                    title="Related Financial Tools"
                />
            </div>
        </div>
    );
}
