'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

type CalculationMode = 'affordability' | 'income-needed';

export default function RentCalculator() {
    const [mode, setMode] = useState<CalculationMode>('affordability');
    const [income, setIncome] = useState<number>(60000);
    const [debt, setDebt] = useState<number>(0);
    const [rent, setRent] = useState<number>(1500);
    const [ratio, setRatio] = useState<number>(30); // 30% rule default

    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        calculate();
    }, [income, debt, rent, ratio, mode]);

    const calculate = () => {
        if (mode === 'affordability') {
            // Calculate Affordable Rent
            // Method 1: Gross Income Rule (e.g. 30%)
            const monthlyIncome = income / 12;
            const affordableRentByRatio = monthlyIncome * (ratio / 100);

            // Method 2: DTI Rule (e.g. 43% - Debt)
            // Standard conservative DTI for housing + debt is often 36% or 43%
            // Let's use a standard "backend ratio" approach if we were strictly following mortgage rules, 
            // but for rent, usually landlords look for 3x rent in gross income (which is 33%).
            // We will stick to the user defined ratio for the primary result, but can show DTI context.

            // Let's calculate the "Remaining for Life"
            const remaining = monthlyIncome - affordableRentByRatio - debt;

            setResult({
                affordableRent: affordableRentByRatio,
                monthlyIncome,
                debt,
                remaining: Math.max(0, remaining),
                isAffordable: remaining > 0
            });
        } else {
            // Calculate Income Needed
            // Rent should be X% of Income => Income = Rent / (X/100)
            const requiredMonthlyIncome = rent / (ratio / 100);
            const requiredAnnualIncome = requiredMonthlyIncome * 12;

            setResult({
                requiredAnnualIncome,
                requiredMonthlyIncome,
                rent,
                ratio
            });
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(val);
    };

    const COLORS = ['#3b82f6', '#ef4444', '#10b981']; // Blue (Rent), Red (Debt), Green (Remaining)

    const getDataForChart = () => {
        if (!result) return [];
        if (mode === 'affordability') {
            return [
                { name: 'Rent', value: result.affordableRent },
                { name: 'Debt', value: result.debt },
                { name: 'Remaining', value: result.remaining },
            ];
        } else {
            // For reverse mode, show the breakdown of the REQUIRED income
            const debtPart = debt; // We assume debt stays same? Or just show Rent vs Rest
            // Actually, in reverse mode we just calculated income based on rent ratio. 
            // We don't necessarily know debt unless we ask for it in reverse mode too.
            // Let's just show Rent vs Remaining (which covers Debt + Life)
            const remaining = result.requiredMonthlyIncome - result.rent;
            return [
                { name: 'Rent', value: result.rent },
                { name: 'Remaining (Debt + Living)', value: remaining },
            ];
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <DollarSign className="text-blue-500" />
                            Rent Affordability Calculator
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {mode === 'affordability'
                                ? 'Calculate how much rent you can afford based on your income.'
                                : 'Calculate how much income you need for a specific rent.'}
                        </p>
                    </div>

                    <button
                        onClick={() => setMode(mode === 'affordability' ? 'income-needed' : 'affordability')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium text-sm"
                    >
                        <RefreshCw size={16} />
                        Switch to {mode === 'affordability' ? 'Income Needed' : 'Rent Affordability'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {/* Inputs Section */}
                    <div className="space-y-6">
                        {mode === 'affordability' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Annual Pre-tax Income
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={income}
                                            onChange={(e) => setIncome(Number(e.target.value))}
                                            className="block w-full pl-7 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Monthly Debt Payments
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={debt}
                                            onChange={(e) => setDebt(Number(e.target.value))}
                                            className="block w-full pl-7 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Credit cards, car loans, student loans, etc.</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Target Monthly Rent
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={rent}
                                        onChange={(e) => setRent(Number(e.target.value))}
                                        className="block w-full pl-7 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Rent-to-Income Ratio (%)
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="10"
                                    max="50"
                                    value={ratio}
                                    onChange={(e) => setRatio(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                />
                                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400 w-12">
                                    {ratio}%
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Standard recommendation is 30%. Landlords typically require income to be 3x rent (33%).
                            </p>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 flex flex-col justify-center">
                        {result && (
                            <>
                                <div className="text-center mb-6">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                        {mode === 'affordability' ? 'You Can Afford' : 'You Need Annual Income'}
                                    </p>
                                    <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                                        {mode === 'affordability'
                                            ? formatCurrency(result.affordableRent)
                                            : formatCurrency(result.requiredAnnualIncome)
                                        }
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        {mode === 'affordability'
                                            ? '/ month'
                                            : `(approx. ${formatCurrency(result.requiredMonthlyIncome)} / month)`
                                        }
                                    </p>
                                </div>

                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={getDataForChart()}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {getDataForChart().map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value: number) => formatCurrency(value)}
                                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
