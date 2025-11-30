'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import PaymentCalculatorForm from './PaymentCalculatorForm';
import EMIResultCard from '@/components/EMIResultCard';
import AmortizationTable from '@/components/AmortizationTable';
import ExportButton from '@/components/ExportButton';
import ShareButton from '@/components/ShareButton';
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

    const handleResultChange = React.useCallback((newResult: PaymentResult, params: any) => {
        setResult(newResult);
        setCalcParams(params);
    }, []);

    const shareData = {
        p: calcParams.principal,
        r: calcParams.rate,
        t: calcParams.tenureMonths / 12,
        m: calcParams.mode === 'fixed-payment' ? calcParams.monthlyPayment : undefined
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Inputs */}
            <div className="lg:col-span-4 space-y-6">
                <PaymentCalculatorForm
                    onResultChange={handleResultChange}
                    currencySymbol="$"
                    persistenceKey="payment_calculator_state"
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
                            <div className="flex items-start pt-2 gap-2">
                                <ShareButton data={shareData} />
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 h-80">
                                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Total Payment Breakup</h3>
                                <ChartBreakup
                                    principal={result.totalPayment - result.totalInterest}
                                    interest={result.totalInterest}
                                />
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 h-80">
                                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Balance Over Time</h3>
                                <ChartBalance data={result.amortization} />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <h3 className="text-lg font-bold">Amortization Schedule</h3>
                                <ExportButton
                                    result={result}
                                    currencySymbol="$"
                                />
                            </div>
                            <AmortizationTable
                                schedule={result.amortization}
                                currencySymbol="$"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
