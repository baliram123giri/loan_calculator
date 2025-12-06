'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { calculateVA, VAInput, VAResult, VALoanPurpose } from '@/lib/calc/va';
import EMIResultCard from '@/components/EMIResultCard';
import AmortizationTable from '@/components/AmortizationTable';
import ExportButton from '@/components/ExportButton';
import ShareButton from '@/components/ShareButton';
import CurrencyInput from '@/components/CurrencyInput';
import NumberInput from '@/components/NumberInput';
import { LoanTypeConfig } from '@/types/loanTypes';
import { ChevronDown, ChevronUp, RefreshCw, Calendar, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

const ChartBreakup = dynamic(() => import('@/components/ChartBreakup'), { ssr: false });
const ChartBalance = dynamic(() => import('@/components/ChartBalance'), { ssr: false });

const VA_CONFIG: LoanTypeConfig = {
    name: 'VA Mortgage',
    icon: '🎖️',
    description: 'Calculate VA loan payments with Funding Fee',
    minAmount: 50000,
    maxAmount: 5000000,
    minRate: 2.0,
    maxRate: 15.0,
    minTenure: 5,
    maxTenure: 40,
    defaultRate: 6.5
};

export default function VAMortgageCalculator() {
    const [result, setResult] = useState<VAResult | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Default State
    const [homePrice, setHomePrice] = useState(300000);
    const [downPayment, setDownPayment] = useState(0); // VA loans often 0% down
    const [interestRate, setInterestRate] = useState(6.5);
    const [loanTermYears, setLoanTermYears] = useState(30);
    const [startDate, setStartDate] = useState(new Date());

    // VA Specific State
    const [loanPurpose, setLoanPurpose] = useState<VALoanPurpose>('purchase');
    const [isFirstUse, setIsFirstUse] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);

    // Advanced State
    const [propertyTax, setPropertyTax] = useState(0); // Monthly
    const [homeInsurance, setHomeInsurance] = useState(0); // Monthly
    const [hoaFees, setHoaFees] = useState(0); // Monthly

    const calculate = React.useCallback(() => {
        const input: VAInput = {
            homePrice,
            downPayment,
            interestRate,
            loanTermYears,
            startDate,
            loanPurpose,
            isFirstUse,
            isDisabled,
            propertyTax,
            homeInsurance,
            hoaFees
        };
        const res = calculateVA(input);
        setResult(res);
    }, [homePrice, downPayment, interestRate, loanTermYears, startDate, loanPurpose, isFirstUse, isDisabled, propertyTax, homeInsurance, hoaFees]);

    useEffect(() => {
        calculate();
    }, [calculate]);

    const handleReset = () => {
        setHomePrice(300000);
        setDownPayment(0);
        setInterestRate(6.5);
        setLoanTermYears(30);
        setStartDate(new Date());
        setLoanPurpose('purchase');
        setIsFirstUse(true);
        setIsDisabled(false);
        setPropertyTax(0);
        setHomeInsurance(0);
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
                            <span>{VA_CONFIG.icon}</span>
                            {VA_CONFIG.name}
                        </h2>
                        <button
                            onClick={handleReset}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reset
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Home Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Home Price
                            </label>
                            <CurrencyInput
                                value={homePrice}
                                onChange={setHomePrice}
                            />
                        </div>

                        {/* Down Payment */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Down Payment ($)
                            </label>
                            <CurrencyInput
                                value={downPayment}
                                onChange={setDownPayment}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {((downPayment / homePrice) * 100).toFixed(2)}% (0% allowed for VA)
                            </p>
                        </div>

                        {/* Interest Rate */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Interest Rate (%)
                            </label>
                            <NumberInput
                                value={interestRate}
                                onChange={setInterestRate}
                                suffix="%"
                                max={100}
                            />
                        </div>

                        {/* Loan Term */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Loan Term (Years)
                            </label>
                            <NumberInput
                                value={loanTermYears}
                                onChange={setLoanTermYears}
                                suffix="Years"
                                max={50}
                            />
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Start Date
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar size={16} className="text-gray-500" />
                                </div>
                                <input
                                    type="date"
                                    value={startDate.toISOString().split('T')[0]}
                                    onChange={(e) => setStartDate(new Date(e.target.value))}
                                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* VA Specific Options */}
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl space-y-4">
                            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">VA Loan Details</h3>

                            {/* Loan Purpose */}
                            <div>
                                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Loan Purpose</label>
                                <select
                                    value={loanPurpose}
                                    onChange={(e) => setLoanPurpose(e.target.value as VALoanPurpose)}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white"
                                >
                                    <option value="purchase">Purchase Loan</option>
                                    <option value="cash-out">Cash-Out Refinance</option>
                                    <option value="irrrl">IRRRL (Streamline Refinance)</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700 dark:text-gray-300">VA Loan Usage</label>
                                <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => setIsFirstUse(true)}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${isFirstUse
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        First Use
                                    </button>
                                    <button
                                        onClick={() => setIsFirstUse(false)}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${!isFirstUse
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        Subsequent
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700 dark:text-gray-300 flex flex-col">
                                    <span>Service Disability?</span>
                                    <span className="text-[10px] text-gray-500">Waives Funding Fee</span>
                                </label>
                                <button
                                    onClick={() => setIsDisabled(!isDisabled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDisabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDisabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
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
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Property Tax ($/mo)</label>
                                <CurrencyInput
                                    value={propertyTax}
                                    onChange={setPropertyTax}
                                    className="text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Home Insurance ($/mo)</label>
                                <CurrencyInput
                                    value={homeInsurance}
                                    onChange={setHomeInsurance}
                                    className="text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">HOA Fees ($/mo)</label>
                                <CurrencyInput
                                    value={hoaFees}
                                    onChange={setHoaFees}
                                    className="text-sm"
                                />
                            </div>
                        </div>
                    )}
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
                                <p className="text-xs text-green-600/80 dark:text-green-400/80">
                                    Includes ${result.fundingFeeAmount.toLocaleString()} Funding Fee
                                </p>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                                <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Total Interest</p>
                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">${result.totalInterest.toLocaleString()}</p>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800">
                                <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">VA Funding Fee</p>
                                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">${result.fundingFeeAmount.toLocaleString()}</p>
                                <p className="text-xs text-orange-600/80 dark:text-orange-400/80">
                                    Rate: {result.fundingFeeRate}% {isDisabled ? '(Waived)' : ''}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Monthly Payment Breakdown</h3>
                                <div className="mb-6 w-full h-[300px]">
                                    <ChartBreakup
                                        data={[
                                            { name: 'Principal & Interest', value: result.emi, color: '#3B82F6' },
                                            { name: 'Property Tax', value: result.monthlyTax, color: '#22C55E' },
                                            { name: 'Home Insurance', value: result.monthlyInsurance, color: '#A855F7' },
                                            ...(result.monthlyHOA > 0 ? [{ name: 'HOA Fees', value: result.monthlyHOA, color: '#6B7280' }] : [])
                                        ]}
                                        legendType='none'
                                        centerLabel="Total"
                                        centerValue={`$${result.totalMonthlyPayment.toLocaleString()}`}
                                        variant="donut"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Principal & Interest</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">${result.emi.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Property Tax</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">${result.monthlyTax.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Home Insurance</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">${result.monthlyInsurance.toLocaleString()}</span>
                                    </div>
                                    {result.monthlyHOA > 0 && (
                                        <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">HOA Fees</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">${result.monthlyHOA.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 h-96">
                                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Balance Over Time</h3>
                                <ChartBalance data={result.amortization} />
                            </div>
                        </div>

                        {/* Amortization Table */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div className="flex flex-col gap-1 w-full lg:w-auto">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Amortization Schedule</h3>
                                </div>
                                <div className="flex-shrink-0 w-full lg:w-auto">
                                    <ExportButton
                                        result={result}
                                        principal={result.totalLoanAmount}
                                        rate={interestRate}
                                        tenureMonths={loanTermYears * 12}
                                        currencySymbol="$"
                                    />
                                </div>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                <AmortizationTable schedule={result.amortization} currencySymbol="$" />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div >
    );
}
