'use client';

import React, { useState, useEffect } from 'react';
import { calculateChitFund, ChitFundResult } from '@/lib/calc/chit';
import { TrendingUp, PiggyBank, Coins, RotateCcw } from 'lucide-react';
import { InputNumber } from './Shared/InputNumber';

export default function ChitFundCalculator() {
    const [chitValue, setChitValue] = useState(500000);
    const [months, setMonths] = useState(50);
    const [commission, setCommission] = useState(5);
    const [avgBid, setAvgBid] = useState(20);
    const [result, setResult] = useState<ChitFundResult | null>(null);

    useEffect(() => {
        try {
            const res = calculateChitFund(chitValue, months, commission, avgBid);
            setResult(res);
        } catch (e) {
            console.error(e);
        }
    }, [chitValue, months, commission, avgBid]);

    const resetToDefaults = () => {
        setChitValue(500000);
        setMonths(50);
        setCommission(5);
        setAvgBid(20);
    };

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
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Chit Fund Estimator
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Estimate your returns and payments in a Chit Fund scheme
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Scheme Details</h2>
                        <button
                            onClick={resetToDefaults}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reset
                        </button>
                    </div>

                    <InputNumber
                        label="Chit Value"
                        symbol="₹"
                        value={chitValue}
                        onChange={(e) => setChitValue(Number(e.target.value))}
                        step={10000}
                    />

                    <InputNumber
                        label="Duration (Months)"
                        value={months}
                        onChange={(e) => setMonths(Number(e.target.value))}
                        min={1}
                        max={100}
                    />

                    <InputNumber
                        label="Foreman Commission (%)"
                        symbol="%"
                        value={commission}
                        onChange={(e) => setCommission(Number(e.target.value))}
                        step={0.5}
                        max={10}
                    />

                    <InputNumber
                        label="Average Bid Amount (%)"
                        symbol="%"
                        value={avgBid}
                        onChange={(e) => setAvgBid(Number(e.target.value))}
                        step={1}
                        max={50}
                        helperText="Estimated average discount across all auctions"
                    />
                </div>

                {/* Results */}
                {result && (
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <PiggyBank size={20} className="text-blue-600" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Net Payable</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(result.netPayable)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    vs {formatCurrency(result.chitValue)}
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Coins size={20} className="text-green-600" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Dividend</span>
                                </div>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {formatCurrency(result.totalDividend)}
                                </p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp size={20} className="text-blue-600" />
                                    <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Estimated Return</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {result.returnPercentage.toFixed(2)}%
                                </p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Monthly Breakdown (Estimated)</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 font-medium">
                                        <tr>
                                            <th className="px-4 py-3">Month</th>
                                            <th className="px-4 py-3">Contribution</th>
                                            <th className="px-4 py-3">Dividend</th>
                                            <th className="px-4 py-3">Net Payable</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {result.monthlyBreakdown.map((row) => (
                                            <tr key={row.month} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-4 py-3">{row.month}</td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatCurrency(row.contribution)}</td>
                                                <td className="px-4 py-3 text-green-600 dark:text-green-400">{formatCurrency(row.dividend)}</td>
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{formatCurrency(row.netPayable)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
