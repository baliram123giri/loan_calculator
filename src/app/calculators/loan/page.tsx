import React from 'react';
import LoanCalculator from '@/components/LoanCalculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Loan Calculator | Loanly',
    description: 'Calculate monthly payments for personal loans, car loans, and more.',
};

export const dynamic = 'force-dynamic';

export default function LoanPage() {
    return (
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
        </div>
    );
}
