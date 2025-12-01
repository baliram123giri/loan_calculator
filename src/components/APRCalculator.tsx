'use client';

import React, { useState, useEffect } from 'react';
import { calculateLoanSummary } from '@/lib/calc/aprCalc';
import { generatePaymentAmortization } from '@/lib/calc/paymentCalc';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import CurrencyInput from './CurrencyInput';
import ShareButton from './ShareButton';
import AmortizationTable from './AmortizationTable';
import ChartBalance from './ChartBalance';
import ChartPaymentComposition from './ChartPaymentComposition';
import ExportButton from './ExportButton';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

export default function APRCalculator() {
    // State for inputs
    const [principal, setPrincipal] = useState(200000);
    const [interestRate, setInterestRate] = useState(5.0);
    const [termValue, setTermValue] = useState(30);
    const [termType, setTermType] = useState<'years' | 'months'>('years');

    // Fees state
    const [fees, setFees] = useState({
        origination: 1000,
        documentation: 500,
        other: 0
    });

    const [showFees, setShowFees] = useState(true);

    // Results state
    const [result, setResult] = useState<any>(null);
    const [amortizationSchedule, setAmortizationSchedule] = useState<any[]>([]);
    const [activeChart, setActiveChart] = useState<'balance' | 'composition'>('balance');
    const [viewMode, setViewMode] = useState<'schedule' | 'analysis'>('schedule');

    // Calculate on change
    useEffect(() => {
        const totalFees = fees.origination + fees.documentation + fees.other;
        const termMonths = termType === 'years' ? termValue * 12 : termValue;

        if (termMonths <= 0 || principal <= 0) {
            setResult(null);
            setAmortizationSchedule([]);
            return;
        }

        const summary = calculateLoanSummary(
            principal,
            interestRate,
            termMonths,
            totalFees
        );

        setResult(summary);

        // Generate Amortization Schedule (based on Interest Rate, not APR)
        const schedule = generatePaymentAmortization(
            principal,
            interestRate,
            termMonths,
            summary.monthlyPayment
        );
        setAmortizationSchedule(schedule.amortization);

    }, [principal, interestRate, termValue, termType, fees]);

    const chartData = [
        { name: 'Principal', value: principal, color: '#3b82f6' }, // Blue
        { name: 'Interest', value: result ? result.totalInterest : 0, color: '#ef4444' }, // Red
        { name: 'Fees', value: result ? result.totalFees : 0, color: '#eab308' }, // Yellow
    ];

    const handleFeeChange = (key: keyof typeof fees, value: number) => {
        setFees(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Inputs */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                            Loan Details
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Loan Amount
                                </label>
                                <CurrencyInput
                                    value={principal}
                                    onChange={setPrincipal}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Interest Rate (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={interestRate}
                                            onChange={(e) => setInterestRate(Number(e.target.value))}
                                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                            step="0.1"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">%</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Term
                                    </label>
                                    <div className="flex rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            value={termValue}
                                            onChange={(e) => setTermValue(Number(e.target.value))}
                                            className="block w-full rounded-l-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                        />
                                        <select
                                            value={termType}
                                            onChange={(e) => setTermType(e.target.value as 'years' | 'months')}
                                            className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="years">Years</option>
                                            <option value="months">Months</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={() => setShowFees(!showFees)}
                                className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 dark:text-white mb-4"
                            >
                                <span className="flex items-center gap-2">
                                    Fees & Closing Costs
                                    <Info size={14} className="text-gray-400" />
                                </span>
                                {showFees ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {showFees && (
                                <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Origination Fee
                                        </label>
                                        <CurrencyInput
                                            value={fees.origination}
                                            onChange={(v) => handleFeeChange('origination', v)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Documentation Fee
                                        </label>
                                        <CurrencyInput
                                            value={fees.documentation}
                                            onChange={(v) => handleFeeChange('documentation', v)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Other Closing Costs
                                        </label>
                                        <CurrencyInput
                                            value={fees.other}
                                            onChange={(v) => handleFeeChange('other', v)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Results */}
                <div className="lg:col-span-7 space-y-6">
                    {result && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* APR Card */}
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                    <h3 className="text-blue-100 font-medium mb-1">Annual Percentage Rate (APR)</h3>
                                    <div className="text-4xl font-bold mb-2">
                                        {result.apr.toFixed(3)}%
                                    </div>
                                    <p className="text-sm text-blue-100 opacity-90">
                                        This is the true cost of your loan including fees.
                                    </p>
                                </div>

                                {/* Monthly Payment Card */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-1">Monthly Payment</h3>
                                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        ${result.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                        Principal & Interest
                                    </p>
                                </div>
                            </div>

                            {/* Breakdown Chart & Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Cost Breakdown</h3>
                                    <div className="h-64 flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value: number) => `$${value.toLocaleString()}`}
                                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                />
                                                <Legend verticalAlign="bottom" height={36} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-center">
                                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Loan Summary</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                            <span className="text-gray-600 dark:text-gray-400">Total Principal</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                ${principal.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                            <span className="text-gray-600 dark:text-gray-400">Total Interest</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                ${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                            <span className="text-gray-600 dark:text-gray-400">Total Fees</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                ${result.totalFees.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">Total Cost</span>
                                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                ${result.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <ShareButton
                                            data={{
                                                p: principal,
                                                r: interestRate,
                                                t: termType === 'years' ? termValue : termValue / 12,
                                                f: result.totalFees
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {amortizationSchedule.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('schedule')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'schedule'
                                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                Amortization Schedule
                            </button>
                            <button
                                onClick={() => setViewMode('analysis')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'analysis'
                                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                Loan Analysis
                            </button>
                        </div>

                        {viewMode === 'schedule' && (
                            /* @ts-ignore */
                            <ExportButton
                                result={{
                                    emi: result.monthlyPayment,
                                    totalInterest: result.totalInterest,
                                    totalPayment: result.totalCost,
                                    amortization: amortizationSchedule
                                }}
                                principal={principal}
                                rate={interestRate}
                                tenureMonths={termType === 'years' ? termValue * 12 : termValue}
                            />
                        )}
                    </div>

                    <div className="p-6">
                        {viewMode === 'schedule' ? (
                            <AmortizationTable schedule={amortizationSchedule} />
                        ) : (
                            <div className="animate-in slide-in-from-top-2 duration-200">
                                <div className="flex justify-end mb-6">
                                    <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                                        <button
                                            onClick={() => setActiveChart('balance')}
                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeChart === 'balance'
                                                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                                }`}
                                        >
                                            Balance History
                                        </button>
                                        <button
                                            onClick={() => setActiveChart('composition')}
                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeChart === 'composition'
                                                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                                }`}
                                        >
                                            Payment Composition
                                        </button>
                                    </div>
                                </div>

                                <div className="h-96">
                                    {activeChart === 'balance' ? (
                                        <ChartBalance data={amortizationSchedule} />
                                    ) : (
                                        <ChartPaymentComposition data={amortizationSchedule} />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
