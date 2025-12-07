'use client';

import React, { useState } from 'react';
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
    RotateCcw,
    FileText
} from 'lucide-react';
import {
    calculateRefinanceMetrics,
    type RefinanceInput,
    type RefinanceResult
} from '@/lib/calculations/refinance';
import { InputNumber } from './Shared/InputNumber';
import { CalculateButton } from './Shared/CalculateButton';
import jsPDF from 'jspdf';
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
            return next;
        });
    };

    const getCalculation = (currentInput: RefinanceInput, cashOut: boolean): RefinanceResult => {
        const effectiveNewLoanAmount = cashOut
            ? currentInput.newLoanAmount + currentInput.cashOutAmount
            : currentInput.newLoanAmount;

        return calculateRefinanceMetrics({
            ...currentInput,
            newLoanAmount: effectiveNewLoanAmount
        });
    };

    const [result, setResult] = useState<RefinanceResult>(getCalculation(input, isCashOut));

    const performCalculation = () => {
        setResult(getCalculation(input, isCashOut));
    };

    const resetToDefaults = () => {
        const defaultInput = {
            currentLoanBalance: 300000,
            currentInterestRate: 7.0,
            currentTermYears: 25,
            newLoanAmount: 300000,
            newInterestRate: 5.5,
            newTermYears: 30,
            closingCosts: 5000,
            cashOutAmount: 0
        };
        const defaultCashOut = false;

        setInput(defaultInput);
        setIsCashOut(defaultCashOut);
        setActiveTab('overview');
        setCurrentPage(1);

        // Immediately recalculate
        setResult(getCalculation(defaultInput, defaultCashOut));
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(59, 130, 246); // Blue-500
        doc.rect(0, 0, 210, 35, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Refinance Analysis Report', 14, 18);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const today = new Date();
        const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
        doc.text(`Generated on ${formattedDate}`, 14, 26);

        // Loan Comparison
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Loan Comparison', 14, 45);

        const effectiveNewLoan = isCashOut ? input.newLoanAmount + input.cashOutAmount : input.newLoanAmount;

        const comparisonData = [
            ['Metric', 'Current Loan', 'New Loan'],
            ['Loan Amount', formatCurrency(input.currentLoanBalance), formatCurrency(effectiveNewLoan)],
            ['Interest Rate', `${input.currentInterestRate}%`, `${input.newInterestRate}%`],
            ['Term', `${input.currentTermYears} Years`, `${input.newTermYears} Years`],
            ['Monthly Payment', formatCurrency(result.monthly.currentPayment), formatCurrency(result.monthly.newPayment)],
            ['Total Interest', formatCurrency(result.lifetime.currentTotalInterest), formatCurrency(result.lifetime.newTotalInterest)],
            ['Total Cost', formatCurrency(result.lifetime.totalCostCurrent), formatCurrency(result.lifetime.totalCostNew)]
        ];

        const autoTable = require('jspdf-autotable').default;

        autoTable(doc, {
            startY: 50,
            head: [comparisonData[0]],
            body: comparisonData.slice(1),
            theme: 'grid',
            headStyles: {
                fillColor: [59, 130, 246],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 10,
                cellPadding: 3
            },
            alternateRowStyles: {
                fillColor: [249, 250, 251]
            }
        });

        let yPos = (doc as any).lastAutoTable.finalY + 15;

        // Savings Analysis
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Savings Analysis', 14, yPos);

        yPos += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        const savingsData = [
            `Monthly Savings: ${formatCurrency(result.monthly.savings)}`,
            `Lifetime Savings: ${formatCurrency(result.lifetime.netLifetimeSavings)}`,
            `Interest Savings: ${formatCurrency(result.lifetime.interestSavings)}`,
            `Break-Even Point: ${result.breakEvenMonths > 0 ? Math.ceil(result.breakEvenMonths) + ' Months' : 'N/A'}`
        ];

        savingsData.forEach(item => {
            doc.text(item, 14, yPos);
            yPos += 6;
        });

        // Projections Table
        yPos += 10;

        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Amortization Schedule', 14, yPos);

        const tableData = result.projections.map(row => [
            row.year.toString(),
            formatCurrency(row.currentBalance),
            formatCurrency(row.newBalance),
            formatCurrency(row.cumulativeSavings)
        ]);

        autoTable(doc, {
            startY: yPos + 5,
            head: [['Year', 'Current Balance', 'New Balance', 'Cumulative Savings']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [59, 130, 246],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            columnStyles: {
                0: { halign: 'center' },
                1: { halign: 'right' },
                2: { halign: 'right' },
                3: { halign: 'right' }
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            alternateRowStyles: {
                fillColor: [249, 250, 251]
            }
        });

        // Footer
        const pageCount = doc.internal.pages.length - 1;
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.setPage(pageCount);
        doc.text('This report is for informational purposes only.', 14, 280);

        doc.save(`Refinance_Analysis_${Date.now()}.pdf`);
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

                    {/* Calculate Button */}
                    <div className="pt-2">
                        <CalculateButton onClick={performCalculation} label="Calculate Refinance Benefits" />
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
                                className={`flex-1 py-4 text-sm font-medium text-center transition-colors cursor-pointer ${activeTab === 'overview'
                                    ? 'bg-gray-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                Overview & Charts
                            </button>
                            <button
                                onClick={() => setActiveTab('projections')}
                                className={`flex-1 py-4 text-sm font-medium text-center transition-colors cursor-pointer ${activeTab === 'projections'
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

                                    {/* Export PDF Button */}
                                    <div className="flex justify-center mt-8">
                                        <button
                                            onClick={handleExportPDF}
                                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm cursor-pointer shadow-sm"
                                        >
                                            <FileText size={18} />
                                            Export PDF Report
                                        </button>
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
                                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
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
                                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                                    aria-label="Next Page"
                                                >
                                                    <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Export PDF Button */}
                                    <div className="flex justify-center mt-8">
                                        <button
                                            onClick={handleExportPDF}
                                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm cursor-pointer shadow-sm"
                                        >
                                            <FileText size={18} />
                                            Export PDF Report
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
