import React from 'react';
import PaymentCalculator from '@/components/PaymentCalculator';

export const metadata = {
    title: 'Payment Calculator - Calculate Monthly Payments or Loan Term',
    description: 'Calculate monthly loan payments for a fixed term or determine how long it will take to pay off a loan with fixed monthly payments. Includes prepayment and rate change options.',
};

export const dynamic = 'force-dynamic';

export default function PaymentPage() {
    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Payment Calculator
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Calculate monthly payments or determine loan term with advanced features like prepayments and rate changes.
                    </p>
                </div>

                <PaymentCalculator />

                {/* SEO Content */}
                <div className="max-w-4xl mx-auto mt-16 space-y-12">
                    {/* Introduction Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            Understanding Loan Payments and Payoff Terms
                        </h2>

                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Whether you're planning a new loan or trying to pay off existing debt faster, understanding the
                            relationship between payment amount, interest rate, and loan term is crucial. Our payment calculator
                            works both ways: calculate your monthly payment for a specific loan term, or determine how long it
                            will take to pay off a loan with a fixed monthly payment.
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            This flexibility is especially valuable when you're trying to decide between different loan options
                            or planning to make extra payments. Small changes in your monthly payment can dramatically affect
                            how quickly you become debt-free and how much interest you'll pay over time.
                        </p>
                    </section>

                    {/* Two Calculation Modes */}
                    <section className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-8 border border-purple-100 dark:border-purple-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Two Ways to Calculate: Payment or Term
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Our calculator offers two distinct modes to match your planning needs. Understanding when to use
                            each mode helps you make better financial decisions.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 my-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-3">Calculate Payment</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                    <strong>When to use:</strong> You know how much you want to borrow and how long you want to
                                    take to pay it back. The calculator tells you what your monthly payment will be.
                                </p>
                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Example:</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        "I want to borrow $20,000 at 8% interest for 5 years. What will my monthly payment be?"<br />
                                        <strong className="text-purple-600 dark:text-purple-400">Answer: $405/month</strong>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-3">Calculate Term</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                    <strong>When to use:</strong> You know how much you can afford to pay each month and want
                                    to know how long it will take to pay off the loan.
                                </p>
                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Example:</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        "I owe $20,000 at 8% interest. If I pay $500/month, how long until I'm debt-free?"<br />
                                        <strong className="text-purple-600 dark:text-purple-400">Answer: 3.7 years (45 months)</strong>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mt-6">
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Pro Tip
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Use both modes together! First, calculate the minimum payment for your desired term. Then, use
                                the term calculator to see how much faster you could pay off the loan by adding just $50-100
                                more per month. You'll often find that a small increase in payment dramatically reduces your
                                payoff time and total interest.
                            </p>
                        </div>
                    </section>

                    {/* Impact of Extra Payments */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            The Power of Extra Payments
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Making extra payments is one of the most effective ways to save money on interest and become debt-free
                            faster. Even small additional payments can have a dramatic impact over time because they go directly
                            toward reducing your principal balance.
                        </p>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 my-6 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Real-World Example
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                <strong className="text-blue-600 dark:text-blue-400">Scenario:</strong> $25,000 car loan at 6% for 5 years
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Minimum Payment Only</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        • Monthly payment: <strong>$483</strong><br />
                                        • Total interest: <strong>$3,982</strong><br />
                                        • Payoff time: <strong>60 months</strong>
                                    </p>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-2 border-green-500">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Add $100/Month Extra</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        • Monthly payment: <strong>$583</strong><br />
                                        • Total interest: <strong>$2,847</strong><br />
                                        • Payoff time: <strong>46 months</strong><br />
                                        <strong className="text-green-600 dark:text-green-400">Savings: $1,135 + 14 months!</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Smart Payment Strategies */}
                    <section className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-8 border border-green-100 dark:border-green-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Smart Strategies to Pay Off Loans Faster
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Round Up Your Payments</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    If your payment is $387, round up to $400. This simple trick adds $13 extra per month ($156/year)
                                    without feeling like a sacrifice. Over a 5-year loan, that's $780 in extra principal payments,
                                    potentially saving you months of payments and hundreds in interest.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Make Bi-Weekly Payments</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Instead of one monthly payment, pay half every two weeks. You'll make 26 half-payments per year
                                    (equivalent to 13 full payments instead of 12). This extra payment goes entirely to principal,
                                    significantly reducing your loan term and interest costs.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Apply Windfalls to Principal</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Tax refunds, bonuses, birthday money, or side gig earnings can make a huge dent in your loan.
                                    A single $1,000 extra payment on a $20,000 loan at 8% could save you $200-300 in interest and
                                    shave 2-3 months off your payoff time.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Refinance to a Lower Rate</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    If interest rates have dropped or your credit has improved, refinancing could lower your rate by
                                    1-3%. Keep the same payment amount but apply the savings to principal, or keep the same term and
                                    enjoy lower payments. Either way, you save money.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5. Prioritize High-Interest Debt</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    If you have multiple loans, focus extra payments on the highest interest rate first (avalanche method)
                                    to minimize total interest. Or pay off the smallest balance first (snowball method) for psychological
                                    wins. Both work—choose what motivates you.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            Payment Calculator Questions
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    How do I calculate my monthly loan payment?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Monthly payments are calculated using the loan amount (principal), annual interest rate, and
                                    loan term in months. The formula ensures each payment includes both interest on the remaining
                                    balance and principal reduction. Early payments are mostly interest; later payments are mostly
                                    principal. Our calculator does this math instantly.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What happens if I pay more than the minimum?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Extra payments go directly to your principal balance (unless you specify otherwise). This reduces
                                    the amount you owe, which means less interest accrues each month. The result: you pay off the loan
                                    faster and save money. Most loans allow extra payments without penalty, but always verify with
                                    your lender.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Should I pay off my loan early or invest the extra money?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    It depends on your loan's interest rate versus potential investment returns. If your loan rate is
                                    6% and you can earn 8% in investments, investing might make more sense mathematically. However,
                                    paying off debt is guaranteed savings and provides peace of mind. Consider your risk tolerance,
                                    emergency fund status, and overall financial goals.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    How much faster will I pay off my loan with extra payments?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    It varies based on your loan amount, rate, and extra payment size. As a rule of thumb, adding 10%
                                    to your payment (e.g., $50 extra on a $500 payment) can reduce a 5-year loan by 6-8 months. Adding
                                    20% could cut it by 12-15 months. Use our calculator's term mode to see your exact payoff timeline.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Can I change my payment amount during the loan term?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Your required minimum payment is fixed (unless you refinance), but you can always pay more. You
                                    can't pay less than the minimum without risking late fees and credit damage. If you're struggling
                                    with payments, contact your lender immediately—they may offer hardship programs, payment deferrals,
                                    or loan modification options.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Related Tools Section */}
                    <section className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            More Loan Planning Tools
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Plan your complete debt strategy with these calculators:
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                            <a
                                href="/calculators/loan"
                                className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                            >
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Loan Calculator</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Full amortization schedule and breakdowns</p>
                            </a>
                            <a
                                href="/calculators/simple-interest"
                                className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                            >
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Simple Interest</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Calculate interest on short-term loans</p>
                            </a>
                            <a
                                href="/calculators/compound-interest"
                                className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                            >
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Compound Interest</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">See how savings grow over time</p>
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
