import React from 'react';
import SimpleInterestCalculator from '@/components/SimpleInterestCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import { TrendingUp, Calculator, DollarSign, Percent } from 'lucide-react';
import { generateCalculatorMetadata } from '@/lib/seo/metadata';
import { calculatorSchemas } from '@/lib/seo/schema';

export const metadata = generateCalculatorMetadata('simple-interest');
export const dynamic = 'force-dynamic';

export default function SimpleInterestPage() {
    const schemas = [
        calculatorSchemas['simple-interest'].software,
        calculatorSchemas['simple-interest'].breadcrumb
    ];

    return (
        <>
            {/* JSON-LD Structured Data */}
            {schemas.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="mb-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Simple Interest{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                Simplified
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                            Calculate simple interest on loans and investments. Get clear, precise breakdowns for your financial planning.
                        </p>
                    </div>
                </div>

                <SimpleInterestCalculator />

                {/* SEO Content */}
                <div className="max-w-4xl mx-auto mt-16 space-y-12">
                    {/* Introduction Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                            <span className="text-4xl">💡</span>
                            Understanding Simple Interest
                        </h2>

                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Simple interest is the most straightforward way to calculate interest on a loan or investment. Unlike
                            compound interest, which calculates interest on both the principal and accumulated interest, simple
                            interest is calculated only on the original principal amount. This makes it easier to understand and
                            predict your costs or earnings.
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Simple interest is commonly used for short-term loans, car loans, some student loans, and certain
                            savings accounts. Understanding how it works helps you compare loan offers, plan your finances, and
                            make informed decisions about borrowing and saving.
                        </p>
                    </section>

                    {/* How Simple Interest Works */}
                    <section className="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="text-3xl">🧮</span>
                            The Simple Interest Formula
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Simple interest uses a straightforward formula that anyone can calculate with basic math. The interest
                            remains constant throughout the loan or investment period because it's always calculated on the same
                            principal amount.
                        </p>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 my-6 shadow-sm">
                            <h4 className="font-semibold text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
                                <span>📐</span> The Formula
                            </h4>
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 text-center mb-4 border border-indigo-100 dark:border-indigo-800">
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-wide">
                                    I = P × R × T
                                </p>
                                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                    <p><strong>I</strong> = Interest earned or paid</p>
                                    <p><strong>P</strong> = Principal (initial amount)</p>
                                    <p><strong>R</strong> = Annual interest rate (as a decimal)</p>
                                    <p><strong>T</strong> = Time period (in years)</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 italic text-center">
                                Total Amount = Principal + Interest
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                                <span>📝</span> Example Calculation
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                You borrow <strong className="text-indigo-600 dark:text-indigo-400">$10,000</strong> at{' '}
                                <strong className="text-indigo-600 dark:text-indigo-400">5% annual interest</strong> for{' '}
                                <strong className="text-indigo-600 dark:text-indigo-400">3 years</strong>:<br /><br />
                                I = $10,000 × 0.05 × 3 = <strong className="text-indigo-600 dark:text-indigo-400">$1,500</strong><br />
                                Total Amount = $10,000 + $1,500 = <strong className="text-indigo-600 dark:text-indigo-400">$11,500</strong><br /><br />
                                You'll pay <strong>$500 in interest each year</strong> for a total of $1,500 over 3 years.
                            </p>
                        </div>
                    </section>

                    {/* Simple vs Compound Interest */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="text-3xl">⚖️</span>
                            Simple Interest vs. Compound Interest
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            The key difference between simple and compound interest is what the interest is calculated on.
                            Understanding this distinction helps you choose the right loan type and maximize your savings.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 my-8">
                            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <span>🔹</span> Simple Interest
                                </h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                                    Interest calculated only on the original principal amount. The interest stays the same each period.
                                </p>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-sm">
                                    <p className="font-semibold mb-2">$10,000 at 5% for 3 years:</p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Year 1: $500 interest<br />
                                        Year 2: $500 interest<br />
                                        Year 3: $500 interest<br />
                                        <strong className="text-blue-600 dark:text-blue-400">Total: $1,500</strong>
                                    </p>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                                    ✓ Better for borrowers<br />
                                    ✓ Predictable costs<br />
                                    ✓ Common in short-term loans
                                </p>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-6 border border-green-200 dark:border-green-800">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <span>📈</span> Compound Interest
                                </h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                                    Interest calculated on principal plus accumulated interest. Interest grows exponentially.
                                </p>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-sm">
                                    <p className="font-semibold mb-2">$10,000 at 5% for 3 years:</p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Year 1: $500 interest<br />
                                        Year 2: $525 interest<br />
                                        Year 3: $551 interest<br />
                                        <strong className="text-green-600 dark:text-green-400">Total: $1,576</strong>
                                    </p>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                                    ✓ Better for savers/investors<br />
                                    ✓ Grows faster over time<br />
                                    ✓ Common in savings/investments
                                </p>
                            </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">💡 Key Takeaway</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                For loans, simple interest is better (you pay less). For savings and investments, compound interest
                                is better (you earn more). The difference becomes more significant over longer time periods.
                            </p>
                        </div>
                    </section>

                    {/* Common Uses */}
                    <section className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-8 border border-green-100 dark:border-green-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">🏦</span>
                            Where Simple Interest Is Used
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    <span>🚗</span> 1. Auto Loans
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Most car loans use simple interest, calculated daily on the remaining balance. If you pay early
                                    in the month, you pay less interest. If you pay late, you pay more. This makes extra payments
                                    particularly effective for paying down auto loans faster.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    <span>🤝</span> 2. Short-Term Personal Loans
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Loans with terms under 1-2 years often use simple interest. This includes payday loans (though
                                    these have extremely high rates), some personal loans, and bridge loans. The shorter term means
                                    the difference between simple and compound interest is minimal.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    <span>🎓</span> 3. Some Student Loans
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Federal student loans use simple daily interest. Interest accrues daily but doesn't compound
                                    (unless you don't pay it and it capitalizes). Private student loans vary—some use simple interest,
                                    others compound monthly or quarterly.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    <span>💰</span> 4. Certain Savings Accounts
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Some basic savings accounts and short-term certificates of deposit (CDs) use simple interest,
                                    though most modern savings accounts compound daily or monthly. Always check the terms to understand
                                    how your interest is calculated.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    <span>🏢</span> 5. Business and Commercial Loans
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Short-term business loans, lines of credit, and commercial paper often use simple interest. The
                                    predictability helps businesses plan cash flow and budget for interest expenses accurately.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                            <span className="text-4xl">❓</span>
                            Simple Interest Questions
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    How do I convert an annual interest rate to a decimal?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Divide the percentage by 100. For example, 5% becomes 0.05, 7.5% becomes 0.075, and 12% becomes
                                    0.12. This decimal form is what you use in the simple interest formula (I = P × R × T).
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What if my loan term is in months, not years?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Convert months to years by dividing by 12. A 6-month loan is 0.5 years, an 18-month loan is 1.5
                                    years, and a 30-month loan is 2.5 years. For daily calculations, divide days by 365 (or 360 for
                                    some commercial loans).
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Is simple interest better than compound interest for loans?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Yes, for borrowers, simple interest is always better because you pay less total interest. For
                                    example, on a $10,000 loan at 5% for 3 years, you'd pay $1,500 with simple interest versus $1,576
                                    with annual compound interest. The difference grows larger with higher rates and longer terms.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Can I pay off a simple interest loan early?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Usually yes, and it saves you money. With simple interest, you only pay interest for the time you
                                    actually have the loan. If you pay off a 3-year loan in 2 years, you only pay 2 years of interest.
                                    Always check for prepayment penalties, though most simple interest loans don't have them.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    How is simple interest calculated on a daily basis?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Daily simple interest uses the formula: (Principal × Annual Rate × Days) ÷ 365. For example,
                                    $10,000 at 5% for 30 days = ($10,000 × 0.05 × 30) ÷ 365 = $41.10. This method is common for
                                    auto loans and means paying early in your billing cycle saves you money.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Related Tools Section */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <RelatedCalculators
                            links={[
                                {
                                    href: "/calculators/compound-interest",
                                    title: "Compound Interest",
                                    description: "See how interest compounds over time",
                                    icon: TrendingUp,
                                    iconColorClass: "text-blue-600",
                                    iconBgClass: "bg-blue-100",
                                    hoverBgClass: "group-hover:bg-blue-600"
                                },
                                {
                                    href: "/calculators/loan",
                                    title: "Loan Calculator",
                                    description: "Full amortization with payment schedules",
                                    icon: Calculator,
                                    iconColorClass: "text-green-600",
                                    iconBgClass: "bg-green-100",
                                    hoverBgClass: "group-hover:bg-green-600"
                                },
                                {
                                    href: "/calculators/payment",
                                    title: "Payment Calculator",
                                    description: "Calculate payments or loan terms",
                                    icon: DollarSign,
                                    iconColorClass: "text-purple-600",
                                    iconBgClass: "bg-purple-100",
                                    hoverBgClass: "group-hover:bg-purple-600"
                                }
                            ]}
                            title="Explore More Interest Calculators"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
