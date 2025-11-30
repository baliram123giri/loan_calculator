import React from 'react';
import LoanCalculator from '@/components/LoanCalculator';
import CalculatorDescription from '@/components/CalculatorDescription';
import HowItWorks from '@/components/HowItWorks';
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
                        Estimate your monthly payments for any type of loan.
                    </p>
                </div>

                <LoanCalculator />

                <CalculatorDescription type="loan" />

                <HowItWorks type="loan" />
            </div>
        </>
    );
}
