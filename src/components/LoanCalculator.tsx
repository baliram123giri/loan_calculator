'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import CalculatorForm from '@/components/CalculatorForm';
import EMIResultCard from '@/components/EMIResultCard';
import AmortizationTable from '@/components/AmortizationTable';
import SaveScenario from '@/components/SaveScenario';
import ShareButton from '@/components/ShareButton';
import { EMIResult } from '@/lib/calc/emi';
import { LoanTypeConfig } from '@/types/loanTypes';

const ChartBreakup = dynamic(() => import('@/components/ChartBreakup'), { ssr: false });
const ChartBalance = dynamic(() => import('@/components/ChartBalance'), { ssr: false });

const PERSONAL_LOAN_CONFIG: LoanTypeConfig = {
    name: 'Personal Loan',
    icon: '💰',
    description: 'Calculate monthly payments for personal loans',
    minAmount: 1000,
    maxAmount: 100000,
    minRate: 5.0,
    maxRate: 36.0,
    minTenure: 1,
    maxTenure: 7,
    defaultRate: 10.0
};

export default function LoanCalculator() {
    const [result, setResult] = useState<EMIResult | null>(null);
    const [loanParams, setLoanParams] = useState({ principal: 10000, rate: 10.0, tenureMonths: 36 });
    const [loadScenario, setLoadScenario] = useState<any>(null);
    const [resetKey, setResetKey] = useState(0);

    const resetToDefaults = () => {
        // Clear any saved state in localStorage
        localStorage.removeItem('personal_loan_calculator_state');

        // Increment reset key to force form remount with defaults
        setResetKey(prev => prev + 1);

        // Reset result to null to clear any displayed results
        setResult(null);
    };

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
                    key={resetKey}
                    onResultChange={handleResultChange}
                    loanTypeConfig={PERSONAL_LOAN_CONFIG}
                    currencySymbol="$"
                    loadScenario={loadScenario}
                    onScenarioLoaded={() => setLoadScenario(null)}
                    persistenceKey="personal_loan_calculator_state"
                    onReset={resetToDefaults}
                    manualCalculation={true}
                    calculateButtonLabel="Calculate Loan"
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
                                    loanType="personal"
                                    principal={loanParams.principal}
                                    rate={loanParams.rate}
                                    tenureMonths={loanParams.tenureMonths}
                                    result={result}
                                    currencySymbol="$"
                                    onLoad={(scenario) => setLoadScenario(scenario)}
                                />
                                <ShareButton data={shareData} />
                            </div>
                        </div>

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
                                calculatorName="Personal Loan"
                                loanDetails={{
                                    loanAmount: loanParams.principal,
                                    interestRate: loanParams.rate,
                                    loanTerm: loanParams.tenureMonths,
                                    monthlyPayment: result.emi,
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
