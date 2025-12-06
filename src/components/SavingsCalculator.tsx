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
    ArcElement,
    Filler
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import CurrencyInput from './CurrencyInput';
import NumberInput from './NumberInput';
import SavingsTable from './SavingsTable';
import { ChevronDown, ChevronUp, RotateCcw, TrendingUp } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

interface SavingsCalculatorProps {
    title?: string;
}

const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({ title = "Savings Calculator" }) => {
    // State
    const [initialDeposit, setInitialDeposit] = useState<number>(5000);
    const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
    const [interestRate, setInterestRate] = useState<number>(4.5);
    const [years, setYears] = useState<number>(10);
    const [compoundingFrequency, setCompoundingFrequency] = useState<string>('monthly');
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

    // New Advanced Inputs
    const [inflationRate, setInflationRate] = useState<number>(2.5);
    const [taxRate, setTaxRate] = useState<number>(0); // e.g. 15% on gains
    const [contributeIncreaseRate, setContributeIncreaseRate] = useState<number>(0); // Yearly step-up %

    // Results
    const [totalSavings, setTotalSavings] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [totalPrincipal, setTotalPrincipal] = useState<number>(0);
    const [chartData, setChartData] = useState<any>(null);
    const [aiSuggestion, setAiSuggestion] = useState<string>('');
    const [schedule, setSchedule] = useState<any[]>([]);

    useEffect(() => {
        calculateSavings();
    }, [initialDeposit, monthlyContribution, interestRate, years, compoundingFrequency, inflationRate, taxRate, contributeIncreaseRate]);

    const calculateSavings = () => {
        const frequencyMap: { [key: string]: number } = {
            'daily': 365,
            'monthly': 12,
            'quarterly': 4,
            'annually': 1
        };
        const n = frequencyMap[compoundingFrequency];
        const r = interestRate / 100;

        // Step-by-step month simulation
        let balance = initialDeposit;
        let totalContributed = initialDeposit;
        let currentMonthlyContribution = monthlyContribution;

        const history = [];
        const tableSchedule = [];

        // Initial Row
        history.push({ month: 0, balance: balance, principal: totalContributed });

        for (let m = 1; m <= years * 12; m++) {
            // Apply Inflation adjustments? (Real Value vs Nominal) -> Usually charts show Nominal. We'll stick to Nominal here and maybe show Real as advanced metric.

            // Effective Monthly Rate based on Compounding
            const effectiveMonthlyRate = Math.pow(1 + r / n, n / 12) - 1;

            // 1. Calculate Interest
            let interestEarned = balance * effectiveMonthlyRate;

            // 2. Apply Tax on Interest (Simulated monthly deduction)
            if (taxRate > 0) {
                const tax = interestEarned * (taxRate / 100);
                interestEarned -= tax;
            }

            balance += interestEarned;

            // 3. Add Contribution
            balance += currentMonthlyContribution;
            totalContributed += currentMonthlyContribution;

            // 4. Annual Step-up check
            if (m % 12 === 0 && contributeIncreaseRate > 0) {
                currentMonthlyContribution *= (1 + contributeIncreaseRate / 100);
            }

            // Record data
            // For Table: Show every month
            tableSchedule.push({
                year: Math.ceil(m / 12),
                month: m,
                totalContributed: totalContributed,
                interestEarned: interestEarned,
                totalInterest: balance - totalContributed,
                balance: balance
            });

            // For Chart: Record every year to keep points sane, or every few months
            if (years > 20) {
                if (m % 12 === 0) history.push({ month: m, balance: balance, principal: totalContributed });
            } else {
                if (m % 6 === 0) history.push({ month: m, balance: balance, principal: totalContributed }); // Semi-annual
            }
        }

        // Final Sync
        // Add last month if not added
        if (history[history.length - 1].month !== years * 12) {
            history.push({ month: years * 12, balance: balance, principal: totalContributed });
        }

        const finalBalance = balance;
        const finalPrincipal = totalContributed;
        const finalInterest = finalBalance - finalPrincipal;

        setTotalSavings(finalBalance);
        setTotalPrincipal(finalPrincipal);
        setTotalInterest(finalInterest);
        setSchedule(tableSchedule);

        // Chart Data
        setChartData({
            labels: history.map(h => `Year ${(h.month / 12).toFixed(1)}`),
            datasets: [
                {
                    label: 'Total Balance',
                    data: history.map(h => h.balance),
                    borderColor: '#10B981', // Emerald
                    backgroundColor: (context: any) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
                        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
                        return gradient;
                    },
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2,
                    pointHoverRadius: 6
                },
                {
                    label: 'Principal',
                    data: history.map(h => h.principal),
                    borderColor: '#3B82F6', // Blue
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: false,
                    tension: 0.4,
                    borderDash: [5, 5],
                    pointRadius: 0
                }
            ]
        });

        generateAiSuggestion(finalBalance, finalPrincipal, years, monthlyContribution);
    };

    const generateAiSuggestion = (balance: number, principal: number, yrs: number, monthly: number) => {
        let suggestions = [];
        const interestRatio = (balance - principal) / principal;

        // Inflation Check
        if (inflationRate > 0) {
            const realValue = balance / Math.pow(1 + inflationRate / 100, yrs);
            // const loss = balance - realValue;
            suggestions.push(`Factoring in ${inflationRate}% inflation, your "Real" purchasing power in today's dollars is approximately **$${realValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}**.`);
        }

        // Tax Check
        if (taxRate > 0) {
            suggestions.push(`With a ${taxRate}% tax rate on gains, you are effectively reducing your APY. Consider tax-advantaged accounts like IRAs or 401(k)s.`);
        }

        // Standard
        if (interestRatio > 0.5) {
            suggestions.push(`Great job! Your money is working hard. Over ${yrs} years, ${(interestRatio * 100).toFixed(0)}% of your total balance comes purely from interest.`);
        }

        const extraFifty = calculateFutureValue(initialDeposit, monthly + 50, interestRate, yrs);
        const diff = extraFifty - balance;
        suggestions.push(`💡 **AI Tip**: Increasing your monthly contribution by just $50 could add an extra **$${diff.toLocaleString(undefined, { maximumFractionDigits: 0 })}** to your final balance!`);

        setAiSuggestion(suggestions[suggestions.length - 1]);
    };

    const calculateFutureValue = (p: number, pmt: number, rPct: number, tYrs: number) => {
        // Quick approx for suggestion
        const r = rPct / 100; // Simplified
        const n = 12;
        let b = p;
        const eff = r / 12;
        for (let i = 0; i < tYrs * 12; i++) {
            b += b * eff;
            b += pmt;
        }
        return b;
    };

    const resetToDefaults = () => {
        setInitialDeposit(5000);
        setMonthlyContribution(500);
        setInterestRate(4.5);
        setYears(10);
        setCompoundingFrequency('monthly');
        setInflationRate(2.5);
        setTaxRate(0);
        setContributeIncreaseRate(0);
        setShowAdvanced(false);
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                        <button
                            onClick={resetToDefaults}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reset
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Inputs Side */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Deposit</label>
                                <CurrencyInput value={initialDeposit} onChange={setInitialDeposit} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Contribution</label>
                                <CurrencyInput value={monthlyContribution} onChange={setMonthlyContribution} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                                    <NumberInput value={interestRate} onChange={setInterestRate} suffix="%" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Period (Years)</label>
                                    <NumberInput value={years} onChange={setYears} suffix="yrs" />
                                </div>
                            </div>

                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer"
                            >
                                {showAdvanced ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                                {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                            </button>

                            {showAdvanced && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2 space-y-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Compounding Frequency</label>
                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        {['daily', 'monthly', 'quarterly', 'annually'].map((freq) => (
                                            <button
                                                key={freq}
                                                onClick={() => setCompoundingFrequency(freq)}
                                                className={`py-2 px-3 text-sm rounded-md capitalize transition-colors cursor-pointer ${compoundingFrequency === freq
                                                        ? 'bg-blue-600 text-white shadow-sm'
                                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {freq}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Inflation Rate (%)</label>
                                            <NumberInput value={inflationRate} onChange={setInflationRate} suffix="%" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tax on Interest (%)</label>
                                            <NumberInput value={taxRate} onChange={setTaxRate} suffix="%" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Annual Contribution Increase (%)</label>
                                        <NumberInput value={contributeIncreaseRate} onChange={setContributeIncreaseRate} suffix="%" />
                                        <p className="text-xs text-gray-500 mt-1">Simulate salary bumps or stepping up savings each year.</p>
                                    </div>
                                </div>
                            )}

                            {/* AI Suggestion Box */}
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4 flex gap-3 items-start shadow-sm">
                                <div className="bg-white p-2 rounded-full shadow-sm shrink-0 text-indigo-600">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-indigo-900 mb-1 flex items-center">
                                        AI Growth Insight
                                        <span className="ml-2 px-2 py-0.5 bg-white text-indigo-600 border border-indigo-100 text-[10px] rounded-full uppercase tracking-wider font-bold shadow-sm">Beta</span>
                                    </h4>
                                    <div className="text-sm text-indigo-800 leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                            __html: aiSuggestion.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Results Side */}
                        <div className="flex flex-col space-y-6">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Savings Balance</h3>
                                <div className="text-4xl font-bold text-gray-900 mb-2">
                                    ${totalSavings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </div>
                                {inflationRate > 0 && (
                                    <div className="text-xs text-gray-400 mb-2">
                                        *Nominal Value (ignoring inflation)
                                    </div>
                                )}
                                <div className="text-sm text-green-600 flex items-center font-medium">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    Total Interest Earned: ${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="text-xs text-gray-500 mb-1">Total Principal</div>
                                    <div className="text-lg font-bold text-gray-900">
                                        ${totalPrincipal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </div>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="text-xs text-gray-500 mb-1">Total Interest</div>
                                    <div className="text-lg font-bold text-green-600">
                                        ${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </div>
                                </div>
                            </div>

                            <div className="h-72 relative bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                                {chartData && <Line data={chartData} options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 6 } },
                                        tooltip: {
                                            mode: 'index',
                                            intersect: false,
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            titleColor: '#111827',
                                            bodyColor: '#374151',
                                            borderColor: '#E5E7EB',
                                            borderWidth: 1,
                                            padding: 10,
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
                                            beginAtZero: true,
                                            grid: { color: '#F3F4F6' },
                                            ticks: {
                                                callback: function (value: any) {
                                                    if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
                                                    if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'k';
                                                    return '$' + value;
                                                },
                                                font: { size: 11 }
                                            },
                                            border: { display: false }
                                        },
                                        x: {
                                            grid: { display: false },
                                            ticks: { font: { size: 11 } },
                                            border: { display: false }
                                        }
                                    },
                                    interaction: {
                                        mode: 'nearest',
                                        axis: 'x',
                                        intersect: false
                                    },
                                    elements: {
                                        line: { borderWidth: 2 },
                                        point: { radius: 0, hitRadius: 10 }
                                    }
                                }} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SavingsTable schedule={schedule} />
        </div>
    );
};

export default SavingsCalculator;
