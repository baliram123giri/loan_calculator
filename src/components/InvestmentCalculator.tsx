"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import {
    TrendingUp,
    DollarSign,
    Target,
    Sparkles,
    Info,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Heart
} from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import NumberInput from './NumberInput';
import {
    calculateLumpsum,
    calculateSIP,
    calculateCombined,
    calculateStepUpSIP,
    calculateGoalPlanning,
    generateYearlyBreakdown,
    generateSuggestions,
    type InvestmentResult,
    type YearlyBreakdown
} from '@/lib/calc/investment';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

type TabType = 'lumpsum' | 'sip' | 'combined' | 'stepup' | 'goal';

export default function InvestmentCalculator() {
    const [activeTab, setActiveTab] = useState<TabType>('sip');
    const [liked, setLiked] = useState(false);

    // Lumpsum inputs
    const [lumpsumAmount, setLumpsumAmount] = useState(100000);

    // SIP inputs
    const [monthlySIP, setMonthlySIP] = useState(5000);

    // Combined inputs
    const [combinedLumpsum, setCombinedLumpsum] = useState(50000);
    const [combinedMonthlySIP, setCombinedMonthlySIP] = useState(3000);

    // Step-up SIP inputs
    const [stepupMonthlySIP, setStepupMonthlySIP] = useState(5000);
    const [stepupRate, setStepupRate] = useState(10);

    // Goal planner inputs
    const [targetAmount, setTargetAmount] = useState(1000000);
    const [currentSavings, setCurrentSavings] = useState(0);

    // Common inputs
    const [years, setYears] = useState(10);
    const [annualReturn, setAnnualReturn] = useState(12);
    const [inflationRate, setInflationRate] = useState(0);
    const [taxRate, setTaxRate] = useState(0);

    // Pagination for yearly breakdown
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // State for Results
    const [result, setResult] = useState<InvestmentResult | null>(null);
    const [yearlyBreakdown, setYearlyBreakdown] = useState<YearlyBreakdown[]>([]);
    const [requiredSIP, setRequiredSIP] = useState(0);

    const handleCalculate = () => {
        if (activeTab === 'goal') {
            try {
                const req = calculateGoalPlanning({
                    targetAmount,
                    currentSavings,
                    annualRate: annualReturn,
                    years
                });
                setRequiredSIP(req);
            } catch (error) {
                console.error('Goal calculation error:', error);
            }
            return;
        }

        try {
            let res: InvestmentResult | null = null;
            let breakdown: YearlyBreakdown[] = [];

            if (activeTab === 'lumpsum') {
                res = calculateLumpsum({
                    principal: lumpsumAmount,
                    annualRate: annualReturn,
                    years,
                    inflationRate: inflationRate || undefined,
                    taxRate: taxRate || undefined
                });
                breakdown = generateYearlyBreakdown(
                    { principal: lumpsumAmount, annualRate: annualReturn, years },
                    'lumpsum'
                );
            } else if (activeTab === 'sip') {
                res = calculateSIP({
                    monthlyInvestment: monthlySIP,
                    annualRate: annualReturn,
                    years,
                    inflationRate: inflationRate || undefined,
                    taxRate: taxRate || undefined
                });
                breakdown = generateYearlyBreakdown(
                    { monthlyInvestment: monthlySIP, annualRate: annualReturn, years },
                    'sip'
                );
            } else if (activeTab === 'combined') {
                res = calculateCombined({
                    lumpsum: combinedLumpsum,
                    monthlyInvestment: combinedMonthlySIP,
                    annualRate: annualReturn,
                    years,
                    inflationRate: inflationRate || undefined,
                    taxRate: taxRate || undefined
                });
                breakdown = generateYearlyBreakdown(
                    { lumpsum: combinedLumpsum, monthlyInvestment: combinedMonthlySIP, annualRate: annualReturn, years },
                    'combined'
                );
            } else if (activeTab === 'stepup') {
                res = calculateStepUpSIP({
                    initialMonthlyInvestment: stepupMonthlySIP,
                    annualRate: annualReturn,
                    years,
                    stepUpRate: stepupRate,
                    inflationRate: inflationRate || undefined,
                    taxRate: taxRate || undefined
                });
                breakdown = generateYearlyBreakdown(
                    { initialMonthlyInvestment: stepupMonthlySIP, annualRate: annualReturn, years, stepUpRate: stepupRate },
                    'stepup'
                );
            }
            setResult(res);
            setYearlyBreakdown(breakdown);

        } catch (error) {
            console.error('Calculation error:', error);
            setResult(null);
            setYearlyBreakdown([]);
        }
    };

    // Calculate on mount only
    useEffect(() => {
        handleCalculate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only mount

    // Generate AI suggestions (depend on result state now)
    const suggestions = useMemo(() => {
        const inputData = {
            annualRate: annualReturn,
            years,
            principal: lumpsumAmount,
            monthlyInvestment: monthlySIP,
            initialMonthlyInvestment: stepupMonthlySIP,
            lumpsum: combinedLumpsum,
            stepUpRate: stepupRate,
            inflationRate,
            taxRate
        };

        return generateSuggestions(activeTab, inputData, result || undefined);
    }, [activeTab, lumpsumAmount, monthlySIP, combinedLumpsum, combinedMonthlySIP,
        stepupMonthlySIP, stepupRate, annualReturn, years, inflationRate, taxRate, result]);

    // Chart data for growth visualization
    const growthChartData = useMemo(() => {
        if (!yearlyBreakdown.length) return null;

        return {
            labels: yearlyBreakdown.map(y => `Year ${y.year}`),
            datasets: [
                {
                    label: 'Total Investment',
                    data: yearlyBreakdown.map(y => y.totalInvestment),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                },
                {
                    label: 'Total Value',
                    data: yearlyBreakdown.map(y => y.balance),
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                }
            ]
        };
    }, [yearlyBreakdown]);

    // Pie chart data
    const pieChartData = useMemo(() => {
        if (!result) return null;

        return {
            labels: ['Principal Invested', 'Returns Earned'],
            datasets: [{
                data: [result.totalInvestment, result.totalReturns],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)'
                ],
                borderWidth: 2
            }]
        };
    }, [result]);

    const resetToDefaults = () => {
        setLumpsumAmount(100000);
        setMonthlySIP(5000);
        setCombinedLumpsum(50000);
        setCombinedMonthlySIP(3000);
        setStepupMonthlySIP(5000);
        setStepupRate(10);
        setTargetAmount(1000000);
        setCurrentSavings(0);
        setYears(10);
        setAnnualReturn(12);
        setInflationRate(0);
        setTaxRate(0);
        setCurrentPage(1);
        // Do not force recalculate on reset, let user click.
    };
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    };

    // Pagination
    const totalPages = Math.ceil(yearlyBreakdown.length / rowsPerPage);
    const paginatedData = yearlyBreakdown.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const tabs = [
        { id: 'sip' as TabType, label: 'SIP', icon: TrendingUp },
        { id: 'lumpsum' as TabType, label: 'Lumpsum', icon: DollarSign },
        { id: 'combined' as TabType, label: 'Lumpsum + SIP', icon: TrendingUp },
        { id: 'stepup' as TabType, label: 'Step-Up SIP', icon: TrendingUp },
        { id: 'goal' as TabType, label: 'Goal Planner', icon: Target }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Main Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setCurrentPage(1);
                                    }}
                                    className={`flex items-center px-6 py-4 font-medium transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id
                                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-900'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Input Section */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Investment Details
                                </h3>
                                <button
                                    onClick={resetToDefaults}
                                    className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                                >
                                    <RotateCcw className="w-4 h-4 mr-1" />
                                    Reset
                                </button>
                            </div>

                            {/* Tab-specific inputs */}
                            {activeTab === 'lumpsum' && (
                                <div className="space-y-4">
                                    <CurrencyInput
                                        label="Investment Amount"
                                        value={lumpsumAmount}
                                        onChange={setLumpsumAmount}
                                        min={1000}
                                        max={100000000}
                                    />
                                </div>
                            )}

                            {activeTab === 'sip' && (
                                <div className="space-y-4">
                                    <CurrencyInput
                                        label="Monthly SIP Amount"
                                        value={monthlySIP}
                                        onChange={setMonthlySIP}
                                        min={100}
                                        max={1000000}
                                    />
                                </div>
                            )}

                            {activeTab === 'combined' && (
                                <div className="space-y-4">
                                    <CurrencyInput
                                        label="One-time Lumpsum"
                                        value={combinedLumpsum}
                                        onChange={setCombinedLumpsum}
                                        min={0}
                                        max={100000000}
                                    />
                                    <CurrencyInput
                                        label="Monthly SIP Amount"
                                        value={combinedMonthlySIP}
                                        onChange={setCombinedMonthlySIP}
                                        min={100}
                                        max={1000000}
                                    />
                                </div>
                            )}

                            {activeTab === 'stepup' && (
                                <div className="space-y-4">
                                    <CurrencyInput
                                        label="Initial Monthly SIP"
                                        value={stepupMonthlySIP}
                                        onChange={setStepupMonthlySIP}
                                        min={100}
                                        max={1000000}
                                    />
                                    <NumberInput
                                        label="Annual Step-Up (%)"
                                        value={stepupRate}
                                        onChange={setStepupRate}
                                        min={0}
                                        max={50}
                                        step={1}
                                        suffix="%"
                                    />
                                </div>
                            )}

                            {activeTab === 'goal' && (
                                <div className="space-y-4">
                                    <CurrencyInput
                                        label="Target Amount"
                                        value={targetAmount}
                                        onChange={setTargetAmount}
                                        min={10000}
                                        max={1000000000}
                                    />
                                    <CurrencyInput
                                        label="Current Savings (Optional)"
                                        value={currentSavings}
                                        onChange={setCurrentSavings}
                                        min={0}
                                        max={100000000}
                                    />
                                </div>
                            )}

                            {/* Common inputs */}
                            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <NumberInput
                                    label="Investment Duration (Years)"
                                    value={years}
                                    onChange={setYears}
                                    min={1}
                                    max={40}
                                    step={1}
                                />
                                <NumberInput
                                    label="Expected Annual Return (%)"
                                    value={annualReturn}
                                    onChange={setAnnualReturn}
                                    min={1}
                                    max={30}
                                    step={0.5}
                                    suffix="%"
                                />
                            </div>

                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={handleCalculate}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg transform transition-all active:scale-[0.98] shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                                >
                                    Calculate Investment 🚀
                                </button>
                            </div>

                            {/* Advanced options */}
                            <details className="group mt-4">
                                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 list-none flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <span className="flex items-center">
                                        <Info className="w-4 h-4 mr-2" />
                                        Advanced Options
                                    </span>
                                    <span className="transition group-open:rotate-180">▼</span>
                                </summary>
                                <div className="mt-4 space-y-4 pl-6">
                                    <NumberInput
                                        label="Inflation Rate (%) - Optional"
                                        value={inflationRate}
                                        onChange={setInflationRate}
                                        min={0}
                                        max={15}
                                        step={0.5}
                                        suffix="%"
                                    />
                                    <NumberInput
                                        label="Tax Rate (%) - Optional"
                                        value={taxRate}
                                        onChange={setTaxRate}
                                        min={0}
                                        max={50}
                                        step={1}
                                        suffix="%"
                                    />
                                </div>
                            </details>

                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={handleCalculate}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg transform transition-all active:scale-[0.98] shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                                >
                                    Calculate Investment 🚀
                                </button>
                            </div>
                        </div>

                        {/* Results Section */}
                        <div className="lg:col-span-7 space-y-6">
                            {activeTab === 'goal' ? (
                                // Goal Planner Results
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-blue-100 dark:border-blue-800">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                Required Monthly SIP
                                            </p>
                                            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                                {formatCurrency(requiredSIP)}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                                                to reach your goal of {formatCurrency(targetAmount)} in {years} years
                                            </p>
                                            {currentSavings > 0 && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    (with {formatCurrency(currentSavings)} current savings)
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Investment</p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                                                {formatCurrency(requiredSIP * years * 12 + currentSavings)}
                                            </p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Expected Returns</p>
                                            <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">
                                                {formatCurrency(targetAmount - (requiredSIP * years * 12 + currentSavings))}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : result ? (
                                // Regular calculation results
                                <>
                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                                            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Total Investment</p>
                                            <p className="text-xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                                                {formatCurrency(result.totalInvestment)}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
                                            <p className="text-xs text-green-700 dark:text-green-300 font-medium">Total Returns</p>
                                            <p className="text-xl font-bold text-green-900 dark:text-green-100 mt-1">
                                                {formatCurrency(result.totalReturns)}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                                            <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">Future Value</p>
                                            <p className="text-xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                                                {formatCurrency(result.futureValue)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Additional metrics */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">CAGR</p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {result.cagr.toFixed(2)}%
                                            </p>
                                        </div>
                                        {result.realValue && (
                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Real Value</p>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {formatCurrency(result.realValue)}
                                                </p>
                                            </div>
                                        )}
                                        {result.afterTaxValue && (
                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <p className="text-xs text-gray-500 dark:text-gray-400">After Tax</p>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {formatCurrency(result.afterTaxValue)}
                                                </p>
                                            </div>
                                        )}
                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">ROI</p>
                                            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                                {((result.totalReturns / result.totalInvestment) * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pie Chart */}
                                    {pieChartData && (
                                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 text-center">
                                                Investment Breakdown
                                            </h4>
                                            <div className="h-64">
                                                <Pie
                                                    data={pieChartData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                position: 'bottom',
                                                                labels: {
                                                                    color: 'rgb(107, 114, 128)'
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : null}
                        </div>
                    </div>

                    {/* Growth Chart */}
                    {growthChartData && activeTab !== 'goal' && (
                        <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Investment Growth Over Time
                            </h4>
                            <div className="h-80">
                                <Line
                                    data={growthChartData}
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
                                                labels: {
                                                    color: 'rgb(107, 114, 128)'
                                                }
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: function (context) {
                                                        const val = context.parsed.y;
                                                        return context.dataset.label + ': ' + formatCurrency(val !== null ? val : 0);
                                                    }
                                                }
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    callback: function (value) {
                                                        return '$' + (value as number).toLocaleString();
                                                    },
                                                    color: 'rgb(107, 114, 128)'
                                                },
                                                grid: {
                                                    color: 'rgba(107, 114, 128, 0.1)'
                                                }
                                            },
                                            x: {
                                                ticks: {
                                                    color: 'rgb(107, 114, 128)'
                                                },
                                                grid: {
                                                    color: 'rgba(107, 114, 128, 0.1)'
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* AI Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="mt-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
                            <div className="flex items-center mb-4">
                                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                    AI-Powered Insights
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {suggestions.map((suggestion: string, index: number) => (
                                    <div
                                        key={index}
                                        className="bg-white/80 dark:bg-gray-900/60 p-4 rounded-lg border border-purple-100 dark:border-purple-800"
                                    >
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {suggestion}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Yearly Breakdown Table */}
                    {paginatedData.length > 0 && activeTab !== 'goal' && (
                        <div className="mt-8">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Year-by-Year Breakdown
                            </h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Year</th>
                                            <th className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">Yearly Investment</th>
                                            <th className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">Total Invested</th>
                                            <th className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">Interest Earned</th>
                                            <th className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">Total Interest</th>
                                            <th className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {paginatedData.map((row) => (
                                            <tr key={row.year} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{row.year}</td>
                                                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                                                    {formatCurrency(row.yearlyInvestment)}
                                                </td>
                                                <td className="px-4 py-3 text-right text-gray-900 dark:text-white font-medium">
                                                    {formatCurrency(row.totalInvestment)}
                                                </td>
                                                <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">
                                                    {formatCurrency(row.interestEarned)}
                                                </td>
                                                <td className="px-4 py-3 text-right text-green-600 dark:text-green-400 font-medium">
                                                    {formatCurrency(row.totalInterest)}
                                                </td>
                                                <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400 font-bold">
                                                    {formatCurrency(row.balance)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, yearlyBreakdown.length)} of {yearlyBreakdown.length} years
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <span className="px-4 py-1 text-sm text-gray-700 dark:text-gray-300">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Like Button */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setLiked(!liked)}
                            className={`inline-flex items-center px-6 py-3 rounded-full transition-all ${liked
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Heart className={`w-5 h-5 mr-2 ${liked ? 'fill-current' : ''}`} />
                            {liked ? 'Liked!' : 'Like this calculator'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
