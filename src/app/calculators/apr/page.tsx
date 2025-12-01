import React from 'react';
import APRCalculator from '@/components/APRCalculator';
import { generateCalculatorMetadata } from '@/lib/seo/metadata';
import { calculatorSchemas } from '@/lib/seo/schema';

export const metadata = generateCalculatorMetadata('apr');
export const dynamic = 'force-dynamic';

export default function APRCalculatorPage() {
    const schemas = [
        calculatorSchemas.apr.software,
        calculatorSchemas.apr.breadcrumb
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
                        APR Calculator
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Calculate the true cost of your loan by factoring in interest rates, fees, and closing costs.
                    </p>
                </div>

                <APRCalculator />

                {/* SEO Content */}
                <div className="max-w-4xl mx-auto mt-16 space-y-12">
                    {/* Introduction Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            What is Annual Percentage Rate (APR)?
                        </h2>

                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            When you're shopping for a loan—whether it's a mortgage, personal loan, or auto loan—the interest rate
                            doesn't tell the whole story. The Annual Percentage Rate (APR) is a broader measure of the cost of
                            borrowing money. It reflects not just the interest rate, but also the points, broker fees, and other
                            charges that you have to pay to get the loan.
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Think of the interest rate as the "sticker price" of borrowing money, while the APR is the "out-the-door price."
                            Because it includes these extra costs, the APR is usually higher than your interest rate. It is the
                            single best tool for comparing loan offers from different lenders because it levels the playing field,
                            showing you the true cost of each option.
                        </p>
                    </section>

                    {/* APR vs Interest Rate */}
                    <section className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            APR vs. Interest Rate: The Key Differences
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            It's easy to confuse these two numbers, but understanding the difference can save you thousands of dollars.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 my-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3">Interest Rate</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                    The cost of borrowing the principal amount.
                                </p>
                                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
                                    <li>Determines your monthly principal & interest payment</li>
                                    <li>Does not include fees</li>
                                    <li>Usually lower than APR</li>
                                </ul>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3">APR (Annual Percentage Rate)</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                    The total cost of the loan expressed as a yearly rate.
                                </p>
                                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
                                    <li>Includes interest rate + fees</li>
                                    <li>Best for comparing total loan costs</li>
                                    <li>Does not affect monthly payment directly</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mt-6">
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Real-World Example
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                You borrow <strong>$200,000</strong> with a <strong>5% interest rate</strong>.
                                <br /><br />
                                <strong>Scenario A:</strong> No fees. <br />
                                APR = <strong>5.0%</strong>.
                                <br /><br />
                                <strong>Scenario B:</strong> Lender charges $4,000 in origination fees. <br />
                                You still pay 5% interest on the $200,000, but because you paid $4,000 upfront, the effective cost of the loan is higher. <br />
                                APR ≈ <strong>5.18%</strong>.
                            </p>
                        </div>
                    </section>

                    {/* Why APR Matters */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Why You Should Always Check the APR
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Lenders sometimes advertise incredibly low interest rates to attract customers, but then make up for it
                            by charging high upfront fees. If you only look at the interest rate, you might think you're getting a
                            great deal when you're actually paying more overall.
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            By checking the APR, you can spot these "hidden" costs. If the APR is significantly higher than the
                            interest rate, it means the loan has high fees. If they are close, the fees are low.
                        </p>

                        <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800 my-8">
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                                Important Note on Short-Term Loans
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                APR assumes you will keep the loan for the full term (e.g., 30 years). If you plan to sell or refinance
                                in just a few years, a loan with a lower interest rate but higher fees (and thus higher APR) might actually
                                be <em>more</em> expensive for you than a higher-rate, no-fee loan. In short-term scenarios, the "break-even point"
                                matters more than the APR.
                            </p>
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
                                    Does APR affect my monthly payment?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Not directly. Your monthly payment is calculated based on the <strong>interest rate</strong> and the loan amount.
                                    The APR is a cost indicator that tells you the <em>effective</em> rate you are paying when fees are included.
                                    However, if you roll the fees into your loan balance (financing the closing costs), your monthly payment will increase.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Is a lower APR always better?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Generally, yes. A lower APR means lower overall costs over the life of the loan. However, as noted above,
                                    if you plan to move or refinance soon, you might prefer a loan with fewer upfront costs (even if it has a slightly higher rate/APR)
                                    to keep your cash on hand.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What fees are included in APR?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Common fees included in APR are origination fees, discount points, mortgage broker fees, processing fees,
                                    and underwriting fees. Some costs, like title insurance, appraisal fees, and credit report fees, are often
                                    <em>excluded</em> from APR, though this can vary by loan type and lender.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Why is the APR higher than the interest rate?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    The APR is higher because it adds the cost of upfront fees to the interest rate. It spreads these fees
                                    out over the loan term to show you an annual rate. If a loan had absolutely zero fees, the APR and
                                    interest rate would be identical.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Related Tools Section */}
                    <section className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Related Financial Tools
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Explore more calculators to help you make smart financial decisions:
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                            <a
                                href="/calculators/loan"
                                className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                            >
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Loan Calculator</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Calculate basic monthly payments</p>
                            </a>
                            <a
                                href="/calculators/mortgage"
                                className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                            >
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Mortgage Calculator</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Estimate home loan payments</p>
                            </a>
                            <a
                                href="/calculators/refinance-calculator"
                                className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                            >
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Refinance Calculator</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">See if you should refinance</p>
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
