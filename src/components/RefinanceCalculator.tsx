'use client';

import React, { useState, useMemo } from 'react';
import {
    DollarSign,
    Percent,
    Calendar,
    TrendingUp,
    PiggyBank,
    ArrowRight,
    Info,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    RotateCcw
} from 'lucide-react';
import {
    calculateRefinanceMetrics,
    type RefinanceInput,
    type RefinanceResult
} from '@/lib/calculations/refinance';
import { InputNumber } from './Shared/InputNumber';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

export default function RefinanceCalculator() {
    const [activeTab, setActiveTab] = useState<'overview' | 'projections'>('overview');
    const [isCashOut, setIsCashOut] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const [input, setInput] = useState<RefinanceInput>({
        currentLoanBalance: 300000,
        currentInterestRate: 7.0,
        currentTermYears: 25,
        newLoanAmount: 300000,
        newInterestRate: 5.5,
        newTermYears: 30,
        closingCosts: 5000,
        cashOutAmount: 0
    });

    // Auto-update new loan amount when cash-out changes or current balance changes (if not cash-out)
    const updateInput = (field: keyof RefinanceInput, value: number) => {
        setInput(prev => {
            const next = { ...prev, [field]: value };

            // If not cash-out, new loan amount usually equals current balance + closing costs (if rolled in)
            // For simplicity in this UI, we'll keep them independent but let user adjust.
            // However, if we toggle cash-out, we might want to reset or adjust logic.

            return next;
        });
    };

    const resetToDefaults = () => {
        setInput({
            currentLoanBalance: 300000,
            currentInterestRate: 7.0,
            currentTermYears: 25,
            newLoanAmount: 300000,
            newInterestRate: 5.5,
            newTermYears: 30,
            closingCosts: 5000,
            cashOutAmount: 0
        });
        setIsCashOut(false);
        setActiveTab('overview');
        setCurrentPage(1);
    };

    const result: RefinanceResult = useMemo(() => {
        // Adjust new loan amount if cash out is selected
        const effectiveNewLoanAmount = isCashOut
            ? input.newLoanAmount + input.cashOutAmount
            : input.newLoanAmount;

        return calculateRefinanceMetrics({
            ...input,
            newLoanAmount: effectiveNewLoanAmount
        });
    }, [input, isCashOut]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <div className="w-full space-y-8">
            <div className="grid lg:grid-cols-12 gap-8">
                {/* Inputs Column */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Loan Details</h2>
                        <button
                            onClick={resetToDefaults}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reset
                        </button>
                    </div>
                    {/* Current Loan */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Current Loan
                        </h3>
                        <div className="space-y-4">
                            <InputNumber
                                label="Remaining Balance"
                                value={input.currentLoanBalance}
                                onChange={(e) => updateInput('currentLoanBalance', parseFloat(e.target.value) || 0)}
                                symbol="$"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <InputNumber
                                    label="Interest Rate"
                                    value={input.currentInterestRate}
                                    onChange={(e) => updateInput('currentInterestRate', parseFloat(e.target.value) || 0)}
                                    symbol="%"
                                />
                                <InputNumber
                                    label="Remaining Term (Years)"
                                    value={input.currentTermYears}
                                    onChange={(e) => updateInput('currentTermYears', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* New Loan */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            New Loan
                        </h3>

                        <div className="mb-4 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="cashOut"
                                checked={isCashOut}
                                onChange={(e) => setIsCashOut(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <label htmlFor="cashOut" className="text-sm text-gray-700 dark:text-gray-300">
                                Cash-out Refinance
                            </label>
                        </div>

                        <div className="space-y-4">
                            <InputNumber
                                label="New Loan Amount"
                                value={input.newLoanAmount}
                                onChange={(e) => updateInput('newLoanAmount', parseFloat(e.target.value) || 0)}
                                symbol="$"
                            />

                            {isCashOut && (
                                <InputNumber
                                    label="Cash Out Amount"
                                    value={input.cashOutAmount}
                                    onChange={(e) => updateInput('cashOutAmount', parseFloat(e.target.value) || 0)}
                                    symbol="$"
                                />
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <InputNumber
                                    label="Interest Rate"
                                    value={input.newInterestRate}
                                    onChange={(e) => updateInput('newInterestRate', parseFloat(e.target.value) || 0)}
                                    symbol="%"
                                />
                                <InputNumber
                                    label="New Term (Years)"
                                    value={input.newTermYears}
                                    onChange={(e) => updateInput('newTermYears', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <InputNumber
                                label="Closing Costs"
                                value={input.closingCosts}
                                onChange={(e) => updateInput('closingCosts', parseFloat(e.target.value) || 0)}
                                symbol="$"
                            />
                        </div>
                    </div>
                </div>

                {/* Results Column */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                            <p className="text-blue-100 text-sm font-medium mb-1">Monthly Savings</p>
                            <h3 className="text-3xl font-bold">{formatCurrency(result.monthly.savings)}</h3>
                            <p className="text-blue-100 text-xs mt-2">
                                New Payment: {formatCurrency(result.monthly.newPayment)}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                            <p className="text-purple-100 text-sm font-medium mb-1">Lifetime Savings</p>
                            <h3 className="text-3xl font-bold">{formatCurrency(result.lifetime.netLifetimeSavings)}</h3>
                            <p className="text-purple-100 text-xs mt-2">
                                Interest Saved: {formatCurrency(result.lifetime.interestSavings)}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                            <p className="text-emerald-100 text-sm font-medium mb-1">Break-Even Point</p>
                            <h3 className="text-3xl font-bold">
                                {result.breakEvenMonths > 0
                                    ? `${Math.ceil(result.breakEvenMonths)} Months`
                                    : 'N/A'}
                            </h3>
                            <p className="text-emerald-100 text-xs mt-2">
                                Time to recover costs
                            </p>
                        </div>
                    </div>

                    {/* Detailed Analysis Tabs */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="flex border-b border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'overview'
                                    ? 'bg-gray-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                Overview & Charts
                            </button>
                            <button
                                onClick={() => setActiveTab('projections')}
                                className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'projections'
                                    ? 'bg-gray-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                Amortization Schedule
                            </button>
                        </div>

                        <div className="p-6">
                            {activeTab === 'overview' ? (
                                <div className="space-y-8">
                                    {/* Comparison Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                <tr>
                                                    <th className="px-4 py-3">Metric</th>
                                                    <th className="px-4 py-3">Current Loan</th>
                                                    <th className="px-4 py-3">New Loan</th>
                                                    <th className="px-4 py-3">Difference</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                    <td className="px-4 py-3 font-medium">Monthly Payment</td>
                                                    <td className="px-4 py-3">{formatCurrency(result.monthly.currentPayment)}</td>
                                                    <td className="px-4 py-3">{formatCurrency(result.monthly.newPayment)}</td>
                                                    <td className={`px-4 py-3 font-bold ${result.monthly.savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {result.monthly.savings > 0 ? '-' : '+'}{formatCurrency(Math.abs(result.monthly.savings))}
                                                    </td>
                                                </tr>
                                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                    <td className="px-4 py-3 font-medium">Total Interest</td>
                                                    <td className="px-4 py-3">{formatCurrency(result.lifetime.currentTotalInterest)}</td>
                                                    <td className="px-4 py-3">{formatCurrency(result.lifetime.newTotalInterest)}</td>
                                                    <td className={`px-4 py-3 font-bold ${result.lifetime.interestSavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {result.lifetime.interestSavings > 0 ? '-' : '+'}{formatCurrency(Math.abs(result.lifetime.interestSavings))}
                                                    </td>
                                                </tr>
                                                <tr className="bg-white dark:bg-gray-800">
                                                    <td className="px-4 py-3 font-medium">Total Cost</td>
                                                    <td className="px-4 py-3">{formatCurrency(result.lifetime.totalCostCurrent)}</td>
                                                    <td className="px-4 py-3">{formatCurrency(result.lifetime.totalCostNew)}</td>
                                                    <td className={`px-4 py-3 font-bold ${result.lifetime.netLifetimeSavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {result.lifetime.netLifetimeSavings > 0 ? '-' : '+'}{formatCurrency(Math.abs(result.lifetime.netLifetimeSavings))}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Charts */}
                                    <div className="grid lg:grid-cols-2 gap-8">
                                        <div className="h-64 w-full">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Loan Balance Comparison</h4>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={result.projections} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                                    <defs>
                                                        <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#6B7280" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#6B7280" stopOpacity={0} />
                                                        </linearGradient>
                                                        <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                    <XAxis
                                                        dataKey="year"
                                                        stroke="#9CA3AF"
                                                        tickFormatter={(val) => `Y${val}`}
                                                        dy={10}
                                                    />
                                                    <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value / 1000}k`} />
                                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                                    <Area type="monotone" dataKey="currentBalance" stroke="#6B7280" fill="url(#colorCurrent)" name="Current Loan" />
                                                    <Area type="monotone" dataKey="newBalance" stroke="#10B981" fill="url(#colorNew)" name="New Loan" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="h-64 w-full">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Cumulative Savings</h4>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={result.projections} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                    <XAxis
                                                        dataKey="year"
                                                        stroke="#9CA3AF"
                                                        tickFormatter={(val) => `Y${val}`}
                                                        dy={10}
                                                    />
                                                    <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value / 1000}k`} />
                                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                                    <Line type="monotone" dataKey="cumulativeSavings" stroke="#3B82F6" strokeWidth={2} dot={false} name="Net Savings" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                <tr>
                                                    <th className="px-6 py-3">Year</th>
                                                    <th className="px-6 py-3">Current Balance</th>
                                                    <th className="px-6 py-3">New Balance</th>
                                                    <th className="px-6 py-3">Cumulative Savings</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.projections.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((row) => (
                                                    <tr key={row.year} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                            {row.year}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                                            {formatCurrency(row.currentBalance)}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                                            {formatCurrency(row.newBalance)}
                                                        </td>
                                                        <td className={`px-6 py-4 font-medium ${row.cumulativeSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {formatCurrency(row.cumulativeSavings)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Controls */}
                                    {result.projections.length > rowsPerPage && (
                                        <div className="flex items-center justify-between px-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, result.projections.length)} of {result.projections.length} years
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    aria-label="Previous Page"
                                                >
                                                    <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
                                                </button>

                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    Page {currentPage} of {Math.ceil(result.projections.length / rowsPerPage)}
                                                </span>

                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(result.projections.length / rowsPerPage)))}
                                                    disabled={currentPage === Math.ceil(result.projections.length / rowsPerPage)}
                                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    aria-label="Next Page"
                                                >
                                                    <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
