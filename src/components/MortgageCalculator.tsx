'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import CalculatorForm from '@/components/CalculatorForm';
import EMIResultCard from '@/components/EMIResultCard';
import AmortizationTable from '@/components/AmortizationTable';
import ExportButton from '@/components/ExportButton';
import SaveScenario from '@/components/SaveScenario';
import ShareButton from '@/components/ShareButton';
import { EMIResult } from '@/lib/calc/emi';
import { LoanTypeConfig } from '@/types/loanTypes';

const ChartBreakup = dynamic(() => import('@/components/ChartBreakup'), { ssr: false });
const ChartBalance = dynamic(() => import('@/components/ChartBalance'), { ssr: false });

const MORTGAGE_CONFIG: LoanTypeConfig = {
    name: 'Mortgage',
    icon: '🏠',
    description: 'Calculate your monthly mortgage payments',
    minAmount: 50000,
    maxAmount: 5000000,
    minRate: 2.0,
    maxRate: 15.0,
    minTenure: 5,
    maxTenure: 40,
    defaultRate: 6.5
};

export default function MortgageCalculator() {
    const [result, setResult] = useState<EMIResult | null>(null);
    const [loanParams, setLoanParams] = useState({ principal: 300000, rate: 6.5, tenureMonths: 360 });

    const handleResultChange = React.useCallback((newResult: EMIResult, params: { principal: number; rate: number; tenureMonths: number }) => {
        setResult(newResult);
        setLoanParams(params);
    }, []);

    const shareData = {
        p: loanParams.principal,
        r: loanParams.rate,
        t: loanParams.tenureMonths / 12
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Inputs */}
            <div className="lg:col-span-4 space-y-6">
                <CalculatorForm
                    onResultChange={handleResultChange}
                    loanTypeConfig={MORTGAGE_CONFIG}
                    title="Mortgage Details"
                    currencySymbol="$"
                />
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-8 space-y-8">
                {result && (
                    <>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <EMIResultCard result={result} currencySymbol="$" />
                            </div>
                            <div className="flex items-start pt-2 gap-2">
                                <SaveScenario
                                    loanType="home"
                                    principal={loanParams.principal}
                                    rate={loanParams.rate}
                                    tenureMonths={loanParams.tenureMonths}
                                    result={result}
                                    currencySymbol="$"
                                />
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
                                    principal={loanParams.principal}
                                    rate={loanParams.rate}
                                    tenureMonths={loanParams.tenureMonths}
                                    currencySymbol="$"
                                />
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                <AmortizationTable schedule={result.amortization} currencySymbol="$" />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
