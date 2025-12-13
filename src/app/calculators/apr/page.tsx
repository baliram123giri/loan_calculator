import React from 'react';
import APRCalculator from '@/components/APRCalculator';
import APRSeoContent from '@/components/APRSeoContent';
import { generateCalculatorMetadata } from '@/lib/seo/metadata';
import { calculatorSchemas } from '@/lib/seo/schema';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Calculator, Home, RefreshCw } from 'lucide-react';

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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Calculate Your APR with{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                                Precision
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                            Calculate the true cost of your loan by factoring in interest rates, fees, and closing costs.
                        </p>
                    </div>
                </div>

                <APRCalculator />
                <APRSeoContent />
            </main>
        </>
    );
}
