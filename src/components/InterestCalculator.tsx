'use client';

import React, { useState, useEffect } from 'react';
import { calculateSimpleInterest, calculateCompoundInterest, InterestCalculation } from '@/lib/calc/interest';
import { TrendingUp, Calendar } from 'lucide-react';

export default function InterestCalculator() {
    const [calculationType, setCalculationType] = useState<'simple' | 'compound'>('simple');
    const [principal, setPrincipal] = useState<number>(100000);
    const [rate, setRate] = useState<number>(8);
    const [time, setTime] = useState<number>(5);
    const [compoundingFrequency, setCompoundingFrequency] = useState<'yearly' | 'half-yearly' | 'quarterly' | 'monthly' | 'daily'>('yearly');
    const [result, setResult] = useState<InterestCalculation | null>(null);

    useEffect(() => {
        try {
            if (calculationType === 'simple') {
                const calc = calculateSimpleInterest(principal, rate, time);
                setResult(calc);
            } else {
                const calc = calculateCompoundInterest(principal, rate, time, compoundingFrequency);
                setResult(calc);
            }
        } catch (e) {
            console.error('Interest calculation error:', e);
        }
    }, [calculationType, principal, rate, time, compoundingFrequency]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Interest Calculator
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Calculate Simple and Compound Interest with detailed breakdown
                </p>
            </div>

            {/* Calculation Type Toggle */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => setCalculationType('simple')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${calculationType === 'simple'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                >
                    Simple Interest
                </button>
                <button
                    onClick={() => setCalculationType('compound')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${calculationType === 'compound'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                >
                    Compound Interest
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Section */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Input Details</h2>

                    {/* Principal */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Principal Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                            <input
                                type="number"
                                value={principal}
                                onChange={(e) => setPrincipal(Number(e.target.value))}
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Interest Rate */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Annual Interest Rate (%)
                        </label>
                        <input
                            type="number"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                            max="100"
                            step="0.1"
                        />
                    </div>

                    {/* Time Period */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Time Period (Years)
                        </label>
                        <input
                            type="number"
                            value={time}
                            onChange={(e) => setTime(Number(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="1"
                            max="50"
                        />
                    </div>

                    {/* Compounding Frequency (only for compound interest) */}
                    {calculationType === 'compound' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Compounding Frequency
                            </label>
                            <select
                                value={compoundingFrequency}
                                onChange={(e) => setCompoundingFrequency(e.target.value as any)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="yearly">Yearly</option>
                                <option value="half-yearly">Half-Yearly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="monthly">Monthly</option>
                                <option value="daily">Daily</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {result && (
                    <div className="lg:col-span-2 space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp size={20} className="text-blue-600" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Principal</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(result.principal)}
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar size={20} className="text-green-600" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Interest Earned</span>
                                </div>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {formatCurrency(result.interest)}
                                </p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp size={20} className="text-blue-600" />
                                    <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Amount</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(result.totalAmount)}
                                </p>
                            </div>
                        </div>

                        {/* Formula Display */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Formula Used:</p>
                            <code className="text-sm text-gray-900 dark:text-gray-100">
                                {calculationType === 'simple'
                                    ? `SI = (P × R × T) / 100 = (${principal} × ${rate} × ${time}) / 100`
                                    : `CI = P(1 + R/n)^(n×T) - P`
                                }
                            </code>
                        </div>

                        {/* Yearly Breakdown Table */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Year-wise Breakdown</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Year</th>
                                            <th className="px-4 py-3 text-right">Opening Balance</th>
                                            <th className="px-4 py-3 text-right">Interest</th>
                                            <th className="px-4 py-3 text-right">Closing Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {result.breakdown.map((row) => (
                                            <tr key={row.year} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                                                    Year {row.year}
                                                </td>
                                                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                                                    {formatCurrency(row.openingBalance)}
                                                </td>
                                                <td className="px-4 py-3 text-right text-green-600 dark:text-green-400 font-semibold">
                                                    {formatCurrency(row.interest)}
                                                </td>
                                                <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400 font-semibold">
                                                    {formatCurrency(row.closingBalance)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-blue-50 dark:bg-blue-900/20 border-t-2 border-blue-200 dark:border-blue-800">
                                        <tr className="font-bold">
                                            <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Total</td>
                                            <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                                                {formatCurrency(result.principal)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">
                                                {formatCurrency(result.interest)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400">
                                                {formatCurrency(result.totalAmount)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Comparison Info (only for compound) */}
                        {calculationType === 'compound' && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    <strong>Note:</strong> Compound interest grows faster than simple interest.
                                    The more frequently interest is compounded, the more you earn!
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
