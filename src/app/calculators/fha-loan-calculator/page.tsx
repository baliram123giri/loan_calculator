import React from 'react';
import type { Metadata } from 'next';
import FHALoanCalculator from '@/components/FHALoanCalculator';
import CalculatorDescription from '@/components/CalculatorDescription';

export const metadata: Metadata = {
    title: 'FHA Loan Calculator | Calculate FHA Mortgage Payment with MIP',
    description: 'Free FHA Loan Calculator with Upfront and Annual MIP. Estimate your monthly FHA mortgage payments, including taxes, insurance, and HOA fees.',
    keywords: 'FHA loan calculator, FHA mortgage calculator, FHA payment calculator, FHA MIP calculator, FHA loan requirements, FHA down payment',
    openGraph: {
        title: 'FHA Loan Calculator | Accurate MIP & Payment Estimates',
        description: 'Calculate your FHA loan payments instantly. Includes Upfront MIP, Annual MIP, taxes, and insurance estimates.',
        type: 'website',
    }
};

export default function FHALoanCalculatorPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    FHA Loan Calculator
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Estimate your monthly payments for an FHA loan, including Upfront and Annual Mortgage Insurance Premiums (MIP).
                </p>
            </div>

            <FHALoanCalculator />

            <div className="mt-16">
                <CalculatorDescription type="fha-loan" />
            </div>
        </div>
    );
}
