import React from 'react';
import type { Metadata } from 'next';
import CDCalculator from '@/components/CDCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import {
    Calculator,
    TrendingUp,
    DollarSign,
    HelpCircle,
    Shield,
    Clock,
    Landmark,
    Banknote
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'CD Calculator | Certificate of Deposit Interest Calculator',
    description: 'Calculate your Certificate of Deposit (CD) earnings with our advanced CD Calculator. Compare rates, terms, and compounding frequencies to maximize your guaranteed returns.',
    keywords: 'CD calculator, certificate of deposit calculator, CD interest rates, best CD rates, compound interest calculator, savings calculator, bank CD rates, APY calculator',
};

export default function CDCalculatorPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/10 border-b border-gray-200 dark:border-gray-800 pb-12 pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto mb-12">
                        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Maximize Your Returns with Our{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                                CD Calculator
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            Visualize the growth of your Certificate of Deposit investments.
                            Compare APY, compounding frequencies, and tax impacts to make smarter savings decisions.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Calculator Component */}
                <div className="-mt-20 relative z-10">
                    <CDCalculator />
                </div>

                {/* SEO Content */}
                <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-12 space-y-12">

                        {/* Introduction */}
                        <section className="prose dark:prose-invert max-w-none">
                            <h2 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                <Landmark className="w-8 h-8 mr-3 text-blue-600" />
                                Why Choose a Certificate of Deposit (CD)?
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                A Certificate of Deposit (CD) is one of the safest investment vehicles available. Unlike the stock market,
                                which can be volatile, a CD offers a fixed interest rate for a specific period of time. This makes it
                                an excellent choice for risk-averse investors or for short-to-medium term savings goals where capital
                                preservation is paramount.
                            </p>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                                Our CD Calculator helps you peer into the future of your finances. By adjusting the deposit amount,
                                term length, and interest rate, you can see exactly how much your money will grow, helping you decide
                                if a CD is the right place for your hard-earned cash.
                            </p>
                        </section>

                        {/* How it works */}
                        <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                                Understanding the Mechanics of a CD
                            </h2>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mr-4">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Guaranteed Returns</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                When you open a CD, you lock in an interest rate. Even if market rates drop later,
                                                your rate stays the same until maturity.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center mr-4">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Compound Growth</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                Interest can be compounded daily, monthly, or annually. The more frequent the compounding,
                                                the higher your effective yield (APY).
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mr-4">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Term Lengths</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                CDs typically range from 6 months to 5 years. Generally, longer terms offer higher rates
                                                in exchange for locking your money away longer.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center mr-4">
                                            <Banknote className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">FDIC Insurance</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                Bank CDs are FDIC insured up to $250,000 per depositor, making them virtually risk-free
                                                in terms of principal loss.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* CD Ladder Strategy */}
                        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Pro Tip: The CD Ladder Strategy
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                                Don't want to lock all your money up for 5 years? Try a <strong className="text-blue-700 dark:text-blue-300">CD Ladder</strong>.
                                Instead of investing $10,000 in one 5-year CD, split it into five $2,000 CDs with terms of 1, 2, 3, 4, and 5 years.
                            </p>
                            <div className="grid sm:grid-cols-3 gap-6 mt-6">
                                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">1. Liquidity</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        One CD matures every year, giving you access to cash annually without penalties.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">2. Higher Rates</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        You still take advantage of the higher long-term rates with the longer-term portions of your ladder.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">3. Flexibility</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        If rates rise, you can reinvest the maturing CD at the new, higher rate.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section>
                            <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-8">
                                <HelpCircle className="w-6 h-6 mr-3 text-gray-600" />
                                Frequently Asked Questions
                            </h2>

                            <div className="space-y-6">
                                {[
                                    {
                                        q: "What is the difference between Interest Rate and APY?",
                                        a: "The Interest Rate is the simple annual rate. APY (Annual Percentage Yield) includes the effect of compounding. Since interest earns interest, APY is always slightly higher than the interest rate. Banks usually advertise the APY."
                                    },
                                    {
                                        q: "Can I withdraw money from a CD before it matures?",
                                        a: "Yes, but there is usually a penalty. The penalty is typically equal to a few months' worth of interest (e.g., 3 months for short-term CDs, 6-12 months for long-term CDs). Always check the penalty terms before opening a CD."
                                    },
                                    {
                                        q: "Are CDs taxable?",
                                        a: "Yes. The interest you earn on a CD is considered taxable income by the IRS in the year it is earned, even if you don't withdraw it. You will receive a Form 1099-INT from your bank."
                                    },
                                    {
                                        q: "Is a CD better than a High-Yield Savings Account?",
                                        a: "It depends. CDs usually offer higher rates but lock your money. Savings accounts offer lower rates but allow you to withdraw anytime. Use CDs for money you won't need for a set time, and savings accounts for emergency funds."
                                    },
                                    {
                                        q: "What happens when my CD matures?",
                                        a: "Your bank will notify you. You usually have a 'grace period' (7-10 days) to withdraw the money or move it elsewhere. If you do nothing, the bank will often automatically renew it for the same term at the current rate."
                                    }
                                ].map((faq, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                            {faq.q}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {faq.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Related Tools Section */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <RelatedCalculators
                            links={[
                                {
                                    href: "/calculators/compound-interest",
                                    title: "Compound Interest",
                                    description: "See the power of compounding",
                                    icon: TrendingUp,
                                    iconColorClass: "text-blue-600",
                                    iconBgClass: "bg-blue-100",
                                    hoverBgClass: "group-hover:bg-blue-600"
                                },
                                {
                                    href: "/calculators/savings-calculator",
                                    title: "Savings Goal",
                                    description: "Plan for big purchases",
                                    icon: DollarSign,
                                    iconColorClass: "text-green-600",
                                    iconBgClass: "bg-green-100",
                                    hoverBgClass: "group-hover:bg-green-600"
                                },
                                {
                                    href: "/calculators/investment-calculator",
                                    title: "Investment Calculator",
                                    description: "Compare with stock market returns",
                                    icon: Calculator,
                                    iconColorClass: "text-purple-600",
                                    iconBgClass: "bg-purple-100",
                                    hoverBgClass: "group-hover:bg-purple-600"
                                }
                            ]}
                            title="Compare Other Investment Options"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
