import React from 'react';
import LoanCalculator from '@/components/LoanCalculator';
import { generateCalculatorMetadata } from '@/lib/seo/metadata';
import { calculatorSchemas } from '@/lib/seo/schema';

export const metadata = generateCalculatorMetadata('loan');
export const dynamic = 'force-dynamic';

export default function LoanPage() {
    const schemas = [
        calculatorSchemas.loan.software,
        calculatorSchemas.loan.breadcrumb
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Loan Calculator
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Calculate your monthly payments and total interest for any type of loan.
                    </p>
                </div>

                <LoanCalculator />

                {/* SEO Content */}
                <div className="max-w-4xl mx-auto mt-16 space-y-12">
                    {/* Introduction Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            Understanding Personal Loans and Monthly Payments
                        </h2>

                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Whether you're consolidating debt, financing a major purchase, or covering unexpected expenses,
                            understanding your loan payments is crucial for making informed financial decisions. Our loan
                            calculator helps you estimate your monthly payment, total interest, and overall cost before you commit.
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Personal loans typically range from $1,000 to $100,000 with repayment terms between 1 and 7 years.
                            Interest rates vary widely based on your credit score, income, and the lender's policies. By calculating
                            your payments upfront, you can budget effectively and avoid taking on more debt than you can handle.
                        </p>
                    </section>

                    {/* How Loan Payments Work */}
                    <section className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            How Loan Payments Are Calculated
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Personal loans use a calculation method called amortization, where each monthly payment includes both
                            principal (the amount you borrowed) and interest (the cost of borrowing). Early in your loan term,
                            a larger portion goes toward interest. As time passes, more of your payment chips away at the principal.
                        </p>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 my-6">
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Example Calculation
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                For a <strong className="text-blue-600 dark:text-blue-400">$10,000 loan</strong> at{' '}
                                <strong className="text-blue-600 dark:text-blue-400">10% APR</strong> over{' '}
                                <strong className="text-blue-600 dark:text-blue-400">3 years</strong>, your monthly payment
                                would be approximately <strong className="text-blue-600 dark:text-blue-400">$322</strong>.
                                Over the life of the loan, you'd pay about <strong className="text-blue-600 dark:text-blue-400">$1,616 in interest</strong>.
                            </p>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            The formula considers three key factors: the loan amount (principal), the annual interest rate,
                            and the loan term in months. Even small changes in interest rate or term length can significantly
                            impact your total cost.
                        </p>
                    </section>

                    {/* Factors That Affect Your Rate */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            What Determines Your Interest Rate?
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Lenders evaluate several factors when setting your interest rate. Understanding these can help you
                            secure better terms and save thousands of dollars over the life of your loan.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 my-8">
                            <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-6 border border-green-200 dark:border-green-800">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Credit Score</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    The single biggest factor. Excellent credit (740+) can qualify you for rates as low as 5-7%,
                                    while fair credit (640-699) might mean rates of 15-20% or higher.
                                </p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Income & Employment</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Stable employment and sufficient income to cover the payment comfortably signal lower risk
                                    to lenders, potentially earning you better rates.
                                </p>
                            </div>

                            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Debt-to-Income Ratio</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Lenders prefer your total monthly debt payments (including the new loan) to be less than
                                    36-43% of your gross monthly income.
                                </p>
                            </div>

                            <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Loan Term</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Shorter terms often come with lower rates but higher monthly payments. Longer terms spread
                                    payments out but cost more in total interest.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Money-Saving Tips */}
                    <section className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-8 border border-green-100 dark:border-green-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Smart Strategies to Save on Loan Costs
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Improve Your Credit Score First</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Even a 20-point increase in your credit score can lower your interest rate by 0.5-1%. Pay down
                                    credit card balances, dispute errors on your credit report, and avoid new credit inquiries for
                                    3-6 months before applying.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Shop Around and Compare Offers</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Don't accept the first offer you receive. Get quotes from at least 3-5 lenders including banks,
                                    credit unions, and online lenders. Credit unions often offer rates 1-2% lower than traditional banks.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Choose the Shortest Term You Can Afford</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    While a 5-year loan has lower monthly payments than a 3-year loan, you'll pay significantly more
                                    in interest. If you can handle slightly higher payments, opt for the shorter term to save money overall.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Make Extra Payments When Possible</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Most personal loans don't have prepayment penalties. Even one extra payment per year can shave
                                    months off your loan term and save hundreds in interest. Apply windfalls like tax refunds or bonuses
                                    directly to your loan principal.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5. Consider a Co-Signer</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    If your credit isn't great, a co-signer with excellent credit can help you qualify for better rates.
                                    Just remember that they're equally responsible for the debt if you can't pay.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            Common Questions About Personal Loans
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What's the difference between APR and interest rate?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    The interest rate is the cost of borrowing the principal amount, expressed as a percentage.
                                    APR (Annual Percentage Rate) includes the interest rate plus any fees or additional costs,
                                    giving you a more complete picture of the loan's true cost. Always compare APRs when shopping
                                    for loans, not just interest rates.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Can I pay off my personal loan early?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Most personal loans allow early payoff without penalties, but some lenders charge prepayment
                                    fees to recoup lost interest. Always check your loan agreement for prepayment terms. If there's
                                    no penalty, paying off early can save you significant money in interest charges.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    How much can I borrow with a personal loan?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Personal loan amounts typically range from $1,000 to $100,000, though some lenders go higher.
                                    The amount you qualify for depends on your income, credit score, existing debts, and the lender's
                                    policies. Most lenders want your monthly payment to be no more than 10-15% of your gross monthly income.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What credit score do I need for a personal loan?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    While some lenders accept scores as low as 580, you'll get the best rates with a score of 720 or higher.
                                    Scores between 640-719 can still qualify but at higher rates. Below 640, you might need a co-signer or
                                    secured loan. If your score is low, consider waiting a few months to improve it before applying.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Should I get a secured or unsecured personal loan?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Unsecured loans don't require collateral but have higher interest rates. Secured loans use an asset
                                    (like a car or savings account) as collateral, offering lower rates but risking that asset if you default.
                                    Choose secured only if you're confident in your ability to repay and want to save on interest.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Related Tools Section */}
                    <section className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Explore More Financial Calculators
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Make better financial decisions with our comprehensive suite of calculators:
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                            <a
                                href="/calculators/mortgage"
                                className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                            >
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Mortgage Calculator</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Calculate home loan payments and interest</p>
                            </a>
                            <a
                                href="/calculators/house-affordability"
                                className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                            >
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">House Affordability</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Determine how much house you can afford</p>
                            </a>
                            <a
                                href="/calculators/rent-calculator"
                                className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                            >
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Rent Calculator</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Find out how much rent you can afford</p>
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
