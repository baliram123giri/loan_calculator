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
                        Should you refinance your mortgage? Calculate monthly savings, break-even point, and lifetime interest savings.
                    </p>
                </div>

                <RefinanceCalculator />

                Access cash for home improvements or debt consolidation by refinancing for more than you owe.
            </p>
        </div >
                        </div >
                    </section >

        {/* FAQ Section */ }
        < section className = "prose dark:prose-invert max-w-none" >
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
                    </section >
                </div >
            </div >
        </>
    );
}
