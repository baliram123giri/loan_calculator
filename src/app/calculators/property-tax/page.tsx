import React from 'react';
import { Metadata } from 'next';
import PropertyTaxCalculator from '@/components/PropertyTaxCalculator';

export const metadata: Metadata = {
    title: 'Property Tax Calculator | Loanly',
    description: 'Estimate your annual property tax bill.',
};

export const dynamic = 'force-dynamic';

export default function PropertyTaxPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Property Tax Calculator
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Estimate your property taxes based on assessed home value.
                </p>
            </div>
            <PropertyTaxCalculator />
        </div>
    );
}
