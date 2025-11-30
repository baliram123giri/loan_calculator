'use client';

import React, { useState, useMemo } from 'react';
import {
    Building2,
    DollarSign,
    Percent,
    TrendingUp,
    Home,
    Wallet,
    PiggyBank,
    ChevronDown,
    ChevronUp,
    Info,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import {
    calculateRealEstateMetrics,
    type RealEstateInput,
    type RealEstateResult
} from '@/lib/calculations/realEstate';
import { InputNumber } from './Shared/InputNumber';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    ComposedChart,
    Line
} from 'recharts';

export default function RealEstateCalculator() {
    const [activeTab, setActiveTab] = useState<'overview' | 'projections'>('overview');
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const [input, setInput] = useState<RealEstateInput>({
        purchasePrice: 200000,
        downPayment: 40000,
        interestRate: 7.0,
        loanTermYears: 30,
        closingCosts: 5000,
        rehabCosts: 0,
        grossRent: 2000,
        otherIncome: 0,
        vacancyRate: 5,
        propertyTax: 250,
        insurance: 100,
        hoaFees: 0,
        maintenance: 5, // %
        managementFee: 0, // %
        otherExpenses: 0,
        appreciationRate: 3,
        rentIncreaseRate: 2,
        expenseIncreaseRate: 2,
        sellingCosts: 6,
        holdingPeriod: 30
    });

    const result: RealEstateResult = useMemo(() => {
        return calculateRealEstateMetrics(input);
    }, [input]);

    const updateInput = (field: keyof RealEstateInput, value: number) => {
        setInput(prev => ({ ...prev, [field]: value }));
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    const formatPercent = (val: number) => {
        return `${val.toFixed(2)}%`;
    };

    return (
        <div className="w-full space-y-8">
            <div className="grid lg:grid-cols-12 gap-8">
                {/* Inputs Column */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Property & Loan */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Home className="w-5 h-5 text-blue-600" />
                            Property & Loan
                        </h3>
                        <div className="space-y-4">
                            <InputNumber
                                label="Purchase Price"
                                value={input.purchasePrice}
                                onChange={(e) => updateInput('purchasePrice', parseFloat(e.target.value) || 0)}
                                symbol="$"
                            />
                            <InputNumber
                                label="Down Payment"
                                value={input.downPayment}
                                onChange={(e) => updateInput('downPayment', parseFloat(e.target.value) || 0)}
                                symbol="$"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <InputNumber
                                    label="Interest Rate"
                                    value={input.interestRate}
                                    onChange={(e) => updateInput('interestRate', parseFloat(e.target.value) || 0)}
                                    symbol="%"
                                />
                                <InputNumber
                                    label="Loan Term (Years)"
                                    value={input.loanTermYears}
                                    onChange={(e) => updateInput('loanTermYears', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <InputNumber
                                label="Closing Costs"
                                value={input.closingCosts}
                                onChange={(e) => updateInput('closingCosts', parseFloat(e.target.value) || 0)}
                                symbol="$"
                            />
                            <InputNumber
                                label="Rehab Costs"
                                value={input.rehabCosts}
                                onChange={(e) => updateInput('rehabCosts', parseFloat(e.target.value) || 0)}
                                symbol="$"
                            />
                        </div>
                    </div>

                    {/* Income & Expenses */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-green-600" />
                            Income & Expenses
                        </h3>
                        <div className="space-y-4">
                            <InputNumber
                                label="Monthly Gross Rent"
                                value={input.grossRent}
                                onChange={(e) => updateInput('grossRent', parseFloat(e.target.value) || 0)}
                                symbol="$"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <InputNumber
                                    label="Property Tax (Mo)"
                                    value={input.propertyTax}
                                    onChange={(e) => updateInput('propertyTax', parseFloat(e.target.value) || 0)}
                                    symbol="$"
                                />
                                <InputNumber
                                    label="Insurance (Mo)"
                                    value={input.insurance}
                                    onChange={(e) => updateInput('insurance', parseFloat(e.target.value) || 0)}
                                    symbol="$"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputNumber
                                    label="HOA Fees (Mo)"
                                    value={input.hoaFees}
                                    onChange={(e) => updateInput('hoaFees', parseFloat(e.target.value) || 0)}
                                    symbol="$"
                                />
                                <InputNumber
                                    label="Vacancy Rate"
                                    value={input.vacancyRate}
                                    onChange={(e) => updateInput('vacancyRate', parseFloat(e.target.value) || 0)}
                                    symbol="%"
                                />
                            </div>

                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            >
                                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                            </button>

                            {showAdvanced && (
                                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputNumber
                                            label="Maintenance"
                                            value={input.maintenance}
                                            onChange={(e) => updateInput('maintenance', parseFloat(e.target.value) || 0)}
                                            symbol="%"
                                        />
                                        <InputNumber
                                            label="Management Fee"
                                            value={input.managementFee}
                                            onChange={(e) => updateInput('managementFee', parseFloat(e.target.value) || 0)}
                                            symbol="%"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputNumber
                                            label="Appreciation"
                                            value={input.appreciationRate}
                                            onChange={(e) => updateInput('appreciationRate', parseFloat(e.target.value) || 0)}
                                            symbol="%"
                                        />
                                        <InputNumber
                                            label="Rent Increase"
                                            value={input.rentIncreaseRate}
                                            onChange={(e) => updateInput('rentIncreaseRate', parseFloat(e.target.value) || 0)}
                                            symbol="%"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Results Column */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                            <p className="text-blue-100 text-sm font-medium mb-1">Monthly Cash Flow</p>
                            <h3 className="text-3xl font-bold">{formatCurrency(result.monthly.cashFlow)}</h3>
                            <p className="text-blue-100 text-xs mt-2">
                                Income: {formatCurrency(result.monthly.income.effective)}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                            <p className="text-purple-100 text-sm font-medium mb-1">Cash on Cash Return</p>
                            <h3 className="text-3xl font-bold">{formatPercent(result.metrics.cashOnCash)}</h3>
                            <p className="text-purple-100 text-xs mt-2">
                                Annual Cash Flow / Investment
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                            <p className="text-emerald-100 text-sm font-medium mb-1">Cap Rate</p>
                            <h3 className="text-3xl font-bold">{formatPercent(result.metrics.capRate)}</h3>
                            <p className="text-emerald-100 text-xs mt-2">
                                NOI / Purchase Price
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
                                30-Year Projections
                            </button>
                        </div>

                        <div className="p-6">
                            {activeTab === 'overview' ? (
                                <div className="space-y-8">
                                    {/* Monthly Breakdown */}
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Breakdown</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                    <span className="text-gray-600 dark:text-gray-400">Net Operating Income (NOI)</span>
                                                    <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(result.monthly.noi)}</span>
                                                </div>
                                                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                    <span className="text-gray-600 dark:text-gray-400">Mortgage Payment</span>
                                                    <span className="font-semibold text-red-600 dark:text-red-400">-{formatCurrency(result.monthly.expenses.mortgage)}</span>
                                                </div>
                                                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                    <span className="text-gray-600 dark:text-gray-400">Total Expenses</span>
                                                    <span className="font-semibold text-red-600 dark:text-red-400">-{formatCurrency(result.monthly.expenses.total)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Investment Health</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-600 dark:text-gray-400">DSCR</span>
                                                        <div className="group relative">
                                                            <Info className="w-4 h-4 text-gray-400" />
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg hidden group-hover:block z-10">
                                                                Debt Service Coverage Ratio. Should be {'>'} 1.25
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className={`font-semibold ${result.metrics.debtServiceCoverageRatio >= 1.25 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                        {result.metrics.debtServiceCoverageRatio.toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                    <span className="text-gray-600 dark:text-gray-400">Break-even Occupancy</span>
                                                    <span className="font-semibold text-gray-900 dark:text-white">{result.metrics.breakEvenOccupancy.toFixed(1)}%</span>
                                                </div>
                                                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                    <span className="text-gray-600 dark:text-gray-400">Annual Depreciation (Tax)</span>
                                                    <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(result.tax.annualDepreciation)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Charts */}
                                    <div className="h-80 w-full">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Equity vs Loan Balance (30 Years)</h4>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={result.projections}>
                                                <defs>
                                                    <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                <XAxis dataKey="year" stroke="#9CA3AF" />
                                                <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value / 1000}k`} />
                                                <Tooltip
                                                    formatter={(value: number) => formatCurrency(value)}
                                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                />
                                                <Legend />
                                                <Area type="monotone" dataKey="equity" stackId="1" stroke="#10B981" fill="url(#colorEquity)" name="Equity" />
                                                <Area type="monotone" dataKey="loanBalance" stackId="1" stroke="#EF4444" fill="#FEE2E2" name="Loan Balance" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                <tr>
                                                    <th className="px-6 py-3">Year</th>
                                                    <th className="px-6 py-3">Cash Flow</th>
                                                    <th className="px-6 py-3">Equity</th>
                                                    <th className="px-6 py-3">Property Value</th>
                                                    <th className="px-6 py-3">ROI</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.projections.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((year) => (
                                                    <tr key={year.year} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                            {year.year}
                                                        </td>
                                                        <td className={`px-6 py-4 ${year.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {formatCurrency(year.cashFlow)}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                                            {formatCurrency(year.equity)}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                                            {formatCurrency(year.propertyValue)}
                                                        </td>
                                                        <td className="px-6 py-4 text-blue-600 dark:text-blue-400">
                                                            {formatPercent(year.roi)}
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
