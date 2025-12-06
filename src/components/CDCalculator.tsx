"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import {
    Calculator,
    TrendingUp,
    DollarSign,
    Calendar,
    Percent,
    RefreshCw,
    Download,
    Info,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Heart
} from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import NumberInput from './NumberInput';
import ExportButton from './ExportButton';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

interface CDResult {
    totalBalance: number;
    totalInterest: number;
    apy: number;
    realValue: number;
    taxAmount: number;
    afterTaxBalance: number;
}

interface ScheduleItem {
    period: number; // Month number
    year: number;
    interestEarned: number;
    totalInterest: number;
    balance: number;
}

export default function CDCalculator() {
    // Basic Inputs
    const [depositAmount, setDepositAmount] = useState(10000);
    const [rate, setRate] = useState(5.0);
    const [termYears, setTermYears] = useState(5);
    const [termMonths, setTermMonths] = useState(0);
    const [compoundingFrequency, setCompoundingFrequency] = useState(12); // Monthly default

    // Advanced Inputs
    const [taxRate, setTaxRate] = useState(0);
    const [inflationRate, setInflationRate] = useState(0);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // AI Suggestions
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [liked, setLiked] = useState(false);

    // Calculation Logic
    const { result, schedule } = useMemo(() => {
        const principal = depositAmount;
        const annualRate = rate / 100;
        const totalYears = termYears + (termMonths / 12);
        const frequency = compoundingFrequency;

        // Validation for zero/negative values to avoid NaN
        if (principal <= 0 || totalYears <= 0) {
            return {
                result: {
                    totalBalance: 0,
                    totalInterest: 0,
                    apy: 0,
                    realValue: 0,
                    taxAmount: 0,
                    afterTaxBalance: 0
                },
                schedule: []
            };
        }

        // Standard Compound Interest Formula: A = P(1 + r/n)^(nt)
        const totalPeriods = totalYears * frequency;
        const ratePerPeriod = annualRate / frequency;

        let currentBalance = principal;
        let totalInterest = 0;
        const scheduleData: ScheduleItem[] = [];

        // Generate Schedule
        // We will generate monthly data points for the schedule/chart even if compounding is different
        // to keep the chart smooth. For accuracy, we calculate the exact compounded value at each month.
        const totalMonths = Math.ceil(totalYears * 12);

        for (let m = 1; m <= totalMonths; m++) {
            const t = m / 12; // Time in years
            const amount = principal * Math.pow(1 + ratePerPeriod, frequency * t);
            const interest = amount - principal;
            const periodInterest = amount - (scheduleData.length > 0 ? scheduleData[scheduleData.length - 1].balance : principal);

            scheduleData.push({
                period: m,
                year: Math.ceil(m / 12),
                interestEarned: periodInterest,
                totalInterest: interest,
                balance: amount
            });
        }

        const finalBalance = principal * Math.pow(1 + ratePerPeriod, frequency * totalYears);
        const finalInterest = finalBalance - principal;

        // APY Formula: APY = (1 + r/n)^n - 1
        const apy = (Math.pow(1 + ratePerPeriod, frequency) - 1) * 100;

        // Real Value (Inflation Adjusted): PV = FV / (1 + i)^t
        const realVal = finalBalance / Math.pow(1 + inflationRate / 100, totalYears);

        // Tax Calculation
        const taxAmt = finalInterest * (taxRate / 100);
        const afterTaxBal = finalBalance - taxAmt;

        return {
            result: {
                totalBalance: finalBalance,
                totalInterest: finalInterest,
                apy,
                realValue: realVal,
                taxAmount: taxAmt,
                afterTaxBalance: afterTaxBal
            },
            schedule: scheduleData
        };
    }, [depositAmount, rate, termYears, termMonths, compoundingFrequency, taxRate, inflationRate]);

    // AI Suggestions Generation
    useEffect(() => {
        const newSuggestions = [];
        const totalYears = termYears + (termMonths / 12);

        if (rate < 3) {
            newSuggestions.push("💡 Rates adhere to market trends. With a rate below 3%, consider looking for high-yield savings accounts or short-term treasury bills which might offer better liquidity.");
        } else if (rate > 5) {
            newSuggestions.push("🚀 Excellent rate! Locking in a rate above 5% is historically a strong move for guaranteed returns.");
        }

        if (totalYears > 5) {
            newSuggestions.push("📅 Long-term Lock: You're locking money for over 5 years. Ensure you have a separate emergency fund as early withdrawal penalties can eat into your principal.");
        } else if (totalYears < 1) {
            newSuggestions.push("🔄 Short-term CD: Good for parking cash you'll need soon. Have you checked if a No-Penalty CD offers a similar rate?");
        }

        if (compoundingFrequency === 1) {
            newSuggestions.push("📈 Pro Tip: Switching to daily or monthly compounding could slightly increase your APY compared to annual compounding.");
        }

        if (inflationRate > 0 && result.apy < inflationRate) {
            newSuggestions.push(`⚠️ Inflation Alert: Your APY (${result.apy.toFixed(2)}%) is lower than the inflation rate (${inflationRate}%). Your purchasing power may actually decrease over time.`);
        }

        // CD Ladder suggestion
        if (depositAmount >= 10000 && totalYears >= 3) {
            newSuggestions.push("🪜 Strategy: With this amount and term, consider a 'CD Ladder'. Split your $10k into five $2k CDs maturing in 1, 2, 3, 4, and 5 years to balance high rates with liquidity.");
        }

        setSuggestions(newSuggestions);
    }, [depositAmount, rate, termYears, termMonths, compoundingFrequency, inflationRate, result.apy]);

    // Chart Data
    const chartData = {
        labels: schedule.filter((_, i) => i % 12 === 0 || i === schedule.length - 1).map(item => `Year ${item.year}`),
        datasets: [
            {
                label: 'Total Balance',
                data: schedule.filter((_, i) => i % 12 === 0 || i === schedule.length - 1).map(item => item.balance),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Principal',
                data: schedule.filter((_, i) => i % 12 === 0 || i === schedule.length - 1).map(() => depositAmount),
                borderColor: 'rgb(156, 163, 175)',
                borderDash: [5, 5],
                fill: false,
                tension: 0.4
            }
        ]
    };

    const pieData = {
        labels: ['Principal', 'Interest Earned'],
        datasets: [
            {
                data: [depositAmount, result.totalInterest],
                backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)'],
                borderColor: ['rgba(59, 130, 246, 1)', 'rgba(16, 185, 129, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const resetCalculator = () => {
        setDepositAmount(10000);
        setRate(5.0);
        setTermYears(5);
        setTermMonths(0);
        setCompoundingFrequency(12);
        setTaxRate(0);
        setInflationRate(0);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Inputs Section */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                    <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                                    CD Details
                                </h3>
                                <button
                                    onClick={resetCalculator}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4 mr-1" />
                                    Reset
                                </button>
                            </div>

                            <div className="space-y-6">
                                <CurrencyInput
                                    label="Deposit Amount"
                                    value={depositAmount}
                                    onChange={setDepositAmount}
                                    min={100}
                                    max={10000000}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <NumberInput
                                        label="Term (Years)"
                                        value={termYears}
                                        onChange={setTermYears}
                                        min={0}
                                        max={50}
                                    />
                                    <NumberInput
                                        label="Term (Months)"
                                        value={termMonths}
                                        onChange={setTermMonths}
                                        min={0}
                                        max={11}
                                    />
                                </div>

                                <NumberInput
                                    label="Interest Rate (APY)"
                                    value={rate}
                                    onChange={setRate}
                                    min={0.1}
                                    max={20}
                                    step={0.01}
                                    suffix="%"
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Compounding Frequency
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={compoundingFrequency}
                                            onChange={(e) => setCompoundingFrequency(Number(e.target.value))}
                                            className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg dark:bg-gray-800 dark:text-white appearance-none border"
                                        >
                                            <option value={365}>Daily (365/yr)</option>
                                            <option value={12}>Monthly (12/yr)</option>
                                            <option value={4}>Quarterly (4/yr)</option>
                                            <option value={2}>Semi-Annually (2/yr)</option>
                                            <option value={1}>Annually (1/yr)</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                                            <ChevronDown className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Advanced Options Toggle */}
                                <div>
                                    <button
                                        onClick={() => setShowAdvanced(!showAdvanced)}
                                        className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                                    >
                                        {showAdvanced ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                                        Advanced Options (Tax & Inflation)
                                    </button>

                                    {showAdvanced && (
                                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
                                            <NumberInput
                                                label="Tax Rate (Optional)"
                                                value={taxRate}
                                                onChange={setTaxRate}
                                                min={0}
                                                max={100}
                                                suffix="%"
                                            />
                                            <NumberInput
                                                label="Inflation Rate (Optional)"
                                                value={inflationRate}
                                                onChange={setInflationRate}
                                                min={0}
                                                max={20}
                                                suffix="%"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Results Section */}
                        <div className="lg:col-span-7 space-y-8">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Total Balance</p>
                                    <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 tracking-tight">
                                        {formatCurrency(result.totalBalance)}
                                    </div>
                                    <p className="text-xs text-blue-500 dark:text-blue-400 mt-2">
                                        End of {termYears} years {termMonths > 0 && `& ${termMonths} months`}
                                    </p>
                                </div>

                                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800">
                                    <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Total Interest Earned</p>
                                    <div className="text-3xl font-bold text-green-900 dark:text-green-100 tracking-tight">
                                        {formatCurrency(result.totalInterest)}
                                    </div>
                                    <p className="text-xs text-green-500 dark:text-green-400 mt-2">
                                        {((result.totalInterest / depositAmount) * 100).toFixed(1)}% Return on Investment
                                    </p>
                                </div>
                            </div>

                            {/* Detailed Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Effective APY</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{result.apy.toFixed(2)}%</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Real Value</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(result.realValue)}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Est. Tax</p>
                                    <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(result.taxAmount)}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Post-Tax Bal</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(result.afterTaxBalance)}</p>
                                </div>
                            </div>

                            {/* Chart Section */}
                            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Growth Trajectory</h4>
                                <div className="h-64 md:h-80 w-full">
                                    <Line
                                        data={chartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            interaction: {
                                                mode: 'index',
                                                intersect: false,
                                            },
                                            plugins: {
                                                legend: {
                                                    position: 'top',
                                                    labels: { color: '#6B7280' } // gray-500
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}`
                                                    }
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: false,
                                                    grid: { color: 'rgba(107, 114, 128, 0.1)' },
                                                    ticks: {
                                                        color: '#6B7280',
                                                        callback: (val) => formatCurrency(val as number).split('.')[0] // Condensed currency
                                                    }
                                                },
                                                x: {
                                                    grid: { display: false },
                                                    ticks: { color: '#6B7280' }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="mt-12">
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-800">
                                <div className="flex items-center mb-6">
                                    <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg mr-3">
                                        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI-Powered Insights</h3>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {suggestions.map((suggestion, index) => (
                                        <div key={index} className="bg-white/80 dark:bg-gray-900/80 p-5 rounded-xl border border-white dark:border-gray-700 shadow-sm">
                                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                {suggestion}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Schedule Table */}
                    <div className="mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Amortization Schedule</h4>
                            <ExportButton
                                columns={['Period (Month)', 'Year', 'Interest Earned', 'Total Interest', 'Balance']}
                                data={schedule.map(row => [
                                    row.period,
                                    row.year,
                                    formatCurrency(row.interestEarned),
                                    formatCurrency(row.totalInterest),
                                    formatCurrency(row.balance)
                                ])}
                                title="CD_Calculator_Schedule"
                            />
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Month</th>
                                        <th className="px-6 py-4">Year</th>
                                        <th className="px-6 py-4 text-right">Interest Earned</th>
                                        <th className="px-6 py-4 text-right">Total Interest</th>
                                        <th className="px-6 py-4 text-right">End Balance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                                    {schedule.map((row, index) => (
                                        // Show first month, last month, and every 6th month to keep table manageable
                                        (index === 0 || index === schedule.length - 1 || (index + 1) % 12 === 0) && (
                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{row.period}</td>
                                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{row.year}</td>
                                                <td className="px-6 py-4 text-right text-green-600 dark:text-green-400 font-medium">
                                                    +{formatCurrency(row.interestEarned)}
                                                </td>
                                                <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                                                    {formatCurrency(row.totalInterest)}
                                                </td>
                                                <td className="px-6 py-4 text-right text-blue-600 dark:text-blue-400 font-bold">
                                                    {formatCurrency(row.balance)}
                                                </td>
                                            </tr>
                                        )
                                    ))}
                                </tbody>
                            </table>
                            {schedule.length > 20 && (
                                <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                    Showing condensed view (yearly & key milestones)
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => setLiked(!liked)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 ${liked
                                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                            <span>{liked ? 'Added to favorites' : 'Add to favorites'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
