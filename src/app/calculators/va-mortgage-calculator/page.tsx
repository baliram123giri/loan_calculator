import React from 'react';
import type { Metadata } from 'next';
import VAMortgageCalculator from '@/components/VAMortgageCalculator';
import CalculatorDescription from '@/components/CalculatorDescription';

export const metadata: Metadata = {
    title: 'VA Mortgage Calculator | Calculate VA Loan Payments & Funding Fee',
    description: 'Free VA Mortgage Calculator. Estimate your monthly payments for VA loans, including the VA Funding Fee, property taxes, and insurance. Supports 0% down payment.',
    keywords: 'VA loan calculator, VA mortgage calculator, VA funding fee calculator, veterans home loan, 0 down mortgage, military housing loan',
    openGraph: {
        title: 'VA Mortgage Calculator | Accurate Payments & Funding Fee',
        description: 'Calculate your VA loan payments instantly. Includes VA Funding Fee logic, disability exemptions, and 0% down payment options.',
        type: 'website',
    }
};

export default function VAMortgageCalculatorPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    VA Mortgage Calculator
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Estimate your monthly payments for a VA loan, including the specific VA Funding Fee and tax implications.
                </p>
            </div>

            <VAMortgageCalculator />

            <div className="mt-16">
                <CalculatorDescription type="va-mortgage" />
            </div>
        </div>
    );
}
