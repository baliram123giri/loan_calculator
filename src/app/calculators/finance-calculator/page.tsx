import React from 'react';
import FinanceCalculator from '@/components/FinanceCalculator';
import { Metadata } from 'next';
import RelatedCalculators from '@/components/RelatedCalculators';
import { TrendingUp, Home, Percent } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Finance Calculator | Free Time Value of Money (TVM) Calculator',
    description: 'Calculate FV, PV, PMT, N, and I/Y with our advanced Finance Calculator. Free TVM calculator with interactive charts, multiple compounding frequencies, and AI-powered insights.',
    keywords: ['finance calculator', 'TVM calculator', 'time value of money', 'future value calculator', 'present value calculator', 'payment calculator', 'interest rate calculator'],
};

export const dynamic = 'force-dynamic';

export default function FinanceCalculatorPage() {
    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Advanced Time Value of Money Calculator
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Calculate Future Value, Present Value, Payments, Periods, and Interest Rates with our comprehensive TVM calculator.
                        Features multiple compounding frequencies, payment timing options, and real-time visualization.
                    </p>
                </div>

                {/* Calculator Component */}
                <FinanceCalculator />

                {/* SEO Content */}
                <div className="max-w-4xl mx-auto mt-16 space-y-12">

                    {/* What is TVM Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            Understanding Time Value of Money (TVM)
                        </h2>

                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            The Time Value of Money is a fundamental financial concept stating that money available today is worth more than the same amount in the future.
                            Why? Because money you have now can be invested to earn returns, whereas future money cannot.
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            TVM is the foundation of financial mathematics and is used in everything from mortgages and car loans to retirement planning and business valuations.
                            Our calculator helps you master these concepts with real-world applications and visual insights.
                        </p>
                    </section>

                    {/* Five Calculations Section */}
                    <section className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            The Five TVM Calculations Explained
                        </h3>

                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 text-lg">
                                    1. Future Value (FV) - Where Will My Money Grow?
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 mb-3">
                                    Calculate how much your investment will be worth in the future given a specific interest rate and time period.
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>Example:</strong> If you invest $10,000 today at 6% annual interest for 10 years with monthly compounding,
                                    it will grow to approximately $18,194.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 text-lg">
                                    2. Present Value (PV) - What's Future Money Worth Today?
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 mb-3">
                                    Determine the current worth of money you'll receive in the future, discounted by a given interest rate.
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>Example:</strong> If someone promises to pay you $20,000 in 5 years, and your discount rate is 6%,
                                    that future payment is worth approximately $14,945 today.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 text-lg">
                                    3. Payment (PMT) - How Much Do I Pay Each Period?
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 mb-3">
                                    Calculate the regular payment amount needed for loans or investments.
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>Example:</strong> For a $200,000 mortgage at 4% interest over 30 years,
                                    your monthly payment would be approximately $955.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 text-lg">
                                    4. Number of Periods (N) - How Long Will It Take?
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 mb-3">
                                    Find out how long it will take to reach your financial goal.
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>Example:</strong> To grow $10,000 into $20,000 at 7% annual return,
                                    it will take approximately 10.24 years (using the Rule of 72 as a quick estimate: 72/7 ≈ 10.3 years).
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 text-lg">
                                    5. Interest Rate (I/Y) - What Return Do I Need?
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 mb-3">
                                    Calculate the required rate of return to achieve your financial goals.
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>Example:</strong> If you want to turn $10,000 into $20,000 in 10 years,
                                    you'll need an annual return of approximately 7.18%.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Compounding Frequency Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Understanding Compounding Frequency
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            How often interest compounds significantly impacts your returns. Our calculator supports five frequenciesannual, semi-annual, quarterly, monthly, and daily.\n                        </p>

                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 my-8">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                                Impact Example: $10,000 at 5% for 10 Years
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Annual Compounding:</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">$16,289</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Quarterly Compounding:</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">$16,436</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Compounding:</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">$16,470</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Daily Compounding:</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">$16,487</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                                <strong>Difference:</strong> Daily vs. Annual = $198 more (1.2% more)
                            </p>
                        </div>
                    </section>

                    {/* Payment Timing Section */}
                    <section className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-8 border border-green-100 dark:border-green-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Payment Timing: Beginning vs. End of Period
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            The timing of payments affects the future value of your investments. Payments made at the beginning of each period earn one additional period of interest.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3">
                                    End of Period (Ordinary Annuity)
                                </h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Most common for loans and investments. Payments occur at the end of each period.
                                    Example: Monthly mortgage payments, standard retirement contributions.
                                </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3">
                                    Beginning of Period (Annuity Due)
                                </h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Less common but valuable. Payments occur at the start of each period, earning extra interest.
                                    Example: Rent payments, some insurance premiums.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* FAQs */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            Frequently Asked Questions
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What is the Time Value of Money?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    The Time Value of Money (TVM) is the concept that money available today is worth more than the same amount in the future
                                    due to its earning potential. This core principle underlies all financial calculations and investment decisions.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    How do I calculate Future Value?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Future Value is calculated using the formula: FV = PV × (1 + r)^n for lump sums, where PV is present value,
                                    r is the interest rate per period, and n is the number of periods. For regular payments (annuities),
                                    the formula includes the payment amount and payment frequency.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What's the difference between nominal and effective interest rates?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    The nominal rate is the stated annual rate, while the effective rate accounts for compounding frequency.
                                    For example, 6% compounded monthly has an effective annual rate of approximately 6.17%.
                                    Our calculator shows both rates to give you the complete picture.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    When should I use the Payment calculator?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Use the Payment (PMT) calculator to determine regular payment amounts for loans (like mortgages or car loans)
                                    or to calculate how much you need to invest periodically to reach a savings goal. It's perfect for budgeting
                                    and financial planning.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    How accurate is the Interest Rate calculator?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Our calculator uses the Newton-Raphson iterative method with a convergence tolerance of 0.000001%,
                                    providing highly accurate results consistent with professional financial calculators like the BA II Plus and HP 12CP.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Related Tools */}
                    {/* Related Tools */}
                    <div className="lg:col-span-4 space-y-8">
                        <RelatedCalculators
                            links={[
                                {
                                    href: "/calculators/investment-calculator",
                                    title: "Investment Calculator",
                                    description: "Calculate SIP, lumpsum, and step-up investments",
                                    icon: TrendingUp,
                                    iconColorClass: "text-blue-600",
                                    iconBgClass: "bg-blue-100",
                                    hoverBgClass: "group-hover:bg-blue-600"
                                },
                                {
                                    href: "/calculators/mortgage",
                                    title: "Mortgage Calculator",
                                    description: "Calculate monthly mortgage payments with PITI",
                                    icon: Home,
                                    iconColorClass: "text-purple-600",
                                    iconBgClass: "bg-purple-100",
                                    hoverBgClass: "group-hover:bg-purple-600"
                                },
                                {
                                    href: "/calculators/compound-interest",
                                    title: "Compound Interest",
                                    description: "See the power of compound growth over time",
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
        </>
    );
}
