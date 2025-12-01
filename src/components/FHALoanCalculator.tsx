'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { calculateFHA, FHAInput, FHAResult } from '@/lib/calc/fha';
import EMIResultCard from '@/components/EMIResultCard';
import AmortizationTable from '@/components/AmortizationTable';
import ExportButton from '@/components/ExportButton';
import ShareButton from '@/components/ShareButton';
import { LoanTypeConfig } from '@/types/loanTypes';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

const ChartBreakup = dynamic(() => import('@/components/ChartBreakup'), { ssr: false });
const ChartBalance = dynamic(() => import('@/components/ChartBalance'), { ssr: false });

const FHA_CONFIG: LoanTypeConfig = {
    name: 'FHA Loan',
    icon: '🏡',
    description: 'Calculate FHA loan payments with MIP',
    minAmount: 50000,
    maxAmount: 5000000,
    minRate: 2.0,
    maxRate: 15.0,
    minTenure: 5,
    maxTenure: 40,
    defaultRate: 6.5
};

export default function FHALoanCalculator() {
    const [result, setResult] = useState<FHAResult | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Default State
    const [homePrice, setHomePrice] = useState(300000);
    const [downPayment, setDownPayment] = useState(10500); // 3.5% default
    const [interestRate, setInterestRate] = useState(6.5);
    const [loanTermYears, setLoanTermYears] = useState(30);
    const [startDate, setStartDate] = useState(new Date());

    // Advanced State
    const [upfrontMIPRate, setUpfrontMIPRate] = useState(1.75);
    const [annualMIPRate, setAnnualMIPRate] = useState(0.55);
    const [propertyTax, setPropertyTax] = useState(300); // Monthly
    const [homeInsurance, setHomeInsurance] = useState(100); // Monthly
    const [hoaFees, setHoaFees] = useState(0); // Monthly

    const calculate = React.useCallback(() => {
        const input: FHAInput = {
            homePrice,
            downPayment,
            interestRate,
            loanTermYears,
            startDate,
            upfrontMIPRate,
            annualMIPRate,
            propertyTax,
            homeInsurance,
            hoaFees
        };
        const res = calculateFHA(input);
        setResult(res);
    }, [homePrice, downPayment, interestRate, loanTermYears, startDate, upfrontMIPRate, annualMIPRate, propertyTax, homeInsurance, hoaFees]);

    useEffect(() => {
        calculate();
    }, [calculate]);

    const handleReset = () => {
        setHomePrice(300000);
        setDownPayment(10500);
        setInterestRate(6.5);
        setLoanTermYears(30);
        setStartDate(new Date());
        setUpfrontMIPRate(1.75);
        setAnnualMIPRate(0.55);
        setPropertyTax(300);
        setHomeInsurance(100);
        setHoaFees(0);
    };

    const shareData = {
        hp: homePrice,
        dp: downPayment,
        r: interestRate,
        t: loanTermYears
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Inputs */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <span>{FHA_CONFIG.icon}</span>
                            {FHA_CONFIG.name}
                        </h2>
                        <button
                            onClick={handleReset}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Reset Calculator"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Home Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Home Price
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={homePrice}
                                    onChange={(e) => setHomePrice(Number(e.target.value))}
                                    className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Down Payment */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Down Payment ($)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={downPayment}
                                    onChange={(e) => setDownPayment(Number(e.target.value))}
                                    className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {((downPayment / homePrice) * 100).toFixed(2)}% (Min 3.5% required)
                            </p>
                        </div>

                        {/* Interest Rate */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Interest Rate (%)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* Loan Term */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Loan Term (Years)
                            </label>
                            <select
                                value={loanTermYears}
                                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                <option value={15}>15 Years</option>
                                <option value={30}>30 Years</option>
                            </select>
                        </div>

                        {/* Advanced Options Toggle */}
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors w-full justify-center py-2"
                        >
                            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                        </button>

                        {/* Advanced Options Content */}
                        {showAdvanced && (
                            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Upfront MIP (%)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={upfrontMIPRate}
                                            onChange={(e) => setUpfrontMIPRate(Number(e.target.value))}
                                            className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Annual MIP (%)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={annualMIPRate}
                                            onChange={(e) => setAnnualMIPRate(Number(e.target.value))}
                                            className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Property Tax ($/mo)</label>
                                    <input
                                        type="number"
                                        value={propertyTax}
                                        onChange={(e) => setPropertyTax(Number(e.target.value))}
                                        className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Home Insurance ($/mo)</label>
                                    <input
                                        type="number"
                                        value={homeInsurance}
                                        onChange={(e) => setHomeInsurance(Number(e.target.value))}
                                        className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">HOA Fees ($/mo)</label>
                                    <input
                                        type="number"
                                        value={hoaFees}
                                        onChange={(e) => setHoaFees(Number(e.target.value))}
                                        className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-8 space-y-8">
                {result && (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Monthly Payment</p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">${result.totalMonthlyPayment.toLocaleString()}</p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                                <p className="text-sm text-green-600 dark:text-green-400 mb-1">Total Loan Amount</p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-100">${result.totalLoanAmount.toLocaleString()}</p>
                                <p className="text-xs text-green-600/80 dark:text-green-400/80">Includes ${result.financedUpfrontMIP.toLocaleString()} Upfront MIP</p>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                                <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Total Interest</p>
                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">${result.totalInterest.toLocaleString()}</p>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800">
                                <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Total MIP Paid</p>
                                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">${result.totalMIPPaid.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <ShareButton data={shareData} />
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 h-80">
                                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Payment Breakdown</h3>
                                <ChartBreakup
                                    principal={result.monthlyPrincipalAndInterest} // Using P&I as one block for simplicity in this chart
                                    interest={result.monthlyMIP + result.monthlyTax + result.monthlyInsurance + result.monthlyHOA} // Grouping others
                                // Ideally we should update ChartBreakup to support more segments or use a different chart
                                // For now, let's stick to P&I vs "Escrow/Fees"
                                />
                                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-500">
                                    <div className="flex justify-between"><span>P&I:</span> <span>${result.monthlyPrincipalAndInterest.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span>MIP:</span> <span>${result.monthlyMIP.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span>Tax:</span> <span>${result.monthlyTax.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span>Ins:</span> <span>${result.monthlyInsurance.toLocaleString()}</span></div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 h-80">
                                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Balance Over Time</h3>
                                <ChartBalance data={result.amortization} />
                            </div>
                        </div>

                        {/* Amortization Table */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <h3 className="text-lg font-bold">Amortization Schedule</h3>
                                <ExportButton
                                    result={result}
                                    principal={result.totalLoanAmount}
                                    rate={interestRate}
                                    tenureMonths={loanTermYears * 12}
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
