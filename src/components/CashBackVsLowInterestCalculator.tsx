"use client";

import React, { useState, useEffect } from 'react';
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
import { ChevronDown, ChevronUp, Info, CheckCircle, AlertCircle } from 'lucide-react';

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
    const [vehiclePrice, setVehiclePrice] = useState<number>(35000);
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
    }, [vehiclePrice, downPayment, tradeInValue, loanTerm, cashBackAmount, standardRate, lowInterestRate, salesTaxRate, fees, includeTaxInLoan]);

    const calculateComparison = () => {
        const taxAmount = (vehiclePrice * salesTaxRate) / 100;
        const totalFees = fees + (includeTaxInLoan ? taxAmount : 0);
        const baseAmount = vehiclePrice + totalFees - downPayment - tradeInValue;

        // Option A: Cash Back
        const loanAmountA = baseAmount - cashBackAmount;
        const rA = standardRate / 100 / 12;
        const n = loanTerm;

        let monthlyPaymentA = 0;
        let totalInterestA = 0;

        if (loanAmountA > 0) {
            if (standardRate === 0) {
                monthlyPaymentA = loanAmountA / n;
            } else {
                monthlyPaymentA = (loanAmountA * rA * Math.pow(1 + rA, n)) / (Math.pow(1 + rA, n) - 1);
            }
            totalInterestA = (monthlyPaymentA * n) - loanAmountA;
        }

        const totalCostA = loanAmountA + totalInterestA; // Total cost of loan only (excluding down payment/trade-in for comparison of financing)
        // Or should total cost include the vehicle price? 
        // Let's compare "Total Cost of Buying" = Down Payment + Trade In + Loan Payments.
        // Actually, users usually care about "Total Cost out of pocket".
        // Let's stick to Total Cost of Loan + Down Payment + Trade In (Value) - Cash Back?
        // Simpler: Total Paid = Down Payment + (Monthly * Term). 
        // Wait, Trade In is value provided, not cash paid.
        // Total Cost = Vehicle Price + Tax + Fees + Interest - Cash Back.
        // Let's calculate Total Paid over life of loan.
        const totalPaidA = downPayment + (monthlyPaymentA * n); // This assumes Trade In reduces loan but isn't "paid".
        // Correct comparison metric: Total Cost to Own = Total Payments + Down Payment + Trade In Value (opportunity cost)
        // Let's just compare Total Payments + Down Payment.
        const totalCostToOwnA = downPayment + (monthlyPaymentA * n);


        // Option B: Low Interest
        const loanAmountB = baseAmount;
        const rB = lowInterestRate / 100 / 12;

        let monthlyPaymentB = 0;
        let totalInterestB = 0;

        if (loanAmountB > 0) {
            if (lowInterestRate === 0) {
                monthlyPaymentB = loanAmountB / n;
            } else {
                monthlyPaymentB = (loanAmountB * rB * Math.pow(1 + rB, n)) / (Math.pow(1 + rB, n) - 1);
            }
            totalInterestB = (monthlyPaymentB * n) - loanAmountB;
        }

        const totalCostToOwnB = downPayment + (monthlyPaymentB * n);

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
        setVehiclePrice(35000);
        setDownPayment(5000);
        setTradeInValue(0);
        setLoanTerm(60);
        setCashBackAmount(2500);
        setStandardRate(6.5);
        setLowInterestRate(0.9);
        setSalesTaxRate(0);
        setFees(0);
        setIncludeTaxInLoan(true);
        setShowAdvanced(false);
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
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Info className="w-5 h-5 mr-2 text-blue-600" />
                                Loan Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Price</label>
                                    <CurrencyInput value={vehiclePrice} onChange={setVehiclePrice} />
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

                        <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center text-gray-500 hover:text-gray-700 font-medium text-sm cursor-pointer">
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
                            </div>
                        )}

                        <button
                            onClick={resetToDefaults}
                            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors cursor-pointer"
                        >
                            Reset Values
                        </button>
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
        </div>
    );
};

export default CashBackVsLowInterestCalculator;
