import React from 'react';
import MortgageCalculator from '@/components/MortgageCalculator';
import MortgageSeoContent from '@/components/MortgageSeoContent';
import { generateCalculatorMetadata } from '@/lib/seo/metadata';
import { calculatorSchemas } from '@/lib/seo/schema';

export const metadata = generateCalculatorMetadata('mortgage');
export const dynamic = 'force-dynamic';

export default function MortgagePage() {
    const schemas = [
        calculatorSchemas.mortgage.software,
        calculatorSchemas.mortgage.breadcrumb
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
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Calculate Your Mortgage with{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                                Confidence
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                            Calculate your monthly mortgage payments including principal, interest, taxes, and insurance (PITI).
                        </p>
                    </div>
                </div>

                <MortgageCalculator />

                {/* SEO Content */}
                <MortgageSeoContent />

            </div >
        </>
    );
}
