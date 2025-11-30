import React from 'react';
import { Metadata } from 'next';
import SimpleInterestCalculator from '@/components/SimpleInterestCalculator';

export const metadata: Metadata = {
    title: 'Simple Interest Calculator | Loanly',
    description: 'Calculate simple interest with our free online calculator.',
};

export const dynamic = 'force-dynamic';

export default function SimpleInterestPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Simple Interest Calculator
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Calculate simple interest accurately with yearly breakdown.
                </p>
            </div>
            <SimpleInterestCalculator />
        </div>
    );
}
