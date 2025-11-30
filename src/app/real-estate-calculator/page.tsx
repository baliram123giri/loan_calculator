import React from 'react';
import type { Metadata } from 'next';
import RealEstateCalculator from '@/components/RealEstateCalculator';

export const metadata: Metadata = {
    title: 'Free Real Estate Investment Calculator (USA) | Rental Property Analysis',
    description: 'Calculate Cash on Cash Return, Cap Rate, and Cash Flow for US rental properties. Best free tool for real estate investors to analyze deals.',
    keywords: 'Real Estate Calculator, Rental Property Calculator, Cash on Cash Return, Cap Rate Calculator, BRRRR Calculator, US Real Estate Investment',
    openGraph: {
        title: 'Free Real Estate Investment Calculator (USA)',
        description: 'Analyze rental properties with our advanced Real Estate Investment Calculator. Get Cash Flow, Cap Rate, and ROI projections instantly.',
        type: 'website',
    },
};

export default function RealEstateCalculatorPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Real Estate Investment Calculator
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Analyze rental property deals with precision. Calculate Cash Flow, Cap Rate, and Cash on Cash Return
                    to make smarter investment decisions in the US market.
                </p>
            </div>

            <RealEstateCalculator />

            <div className="mt-16 prose dark:prose-invert max-w-none">
                <h2>How to Use This Real Estate Calculator</h2>
                <p>
                    This calculator is designed for US real estate investors to evaluate rental properties.
                    It takes into account all major expenses, including mortgage payments, property taxes,
                    insurance, and maintenance, to provide a clear picture of your potential returns.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <div>
                        <h3>Key Metrics Explained</h3>
                        <ul>
                            <li>
                                <strong>Cash Flow:</strong> The net income from the property after all expenses and debt service.
                                Positive cash flow is essential for a sustainable investment.
                            </li>
                            <li>
                                <strong>Cap Rate (Capitalization Rate):</strong> A measure of the property's natural rate of return,
                                independent of financing. Calculated as NOI / Purchase Price.
                            </li>
                            <li>
                                <strong>Cash on Cash Return (CoC):</strong> The annual return on the actual cash you invested
                                (Down Payment + Closing Costs + Rehab). This is often considered the most important metric for ROI.
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3>US Market Specifics</h3>
                        <ul>
                            <li>
                                <strong>Depreciation:</strong> We calculate tax depreciation based on the standard 27.5-year
                                schedule for residential rental properties in the USA.
                            </li>
                            <li>
                                <strong>Closing Costs:</strong> Typically range from 2% to 5% of the purchase price in the US.
                            </li>
                            <li>
                                <strong>Property Taxes:</strong> Vary significantly by state and county. Always check local rates.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
