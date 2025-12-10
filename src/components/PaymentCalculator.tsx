'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import PaymentCalculatorForm from './PaymentCalculatorForm';
import EMIResultCard from '@/components/EMIResultCard';
import AmortizationTable from '@/components/AmortizationTable';

import { PaymentResult } from '@/lib/calc/paymentCalc';
import { LoanTypeConfig } from '@/types/loanTypes';

const ChartBreakup = dynamic(() => import('@/components/ChartBreakup'), { ssr: false });
const ChartBalance = dynamic(() => import('@/components/ChartBalance'), { ssr: false });

const PAYMENT_CONFIG: LoanTypeConfig = {
    name: 'Payment Calculator',
    icon: '💳',
    description: 'Calculate monthly payments or loan term',
    minAmount: 1000,
    maxAmount: 10000000,
    minRate: 0.1,
    maxRate: 30,
    minTenure: 1,
    maxTenure: 50,
    defaultRate: 5.0
};

export default function PaymentCalculator() {
    const [result, setResult] = useState<PaymentResult | null>(null);
    const [calcParams, setCalcParams] = useState({
        principal: 20000,
        rate: 5.0,
        tenureMonths: 60,
        monthlyPayment: 400,
        mode: 'fixed-term'
    });

    const [resetKey, setResetKey] = useState(0);

    const handleResultChange = React.useCallback((newResult: PaymentResult, params: any) => {
        setResult(newResult);
        setCalcParams(params);
    }, []);

    const resetToDefaults = () => {
        // Clear any saved state in localStorage
        localStorage.removeItem('payment_calculator_state');

        // Increment reset key to force form remount with defaults
        setResetKey(prev => prev + 1);

        // Reset result to null to clear any displayed results
        setResult(null);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Inputs */}
            <div className="lg:col-span-4 space-y-6">
                <PaymentCalculatorForm
                    key={resetKey}
                    onResultChange={handleResultChange}
                    currencySymbol="$"
                    persistenceKey="payment_calculator_state"
                    onReset={resetToDefaults}
                />
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-8 space-y-8">
                {result && (
                    <>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <EMIResultCard
                                    result={result}
                                    currencySymbol="$"
                                    //@ts-ignore
                                    title={calcParams.mode === 'fixed-term' ? "Monthly Payment" : "Required Term"}
                                />
                                {calcParams.mode === 'fixed-payment' && (
                                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            With a monthly payment of <strong>${calcParams.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>,
                                            you will pay off this loan in <strong>{(result.calculatedTermMonths! / 12).toFixed(2)} years</strong> (or <strong>{result.calculatedTermMonths!.toFixed(2)} months</strong>).
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 h-80">
                                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Total Payment Breakup</h3>
                                <ChartBreakup
                                    data={[
                                        { name: 'Principal', value: result.totalPayment - result.totalInterest },
                                        { name: 'Interest', value: result.totalInterest }
                                    ]}
                                />
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 h-80">
                                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Balance Over Time</h3>
                                <ChartBalance data={result.amortization} />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden mt-8">
                            <AmortizationTable
                                schedule={result.amortization}
                                currencySymbol="$"
                                calculatorName="Payment Calculator"
                                loanDetails={{
                                    loanAmount: calcParams.principal,
                                    interestRate: calcParams.rate,
                                    loanTerm: calcParams.mode === 'fixed-term' ? calcParams.tenureMonths : result.calculatedTermMonths!,
                                    monthlyPayment: calcParams.mode === 'fixed-term' ? result.emi : calcParams.monthlyPayment,
                                    totalInterest: result.totalInterest,
                                    totalCost: result.totalPayment
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
