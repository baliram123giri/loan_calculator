import React from 'react';
import PaymentCalculator from '@/components/PaymentCalculator';
import CalculatorDescription from '@/components/CalculatorDescription';
import HowItWorks from '@/components/HowItWorks';

export const metadata = {
    title: 'Payment Calculator - Calculate Monthly Payments or Loan Term',
    description: 'Free payment calculator to determine monthly payments for a fixed term or calculate how long it will take to pay off a loan with fixed monthly payments.',
};

export const dynamic = 'force-dynamic';

export default function PaymentPage() {
    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Payment Calculator
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Calculate monthly payments or determine loan term with advanced features like prepayments and rate changes.
                    </p>
                </div>

                <PaymentCalculator />

                <CalculatorDescription type="loan" />

                <HowItWorks type="loan" />
            </div>
        </>
    );
}
