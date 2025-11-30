import React from 'react';
import { Metadata } from 'next';
import CompoundInterestCalculator from '@/components/CompoundInterestCalculator';

export const metadata: Metadata = {
    title: 'Compound Interest Calculator | Loanly',
    description: 'Calculate compound interest with daily, monthly, or yearly compounding.',
};

export const dynamic = 'force-dynamic';

export default function CompoundInterestPage() {
    return (
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
        </div>
    );
}
