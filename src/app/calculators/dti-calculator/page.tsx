import React from 'react';
import DTICalculator from '@/components/DTICalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Home, DollarSign, Calculator } from 'lucide-react';
import { generateCalculatorMetadata } from '@/lib/seo/metadata';
import DTISeoContent from '@/components/DTISeoContent';
import { calculatorSchemas } from '@/lib/seo/schema';

export const metadata = generateCalculatorMetadata('dti-calculator');
export const dynamic = 'force-dynamic';

export default function DTICalculatorPage() {
    const schemas = [
        calculatorSchemas['dti-calculator'].software,
        calculatorSchemas['dti-calculator'].breadcrumb
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

            <div className="container mx-auto py-12 px-4">
                <div className="mb-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Calculate Your DTI with{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                                Clarity
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                            Calculate your DTI ratio to understand your financial health and loan qualification status.
                        </p>
                    </div>
                </div>

                <DTICalculator />

                {/* SEO Content */}
                <DTISeoContent />

                {/* Related Tools Section */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                    <RelatedCalculators
                        links={[
                            {
                                href: "/calculators/house-affordability",
                                title: "House Affordability",
                                description: "See how much house you can afford",
                                icon: Home,
                                iconColorClass: "text-blue-600",
                                iconBgClass: "bg-blue-100",
                                hoverBgClass: "group-hover:bg-blue-600"
                            },
                            {
                                href: "/calculators/loan",
                                title: "Loan Calculator",
                                description: "Calculate loan payments and interest",
                                icon: DollarSign,
                                iconColorClass: "text-green-600",
                                iconBgClass: "bg-green-100",
                                hoverBgClass: "group-hover:bg-green-600"
                            },
                            {
                                href: "/calculators/mortgage",
                                title: "Mortgage Calculator",
                                description: "Estimate monthly mortgage payments",
                                icon: Calculator,
                                iconColorClass: "text-purple-600",
                                iconBgClass: "bg-purple-100",
                                hoverBgClass: "group-hover:bg-purple-600"
                            }
                        ]}
                        title="Related Financial Calculators"
                    />
                </div>
            </div>
        </>
    );
}
