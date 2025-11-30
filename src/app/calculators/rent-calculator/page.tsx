import React from 'react';
import RentCalculator from '@/components/RentCalculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Rent Calculator – How Much Rent Can I Afford?',
    description: 'Calculate your affordable rent based on your annual income and debts. Use our 30% rule calculator to find your ideal rental budget.',
    keywords: ['rent calculator', 'how much rent can i afford', 'rent affordability', 'income to rent ratio', '30 percent rule'],
};

export default function RentCalculatorPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <RentCalculator />

            <div className="max-w-4xl mx-auto mt-16 prose dark:prose-invert">
                <h2>How Much Rent Can You Afford?</h2>
                <p>
                    Determining how much rent you can afford is a crucial step in financial planning.
                    Most financial experts recommend the <strong>30% Rule</strong>, which suggests that you should spend no more than 30% of your gross monthly income on rent.
                </p>

                <h3>The 30% Rule</h3>
                <p>
                    This is the standard benchmark used by landlords and lenders.
                    For example, if you earn $60,000 per year ($5,000 per month), your maximum rent should be around $1,500.
                </p>

                <h3>Considering Debts (DTI)</h3>
                <p>
                    While the 30% rule is a good starting point, it doesn't account for your other financial obligations.
                    If you have significant monthly debts (student loans, car payments, credit cards), you might need to lower your rental budget.
                    Landlords often look for a Debt-to-Income (DTI) ratio of under 43%, including your potential rent.
                </p>

                <h3>40x Rent Rule</h3>
                <p>
                    In competitive markets like New York City, landlords often require your annual income to be at least 40 times the monthly rent.
                    This is mathematically similar to the 30% rule (1/40 = 2.5%, and 30% of income / 12 months is roughly aligned).
                </p>
            </div>
        </div>
    );
}
