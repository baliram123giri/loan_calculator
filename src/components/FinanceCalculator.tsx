"use client";

import React, { useState, useMemo } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
    DollarSign,
    Percent,
    Calendar,
    TrendingUp,
    Calculator,
    Sparkles,
    RotateCcw,
    Heart
} from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import NumberInput from './NumberInput';
import {
    type CalculationMode,
    type CompoundingFrequency,
    type PaymentTiming,
    calculateFutureValue,
    calculatePresentValue,
    calculatePayment,
    calculatePeriods,
    calculateInterestRate,
    generateCashFlowSchedule,
    generateFinanceSuggestions,
    getPeriodsPerYear
} from '@/lib/calc/finance';
import { CalculateButton } from '@/components/Shared/CalculateButton';
import AmortizationTable from '@/components/AmortizationTable';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const MODES: { id: CalculationMode; label: string; icon: typeof Calculator }[] = [
    { id: 'FV', label: 'Future Value', icon: TrendingUp },
    { id: 'PV', label: 'Present Value', icon: DollarSign },
    { id: 'PMT', label: 'Payment', icon: Calculator },
    { id: 'N', label: 'Periods', icon: Calendar },
    { id: 'IY', label: 'Interest Rate', icon: Percent }
];

const COMPOUNDING_FREQUENCIES: { value: CompoundingFrequency; label: string }[] = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'semiannual', label: 'Semi-Annual' },
    { value: 'annual', label: 'Annual' },
    { value: 'daily', label: 'Daily' }
];

export default function FinanceCalculator() {
    const [activeMode, setActiveMode] = useState<CalculationMode>('FV');
    const [liked, setLiked] = useState(false);

    // Input states
    const [presentValue, setPresentValue] = useState(10000);
    const [futureValue, setFutureValue] = useState(0);
    const [payment, setPayment] = useState(0);
    const [annualRate, setAnnualRate] = useState(6);
    const [periods, setPeriods] = useState(120); // 10 years monthly
    const [compoundingFrequency, setCompoundingFrequency] = useState<CompoundingFrequency>('monthly');
    const [paymentTiming, setPaymentTiming] = useState<PaymentTiming>('end');

    // Advanced options
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Adjust default values when switching to N mode to ensure table displays
    React.useEffect(() => {
        if (activeMode === 'N') {
            // For N mode, we need FV or PMT to calculate periods
            // If both are 0, set a reasonable FV
            if (futureValue === 0 && payment === 0) {
                setFutureValue(20000);
            }
        }
    }, [activeMode, futureValue, payment]);

    // Calculate result based on active mode
    // Calculate result function
    const calculateResult = () => {
        try {
            const input = {
                presentValue,
                futureValue,
                payment,
                annualRate,
                periods,
                compoundingFrequency,
                paymentTiming
            };

            switch (activeMode) {
                case 'FV':
                    return calculateFutureValue(input);
                case 'PV':
                    return calculatePresentValue(input);
                case 'PMT':
                    return calculatePayment(input);
                case 'N':
                    return calculatePeriods(input);
                case 'IY':
                    return calculateInterestRate(input);
                default:
                    return null;
            }
        } catch (error) {
            console.error('Calculation error:', error);
            return null;
        }
    };

    // State for snapshotting inputs on calculate to ensure consistency across charts/tables
    const [calculatedInput, setCalculatedInput] = useState({
        presentValue: 10000,
        futureValue: 0,
        payment: 0,
        annualRate: 6,
        periods: 120,
        compoundingFrequency: 'monthly' as CompoundingFrequency,
        paymentTiming: 'end' as PaymentTiming
    });

    const [result, setResult] = useState<any>(calculateResult());

    const performCalculation = () => {
        const input = {
            presentValue,
            futureValue,
            payment,
            annualRate,
            periods,
            compoundingFrequency,
            paymentTiming
        };
        setCalculatedInput(input);
        setResult(calculateResult());
    };

    // Update result when mode changes
    React.useEffect(() => {
        const input = {
            presentValue,
            futureValue,
            payment,
            annualRate,
            periods,
            compoundingFrequency,
            paymentTiming
        };
        setCalculatedInput(input);
        setResult(calculateResult());
    }, [activeMode]);

    // Generate suggestions
    const suggestions = useMemo(() => {
        if (!result) return [];
        return generateFinanceSuggestions(activeMode, calculatedInput, result);
    }, [activeMode, calculatedInput, result]);

    // Generate cash flow schedule for visualization
    const cashFlowSchedule = useMemo(() => {
        try {
            const input = {
                ...calculatedInput,
                // Override the target value with the calculated one for the schedule
                payment: activeMode === 'PMT' && result ? result.value : calculatedInput.payment,
                annualRate: activeMode === 'IY' && result ? result.value : calculatedInput.annualRate,
                periods: activeMode === 'N' && result ? Math.ceil(result.value) : calculatedInput.periods,
            };

            // Generate schedule for all modes
            return generateCashFlowSchedule(input, activeMode);
        } catch (error) {
            return [];
        }
    }, [activeMode, calculatedInput, result]);

    // Chart data for breakdown
    const breakdownChartData = useMemo(() => {
        if (!result) return null;

        const investment = result.totalInvestment;
        const interest = Math.max(0, result.totalInterest);

        return {
            labels: ['Principal Invested', 'Interest Earned'],
            datasets: [{
                data: [investment, interest],
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

    // Chart data for growth visualization
    const growthChartData = useMemo(() => {
        if (cashFlowSchedule.length === 0) return null;

        // Sample data points for visualization (max 24 points)
        const step = Math.max(1, Math.floor(cashFlowSchedule.length / 24));
        const sampledData = cashFlowSchedule.filter((_, index) => index % step === 0 || index === cashFlowSchedule.length - 1);

        return {
            labels: sampledData.map(p => `Period ${p.period}`),
            datasets: [
                {
                    label: 'Balance Over Time',
                    data: sampledData.map(p => p.balance),
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Cumulative Payments',
                    data: sampledData.map(p => p.cumulativePayment),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        };
    }, [cashFlowSchedule]);

    const resetToDefaults = () => {
        setPresentValue(10000);
        setFutureValue(0);
        setPayment(0);
        setAnnualRate(6);
        setPeriods(120);
        setCompoundingFrequency('monthly');
        setPaymentTiming('end');
        setShowAdvanced(false);

        const defaults = {
            presentValue: 10000,
            futureValue: 0,
            payment: 0,
            annualRate: 6,
            periods: 120,
            compoundingFrequency: 'monthly' as CompoundingFrequency,
            paymentTiming: 'end' as PaymentTiming
        };

        // Helper to calc with explicit values
        const calcWithValues = (vals: typeof defaults) => {
            const input = { ...vals };
            switch (activeMode) {
                case 'FV': return calculateFutureValue(input);
                case 'PV': return calculatePresentValue(input);
                case 'PMT': return calculatePayment(input);
                case 'N': return calculatePeriods(input);
                case 'IY': return calculateInterestRate(input);
                default: return null;
            }
        };

        setCalculatedInput(defaults);
        setResult(calcWithValues(defaults));
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Math.abs(value));
    };

    const formatNumber = (value: number, decimals: number = 2) => {
        return value.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    };

    const getYearsFromPeriods = () => {
        const periodsPerYear = getPeriodsPerYear(compoundingFrequency);
        return periods / periodsPerYear;
    };

    const setYears = (years: number) => {
        const periodsPerYear = getPeriodsPerYear(compoundingFrequency);
        setPeriods(Math.round(years * periodsPerYear));
    };





    // Prepare schedule for AmortizationTable
    const scheduleForTable = useMemo(() => {
        const startDate = new Date();
        return cashFlowSchedule.map(row => {
            const date = new Date(startDate);
            // Calculate date based on frequency and period
            // Note: row.period is 1-based index
            switch (compoundingFrequency) {
                case 'annual':
                    date.setFullYear(date.getFullYear() + row.period); // Add years (mistake in thought trace fixed here: period 1 = +1 year?? usually period is offset. If period 1 is end of 1st year, then +1 year is correct)
                    // Better: add period * 1 year? 
                    // If start is Jan 1 2024. Period 1 end is Jan 1 2025. Yes.
                    // But usually amortization tables start with period 1 AFTER 1 month.
                    // So adding 'period' units is correct.
                    break;
                case 'semiannual':
                    date.setMonth(date.getMonth() + row.period * 6);
                    break;
                case 'quarterly':
                    date.setMonth(date.getMonth() + row.period * 3);
                    break;
                case 'monthly':
                    date.setMonth(date.getMonth() + row.period);
                    break;
                case 'daily':
                    date.setDate(date.getDate() + row.period);
                    break;
            }

            return {
                month: row.period,
                date: date,
                payment: row.payment,
                principal: row.principal,
                interest: row.interest,
                balance: row.balance
            };
        });
    }, [cashFlowSchedule, compoundingFrequency]);

    // Prepare loan details for PDF
    const loanDetails = useMemo(() => {
        if (!result) return undefined;

        return {
            loanAmount: calculatedInput.presentValue,
            interestRate: activeMode === 'IY' ? result.value : calculatedInput.annualRate,
            loanTerm: activeMode === 'N' ? Math.ceil(result.value) : calculatedInput.periods,
            monthlyPayment: activeMode === 'PMT' ? result.value : calculatedInput.payment,
            totalInterest: result.totalInterest,
            totalCost: result.totalInvestment + result.totalInterest
        };
    }, [result, calculatedInput, activeMode]);






    return (
        <div className="max-w-7xl mx-auto">
            {/* Main Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">

                {/* Mode Selection Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex overflow-x-auto">
                        {MODES.map((mode) => {
                            const Icon = mode.icon;
                            return (
                                <button
                                    key={mode.id}
                                    onClick={() => setActiveMode(mode.id)}
                                    className={`flex items-center px-6 py-4 font-medium transition-all whitespace-nowrap cursor-pointer ${activeMode === mode.id
                                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-900'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {mode.label}
                                </button>
                            );
                        })
                        }
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Input Section */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Calculate {MODES.find(m => m.id === activeMode)?.label}
                                </h3>
                                <button
                                    onClick={resetToDefaults}
                                    className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                                >
                                    <RotateCcw className="w-4 h-4 mr-1" />
                                    Reset
                                </button>
                            </div>

                            {/* Mode-specific inputs */}
                            <div className="space-y-4">
                                {/* Present Value - shown for all except PV mode */}
                                {activeMode !== 'PV' && (
                                    <CurrencyInput
                                        label="Present Value (PV)"
                                        value={presentValue}
                                        onChange={setPresentValue}
                                        min={0}
                                        max={100000000}
                                    />
                                )}

                                {/* Future Value - shown for all except FV mode */}
                                {activeMode !== 'FV' && (
                                    <CurrencyInput
                                        label="Future Value (FV)"
                                        value={futureValue}
                                        onChange={setFutureValue}
                                        min={0}
                                        max={100000000}
                                    />
                                )}

                                {/* Payment - shown for all except PMT mode */}
                                {activeMode !== 'PMT' && (
                                    <CurrencyInput
                                        label="Payment (PMT)"
                                        value={payment}
                                        onChange={setPayment}
                                        min={0}
                                        max={1000000}
                                    />
                                )}

                                {/* Annual Rate - shown for all except IY mode */}
                                {activeMode !== 'IY' && (
                                    <NumberInput
                                        label="Annual Interest Rate (%)"
                                        value={annualRate}
                                        onChange={setAnnualRate}
                                        min={0}
                                        max={30}
                                        step={0.1}
                                        suffix="%"
                                    />
                                )}

                                {/* Periods - shown for all except N mode */}
                                {activeMode !== 'N' && (
                                    <NumberInput
                                        label={`Number of Years`}
                                        value={getYearsFromPeriods()}
                                        onChange={setYears}
                                        min={0.1}
                                        max={50}
                                        step={0.5}
                                    />
                                )}
                            </div>

                            {/* Payment Settings */}
                            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Payment Timing
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPaymentTiming('end')}
                                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${paymentTiming === 'end'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            End of Period
                                        </button>
                                        <button
                                            onClick={() => setPaymentTiming('begin')}
                                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${paymentTiming === 'begin'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            Beginning of Period
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <CalculateButton
                                    onClick={performCalculation}
                                    label="Calculate"
                                />
                            </div>
                        </div>

                        {/* Results Section */}
                        <div className="lg:col-span-7 space-y-6">
                            {result && (
                                <>
                                    {/* Main Result Card */}
                                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-blue-100 dark:border-blue-800">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                {MODES.find(m => m.id === activeMode)?.label}
                                            </p>
                                            <p className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400">
                                                {activeMode === 'N'
                                                    ? `${formatNumber(result.value / getPeriodsPerYear(compoundingFrequency), 1)} years`
                                                    : activeMode === 'IY'
                                                        ? `${formatNumber(result.value, 2)}%`
                                                        : formatCurrency(result.value)
                                                }
                                            </p>
                                            {activeMode === 'IY' && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                    Effective Rate: {formatNumber(result.effectiveRate, 2)}%
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Metric Cards */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Investment</p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                                                {formatCurrency(result.totalInvestment)}
                                            </p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Interest</p>
                                            <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">
                                                {formatCurrency(Math.max(0, result.totalInterest))}
                                            </p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Effective Rate</p>
                                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                                                {formatNumber(result.effectiveRate, 2)}%
                                            </p>
                                        </div>
                                    </div>

                                    {/* Charts */}
                                    {breakdownChartData && (
                                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 text-center">
                                                Investment Breakdown
                                            </h4>
                                            <div className="h-64">
                                                <Pie
                                                    data={breakdownChartData}
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

                                    {/* Growth Chart */}
                                    {growthChartData && (
                                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                Growth Over Time
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
                                                                        const value = context.parsed.y ?? 0;
                                                                        return context.dataset.label + ': ' + formatCurrency(value);
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

                                    {/* Cash Flow Schedule Table */}
                                    {scheduleForTable.length > 0 && (
                                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                Cash Flow Schedule
                                            </h4>
                                            <AmortizationTable
                                                schedule={scheduleForTable}
                                                calculatorName={`Finance Calculator - ${MODES.find(m => m.id === activeMode)?.label}`}
                                                loanDetails={loanDetails}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

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
                                {suggestions.map((suggestion, index) => (
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

                    {/* Like Button */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setLiked(!liked)}
                            className={`inline-flex items-center px-6 py-3 rounded-full transition-all cursor-pointer ${liked
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
