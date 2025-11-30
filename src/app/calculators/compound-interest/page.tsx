import React from 'react';
import CompoundInterestCalculator from '@/components/CompoundInterestCalculator';
import CalculatorDescription from '@/components/CalculatorDescription';
import HowItWorks from '@/components/HowItWorks';
import { generateCalculatorMetadata } from '@/lib/seo/metadata';
import { calculatorSchemas } from '@/lib/seo/schema';

export const metadata = generateCalculatorMetadata('compound-interest');
export const dynamic = 'force-dynamic';

export default function CompoundInterestPage() {
    const schemas = [
        calculatorSchemas['compound-interest'].software,
        calculatorSchemas['compound-interest'].breadcrumb
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
                        Compound Interest Calculator
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        See how your money grows with compound interest and APY.
                    </p>
                </div>

                <CompoundInterestCalculator />

                <CalculatorDescription type="compound-interest" />

                <HowItWorks type="compound-interest" />
            </div>
        </>
    );
}
