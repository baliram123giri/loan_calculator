import React from 'react';
import RefinanceCalculator from '@/components/RefinanceCalculator';
import { generateCalculatorMetadata } from '@/lib/seo/metadata';
import { calculatorSchemas } from '@/lib/seo/schema';

export const metadata = generateCalculatorMetadata('refinance-calculator');
export const dynamic = 'force-dynamic';

export default function RefinanceCalculatorPage() {
    const schemas = [
        calculatorSchemas['refinance-calculator'].software,
        calculatorSchemas['refinance-calculator'].breadcrumb
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
                        Refinance Calculator
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        import React from 'react';
                        import RefinanceCalculator from '@/components/RefinanceCalculator';
                        import {generateCalculatorMetadata} from '@/lib/seo/metadata';
                        import {calculatorSchemas} from '@/lib/seo/schema';

                        export const metadata = generateCalculatorMetadata('refinance-calculator');
                        export const dynamic = 'force-dynamic';

                        export default function RefinanceCalculatorPage() {
    const schemas = [
                        calculatorSchemas['refinance-calculator'].software,
                        calculatorSchemas['refinance-calculator'].breadcrumb
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
                                        Refinance Calculator
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Should you refinance your mortgage? Calculate monthly savings, break-even point, and lifetime interest savings.
                                    </p>
                                </div>

                                <RefinanceCalculator />

                                {/* SEO Content */}
                                <div className="max-w-4xl mx-auto mt-16 space-y-12">
                                    {/* Introduction Section */}
                                    <section className="prose dark:prose-invert max-w-none">
                                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                            Is Refinancing Right for You?
                                        </h2>

                                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                            Refinancing your mortgage can be a smart financial move if it lowers your monthly payment, reduces your loan term,
                                            or helps you tap into your home's equity. However, it's not free. Closing costs can eat into your savings.
                                        </p>

                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            Our <strong>Refinance Calculator</strong> helps you do the math. By comparing your current loan to a new loan offer,
                                            you can see exactly how much you'll save each month and over the life of the loan. Most importantly, it calculates your
                                            <strong>Break-Even Point</strong>—the time it takes for your monthly savings to cover the cost of refinancing.
                                        </p>
                                    </section>

                                    {/* When to Refinance */}
                                    <section className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                            When Does Refinancing Make Sense?
                                        </h3>

                                        <div className="grid md:grid-cols-2 gap-6 my-6">
                                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Lower Interest Rate</h4>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    If market rates have dropped at least 0.5% to 1% below your current rate, refinancing could save you thousands.
                                                </p>
                                            </div>

                                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Shorten Loan Term</h4>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    Switching from a 30-year to a 15-year mortgage increases monthly payments but drastically reduces total interest paid.
                                                </p>
                                            </div>

                                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Eliminate PMI</h4>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    If your home value has increased and you have 20% equity, refinancing can remove Private Mortgage Insurance.
                                                </p>
                                            </div>

                                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Cash Out Equity</h4>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    Access cash for home improvements or debt consolidation by refinancing for more than you owe.
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* FAQ Section */}
                                    <section className="prose dark:prose-invert max-w-none">
                                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                                            Common Questions
                                        </h2>

                                        <div className="space-y-8">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                                    What are closing costs?
                                                </h3>
                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                    Closing costs are fees paid to process your loan, typically <strong>2% to 5%</strong> of the loan amount.
                                                    They include appraisal fees, title insurance, origination fees, and more. You can often roll these into your new loan,
                                                    but this increases your loan balance and interest paid.
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                                    What is the Break-Even Point?
                                                </h3>
                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                    This is the number of months it takes for your monthly savings to equal your closing costs.
                                                    For example, if refinancing saves you $200/month and costs $4,000, your break-even point is 20 months.
                                                    If you plan to move before then, refinancing may not be worth it.
                                                </p>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </>
                        );
}
