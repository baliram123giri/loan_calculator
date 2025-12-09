'use client';

import React, { useState, useEffect } from 'react';
import { calculateEMI, EMIResult } from '@/lib/calc/emi';
import { TrendingDown } from 'lucide-react';

export default function LoanComparison({ currencySymbol = "$" }: { currencySymbol?: string }) {
    const [loanA, setLoanA] = useState({ principal: 1000000, rate: 7.5, tenure: 20 });
    const [loanB, setLoanB] = useState({ principal: 1000000, rate: 8.0, tenure: 20 });
    const [resultA, setResultA] = useState<EMIResult | null>(null);
    const [resultB, setResultB] = useState<EMIResult | null>(null);

    useEffect(() => {
        try {
            const resA = calculateEMI(loanA.principal, loanA.rate, loanA.tenure * 12);
            setResultA(resA);
        } catch (e) {
            setResultA(null);
        }

        try {
            const resB = calculateEMI(loanB.principal, loanB.rate, loanB.tenure * 12);
            setResultB(resB);
        } catch (e) {
            setResultB(null);
        }
    }, [loanA, loanB]);

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val).replace('$', currencySymbol);

    const ComparisonCard = ({ title, loan, setLoan, result }: { title: string, loan: any, setLoan: any, result: EMIResult | null }) => (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>

            <div className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loan Amount</label>
                    <input
                        type="number"
                        value={loan.principal}
                        onChange={(e) => setLoan({ ...loan, principal: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-950 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interest Rate (%)</label>
                    <input
                        type="number"
                        step="0.1"
                        value={loan.rate}
                        onChange={(e) => setLoan({ ...loan, rate: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-950 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tenure (Years)</label>
                    <input
                        type="number"
                        value={loan.tenure}
                        onChange={(e) => setLoan({ ...loan, tenure: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-950 dark:text-white"
                    />
                </div>
            </div>

            {result && (
                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Monthly EMI</span>
                        <span className="font-bold text-lg">{formatCurrency(result.emi)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Interest</span>
                        <span className="font-semibold">{formatCurrency(result.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Payment</span>
                        <span className="font-semibold">{formatCurrency(result.totalPayment)}</span>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ComparisonCard title="Loan Option A" loan={loanA} setLoan={setLoanA} result={resultA} />
                <ComparisonCard title="Loan Option B" loan={loanB} setLoan={setLoanB} result={resultB} />
            </div>

            {resultA && resultB && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                    <h3 className="text-lg font-bold mb-4 text-blue-900 dark:text-blue-100">Comparison Verdict</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
                            <p className="text-sm text-gray-500 mb-1">EMI Difference</p>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold">
                                    {formatCurrency(Math.abs(resultA.emi - resultB.emi))}
                                </span>
                                {resultA.emi < resultB.emi ? (
                                    <span className="text-green-600 text-sm flex items-center">
                                        <TrendingDown size={16} className="mr-1" /> Option A is cheaper
                                    </span>
                                ) : (
                                    <span className="text-green-600 text-sm flex items-center">
                                        <TrendingDown size={16} className="mr-1" /> Option B is cheaper
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
                            <p className="text-sm text-gray-500 mb-1">Interest Difference</p>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold">
                                    {formatCurrency(Math.abs(resultA.totalInterest - resultB.totalInterest))}
                                </span>
                                {resultA.totalInterest < resultB.totalInterest ? (
                                    <span className="text-green-600 text-sm flex items-center">
                                        <TrendingDown size={16} className="mr-1" /> Option A saves more
                                    </span>
                                ) : (
                                    <span className="text-green-600 text-sm flex items-center">
                                        <TrendingDown size={16} className="mr-1" /> Option B saves more
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-2">Recommendation</p>
                                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                    Choose {resultA.totalPayment < resultB.totalPayment ? 'Option A' : 'Option B'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
