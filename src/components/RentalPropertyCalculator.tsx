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
    ChevronRight,
    Calculator,
    FileText,
    AlertCircle,
    CheckCircle2,
    XCircle,
    RotateCcw
} from 'lucide-react';
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
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    RentalPropertyInput,
    calculateRentalProperty,
    RentalPropertyResults
} from '@/lib/calculations/rentalPropertyCalculations';

export default function RentalPropertyCalculator() {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [input, setInput] = useState<RentalPropertyInput>({
        // Purchase Details
        purchasePrice: 250000,
        downPaymentPercent: 20,
        closingCosts: 7500,
        rehabCosts: 0,

        // Financing
        interestRate: 7.0,
        loanTerm: 30,

        // Income
        monthlyRent: 2000,
        otherMonthlyIncome: 0,
        annualRentIncrease: 3,

        // Operating Expenses
        annualPropertyTax: 3000,
        annualInsurance: 1200,
        monthlyHOA: 0,
        propertyManagementPercent: 10,
        maintenancePercent: 10,
        vacancyRatePercent: 5,
        monthlyUtilities: 0,
        capexReservePercent: 5,

        // Tax Information
        marginalTaxRate: 24,
        buildingValuePercent: 80,

        // Appreciation
        annualAppreciation: 3
    });

    const updateInput = (field: keyof RentalPropertyInput, value: number) => {
        setInput(prev => ({ ...prev, [field]: value }));
    };

    const resetToDefaults = () => {
        setInput({
            purchasePrice: 250000,
            downPaymentPercent: 20,
            closingCosts: 7500,
            rehabCosts: 0,
            interestRate: 7.0,
            loanTerm: 30,
            monthlyRent: 2000,
            otherMonthlyIncome: 0,
            annualRentIncrease: 3,
            annualPropertyTax: 3000,
            annualInsurance: 1200,
            monthlyHOA: 0,
            propertyManagementPercent: 10,
            maintenancePercent: 10,
            vacancyRatePercent: 5,
            monthlyUtilities: 0,
            capexReservePercent: 5,
            marginalTaxRate: 24,
            buildingValuePercent: 80,
            annualAppreciation: 3
        });
        setShowAdvanced(false);
    };

    const results: RentalPropertyResults = useMemo(() => {
        return calculateRentalProperty(input);
    }, [input]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(val);
    };

    const formatPercent = (val: number) => {
        return `${val.toFixed(2)}%`;
    };

    // Pagination for yearly projections
    const totalPages = Math.ceil(results.yearlyProjections.length / itemsPerPage);
    const paginatedProjections = results.yearlyProjections.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Chart data
    const cashFlowChartData = results.yearlyProjections.slice(0, 10).map(p => ({
        year: `Year ${p.year}`,
        cashFlow: p.cashFlow,
        noi: p.noi
    }));

    const equityChartData = results.yearlyProjections.slice(0, 30).map(p => ({
        year: p.year,
        equity: p.equity,
        propertyValue: p.propertyValue
    }));

    const expenseBreakdownData = [
        { name: 'Property Tax', value: input.annualPropertyTax },
        { name: 'Insurance', value: input.annualInsurance },
        { name: 'HOA', value: input.monthlyHOA * 12 },
        { name: 'Property Mgmt', value: (input.monthlyRent + input.otherMonthlyIncome) * 12 * (input.propertyManagementPercent / 100) },
        { name: 'Maintenance', value: (input.monthlyRent + input.otherMonthlyIncome) * 12 * (input.maintenancePercent / 100) },
        { name: 'Vacancy', value: (input.monthlyRent + input.otherMonthlyIncome) * 12 * (input.vacancyRatePercent / 100) },
        { name: 'Utilities', value: input.monthlyUtilities * 12 },
        { name: 'CapEx', value: (input.monthlyRent + input.otherMonthlyIncome) * 12 * (input.capexReservePercent / 100) }
    ].filter(item => item.value > 0);

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#84cc16'];

    const roiComparisonData = [
        { metric: 'Cash-on-Cash', value: results.cashOnCashReturn },
        { metric: 'Cap Rate', value: results.capRate },
        { metric: 'IRR (10yr)', value: results.irr }
    ];

    return (
        <div className="space-y-6">
            {/* Main Content Area */}
            <div className="space-y-6">
                {/* Input Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Building2 className="text-blue-600" size={28} />
                            Property Details
                        </h2>
                        <button
                            onClick={resetToDefaults}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reset
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Purchase Details */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Home size={18} className="text-blue-600" />
                                Purchase Information
                            </h3>

                            <InputNumber
                                label="Purchase Price"
                                value={input.purchasePrice}
                                onChange={(e) => updateInput('purchasePrice', Number(e.target.value))}
                                symbol="$"
                                step={1000}
                            />

                            <InputNumber
                                label="Down Payment (%)"
                                value={input.downPaymentPercent}
                                onChange={(e) => updateInput('downPaymentPercent', Number(e.target.value))}
                                step={1}
                                min={0}
                                max={100}
                                helperText="Typical: 20-25% for investment properties"
                            />

                            <InputNumber
                                label="Closing Costs"
                                value={input.closingCosts}
                                onChange={(e) => updateInput('closingCosts', Number(e.target.value))}
                                symbol="$"
                                step={100}
                                helperText="Usually 2-5% of purchase price"
                            />

                            <InputNumber
                                label="Rehab/Renovation Costs"
                                value={input.rehabCosts}
                                onChange={(e) => updateInput('rehabCosts', Number(e.target.value))}
                                symbol="$"
                                step={500}
                            />
                        </div>

                        {/* Financing */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Calculator size={18} className="text-blue-600" />
                                Financing
                            </h3>

                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Loan Amount</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(results.loanAmount)}
                                </p>
                            </div>

                            <InputNumber
                                label="Interest Rate (%)"
                                value={input.interestRate}
                                onChange={(e) => updateInput('interestRate', Number(e.target.value))}
                                step={0.125}
                            />

                            <InputNumber
                                label="Loan Term (Years)"
                                value={input.loanTerm}
                                onChange={(e) => updateInput('loanTerm', Number(e.target.value))}
                                step={5}
                                min={10}
                                max={30}
                            />

                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Payment</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(results.monthlyPayment)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Income Section */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <DollarSign size={18} className="text-green-600" />
                            Rental Income
                        </h3>

                        <div className="grid md:grid-cols-3 gap-4">
                            <InputNumber
                                label="Monthly Rent"
                                value={input.monthlyRent}
                                onChange={(e) => updateInput('monthlyRent', Number(e.target.value))}
                                symbol="$"
                                step={50}
                            />

                            <InputNumber
                                label="Other Monthly Income"
                                value={input.otherMonthlyIncome}
                                onChange={(e) => updateInput('otherMonthlyIncome', Number(e.target.value))}
                                symbol="$"
                                step={10}
                                helperText="Laundry, parking, storage, etc."
                            />

                            <InputNumber
                                label="Annual Rent Increase (%)"
                                value={input.annualRentIncrease}
                                onChange={(e) => updateInput('annualRentIncrease', Number(e.target.value))}
                                step={0.5}
                                helperText="Typical: 2-4% per year"
                            />
                        </div>
                    </div>

                    {/* Operating Expenses */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="w-full flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white mb-4"
                        >
                            <span className="flex items-center gap-2">
                                <PiggyBank size={18} className="text-orange-600" />
                                Operating Expenses
                            </span>
                            {showAdvanced ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        {showAdvanced && (
                            <div className="grid md:grid-cols-2 gap-4">
                                <InputNumber
                                    label="Annual Property Tax"
                                    value={input.annualPropertyTax}
                                    onChange={(e) => updateInput('annualPropertyTax', Number(e.target.value))}
                                    symbol="$"
                                    step={100}
                                />

                                <InputNumber
                                    label="Annual Insurance"
                                    value={input.annualInsurance}
                                    onChange={(e) => updateInput('annualInsurance', Number(e.target.value))}
                                    symbol="$"
                                    step={50}
                                />

                                <InputNumber
                                    label="Monthly HOA Fees"
                                    value={input.monthlyHOA}
                                    onChange={(e) => updateInput('monthlyHOA', Number(e.target.value))}
                                    symbol="$"
                                    step={10}
                                />

                                <InputNumber
                                    label="Property Management (% of rent)"
                                    value={input.propertyManagementPercent}
                                    onChange={(e) => updateInput('propertyManagementPercent', Number(e.target.value))}
                                    step={1}
                                    helperText="Typical: 8-12% of monthly rent"
                                />

                                <InputNumber
                                    label="Maintenance & Repairs (% of rent)"
                                    value={input.maintenancePercent}
                                    onChange={(e) => updateInput('maintenancePercent', Number(e.target.value))}
                                    step={1}
                                    helperText="Typical: 10-15% of monthly rent"
                                />

                                <InputNumber
                                    label="Vacancy Rate (%)"
                                    value={input.vacancyRatePercent}
                                    onChange={(e) => updateInput('vacancyRatePercent', Number(e.target.value))}
                                    step={1}
                                    helperText="Typical: 5-10% depending on market"
                                />

                                <InputNumber
                                    label="Monthly Utilities (if paid)"
                                    value={input.monthlyUtilities}
                                    onChange={(e) => updateInput('monthlyUtilities', Number(e.target.value))}
                                    symbol="$"
                                    step={10}
                                />

                                <InputNumber
                                    label="CapEx Reserves (% of rent)"
                                    value={input.capexReservePercent}
                                    onChange={(e) => updateInput('capexReservePercent', Number(e.target.value))}
                                    step={1}
                                    helperText="Capital expenditures: roof, HVAC, etc. Typical: 5-10%"
                                />

                                <InputNumber
                                    label="Marginal Tax Rate (%)"
                                    value={input.marginalTaxRate}
                                    onChange={(e) => updateInput('marginalTaxRate', Number(e.target.value))}
                                    step={1}
                                />

                                <InputNumber
                                    label="Building Value (vs Land) (%)"
                                    value={input.buildingValuePercent}
                                    onChange={(e) => updateInput('buildingValuePercent', Number(e.target.value))}
                                    step={5}
                                    helperText="For depreciation. Typical: 75-85%"
                                />

                                <InputNumber
                                    label="Annual Appreciation (%)"
                                    value={input.annualAppreciation}
                                    onChange={(e) => updateInput('annualAppreciation', Number(e.target.value))}
                                    step={0.5}
                                    helperText="Historical average: 3-4% per year"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Key Metrics Dashboard */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-lg p-6 border border-blue-200 dark:border-blue-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Key Investment Metrics</h2>

                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                        {/* Monthly Cash Flow */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Cash Flow</p>
                                {results.monthlyCashFlow >= 0 ? (
                                    <CheckCircle2 size={18} className="text-green-600" />
                                ) : (
                                    <XCircle size={18} className="text-red-600" />
                                )}
                            </div>
                            <p className={`text-3xl font-bold ${results.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(results.monthlyCashFlow)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Annual: {formatCurrency(results.annualCashFlow)}
                            </p>
                        </div>

                        {/* Cash-on-Cash Return */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cash-on-Cash Return</p>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {formatPercent(results.cashOnCashReturn)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Target: 8-12%
                            </p>
                        </div>

                        {/* Cap Rate */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cap Rate</p>
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                {formatPercent(results.capRate)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                NOI: {formatCurrency(results.noi)}
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {/* DSCR */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-600 dark:text-gray-400">DSCR</p>
                                {results.dscr >= 1.25 ? (
                                    <CheckCircle2 size={18} className="text-green-600" />
                                ) : (
                                    <AlertCircle size={18} className="text-orange-600" />
                                )}
                            </div>
                            <p className={`text-3xl font-bold ${results.dscr >= 1.25 ? 'text-green-600' : 'text-orange-600'}`}>
                                {results.dscr.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Lender Min: 1.25
                            </p>
                        </div>

                        {/* IRR */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">IRR (10-Year)</p>
                            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                {formatPercent(results.irr)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Internal Rate of Return
                            </p>
                        </div>

                        {/* Total Investment */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Cash Needed</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(results.totalCashNeeded)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Down + Closing + Rehab
                            </p>
                        </div>
                    </div>

                    {/* Investment Rules */}
                    <div className="mt-6 pt-6 border-t border-blue-200 dark:border-blue-800">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Investment Rule Checks</h3>
                        <div className="grid md:grid-cols-3 gap-3">
                            <div className={`flex items-center gap-2 p-3 rounded-lg ${results.onePercentRule.passes ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                                {results.onePercentRule.passes ? (
                                    <CheckCircle2 size={20} className="text-green-600" />
                                ) : (
                                    <XCircle size={20} className="text-red-600" />
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">1% Rule</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{formatPercent(results.onePercentRule.ratio)}</p>
                                </div>
                            </div>

                            <div className={`flex items-center gap-2 p-3 rounded-lg ${results.fiftyPercentRule.passes ? 'bg-green-100 dark:bg-green-900/20' : 'bg-orange-100 dark:bg-orange-900/20'}`}>
                                {results.fiftyPercentRule.passes ? (
                                    <CheckCircle2 size={20} className="text-green-600" />
                                ) : (
                                    <AlertCircle size={20} className="text-orange-600" />
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">50% Rule</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{formatPercent(results.fiftyPercentRule.expenseRatio)} expenses</p>
                                </div>
                            </div>

                            <div className={`flex items-center gap-2 p-3 rounded-lg ${results.dscr >= 1.25 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-orange-100 dark:bg-orange-900/20'}`}>
                                {results.dscr >= 1.25 ? (
                                    <CheckCircle2 size={20} className="text-green-600" />
                                ) : (
                                    <AlertCircle size={20} className="text-orange-600" />
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">DSCR ≥ 1.25</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Lender Qualification</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cash Flow Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cash Flow vs NOI</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={cashFlowChartData} margin={{ top: 5, right: 5, left: 5, bottom: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis
                                    dataKey="year"
                                    stroke="#9ca3af"
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Bar dataKey="noi" fill="#3b82f6" name="NOI" />
                                <Line type="monotone" dataKey="cashFlow" stroke="#10b981" strokeWidth={2} name="Cash Flow" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    {/* ROI Comparison */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Return Metrics Comparison</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={roiComparisonData} margin={{ top: 5, right: 5, left: 5, bottom: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis
                                    dataKey="metric"
                                    stroke="#9ca3af"
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value: number) => `${value.toFixed(2)}%`}
                                />
                                <Bar dataKey="value" fill="#8b5cf6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Equity Build-Up Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">30-Year Equity Build-Up</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={equityChartData} margin={{ top: 5, right: 5, left: 5, bottom: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis
                                    dataKey="year"
                                    stroke="#9ca3af"
                                    label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Area type="monotone" dataKey="propertyValue" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Property Value" />
                                <Area type="monotone" dataKey="equity" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.8} name="Equity" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Expense Breakdown */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Annual Operating Expenses Breakdown</h3>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={expenseBreakdownData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {expenseBreakdownData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2">
                                {expenseBreakdownData.map((item, index) => (
                                    <div key={item.name} className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}: {formatCurrency(item.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tax Benefits Summary */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-lg p-6 border border-green-200 dark:border-green-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tax Benefits (Year 1)</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Annual Depreciation</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(results.annualDepreciation)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">27.5 year schedule</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mortgage Interest</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(results.yearlyProjections[0]?.mortgageInterest || 0)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tax deductible</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Tax Savings</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(results.yearlyProjections[0]?.taxSavings || 0)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">At {input.marginalTaxRate}% rate</p>
                        </div>
                    </div>
                </div>

                {/* 30-Year Projections Table */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">30-Year Projections</h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Year</th>
                                    <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">Rental Income</th>
                                    <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">Expenses</th>
                                    <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">NOI</th>
                                    <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">Cash Flow</th>
                                    <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">CoC Return</th>
                                    <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">Equity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProjections.map((proj, index) => (
                                    <tr key={proj.year} className={`border-b border-gray-100 dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900/50' : ''}`}>
                                        <td className="py-3 px-2 text-gray-900 dark:text-white font-medium">{proj.year}</td>
                                        <td className="py-3 px-2 text-right text-gray-700 dark:text-gray-300">{formatCurrency(proj.rentalIncome)}</td>
                                        <td className="py-3 px-2 text-right text-gray-700 dark:text-gray-300">{formatCurrency(proj.operatingExpenses)}</td>
                                        <td className="py-3 px-2 text-right text-gray-700 dark:text-gray-300">{formatCurrency(proj.noi)}</td>
                                        <td className={`py-3 px-2 text-right font-semibold ${proj.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(proj.cashFlow)}
                                        </td>
                                        <td className="py-3 px-2 text-right text-blue-600 dark:text-blue-400 font-semibold">
                                            {formatPercent(proj.cashOnCashReturn)}
                                        </td>
                                        <td className="py-3 px-2 text-right text-gray-700 dark:text-gray-300">{formatCurrency(proj.equity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={18} />
                                Previous
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
