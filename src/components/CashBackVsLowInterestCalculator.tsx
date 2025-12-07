"use client";

import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import CurrencyInput from './CurrencyInput';
import NumberInput from './NumberInput';
import { CalculateButton } from './Shared/CalculateButton';
import { ResetButton } from './Shared/ResetButton';
import { DatePicker } from './Shared/DatePicker';
import { ChevronDown, ChevronUp, Info, CheckCircle, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const CashBackVsLowInterestCalculator = () => {
    // Inputs
    const [carPrice, setCarPrice] = useState<number>(35000);
    const [downPayment, setDownPayment] = useState<number>(5000);
    const [tradeInValue, setTradeInValue] = useState<number>(0);
    const [loanTerm, setLoanTerm] = useState<number>(60);

    // Option A: Cash Back
    const [cashBackAmount, setCashBackAmount] = useState<number>(2500);
    const [standardRate, setStandardRate] = useState<number>(6.5);

    // Option B: Low Interest
    const [lowInterestRate, setLowInterestRate] = useState<number>(0.9);

    // Advanced
    const [salesTaxRate, setSalesTaxRate] = useState<number>(0);
    const [fees, setFees] = useState<number>(0);
    const [includeTaxInLoan, setIncludeTaxInLoan] = useState<boolean>(true);
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Results
    const [results, setResults] = useState({
        optionA: {
            monthlyPayment: 0,
            totalInterest: 0,
            totalCost: 0,
            loanAmount: 0
        },
        optionB: {
            monthlyPayment: 0,
            totalInterest: 0,
            totalCost: 0,
            loanAmount: 0
        },
        savings: 0,
        betterOption: 'A' as 'A' | 'B'
    });

    useEffect(() => {
        calculateComparison();
    }, []); // Only run on mount

    const calculateComparison = (overrides?: {
        carPrice?: number,
        downPayment?: number,
        tradeInValue?: number,
        loanTerm?: number,
        cashBackAmount?: number,
        standardRate?: number,
        lowInterestRate?: number,
        salesTaxRate?: number,
        fees?: number,
        includeTaxInLoan?: boolean
    }) => {
        // Use overrides if provided, otherwise use current state
        const currentCarPrice = overrides?.carPrice ?? carPrice;
        const currentDownPayment = overrides?.downPayment ?? downPayment;
        const currentTradeInValue = overrides?.tradeInValue ?? tradeInValue;
        const currentLoanTerm = overrides?.loanTerm ?? loanTerm;
        const currentCashBackAmount = overrides?.cashBackAmount ?? cashBackAmount;
        const currentStandardRate = overrides?.standardRate ?? standardRate;
        const currentLowInterestRate = overrides?.lowInterestRate ?? lowInterestRate;
        const currentSalesTaxRate = overrides?.salesTaxRate ?? salesTaxRate;
        const currentFees = overrides?.fees ?? fees;
        const currentIncludeTaxInLoan = overrides?.includeTaxInLoan ?? includeTaxInLoan;

        const taxAmount = (currentCarPrice * currentSalesTaxRate) / 100;
        const totalFees = currentFees + (currentIncludeTaxInLoan ? taxAmount : 0);
        const baseAmount = currentCarPrice + totalFees - currentDownPayment - currentTradeInValue;

        // Option A: Cash Back
        const loanAmountA = baseAmount - currentCashBackAmount;
        const rA = currentStandardRate / 100 / 12;
        const n = currentLoanTerm;

        let monthlyPaymentA = 0;
        let totalInterestA = 0;

        if (loanAmountA > 0) {
            if (currentStandardRate === 0) {
                monthlyPaymentA = loanAmountA / n;
            } else {
                monthlyPaymentA = (loanAmountA * rA * Math.pow(1 + rA, n)) / (Math.pow(1 + rA, n) - 1);
            }
            totalInterestA = (monthlyPaymentA * n) - loanAmountA;
        }

        const totalCostToOwnA = currentDownPayment + (monthlyPaymentA * n);


        // Option B: Low Interest
        const loanAmountB = baseAmount;
        const rB = currentLowInterestRate / 100 / 12;

        let monthlyPaymentB = 0;
        let totalInterestB = 0;

        if (loanAmountB > 0) {
            if (currentLowInterestRate === 0) {
                monthlyPaymentB = loanAmountB / n;
            } else {
                monthlyPaymentB = (loanAmountB * rB * Math.pow(1 + rB, n)) / (Math.pow(1 + rB, n) - 1);
            }
            totalInterestB = (monthlyPaymentB * n) - loanAmountB;
        }

        const totalCostToOwnB = currentDownPayment + (monthlyPaymentB * n);

        const savings = Math.abs(totalCostToOwnA - totalCostToOwnB);
        const betterOption = totalCostToOwnA < totalCostToOwnB ? 'A' : 'B';

        setResults({
            optionA: {
                monthlyPayment: monthlyPaymentA,
                totalInterest: totalInterestA,
                totalCost: totalCostToOwnA,
                loanAmount: loanAmountA
            },
            optionB: {
                monthlyPayment: monthlyPaymentB,
                totalInterest: totalInterestB,
                totalCost: totalCostToOwnB,
                loanAmount: loanAmountB
            },
            savings,
            betterOption
        });
    };

    const resetToDefaults = () => {
        const defaults = {
            carPrice: 35000,
            downPayment: 5000,
            tradeInValue: 0,
            loanTerm: 60,
            cashBackAmount: 2500,
            standardRate: 6.5,
            lowInterestRate: 0.9,
            salesTaxRate: 0,
            fees: 0,
            includeTaxInLoan: true,
            showAdvanced: false,
            startDate: new Date().toISOString().split('T')[0]
        };

        // Use flushSync to ensure all state updates happen synchronously
        flushSync(() => {
            setCarPrice(defaults.carPrice);
            setDownPayment(defaults.downPayment);
            setTradeInValue(defaults.tradeInValue);
            setLoanTerm(defaults.loanTerm);
            setCashBackAmount(defaults.cashBackAmount);
            setStandardRate(defaults.standardRate);
            setLowInterestRate(defaults.lowInterestRate);
            setSalesTaxRate(defaults.salesTaxRate);
            setFees(defaults.fees);
            setIncludeTaxInLoan(defaults.includeTaxInLoan);
            setShowAdvanced(defaults.showAdvanced);
            setStartDate(defaults.startDate);
        });

        // Use requestAnimationFrame to ensure calculation happens after DOM updates
        requestAnimationFrame(() => {
            calculateComparison(defaults);
        });
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // 1. Header Section with Gradient-like Bar
        doc.setFillColor(37, 99, 235); // Blue-600
        doc.rect(0, 0, 210, 24, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text('Cash Back vs Low Interest Comparison', 14, 16);

        let startY = 34;

        // 2. Loan Details Section (Modern Box UI)
        const boxX = 14;
        const boxY = 32;
        const boxWidth = 182;
        const boxHeight = 50;

        // Draw Box Background
        doc.setFillColor(248, 250, 252); // Slate-50
        doc.setDrawColor(226, 232, 240); // Slate-200
        doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3, 'FD');

        // Loan Details Title
        doc.setTextColor(30, 41, 59); // Slate-800
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Loan Details", boxX + 6, boxY + 10);

        // Details Grid
        doc.setFontSize(10);
        const col1X = boxX + 6;
        const col2X = boxX + 100;
        const row1Y = boxY + 20;
        const row2Y = boxY + 28;
        const row3Y = boxY + 36;
        const row4Y = boxY + 44;

        const drawDetail = (label: string, value: string, x: number, y: number) => {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(15, 23, 42); // Slate-900
            doc.text(label, x, y);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(71, 85, 105); // Slate-600
            doc.text(value, x + 40, y);
        };

        // Left Column
        drawDetail("Car Price:", `$${carPrice.toLocaleString()}`, col1X, row1Y);
        drawDetail("Down Payment:", `$${downPayment.toLocaleString()}`, col1X, row2Y);
        drawDetail("Trade-in:", `$${tradeInValue.toLocaleString()}`, col1X, row3Y);
        drawDetail("Loan Term:", `${loanTerm} months`, col1X, row4Y);

        // Right Column
        drawDetail("Cash Back:", `$${cashBackAmount.toLocaleString()}`, col2X, row1Y);
        drawDetail("Standard Rate:", `${standardRate}%`, col2X, row2Y);
        drawDetail("Low Rate:", `${lowInterestRate}%`, col2X, row3Y);
        drawDetail("Winner:", `Option ${results.betterOption}`, col2X, row4Y);

        startY = boxY + boxHeight + 10;

        // 3. Comparison Table
        const tableBody = [
            [
                'Loan Amount',
                `$${results.optionA.loanAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                `$${results.optionB.loanAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                `$${Math.abs(results.optionA.loanAmount - results.optionB.loanAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
            ],
            [
                'Interest Rate',
                `${standardRate.toFixed(2)}%`,
                `${lowInterestRate.toFixed(2)}%`,
                `${Math.abs(standardRate - lowInterestRate).toFixed(2)}%`
            ],
            [
                'Loan Term',
                `${loanTerm} months`,
                `${loanTerm} months`,
                '-'
            ],
            [
                'Monthly Payment',
                `$${results.optionA.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                `$${results.optionB.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                `$${Math.abs(results.optionA.monthlyPayment - results.optionB.monthlyPayment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            ],
            [
                'Total Interest',
                `$${results.optionA.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                `$${results.optionB.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                `$${Math.abs(results.optionA.totalInterest - results.optionB.totalInterest).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
            ],
            [
                'Total Cost',
                `$${results.optionA.totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                `$${results.optionB.totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                `$${results.savings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
            ]
        ];

        autoTable(doc, {
            startY: startY,
            head: [['Detail', 'Option A: Cash Back', 'Option B: Low Interest', 'Difference']],
            body: tableBody,
            theme: 'grid',
            headStyles: {
                fillColor: [37, 99, 235], // Blue-600
                textColor: 255,
                fontStyle: 'bold',
                halign: 'center',
                lineWidth: 0.1,
                lineColor: [200, 200, 200]
            },
            bodyStyles: {
                lineWidth: 0.1,
                lineColor: [226, 232, 240], // Slate-200
                textColor: [51, 65, 85] // Slate-700
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252] // Slate-50
            },
            styles: {
                fontSize: 10,
                cellPadding: 4,
                valign: 'middle',
                overflow: 'linebreak'
            },
            columnStyles: {
                0: { halign: 'left', cellWidth: 50 },
                1: { halign: 'right', cellWidth: 45 },
                2: { halign: 'right', cellWidth: 45 },
                3: { halign: 'right', cellWidth: 42 }
            }
        });

        const timestamp = Date.now().toString();
        doc.save(`Cash_Back_vs_Low_Interest_${timestamp}.pdf`);
    };

    // Chart Data
    const chartData = {
        labels: Array.from({ length: loanTerm + 1 }, (_, i) => i),
        datasets: [
            {
                label: 'Option A: Cash Back (Cumulative Cost)',
                data: Array.from({ length: loanTerm + 1 }, (_, i) => {
                    return downPayment + (results.optionA.monthlyPayment * i);
                }),
                borderColor: '#3B82F6', // Blue
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.4
            },
            {
                label: 'Option B: Low Interest (Cumulative Cost)',
                data: Array.from({ length: loanTerm + 1 }, (_, i) => {
                    return downPayment + (results.optionB.monthlyPayment * i);
                }),
                borderColor: '#10B981', // Green
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: false,
                tension: 0.4
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: function (value: any) {
                        return '$' + value.toLocaleString();
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Months'
                }
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Inputs Section */}
                    <div className="lg:col-span-5 space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <Info className="w-5 h-5 mr-2 text-blue-600" />
                                    Loan Details
                                </h3>
                                <ResetButton onClick={resetToDefaults} />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Price</label>
                                    <CurrencyInput value={carPrice} onChange={setCarPrice} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment</label>
                                        <CurrencyInput value={downPayment} onChange={setDownPayment} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Trade-in Value</label>
                                        <CurrencyInput value={tradeInValue} onChange={setTradeInValue} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (Months)</label>
                                    <NumberInput value={loanTerm} onChange={setLoanTerm} suffix="mo" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <h4 className="font-semibold text-blue-800 mb-3">Option A: Cash Back</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-blue-700 mb-1">Cash Back Amount</label>
                                        <CurrencyInput value={cashBackAmount} onChange={setCashBackAmount} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-blue-700 mb-1">Standard Interest Rate</label>
                                        <NumberInput value={standardRate} onChange={setStandardRate} suffix="%" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                <h4 className="font-semibold text-green-800 mb-3">Option B: Low Interest</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-green-700 mb-1">Low Interest Rate</label>
                                        <NumberInput value={lowInterestRate} onChange={setLowInterestRate} suffix="%" />
                                    </div>
                                    <div className="h-[58px] flex items-center justify-center text-xs text-green-600 italic">
                                        No cash back with this option
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer">
                            {showAdvanced ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options (Taxes & Fees)'}
                        </button>

                        {showAdvanced && (
                            <div className="bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-200 animate-in fade-in slide-in-from-top-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sales Tax (%)</label>
                                        <NumberInput value={salesTaxRate} onChange={setSalesTaxRate} suffix="%" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fees</label>
                                        <CurrencyInput value={fees} onChange={setFees} />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="includeTax"
                                        checked={includeTaxInLoan}
                                        onChange={(e) => setIncludeTaxInLoan(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="includeTax" className="text-sm text-gray-700">Include taxes and fees in loan</label>
                                </div>
                                <div>
                                    <DatePicker
                                        label="Start Date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="mt-6">
                            <CalculateButton
                                onClick={() => calculateComparison()}
                                label="Compare Options"
                            />
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Recommendation Card */}
                        <div className={`p-6 rounded-xl border-2 ${results.betterOption === 'A' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                            <div className="flex items-start gap-4">
                                {results.betterOption === 'A' ? (
                                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                ) : (
                                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        Option {results.betterOption} is better!
                                    </h3>
                                    <p className="text-gray-700">
                                        You will save <span className="font-bold text-gray-900">${results.savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> by choosing the
                                        {results.betterOption === 'A' ? ' Cash Back ' : ' Low Interest '} option.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Comparison Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Option A Card */}
                            <div className={`p-5 rounded-xl border ${results.betterOption === 'A' ? 'border-blue-500 shadow-md ring-1 ring-blue-500' : 'border-gray-200 bg-gray-50'}`}>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-gray-900">Option A: Cash Back</h4>
                                    <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                        ${cashBackAmount.toLocaleString()} Rebate
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Monthly Payment</span>
                                        <span className="font-bold text-gray-900">${results.optionA.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Total Interest</span>
                                        <span className="font-medium text-gray-900">${results.optionA.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-200 flex justify-between text-sm">
                                        <span className="text-gray-600 font-medium">Total Cost</span>
                                        <span className="font-bold text-xl text-blue-600">${results.optionA.totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Option B Card */}
                            <div className={`p-5 rounded-xl border ${results.betterOption === 'B' ? 'border-green-500 shadow-md ring-1 ring-green-500' : 'border-gray-200 bg-gray-50'}`}>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-gray-900">Option B: Low Interest</h4>
                                    <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                        {lowInterestRate}% APR
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Monthly Payment</span>
                                        <span className="font-bold text-gray-900">${results.optionB.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Total Interest</span>
                                        <span className="font-medium text-gray-900">${results.optionB.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-200 flex justify-between text-sm">
                                        <span className="text-gray-600 font-medium">Total Cost</span>
                                        <span className="font-bold text-xl text-green-600">${results.optionB.totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 h-80">
                            <h4 className="text-sm font-semibold text-gray-700 mb-4">Cumulative Cost Over Time</h4>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Comparison Table */}
            <div className="mt-12 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Payment Comparison</h3>
                        <button
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                            <Download className="w-4 h-4" />
                            Export PDF
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Detail</th>
                                    <th className="text-right py-3 px-4 font-semibold text-blue-700">Option A: Cash Back</th>
                                    <th className="text-right py-3 px-4 font-semibold text-green-700">Option B: Low Interest</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Difference</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-700">Loan Amount</td>
                                    <td className="py-3 px-4 text-right font-medium">${results.optionA.loanAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                    <td className="py-3 px-4 text-right font-medium">${results.optionB.loanAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                    <td className="py-3 px-4 text-right font-medium">${Math.abs(results.optionA.loanAmount - results.optionB.loanAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-700">Interest Rate</td>
                                    <td className="py-3 px-4 text-right font-medium">{standardRate.toFixed(2)}%</td>
                                    <td className="py-3 px-4 text-right font-medium">{lowInterestRate.toFixed(2)}%</td>
                                    <td className="py-3 px-4 text-right font-medium">{Math.abs(standardRate - lowInterestRate).toFixed(2)}%</td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-700">Loan Term</td>
                                    <td className="py-3 px-4 text-right font-medium">{loanTerm} months</td>
                                    <td className="py-3 px-4 text-right font-medium">{loanTerm} months</td>
                                    <td className="py-3 px-4 text-right font-medium">-</td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50 bg-blue-50">
                                    <td className="py-3 px-4 text-gray-900 font-semibold">Monthly Payment</td>
                                    <td className="py-3 px-4 text-right font-bold text-blue-600">${results.optionA.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="py-3 px-4 text-right font-bold text-green-600">${results.optionB.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="py-3 px-4 text-right font-bold">${Math.abs(results.optionA.monthlyPayment - results.optionB.monthlyPayment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-700">Total Interest Paid</td>
                                    <td className="py-3 px-4 text-right font-medium">${results.optionA.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                    <td className="py-3 px-4 text-right font-medium">${results.optionB.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                    <td className="py-3 px-4 text-right font-medium">${Math.abs(results.optionA.totalInterest - results.optionB.totalInterest).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                </tr>
                                <tr className="border-b-2 border-gray-200 hover:bg-gray-50 bg-green-50">
                                    <td className="py-3 px-4 text-gray-900 font-bold">Total Cost</td>
                                    <td className="py-3 px-4 text-right font-bold text-lg">${results.optionA.totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                    <td className="py-3 px-4 text-right font-bold text-lg">${results.optionB.totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                    <td className="py-3 px-4 text-right font-bold text-lg">${results.savings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                </tr>
                                <tr className="bg-gradient-to-r from-blue-50 to-green-50">
                                    <td className="py-4 px-4 text-gray-900 font-bold">Winner</td>
                                    <td className="py-4 px-4 text-right" colSpan={3}>
                                        <span className={`inline-flex items-center px-4 py-2 rounded-full font-bold ${results.betterOption === 'A' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Option {results.betterOption} saves ${results.savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CashBackVsLowInterestCalculator;
