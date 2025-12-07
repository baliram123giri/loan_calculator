import React from 'react';
import HouseAffordabilityCalculator from '@/modules/house-affordability/component';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Home, FileText, Calculator } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'House Affordability Calculator – How Much House Can You Afford?',
    description: 'Calculate how much house you can afford based on your income, debts, and down payment. Get a detailed breakdown of your monthly mortgage payments with taxes and insurance.',
};

export default function HouseAffordabilityPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                        Find Your Dream Home with{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            Confidence
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                        Calculate how much house you can afford based on your income, debts, and down payment.
                    </p>
                </div>
            </div>

            <HouseAffordabilityCalculator />

            {/* SEO Content */}
            <div className="max-w-4xl mx-auto mt-16 space-y-12">
                {/* Introduction Section */}
                <section className="prose dark:prose-invert max-w-none">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        📚 Determining How Much House You Can Afford
                    </h2>

                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        Before you start house hunting, you need to know your budget. Not just what you want to spend, but what
                        you can realistically afford without stretching your finances too thin. Our calculator uses the same
                        formulas lenders use to determine your maximum home price and monthly payment.
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        The difference between what a lender will approve and what you should actually spend can be significant.
                        Lenders qualify you based on maximum debt ratios, but you need to consider your lifestyle, savings goals,
                        and financial cushion for unexpected expenses.
                    </p>
                </section>

                {/* DTI Ratios Explained */}
                <section className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        💳 Understanding Debt-to-Income (DTI) Ratios
                    </h3>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        Lenders use two DTI ratios to determine how much you can borrow. These ratios compare your monthly debt
                        payments to your gross monthly income and are the primary factors in loan approval.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 my-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3">Front-End DTI (Housing Ratio)</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                Your total housing costs (PITI: Principal, Interest, Taxes, Insurance) divided by gross monthly income.
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Typical Limits:</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    • Conventional: <strong>28%</strong><br />
                                    • FHA: <strong>31%</strong><br />
                                    • VA: <strong>No limit</strong> (uses back-end only)
                                </p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3">Back-End DTI (Total Debt Ratio)</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                All monthly debt payments (housing + car loans + credit cards + student loans) divided by gross monthly income.
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Typical Limits:</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    • Conventional: <strong>36%</strong><br />
                                    • FHA: <strong>43%</strong><br />
                                    • VA: <strong>41%</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mt-6">
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                            Example Calculation
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            With <strong className="text-blue-600 dark:text-blue-400">$6,000/month gross income</strong>:<br />
                            • Front-End (28%): Max housing payment = <strong>$1,680/month</strong><br />
                            • Back-End (36%): Max total debts = <strong>$2,160/month</strong><br />
                            If you have $500 in other debts, your max housing payment is <strong>$1,660</strong> ($2,160 - $500)
                        </p>
                    </div>
                </section>

                {/* Factors That Affect Affordability */}
                <section className="prose dark:prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        🔑 Key Factors That Determine Your Buying Power
                    </h3>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        Your maximum home price depends on several interconnected factors. Understanding how each affects your
                        budget helps you make strategic decisions to increase your buying power.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 my-8">
                        <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-6 border border-green-200 dark:border-green-800">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Income</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Higher income directly increases your maximum payment. Lenders count salary, bonuses (if consistent
                                for 2+ years), and sometimes rental income. Self-employed? You'll need 2 years of tax returns.
                            </p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Existing Debts</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Every $100/month in debt payments reduces your home buying power by about $15,000-20,000. Pay off
                                small debts before applying to maximize your affordability.
                            </p>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Down Payment</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                A larger down payment means a smaller loan, lower monthly payment, and no PMI at 20%+. It also
                                shows financial discipline, potentially earning you better rates.
                            </p>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Interest Rate</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                A 1% rate difference on a $300,000 loan changes your payment by about $200/month and your buying
                                power by $30,000-40,000. Credit score is the biggest rate factor.
                            </p>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-6 border border-red-200 dark:border-red-800">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Property Taxes</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Rates vary from 0.3% (Hawaii) to 2.5% (New Jersey) of home value annually. High-tax states
                                significantly reduce how much house you can afford with the same income.
                            </p>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Credit Score</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Scores above 740 get the best rates. Below 620, you'll pay significantly more or need FHA financing.
                                A 60-point score increase can save you $150+/month.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Smart Strategies */}
                <section className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-8 border border-green-100 dark:border-green-800">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        💡 Strategies to Increase Your Buying Power
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Pay Down High-Interest Debt First</h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Eliminating a $300/month car payment could increase your home buying power by $45,000-60,000. Focus
                                on debts with minimum payments that hurt your DTI ratio, even if they're not your highest interest.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Increase Your Income</h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                A $10,000 annual raise increases your buying power by approximately $50,000-70,000. Consider asking
                                for a raise, taking a higher-paying job, or adding consistent side income (must be documented for
                                2+ years for self-employment).
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Improve Your Credit Score</h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Spend 6-12 months optimizing your credit: pay down credit card balances below 30% utilization, dispute
                                errors, avoid new credit inquiries, and make all payments on time. A score jump from 680 to 740 can
                                save you $100-150/month.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Save a Larger Down Payment</h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Beyond reducing your loan amount, a 20%+ down payment eliminates PMI (saving $100-200/month), earns
                                better interest rates, and gives you instant equity. It also makes your offer more attractive to sellers.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5. Consider Different Loan Types</h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                FHA loans allow higher DTI ratios (43% vs 36%) and lower credit scores, but require mortgage insurance.
                                VA loans (for veterans) allow even higher DTI and no down payment. USDA loans offer 100% financing in
                                rural areas. Explore all options.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="prose dark:prose-invert max-w-none">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        ❓ House Affordability Questions
                    </h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                How much house can I afford with my salary?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                A general rule is 2.5-3 times your annual gross income. So with a $80,000 salary, you could afford
                                a $200,000-240,000 home. However, this assumes minimal other debts, a decent down payment, and
                                moderate property taxes. Your actual affordability depends on your complete financial picture.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Should I max out what the lender approves?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                No. Lenders approve you for the maximum they think you can handle, but that doesn't account for your
                                lifestyle, savings goals, or financial cushion. Many experts recommend spending 20-25% less than your
                                maximum approval to maintain financial flexibility and avoid being "house poor."
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                What if I'm self-employed or have irregular income?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Lenders typically average your income over the past 2 years of tax returns. If your income is
                                trending down, they may use the lower year. You'll need to provide more documentation than W-2
                                employees. Consider working with a mortgage broker who specializes in self-employed borrowers.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                How does student loan debt affect my home buying power?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Lenders count your actual monthly payment or 1% of the total balance (whichever is higher) toward
                                your DTI ratio. If you're on an income-driven repayment plan with a $0 payment, you'll need
                                documentation. $50,000 in student loans at $500/month could reduce your buying power by $75,000-100,000.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Can I use gift money for my down payment?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Yes, but you'll need a gift letter stating the money is a gift, not a loan that must be repaid.
                                The donor must provide bank statements showing they had the funds. Some loan types have restrictions
                                on how much can be gifted vs. your own funds, especially for investment properties.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Related Tools Section */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                    <RelatedCalculators
                        links={[
                            {
                                href: "/calculators/mortgage",
                                title: "Mortgage Calculator",
                                description: "Calculate exact monthly payments",
                                icon: Home,
                                iconColorClass: "text-blue-600",
                                iconBgClass: "bg-blue-100",
                                hoverBgClass: "group-hover:bg-blue-600"
                            },
                            {
                                href: "/calculators/property-tax",
                                title: "Property Tax",
                                description: "Estimate taxes by state",
                                icon: FileText,
                                iconColorClass: "text-green-600",
                                iconBgClass: "bg-green-100",
                                hoverBgClass: "group-hover:bg-green-600"
                            },
                            {
                                href: "/calculators/loan",
                                title: "Loan Calculator",
                                description: "Plan for other loans",
                                icon: Calculator,
                                iconColorClass: "text-purple-600",
                                iconBgClass: "bg-purple-100",
                                hoverBgClass: "group-hover:bg-purple-600"
                            }
                        ]}
                        title="Complete Your Home Buying Plan"
                    />
                </div>
            </div>
        </div>
    );
}
