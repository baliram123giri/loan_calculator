'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, PieChart as PieChartIcon, AlertCircle, CheckCircle, Info, TrendingUp, RotateCcw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import CurrencyInput from './CurrencyInput';

type CalculationMode = 'affordability' | 'income-needed';

export default function RentCalculator() {
    const [mode, setMode] = useState<CalculationMode>('affordability');
    const [income, setIncome] = useState<number>(60000);
    const [debt, setDebt] = useState<number>(0);
    const [rent, setRent] = useState<number>(1500);
    const [ratio, setRatio] = useState<number>(30); // 30% rule default
    const [utilities, setUtilities] = useState<number>(150);
    const [savings, setSavings] = useState<number>(500);

    const [result, setResult] = useState<any>(null);

    const resetToDefaults = () => {
        setMode('affordability');
        setIncome(60000);
        setDebt(0);
        setRent(1500);
        setRatio(30);
        setUtilities(150);
        setSavings(500);
    };

    useEffect(() => {
        calculate();
    }, [income, debt, rent, ratio, mode, utilities, savings]);

    const calculate = () => {
        if (mode === 'affordability') {
            // Calculate Affordable Rent
            const monthlyIncome = income / 12;
            const affordableRentByRatio = monthlyIncome * (ratio / 100);

            // Calculate DTI (Debt-to-Income)
            const totalHousingCost = affordableRentByRatio + utilities;
            const totalMonthlyObligations = totalHousingCost + debt;
            const dti = (totalMonthlyObligations / monthlyIncome) * 100;

            // Calculate remaining after all expenses
            const remaining = monthlyIncome - affordableRentByRatio - debt - utilities - savings;

            // Affordability Score (0-100)
            let score = 100;
            if (dti > 43) score -= 30;
            else if (dti > 36) score -= 15;
            if (remaining < 0) score -= 40;
            else if (remaining < 500) score -= 20;
            if (savings < 300) score -= 10;

            setResult({
                affordableRent: affordableRentByRatio,
                monthlyIncome,
                debt,
                utilities,
                savings,
                remaining: Math.max(0, remaining),
                dti,
                score: Math.max(0, score),
                isAffordable: remaining > 0 && dti < 43
            });
        } else {
            // Calculate Income Needed
            const requiredMonthlyIncome = rent / (ratio / 100);
            const requiredAnnualIncome = requiredMonthlyIncome * 12;

            // Calculate what's left after rent
            const totalHousingCost = rent + utilities;
            const remaining = requiredMonthlyIncome - totalHousingCost - debt - savings;
            const dti = ((totalHousingCost + debt) / requiredMonthlyIncome) * 100;

            setResult({
                requiredAnnualIncome,
                requiredMonthlyIncome,
                rent,
                utilities,
                debt,
                savings,
                remaining: Math.max(0, remaining),
                dti,
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

    const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6']; // Blue, Red, Orange, Green, Purple

    const getDataForPieChart = () => {
        if (!result) return [];
        if (mode === 'affordability') {
            return [
                { name: 'Rent', value: result.affordableRent },
                { name: 'Debt', value: result.debt },
                { name: 'Utilities', value: result.utilities },
                { name: 'Savings', value: result.savings },
                { name: 'Remaining', value: result.remaining },
            ].filter(item => item.value > 0);
        } else {
            return [
                { name: 'Rent', value: result.rent },
                { name: 'Debt', value: result.debt },
                { name: 'Utilities', value: result.utilities },
                { name: 'Savings', value: result.savings },
                { name: 'Remaining', value: result.remaining },
            ].filter(item => item.value > 0);
        }
    };

    const getDataForBarChart = () => {
        if (!result) return [];
        if (mode === 'affordability') {
            return [
                { category: 'Rent', amount: result.affordableRent },
                { category: 'Debt', amount: result.debt },
                { category: 'Utilities', amount: result.utilities },
                { category: 'Savings', amount: result.savings },
                { category: 'Remaining', amount: result.remaining },
            ];
        } else {
            return [
                { category: 'Rent', amount: result.rent },
                { category: 'Debt', amount: result.debt },
                { category: 'Utilities', amount: result.utilities },
                { category: 'Savings', amount: result.savings },
                { category: 'Remaining', amount: result.remaining },
            ];
        }
    };

    const getAffordabilityMessage = () => {
        if (!result || mode !== 'affordability') return null;

        if (result.score >= 80) {
            return {
                icon: <CheckCircle className="text-green-500" size={20} />,
                text: "Excellent! This rent is very affordable for your income.",
                color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            };
        } else if (result.score >= 60) {
            return {
                icon: <Info className="text-blue-500" size={20} />,
                text: "Good. This rent is manageable but leaves limited room for unexpected expenses.",
                color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            };
        } else if (result.score >= 40) {
            return {
                icon: <AlertCircle className="text-orange-500" size={20} />,
                text: "Caution! This rent may strain your budget. Consider reducing expenses or finding a lower rent.",
                color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
            };
        } else {
            return {
                icon: <AlertCircle className="text-red-500" size={20} />,
                text: "Warning! This rent is not affordable with your current income and expenses.",
                color: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            };
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
                        <button
                            onClick={resetToDefaults}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer mt-2"
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reset
                        </button>
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
                                    <CurrencyInput
                                        value={income}
                                        onChange={setIncome}
                                        min={0}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Monthly Debt Payments
                                    </label>
                                    <CurrencyInput
                                        value={debt}
                                        onChange={setDebt}
                                        min={0}
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Credit cards, car loans, student loans, etc.</p>
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Target Monthly Rent
                                </label>
                                <CurrencyInput
                                    value={rent}
                                    onChange={setRent}
                                    min={0}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Monthly Utilities (Estimated)
                            </label>
                            <CurrencyInput
                                value={utilities}
                                onChange={setUtilities}
                                min={0}
                            />
                            <p className="mt-1 text-xs text-gray-500">Electric, gas, water, internet, etc.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Monthly Savings Goal
                            </label>
                            <CurrencyInput
                                value={savings}
                                onChange={setSavings}
                                min={0}
                            />
                            <p className="mt-1 text-xs text-gray-500">Emergency fund, retirement, investments</p>
                        </div>

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
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                                    style={{
                                        background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(ratio - 10) / 0.4}%, #e5e7eb ${(ratio - 10) / 0.4}%, #e5e7eb 100%)`
                                    }}
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
                    <div className="space-y-6">
                        {result && (
                            <>
                                <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg text-center">
                                    <p className="text-lg opacity-90 mb-2">
                                        {mode === 'affordability' ? 'You Can Afford' : 'You Need Annual Income'}
                                    </p>
                                    <div className="text-5xl font-bold mb-4">
                                        {mode === 'affordability'
                                            ? formatCurrency(result.affordableRent)
                                            : formatCurrency(result.requiredAnnualIncome)
                                        }
                                    </div>
                                    <p className="text-sm opacity-80">
                                        {mode === 'affordability'
                                            ? '/ month in rent'
                                            : `(approx. ${formatCurrency(result.requiredMonthlyIncome)} / month)`
                                        }
                                    </p>
                                </div>

                                {mode === 'affordability' && (
                                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Affordability Score</span>
                                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.score}/100</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                                            <div
                                                className={`h-3 rounded-full transition-all ${result.score >= 80 ? 'bg-green-500' :
                                                    result.score >= 60 ? 'bg-blue-500' :
                                                        result.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${result.score}%` }}
                                            />
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex justify-between mb-1">
                                                <span>Debt-to-Income Ratio:</span>
                                                <span className="font-semibold">{result.dti.toFixed(1)}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Monthly Remaining:</span>
                                                <span className="font-semibold">{formatCurrency(result.remaining)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {mode === 'affordability' && getAffordabilityMessage() && (
                                    <div className={`rounded-xl p-4 border flex items-start gap-3 ${getAffordabilityMessage()?.color}`}>
                                        {getAffordabilityMessage()?.icon}
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {getAffordabilityMessage()?.text}
                                        </p>
                                    </div>
                                )}

                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                                        <PieChartIcon size={16} />
                                        Monthly Budget Breakdown
                                    </h3>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={getDataForPieChart()}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={50}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {getDataForPieChart().map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value: number) => formatCurrency(value)}
                                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                />
                                                <Legend verticalAlign="bottom" height={36} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
