'use client';

import React, { useState, useEffect } from 'react';
import { calculateGST, GSTCalculation } from '@/lib/calc/gst';
import { Calculator, ArrowRightLeft, RotateCcw } from 'lucide-react';

export default function GSTCalculator() {
    const [amount, setAmount] = useState<number>(10000);
    const [gstRate, setGstRate] = useState<number>(18);
    const [isInterState, setIsInterState] = useState<boolean>(false);
    const [isReverse, setIsReverse] = useState<boolean>(false);
    const [result, setResult] = useState<GSTCalculation | null>(null);

    const gstRates = [5, 12, 18, 28];

    const resetToDefaults = () => {
        setAmount(10000);
        setGstRate(18);
        setIsInterState(false);
        setIsReverse(false);
    };

    useEffect(() => {
        try {
            const calc = calculateGST(amount, gstRate, isInterState, isReverse);
            setResult(calc);
        } catch (e) {
            console.error('GST calculation error:', e);
        }
    }, [amount, gstRate, isInterState, isReverse]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    GST Calculator
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Calculate GST, CGST, SGST, and IGST for your transactions
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Input Details</h2>
                        <button
                            onClick={resetToDefaults}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reset
                        </button>
                    </div>

                    {/* Calculation Type Toggle */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsReverse(!isReverse)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <ArrowRightLeft size={18} />
                            {isReverse ? 'Reverse Mode' : 'Forward Mode'}
                        </button>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {isReverse ? '(Amount includes GST)' : '(Amount excludes GST)'}
                        </span>
                    </div>

                    {/* Amount Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {isReverse ? 'Total Amount (with GST)' : 'Base Amount (without GST)'}
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* GST Rate Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            GST Rate
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {gstRates.map((rate) => (
                                <button
                                    key={rate}
                                    onClick={() => setGstRate(rate)}
                                    className={`py-3 rounded-lg font-semibold transition-colors ${gstRate === rate
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {rate}%
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom GST Rate */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Custom GST Rate (%)
                        </label>
                        <input
                            type="number"
                            value={gstRate}
                            onChange={(e) => setGstRate(Number(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                            max="100"
                            step="0.1"
                        />
                    </div>

                    {/* Inter-state Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="interstate"
                            checked={isInterState}
                            onChange={(e) => setIsInterState(e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor="interstate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Inter-state Transaction (IGST)
                        </label>
                    </div>
                </div>

                {/* Results Section */}
                {result && (
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">GST Breakdown</h2>

                        <div className="space-y-4">
                            {/* Base Amount */}
                            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <span className="text-gray-600 dark:text-gray-400">Base Amount</span>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(result.baseAmount)}
                                </span>
                            </div>

                            {/* GST Components */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                                {isInterState ? (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            IGST ({result.gstRate}%)
                                        </span>
                                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                                            {formatCurrency(result.igst)}
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                CGST ({result.gstRate / 2}%)
                                            </span>
                                            <span className="font-semibold text-green-600 dark:text-green-400">
                                                {formatCurrency(result.cgst)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                SGST ({result.gstRate / 2}%)
                                            </span>
                                            <span className="font-semibold text-green-600 dark:text-green-400">
                                                {formatCurrency(result.sgst)}
                                            </span>
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        Total GST
                                    </span>
                                    <span className="font-bold text-orange-600 dark:text-orange-400">
                                        {formatCurrency(result.totalGST)}
                                    </span>
                                </div>
                            </div>

                            {/* Final Amount */}
                            <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                <span className="font-bold text-gray-900 dark:text-white">Final Amount</span>
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(result.finalAmount)}
                                </span>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                <strong>Note:</strong> {isInterState
                                    ? 'IGST is applicable for inter-state transactions.'
                                    : 'CGST and SGST are applicable for intra-state transactions.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
