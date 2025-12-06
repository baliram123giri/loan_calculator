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
import { ChevronDown, ChevronUp, RotateCcw, Lightbulb, TrendingUp, DollarSign } from 'lucide-react';

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

    // Results
    const [totalSavings, setTotalSavings] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [totalPrincipal, setTotalPrincipal] = useState<number>(0);
    const [chartData, setChartData] = useState<any>(null);
    const [aiSuggestion, setAiSuggestion] = useState<string>('');

    useEffect(() => {
        calculateSavings();
    }, [initialDeposit, monthlyContribution, interestRate, years, compoundingFrequency]);

    const calculateSavings = () => {
        let principal = initialDeposit;
        let total = initialDeposit;
        let tInterest = 0;
        const dataPoints = [];
        const labels = [];

        const frequencyMap: { [key: string]: number } = {
            'daily': 365,
            'monthly': 12,
            'quarterly': 4,
            'annually': 1
        };

        const n = frequencyMap[compoundingFrequency];
        const r = interestRate / 100;

        // Generate monthly data points for the graph
        const totalMonths = years * 12;

        for (let i = 0; i <= totalMonths; i++) {
            // Logic for monthly contribution and compounding
            // To simplify graph generation, we calculate balance at each month
            const currentYear = i / 12;

            // Compound Interest Formula: A = P(1 + r/n)^(nt)
            // Future Value of a Series: PMT * (((1 + r/n)^(nt) - 1) / (r/n))

            // However, mixing initial deposit + monthly contributions with specific compounding requires careful step-by-step or combined formula

            // Let's do step-by-step for accurate monthly tracking for the graph
            // Actually, usually compounding happens at 'n' times per year.
            // If n=12 (monthly), it aligns with contributions.
            // If n=1 (annually), interest is added only at end of year.

            // For a smooth graph, we'll approximate/calculate value at month 'i'

            // Precise calculation at year 't' (can be fractional)
            const t = i / 12;

            const amountFromPrincipal = initialDeposit * Math.pow(1 + r / n, n * t);
            const amountFromContributions = monthlyContribution * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));

            // Note: The contribution formula above assumes contributions are made at the END of each compounding period if frequencies match.
            // If frequencies differ, it gets complex. For a general calculator:
            // We can simulate month-by-month.
        }

        // Re-implementing with a robust month-by-month simulation for the graph
        let balance = initialDeposit;
        let totalContributed = initialDeposit;
        const history = [];

        // We'll record data points every year to keep graph clean, or every month if short term
        const recordFrequency = years > 5 ? 12 : 1; // Record every 12 months (1 year) if long term, else every month

        history.push({
            month: 0,
            balance: balance,
            principal: totalContributed,
            interest: 0
        });

        for (let m = 1; m <= years * 12; m++) {
            // Add monthly contribution
            balance += monthlyContribution;
            totalContributed += monthlyContribution;

            // Add interest if applicable this month
            // If compounding is monthly (n=12), add interest each month.
            // Rate per month = r/12.
            // If daily, we approximate monthly addition.

            // Simpler approach that is standard for these calculators:
            // Assume monthly compounding for the "monthly step" simulation or adjust rate

            // Accurate approximation for simulation loop:
            // Effective monthly rate based on compounding frequency
            // (1 + r_eff)^12 = (1 + r/n)^n
            // 1 + r_eff = (1 + r/n)^(n/12)
            // r_eff = (1 + r/n)^(n/12) - 1

            const effectiveMonthlyRate = Math.pow(1 + r / n, n / 12) - 1;
            const interestForMonth = balance * effectiveMonthlyRate; // Interest on balance BEFORE contribution or AFTER? Usually standard is check balance at start of month.

            // Let's stick to: Interest calc on balance, then add contribution (end of month)
            // Or Interest calc on (balance + contribution) ?
            // Let's assume contribution happens at start of month for interest? Or end?
            // "Deposits made at the beginning of each period" vs "End".
            // Let's assume End of month for contribution, so interest is calculated on opening balance.

            // Correct flow:
            // 1. Calculate Interest on current Balance
            const interest = (balance - monthlyContribution) * effectiveMonthlyRate; // Wait, balance already includes this month's contribution? No.

            // Let's restart loop mental model
            // Month 0: Balance = Initial
            // Month 1 Loop:
            //   Interest = Balance * rate
            //   Balance += Interest
            //   Balance += Contribution

            // Refined Loop:
            const interestEarned = balance * effectiveMonthlyRate;
            balance += interestEarned;
            balance += monthlyContribution;
            totalContributed += monthlyContribution; // This keeps adding up

            if (m % recordFrequency === 0) {
                history.push({
                    month: m,
                    balance: balance,
                    principal: totalContributed, // Note: Initial + (Monthly * m)
                    interest: balance - totalContributed
                });
            }
        }

        // Final values
        const finalBalance = balance;
        const finalPrincipal = initialDeposit + (monthlyContribution * years * 12);
        const finalInterest = finalBalance - finalPrincipal; // Recalculate based on pure math to avoid loop drift? Loop is fine.

        setTotalSavings(finalBalance);
        setTotalPrincipal(finalPrincipal);
        setTotalInterest(finalInterest);

        // Chart Data
        const labelsArr = history.map(h => `Year ${(h.month / 12).toFixed(1)}`);

        setChartData({
            labels: labelsArr,
            datasets: [
                {
                    label: 'Total Principal',
                    data: history.map(h => h.principal),
                    borderColor: '#3B82F6', // Blue
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Total Interest',
                    data: history.map(h => h.balance), // Stacked? No, this is line chart usually showing total. 
                    // To show interest as a layer on top of principal in an Area chart:
                    // 'Total Savings' (Balance) is the top line. 
                    // Property 'fill: "-1"' fills to the dataset below?
                    // Let's just do two lines or stacked area.
                    // Dataset 1: Principal
                    // Dataset 2: Interest (Value = Balance - Principal) ?? 
                    // Easier: Stacked Area.
                    // Dataset 1: Principal
                    // Dataset 2: Interest (Just the interest component)
                    // If stacked: true on y-axis.

                }
            ]
        });

        // Let's use a simpler configuration for the Area Chart:
        // 1. Balance (Top line, filled usually?)
        // 2. Principal (Bottom line, filled)

        setChartData({
            labels: history.map(h => `Year ${Math.round(h.month / 12)}`),
            datasets: [
                {
                    label: 'Total Balance',
                    data: history.map(h => h.balance),
                    borderColor: '#10B981', // Emerald
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: false, // Let's simplify to lines for cleaner look or fill?
                    tension: 0.4
                },
                {
                    label: 'Principal',
                    data: history.map(h => h.principal),
                    borderColor: '#3B82F6', // Blue
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        });

        generateAiSuggestion(finalBalance, finalPrincipal, years, monthlyContribution);
    };

    const generateAiSuggestion = (balance: number, principal: number, yrs: number, monthly: number) => {
        // Rule-based suggestions
        const interestRatio = (balance - principal) / principal;
        const gain = balance - principal;

        let suggestions = [];

        if (interestRatio < 0.1 && yrs >= 5) {
            suggestions.push(`With a ${yrs}-year term, you're only earning ${(interestRatio * 100).toFixed(1)}% in total interest. Consider increasing your monthly contribution or seeking a higher interest rate (e.g., High-Yield Components).`);
        }

        if (compoundingFrequency === 'annually') {
            suggestions.push("Switching to monthly or daily compounding could slightly increase your returns due to faster interest accumulation.");
        }

        // The "What if" suggestion
        const extraFifty = calculateFutureValue(initialDeposit, monthly + 50, interestRate, yrs, compoundingFrequency);
        const diff = extraFifty - balance;

        suggestions.push(`💡 AI Insight: If you increase your monthly contribution by just $50, you could have an extra **$${diff.toLocaleString(undefined, { maximumFractionDigits: 0 })}** after ${yrs} years!`);

        setAiSuggestion(suggestions[suggestions.length - 1]); // Show the most impactful one
    };

    // Helper calculate for suggestion
    const calculateFutureValue = (p: number, pmt: number, rPct: number, tYrs: number, freq: string) => {
        const frequencyMap: { [key: string]: number } = { 'daily': 365, 'monthly': 12, 'quarterly': 4, 'annually': 1 };
        const n = frequencyMap[freq];
        const r = rPct / 100;
        // Approximation for quick calc
        let b = p;
        const effRate = Math.pow(1 + r / n, n / 12) - 1;
        for (let i = 0; i < tYrs * 12; i++) {
            b += b * effRate;
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
        setShowAdvanced(false);
    };

    const doughnutData = {
        labels: ['Principal', 'Interest'],
        datasets: [{
            data: [totalPrincipal, totalInterest],
            backgroundColor: ['#3B82F6', '#10B981'],
            borderColor: ['#2563EB', '#059669'],
            borderWidth: 1,
        }],
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
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Compounding Frequency</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['daily', 'monthly', 'quarterly', 'annually'].map((freq) => (
                                            <button
                                                key={freq}
                                                onClick={() => setCompoundingFrequency(freq)}
                                                className={`py-2 px-3 text-sm rounded-md capitalize transition-colors ${compoundingFrequency === freq
                                                        ? 'bg-blue-600 text-white shadow-sm'
                                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {freq}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* AI Suggestion Box */}
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3 items-start">
                                <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
                                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-indigo-900 mb-1 flex items-center">
                                        AI Growth Insight
                                        <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] rounded-full uppercase tracking-wider font-bold">Beta</span>
                                    </h4>
                                    <div className="text-sm text-indigo-800 leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                            __html: aiSuggestion.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        }}
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Results Column */}
                        <div className="flex flex-col space-y-6">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Savings Balance</h3>
                                <div className="text-4xl font-bold text-gray-900 mb-2">
                                    ${totalSavings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </div>
                                <div className="text-sm text-green-600 flex items-center font-medium">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    Total Interest Earned: ${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <div className="text-xs text-gray-500 mb-1">Total Principal</div>
                                    <div className="text-lg font-bold text-gray-900">
                                        ${totalPrincipal.toLocaleString()}
                                    </div>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <div className="text-xs text-gray-500 mb-1">Total Interest</div>
                                    <div className="text-lg font-bold text-green-600">
                                        ${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </div>
                                </div>
                            </div>

                            <div className="h-64 relative bg-white rounded-xl border border-gray-100 p-4">
                                {chartData && <Line data={chartData} options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { position: 'bottom' },
                                        tooltip: {
                                            mode: 'index',
                                            intersect: false,
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
                                            ticks: {
                                                callback: function (value: any) {
                                                    return '$' + value.toLocaleString();
                                                }
                                            }
                                        }
                                    },
                                    interaction: {
                                        mode: 'nearest',
                                        axis: 'x',
                                        intersect: false
                                    }
                                }} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavingsCalculator;
