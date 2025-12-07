'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { calculateFHA, FHAInput, FHAResult } from '@/lib/calc/fha';
import EMIResultCard from '@/components/EMIResultCard';
import AmortizationTable from '@/components/AmortizationTable';
import ExportButton from '@/components/ExportButton';
import ShareButton from '@/components/ShareButton';
import CurrencyInput from '@/components/CurrencyInput';
import NumberInput from '@/components/NumberInput';
import { LoanTypeConfig } from '@/types/loanTypes';
import { ChevronDown, ChevronUp, Calendar, RotateCcw } from 'lucide-react';
import { CalculateButton } from '@/components/Shared/CalculateButton';

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
    // Initialize with default calculation
    const getDefaultResult = (): FHAResult => {
        const input: FHAInput = {
            homePrice: 300000,
            downPayment: 10500,
            interestRate: 6.5,
            loanTermYears: 30,
            startDate: new Date(),
            upfrontMIPRate: 1.75,
            annualMIPRate: 0.55,
            propertyTax: 300,
            homeInsurance: 100,
            hoaFees: 0
        };
        return calculateFHA(input);
    };

    const [result, setResult] = useState<FHAResult>(getDefaultResult());
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

    const performCalculation = () => {
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
    };

    const handleReset = () => {
        const defaults = {
            homePrice: 300000,
            downPayment: 10500,
            interestRate: 6.5,
            loanTermYears: 30,
            startDate: new Date(),
            upfrontMIPRate: 1.75,
            annualMIPRate: 0.55,
            propertyTax: 300,
            homeInsurance: 100,
            hoaFees: 0
        };

        setHomePrice(defaults.homePrice);
        setDownPayment(defaults.downPayment);
        setInterestRate(defaults.interestRate);
        setLoanTermYears(defaults.loanTermYears);
        setStartDate(defaults.startDate);
        setUpfrontMIPRate(defaults.upfrontMIPRate);
        setAnnualMIPRate(defaults.annualMIPRate);
        setPropertyTax(defaults.propertyTax);
        setHomeInsurance(defaults.homeInsurance);
        setHoaFees(defaults.hoaFees);

        // Immediately recalculate with default values
        const input: FHAInput = defaults;
        const res = calculateFHA(input);
        setResult(res);
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
                                {((downPayment / homePrice) * 100).toFixed(2)}% (Min 3.5% required)
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
                                        <NumberInput
                                            value={upfrontMIPRate}
                                            onChange={setUpfrontMIPRate}
                                            suffix="%"
                                            className="text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Annual MIP (%)</label>
                                        <NumberInput
                                            value={annualMIPRate}
                                            onChange={setAnnualMIPRate}
                                            suffix="%"
                                            className="text-sm"
                                        />
                                    </div>
                                </div>
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

                        {/* Calculate Button */}
                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 mt-6">
                            <CalculateButton onClick={performCalculation} label="Calculate FHA Loan" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-8 space-y-8">
                {result && result.monthlyPrincipalAndInterest > 0 && (
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

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Monthly Payment Breakdown</h3>
                                <div className="mb-6">
                                    <ChartBreakup
                                        data={[
                                            { name: 'Principal & Interest', value: result.monthlyPrincipalAndInterest, color: '#3B82F6' },
                                            { name: 'MIP', value: result.monthlyMIP, color: '#F97316' },
                                            { name: 'Property Tax', value: result.monthlyTax, color: '#22C55E' },
                                            { name: 'Home Insurance', value: result.monthlyInsurance, color: '#A855F7' },
                                            ...(result.monthlyHOA > 0 ? [{ name: 'HOA Fees', value: result.monthlyHOA, color: '#6B7280' }] : [])
                                        ]}
                                        centerLabel="Total"
                                        centerValue={`$${result.totalMonthlyPayment.toLocaleString()}`}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Principal & Interest</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">${result.monthlyPrincipalAndInterest.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">MIP (Mortgage Insurance)</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">${result.monthlyMIP.toLocaleString()}</span>
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
                            <AmortizationTable
                                schedule={result.amortization}
                                currencySymbol="$"
                                calculatorName="FHA Loan Calculator"
                                loanDetails={{
                                    loanAmount: result.totalLoanAmount,
                                    interestRate: interestRate,
                                    loanTerm: loanTermYears * 12,
                                    monthlyPayment: result.monthlyPrincipalAndInterest,
                                    totalInterest: result.totalInterest,
                                    totalCost: result.totalPayment,
                                    upfrontMIP: result.financedUpfrontMIP,
                                    annualMIPRate: annualMIPRate,
                                    totalMIPPaid: result.totalMIPPaid
                                }}
                                pdfHeaderColor="from-green-600 to-emerald-600"
                            />
                        </div>
                    </>
                )
                }
            </div >
        </div >
    );
}
