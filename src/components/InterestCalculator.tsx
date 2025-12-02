'use client';

import React, { useState, useEffect } from 'react';
import { calculateSimpleInterest, calculateCompoundInterest, InterestCalculation } from '@/lib/calc/interest';
import { TrendingUp, Calendar, Lightbulb, ArrowRight, DollarSign, Percent, Clock, PieChart } from 'lucide-react';
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

export default function InterestCalculator() {
    const [calculationType, setCalculationType] = useState<'simple' | 'compound'>('compound');
    const [principal, setPrincipal] = useState<number>(10000);
    const [rate, setRate] = useState<number>(7);
    const [time, setTime] = useState<number>(10);
    const [compoundingFrequency, setCompoundingFrequency] = useState<'yearly' | 'half-yearly' | 'quarterly' | 'monthly' | 'daily'>('yearly');
    const [monthlyContribution, setMonthlyContribution] = useState<number>(0);
    const [result, setResult] = useState<InterestCalculation | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        try {
            let calc: InterestCalculation;
            if (calculationType === 'simple') {
                calc = calculateSimpleInterest(principal, rate, time);
            } else {
                calc = calculateCompoundInterest(principal, rate, time, compoundingFrequency, monthlyContribution);
            }
            setResult(calc);
            generateSuggestions(calc);
        } catch (e) {
            console.error('Interest calculation error:', e);
        }
    }, [calculationType, principal, rate, time, compoundingFrequency, monthlyContribution]);

    const generateSuggestions = (calc: InterestCalculation) => {
        const newSuggestions: string[] = [];

        if (calculationType === 'simple') {
            newSuggestions.push("💡 **Tip:** Switching to Compound Interest could significantly increase your returns over time.");
        } else {
            if (compoundingFrequency === 'yearly') {
                const monthlyCalc = calculateCompoundInterest(principal, rate, time, 'monthly', monthlyContribution);
                const diff = monthlyCalc.totalAmount - calc.totalAmount;
                if (diff > 100) {
                    newSuggestions.push(`🚀 **Boost your returns:** If interest were compounded **monthly** instead of yearly, you would earn an extra **${formatCurrency(diff)}**.`);
                }
            }

            if (monthlyContribution === 0) {
                const withContribution = calculateCompoundInterest(principal, rate, time, compoundingFrequency, 500);
                const extra = withContribution.totalAmount - calc.totalAmount - (500 * 12 * time);
                newSuggestions.push(`💰 **Power of SIP:** Contributing just **$500/month** could earn you an additional **${formatCurrency(extra)}** in interest alone!`);
            }
        }

        if (time < 5) {
            newSuggestions.push("📈 **Long-term growth:** Extending your investment period to 10 years allows compound interest to work its magic more effectively.");
        }

        setSuggestions(newSuggestions);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const chartData = {
        labels: result?.breakdown.map(b => `Year ${b.year}`) || [],
        datasets: [
            {
                label: 'Total Amount',
                data: result?.breakdown.map(b => b.closingBalance) || [],
                borderColor: '#2563EB', // Blue 600
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Principal Invested',
                data: result?.breakdown.map(b => b.openingBalance + (monthlyContribution * 12)) || [], // Approximate for viz
                borderColor: '#9CA3AF', // Gray 400
                borderDash: [5, 5],
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
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(context.parsed.y);
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
                        return '$' + value.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short' });
                    }
                }
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">


            {/* Main Calculator Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12">

                    {/* Left Panel: Inputs */}
                    <div className="lg:col-span-4 p-8 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-100 dark:border-gray-800 space-y-6">

                        {/* Type Toggle */}
                        <div className="bg-white dark:bg-gray-900 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex">
                            <button
                                onClick={() => setCalculationType('simple')}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${calculationType === 'simple'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                Simple Interest
                            </button>
                            <button
                                onClick={() => setCalculationType('compound')}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${calculationType === 'compound'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                Compound Interest
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
                                    Principal Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                                    <input
                                        type="number"
                                        value={principal}
                                        onChange={(e) => setPrincipal(Number(e.target.value))}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Percent className="w-4 h-4 mr-2 text-green-500" />
                                    Annual Interest Rate (%)
                                </label>
                                <input
                                    type="number"
                                    value={rate}
                                    onChange={(e) => setRate(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Clock className="w-4 h-4 mr-2 text-purple-500" />
                                    Time Period (Years)
                                </label>
                                <input
                                    type="number"
                                    value={time}
                                    onChange={(e) => setTime(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                />
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    value={time}
                                    onChange={(e) => setTime(Number(e.target.value))}
                                    className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                                />
                            </div>

                            {calculationType === 'compound' && (
                                <div className="animate-in fade-in slide-in-from-top-4 space-y-5">
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <PieChart className="w-4 h-4 mr-2 text-orange-500" />
                                            Compounding Frequency
                                        </label>
                                        <select
                                            value={compoundingFrequency}
                                            onChange={(e) => setCompoundingFrequency(e.target.value as any)}
                                            className="w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                        >
                                            <option value="yearly">Yearly</option>
                                            <option value="half-yearly">Half-Yearly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="daily">Daily</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <TrendingUp className="w-4 h-4 mr-2 text-teal-500" />
                                            Monthly Contribution (Optional)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                                            <input
                                                type="number"
                                                value={monthlyContribution}
                                                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Results & Visuals */}
                    <div className="lg:col-span-8 p-8 space-y-8">

                        {/* Result Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Total Amount</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {result ? formatCurrency(result.totalAmount) : '-'}
                                </p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800">
                                <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">Total Interest</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {result ? formatCurrency(result.interest) : '-'}
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Principal Invested</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {result ? formatCurrency(result.principal + (monthlyContribution * 12 * time)) : '-'}
                                </p>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 h-[400px]">
                            <Line data={chartData} options={chartOptions} />
                        </div>

                        {/* AI Suggestions */}
                        {suggestions.length > 0 && (
                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 p-6 rounded-2xl border border-yellow-100 dark:border-yellow-800/30">
                                <h3 className="flex items-center text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-4">
                                    <Lightbulb className="w-5 h-5 mr-2" />
                                    Smart Insights
                                </h3>
                                <div className="space-y-3">
                                    {suggestions.map((suggestion, index) => (
                                        <div key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                            <ArrowRight className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                            <p dangerouslySetInnerHTML={{ __html: suggestion.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
