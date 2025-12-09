import React from 'react';
import type { Metadata } from 'next';
import SavingsCalculator from '@/components/SavingsCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import { DollarSign, TrendingUp, PiggyBank, Calendar, Car, Home } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Savings Calculator | Estimate Compound Interest Growth',
    description: 'Free savings calculator to estimate how much your money will grow over time with compound interest. Calculate returns on deposits and monthly contributions.',
    keywords: 'savings calculator, compound interest calculator, savings growth, investment calculator, future value calculator, savings goal',
};

export default function SavingsCalculatorPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-900/50 border-b border-gray-200 dark:border-gray-800 pb-12 pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto mb-12">
                        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Watch Your Savings Grow with Our <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                Smart Savings Calculator
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            Estimate how much your money will grow over time with compound interest. Plan for your future goals today.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <main>
                    {/* Calculator Section */}
                    <div className="-mt-20 relative z-10 mb-12">
                        <SavingsCalculator />
                    </div>

                    {/* SEO Content */}
                    <div className="max-w-4xl mx-auto mt-16 space-y-12">
                        {/* Introduction */}
                        <section className="prose dark:prose-invert max-w-none">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                🔐 Unlock the Power of Compound Interest
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                Saving money is the first step toward financial freedom, but growing your money is where the real magic happens.
                                Our advanced Savings Calculator helps you visualize how regular contributions and compound interest can turn small amounts into significant wealth over time.
                            </p>
                        </section>

                        {/* Key Concepts */}
                        <section className="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-800">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                💰 How Your Money Grows
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Principal</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        The money you deposit initially and your regular monthly contributions. This is your "hard work."
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Interest</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        The money the bank pays you for keeping your money with them. This is your money working for you.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                                        <PiggyBank className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Compounding</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Earning interest on your interest. Over long periods, this exponential growth can exceed your actual contributions.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Formula Section */}
                        <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                🧮 The Math Behind the Magic
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Understanding the formula can help you see why time and interest rate are so powerful.
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800 mb-6">
                                <code className="text-xl text-blue-800 dark:text-blue-200 font-mono block text-center">
                                    A = P(1 + r/n)^(nt)
                                </code>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300">A</span>
                                    <span className="text-gray-600 dark:text-gray-400">Total future balance</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300">P</span>
                                    <span className="text-gray-600 dark:text-gray-400">Principal investment</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300">r</span>
                                    <span className="text-gray-600 dark:text-gray-400">Annual interest rate (decimal)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300">n</span>
                                    <span className="text-gray-600 dark:text-gray-400">Times compounded per year</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300">t</span>
                                    <span className="text-gray-600 dark:text-gray-400">Time in years</span>
                                </div>
                            </div>
                        </section>

                        {/* Strategies */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                🚀 Smart Saving Strategies
                            </h2>

                            <div className="flex gap-4 items-start">
                                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Start Early</h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Time is your biggest asset. Due to compounding, saving a smaller amount for a longer period often results in more wealth than saving a larger amount for a shorter period.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Automate Your Savings</h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Set up automatic transfers from your checking to your savings account right when you get paid. You won't miss money you never see in your spending account.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Seek High-Yield Accounts</h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Don't settle for 0.01% interest. Look for High-Yield Savings Accounts (HYSA) or CDs that offer competitive rates to maximize your returns.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* FAQ */}
                        <section className="prose dark:prose-invert max-w-none pt-8 border-t border-gray-200 dark:border-gray-800">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                                ❓ Frequently Asked Questions
                            </h2>
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">What is APY?</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        APY stands for Annual Percentage Yield. It represents the real rate of return on your savings, taking into account the effect of compounding interest whereas simple interest rate does not.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">How often is success compounded?</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Savings accounts typically compound interest daily or monthly. The more visible the compounding frequency, the more you earn, though the difference between daily and monthly on smaller amounts is minimal.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Is savings interest taxable?</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Yes, in most jurisdictions, interest earned on savings accounts is considered taxable income. You will typically receive a 1099-INT form if you earn more than $10 in interest annually.
                                    </p>
                                </div>
                            </div>
                        </section>

                    </div>
                    <div className="w-[80%] mx-auto space-y-8 mt-12 bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <RelatedCalculators
                            links={[
                                {
                                    href: "/calculators/investment-calculator",
                                    title: "Investment Calculator",
                                    description: "Plan stock & market investments",
                                    icon: TrendingUp,
                                    iconColorClass: "text-green-600",
                                    iconBgClass: "bg-green-100",
                                    hoverBgClass: "group-hover:bg-green-600"
                                },
                                {
                                    href: "/calculators/auto-loan-calculator",
                                    title: "Auto Loan",
                                    description: "Calculate car payments",
                                    icon: Car,
                                    iconColorClass: "text-blue-600",
                                    iconBgClass: "bg-blue-100",
                                    hoverBgClass: "group-hover:bg-blue-600"
                                },
                                {
                                    href: "/calculators/mortgage",
                                    title: "Mortgage Calculator",
                                    description: "Estimate monthly home payments",
                                    icon: Home,
                                    iconColorClass: "text-purple-600",
                                    iconBgClass: "bg-purple-100",
                                    hoverBgClass: "group-hover:bg-purple-600"
                                }
                            ]}
                            title="More Financial Calculators"
                        />
                    </div>

                </main >
            </div>
        </div >
    );
}
