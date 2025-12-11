"use client";

import React, { useState, useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {
    TrendingUp,
    DollarSign,
    Target,
    Sparkles,
    Info,
    Download,
    ChevronDown,
    ChevronRight,
    RotateCcw,
    Calculator,
    Building2,
    Briefcase,
    PieChart,
    Plus,
    Trash2
} from 'lucide-react';
import { CalculateButton } from './Shared/CalculateButton';
import { ResetButton } from './Shared/ResetButton';
import CurrencyInput from './CurrencyInput';
import NumberInput from './NumberInput';
import {
    calculateSimpleIRR,
    calculateInvestmentIRR,
    calculateRealEstateIRR,
    calculateBusinessProjectIRR,
    calculateNPV,
    generateNPVSensitivity,
    type IRRResult,
    type CashFlowItem
} from '@/lib/calc/irr';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { loadUnicodeFont } from '@/utils/pdfUtils';
import { useCurrency } from '@/context/CurrencyContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

type CalculationMode = 'simple' | 'investment' | 'realestate' | 'business' | 'npv';

export default function IRRCalculator() {
    const { currency } = useCurrency();

    // Mode selection
    const [mode, setMode] = useState<CalculationMode>('simple');

    // Simple IRR mode
    const [cashFlows, setCashFlows] = useState<number[]>([-10000, 3000, 4000]);

    // Investment Project mode
    const [initialInvestment, setInitialInvestment] = useState(100000);
    const [periodicReturns, setPeriodicReturns] = useState<number[]>([25000, 30000]);

    // Real Estate mode
    const [purchasePrice, setPurchasePrice] = useState(300000);
    const [downPayment, setDownPayment] = useState(60000);
    const [annualRent, setAnnualRent] = useState(24000);
    const [annualExpenses, setAnnualExpenses] = useState(8000);
    const [appreciationRate, setAppreciationRate] = useState(3);
    const [investmentYears, setInvestmentYears] = useState(10);

    // Business Project mode
    const [businessInvestment, setBusinessInvestment] = useState(200000);
    const [yearlyRevenues, setYearlyRevenues] = useState<number[]>([100000, 150000]);
    const [yearlyCosts, setYearlyCosts] = useState<number[]>([50000, 60000]);
    const [terminalValue, setTerminalValue] = useState(0);

    // NPV mode
    const [npvCashFlows, setNpvCashFlows] = useState<number[]>([-50000, 15000, 20000]);
    const [discountRate, setDiscountRate] = useState(10);

    // Advanced options (all start at 0)
    const [inflationRate, setInflationRate] = useState(0);
    const [taxRate, setTaxRate] = useState(0);
    const [reinvestmentRate, setReinvestmentRate] = useState(0);

    // UI State
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // Calculation state
    const [calculatedValues, setCalculatedValues] = useState<any>({
        mode: 'simple',
        cashFlows: [-10000, 3000, 4000],
        inflationRate: 0,
        taxRate: 0,
        reinvestmentRate: 0
    });
    const [hasCalculated, setHasCalculated] = useState(true);

    // Handle calculation
    const handleCalculate = () => {
        const values: any = {
            mode,
            inflationRate,
            taxRate,
            reinvestmentRate
        };

        if (mode === 'simple') {
            values.cashFlows = [...cashFlows];
        } else if (mode === 'investment') {
            values.initialInvestment = initialInvestment;
            values.periodicReturns = [...periodicReturns];
        } else if (mode === 'realestate') {
            values.purchasePrice = purchasePrice;
            values.downPayment = downPayment;
            values.annualRent = annualRent;
            values.annualExpenses = annualExpenses;
            values.appreciationRate = appreciationRate;
            values.investmentYears = investmentYears;
        } else if (mode === 'business') {
            values.businessInvestment = businessInvestment;
            values.yearlyRevenues = [...yearlyRevenues];
            values.yearlyCosts = [...yearlyCosts];
            values.terminalValue = terminalValue;
        } else if (mode === 'npv') {
            values.npvCashFlows = [...npvCashFlows];
            values.discountRate = discountRate;
        }

        setCalculatedValues(values);
        setHasCalculated(true);
        setCurrentPage(1);
    };

    // Calculate results based on mode
    const results = useMemo(() => {
        if (!hasCalculated) return null;

        try {
            if (calculatedValues.mode === 'simple') {
                const result = calculateSimpleIRR(calculatedValues.cashFlows);
                const schedule = calculatedValues.cashFlows.map((cf: number, i: number) => ({
                    period: i,
                    cashFlow: cf,
                    cumulative: calculatedValues.cashFlows.slice(0, i + 1).reduce((sum: number, v: number) => sum + v, 0),
                    discountedCF: cf / Math.pow(1 + result.irr / 100, i),
                    npv: 0
                }));

                // Calculate running NPV
                let runningNPV = 0;
                schedule.forEach((item: any) => {
                    runningNPV += item.discountedCF;
                    item.npv = runningNPV;
                });

                return { result, schedule, totalReturn: calculatedValues.cashFlows.reduce((sum: number, v: number) => sum + v, 0) };
            } else if (calculatedValues.mode === 'investment') {
                return calculateInvestmentIRR({
                    initialInvestment: calculatedValues.initialInvestment,
                    periodicReturns: calculatedValues.periodicReturns,
                    inflationRate: calculatedValues.inflationRate,
                    taxRate: calculatedValues.taxRate
                });
            } else if (calculatedValues.mode === 'realestate') {
                return calculateRealEstateIRR({
                    purchasePrice: calculatedValues.purchasePrice,
                    downPayment: calculatedValues.downPayment,
                    annualRent: calculatedValues.annualRent,
                    annualExpenses: calculatedValues.annualExpenses,
                    appreciationRate: calculatedValues.appreciationRate,
                    years: calculatedValues.investmentYears,
                    inflationRate: calculatedValues.inflationRate,
                    taxRate: calculatedValues.taxRate
                });
            } else if (calculatedValues.mode === 'business') {
                return calculateBusinessProjectIRR({
                    initialInvestment: calculatedValues.businessInvestment,
                    yearlyRevenues: calculatedValues.yearlyRevenues,
                    yearlyCosts: calculatedValues.yearlyCosts,
                    terminalValue: calculatedValues.terminalValue,
                    taxRate: calculatedValues.taxRate
                });
            } else if (calculatedValues.mode === 'npv') {
                // For NPV mode, calculate NPV at the specified discount rate
                if (!calculatedValues.npvCashFlows || calculatedValues.npvCashFlows.length === 0) {
                    return null;
                }

                const npvAtRate = calculateNPV(calculatedValues.npvCashFlows, calculatedValues.discountRate);
                const irrResult = calculateSimpleIRR(calculatedValues.npvCashFlows);

                const schedule = calculatedValues.npvCashFlows.map((cf: number, i: number) => ({
                    period: i,
                    cashFlow: cf,
                    cumulative: calculatedValues.npvCashFlows.slice(0, i + 1).reduce((sum: number, v: number) => sum + v, 0),
                    discountedCF: cf / Math.pow(1 + calculatedValues.discountRate / 100, i),
                    npv: 0
                }));

                // Calculate running NPV at the discount rate
                let runningNPV = 0;
                schedule.forEach((item: any) => {
                    runningNPV += item.discountedCF;
                    item.npv = runningNPV;
                });

                return {
                    result: {
                        ...irrResult,
                        npvAtIRR: npvAtRate
                    },
                    schedule,
                    npvAtDiscountRate: npvAtRate,
                    discountRate: calculatedValues.discountRate
                };
            }
        } catch (error) {
            console.error('Calculation error:', error);
            return null;
        }

        return null;
    }, [calculatedValues, hasCalculated]);

    // Generate sensitivity data
    const sensitivityData = useMemo(() => {
        if (!results || !results.schedule) return null;

        const cfs = results.schedule.map((item: CashFlowItem) => item.cashFlow);
        return generateNPVSensitivity(cfs, [0, 30], 15);
    }, [results]);

    // Chart data for cash flow waterfall
    const waterfallChartData = useMemo(() => {
        if (!results || !results.schedule) return null;

        return {
            labels: results.schedule.map((item: CashFlowItem) => `Year ${item.period}`),
            datasets: [{
                label: 'Cash Flow',
                data: results.schedule.map((item: CashFlowItem) => item.cashFlow),
                backgroundColor: results.schedule.map((item: CashFlowItem) =>
                    item.cashFlow >= 0 ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'
                ),
                borderColor: results.schedule.map((item: CashFlowItem) =>
                    item.cashFlow >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
                ),
                borderWidth: 2,
                borderRadius: 4
            }]
        };
    }, [results]);

    // Chart data for NPV sensitivity
    const sensitivityChartData = useMemo(() => {
        if (!sensitivityData) return null;

        return {
            labels: sensitivityData.map(d => `${d.rate.toFixed(1)}%`),
            datasets: [{
                label: 'NPV',
                data: sensitivityData.map(d => d.npv),
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        };
    }, [sensitivityData]);

    // AI Suggestions
    const suggestions = useMemo(() => {
        if (!results) return [];

        const irr = results.result.irr;
        const suggestions: string[] = [];

        if (irr > 20) {
            suggestions.push("🚀 Exceptional Returns: Your IRR exceeds 20%, which is considered excellent. This suggests a highly profitable investment.");
        } else if (irr > 12) {
            suggestions.push("📈 Strong Performance: An IRR between 12-20% typically outperforms the stock market average (≈10%). This is a solid investment.");
        } else if (irr > 8) {
            suggestions.push("✅ Moderate Returns: Your IRR is positive and beats inflation. Consider if it meets your risk-adjusted expectations.");
        } else if (irr > 0) {
            suggestions.push("⚠️ Low Returns: While positive, your IRR may not adequately compensate for risk and opportunity cost.");
        } else {
            suggestions.push("❌ Negative Returns: This investment destroys value. Reconsider or restructure the project.");
        }

        if (results.result.paybackPeriod) {
            if (results.result.paybackPeriod < 3) {
                suggestions.push(`💰 Quick Payback: You'll recover your initial investment in ${results.result.paybackPeriod.toFixed(1)} years, which is excellent for liquidity.`);
            } else if (results.result.paybackPeriod > 5) {
                suggestions.push(`⏳ Extended Payback: Recovery takes ${results.result.paybackPeriod.toFixed(1)} years. Ensure you're comfortable with this time horizon.`);
            }
        }

        if (calculatedValues.inflationRate > 0 && results.realIRR) {
            if (results.realIRR < inflationRate) {
                suggestions.push(`💸 Inflation Warning: Your real IRR (${results.realIRR.toFixed(2)}%) is below inflation (${inflationRate}%). You're losing purchasing power.`);
            }
        }

        if (!results.result.converged) {
            suggestions.push("⚠️ Calculation Note: IRR did not fully converge. Results may be approximate. Consider reviewing your cash flows.");
        }

        return suggestions;
    }, [results, calculatedValues]);

    // Reset functionality
    const handleReset = () => {
        setMode('simple');
        setCashFlows([-10000, 3000, 4000]);
        setInitialInvestment(100000);
        setPeriodicReturns([25000, 30000]);
        setPurchasePrice(300000);
        setDownPayment(60000);
        setAnnualRent(24000);
        setAnnualExpenses(8000);
        setAppreciationRate(3);
        setInvestmentYears(10);
        setBusinessInvestment(200000);
        setYearlyRevenues([100000, 150000]);
        setYearlyCosts([50000, 60000]);
        setTerminalValue(0);
        setNpvCashFlows([-50000, 15000, 20000]);
        setDiscountRate(10);
        setInflationRate(0);
        setTaxRate(0);
        setReinvestmentRate(0);
        setShowAdvanced(false);

        setCalculatedValues({
            mode: 'simple',
            cashFlows: [-10000, 3000, 4000],
            inflationRate: 0,
            taxRate: 0,
            reinvestmentRate: 0
        });
        setHasCalculated(true);
    };

    // PDF Export
    const handleExportPDF = async () => {
        if (!results) return;

        const doc = new jsPDF();
        await loadUnicodeFont(doc);

        // Header
        doc.setFillColor(220, 38, 38);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text('IRR Analysis Report', 105, 25, { align: 'center' });

        // Summary
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text('Investment Summary', 14, 50);

        const summaryData = [
            ['IRR', `${results.result.irr.toFixed(2)}%`],
            ['NPV at IRR', formatCurrency(results.result.npvAtIRR)],
            ['MIRR', results.result.mirr ? `${results.result.mirr.toFixed(2)}%` : 'N/A'],
            ['Payback Period', results.result.paybackPeriod ? `${results.result.paybackPeriod.toFixed(1)} years` : 'Not recovered'],
            ['Converged', results.result.converged ? 'Yes' : 'No']
        ];

        autoTable(doc, {
            startY: 55,
            head: [['Metric', 'Value']],
            body: summaryData,
            theme: 'grid',
            headStyles: { fillColor: [220, 38, 38] },
            columnStyles: {
                1: { font: 'NotoSans' }
            }
        });

        // Cash Flow Schedule
        if (results.schedule && results.schedule.length > 0) {
            doc.text('Cash Flow Schedule', 14, (doc as any).lastAutoTable.finalY + 15);

            const scheduleData = results.schedule.map((item: CashFlowItem) => [
                item.period.toString(),
                formatCurrency(item.cashFlow),
                formatCurrency(item.cumulative),
                formatCurrency(item.discountedCF),
                formatCurrency(item.npv)
            ]);

            autoTable(doc, {
                startY: (doc as any).lastAutoTable.finalY + 20,
                head: [['Period', 'Cash Flow', 'Cumulative', 'Discounted CF', 'NPV']],
                body: scheduleData,
                theme: 'striped',
                headStyles: { fillColor: [220, 38, 38] },
                styles: { fontSize: 9 },
                columnStyles: {
                    1: { font: 'NotoSans' },
                    2: { font: 'NotoSans' },
                    3: { font: 'NotoSans' },
                    4: { font: 'NotoSans' }
                }
            });
        }

        const timestamp = Date.now();
        doc.save(`irr-report-${timestamp}.pdf`);
    };

    const formatCurrency = (value: number) => {
        const absValue = Math.abs(value);
        const formatted = `${currency.symbol}${absValue.toLocaleString(currency.locale, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })}`;
        return value < 0 ? `-${formatted}` : formatted;
    };

    // Pagination
    const paginatedSchedule = useMemo(() => {
        if (!results || !results.schedule) return [];
        const start = (currentPage - 1) * rowsPerPage;
        return results.schedule.slice(start, start + rowsPerPage);
    }, [results, currentPage]);

    const totalPages = results ? Math.ceil(results.schedule.length / rowsPerPage) : 0;

    // Mode tabs
    const modes = [
        { id: 'simple' as CalculationMode, label: 'Simple IRR', icon: Calculator },
        { id: 'investment' as CalculationMode, label: 'Investment', icon: TrendingUp },
        { id: 'realestate' as CalculationMode, label: 'Real Estate', icon: Building2 },
        { id: 'business' as CalculationMode, label: 'Business', icon: Briefcase },
        { id: 'npv' as CalculationMode, label: 'NPV Analysis', icon: PieChart }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                {/* Mode Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex overflow-x-auto" role="tablist" aria-label="IRR calculation modes">
                        {modes.map((m) => {
                            const Icon = m.icon;
                            return (
                                <button
                                    key={m.id}
                                    role="tab"
                                    aria-selected={mode === m.id}
                                    aria-controls={`${m.id}-panel`}
                                    onClick={() => {
                                        setMode(m.id);
                                        // Only keep results showing for Simple mode
                                        if (m.id !== 'simple') {
                                            setHasCalculated(false);
                                        }
                                    }}
                                    className={`flex items-center px-6 py-4 font-medium transition-all whitespace-nowrap cursor-pointer ${mode === m.id
                                        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-gray-900'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {m.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Input Section */}
                        <div className="lg:col-span-4 space-y-6" id={`${mode}-panel`} role="tabpanel" aria-labelledby={mode}>
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {mode === 'simple' && 'Cash Flows'}
                                    {mode === 'investment' && 'Investment Details'}
                                    {mode === 'realestate' && 'Property Details'}
                                    {mode === 'business' && 'Project Details'}
                                    {mode === 'npv' && 'NPV Analysis'}
                                </h2>
                                <ResetButton onClick={handleReset} />
                            </div>

                            {/* Mode-specific inputs */}
                            {mode === 'simple' && (
                                <div className="space-y-4">
                                    {cashFlows.map((cf, idx) => (
                                        <div key={idx} className="flex gap-2 items-end">
                                            <div className="flex-1">
                                                <CurrencyInput
                                                    label={`${idx === 0 ? 'Initial Investment' : `Year ${idx}`}`}
                                                    value={Math.abs(cf)}
                                                    onChange={(v) => {
                                                        const newFlows = [...cashFlows];
                                                        newFlows[idx] = idx === 0 ? -Math.abs(v) : v;
                                                        setCashFlows(newFlows);
                                                    }}
                                                />
                                            </div>
                                            {idx > 0 && cashFlows.length > 2 && (
                                                <button
                                                    onClick={() => {
                                                        const newFlows = cashFlows.filter((_, i) => i !== idx);
                                                        setCashFlows(newFlows);
                                                    }}
                                                    className="mb-2 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                                                    aria-label={`Remove year ${idx} cash flow`}
                                                    title="Remove year"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => setCashFlows([...cashFlows, 0])}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                                        aria-label="Add another year to cash flow analysis"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span className="font-medium">Add Year</span>
                                    </button>
                                </div>
                            )}

                            {mode === 'investment' && (
                                <div className="space-y-4">
                                    <CurrencyInput
                                        label="Initial Investment"
                                        value={initialInvestment}
                                        onChange={setInitialInvestment}
                                        min={1000}
                                    />

                                    {periodicReturns.map((ret, idx) => (
                                        <div key={idx} className="flex gap-2 items-end">
                                            <div className="flex-1">
                                                <CurrencyInput
                                                    label={`Year ${idx + 1} Return`}
                                                    value={ret}
                                                    onChange={(v) => {
                                                        const newReturns = [...periodicReturns];
                                                        newReturns[idx] = v;
                                                        setPeriodicReturns(newReturns);
                                                    }}
                                                />
                                            </div>
                                            {periodicReturns.length > 1 && (
                                                <button
                                                    onClick={() => {
                                                        const newReturns = periodicReturns.filter((_, i) => i !== idx);
                                                        setPeriodicReturns(newReturns);
                                                    }}
                                                    className="mb-2 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                                                    aria-label={`Remove year ${idx + 1} from periodic returns`}
                                                    title="Remove year"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => setPeriodicReturns([...periodicReturns, 0])}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                                        aria-label="Add another year to investment returns"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span className="font-medium">Add Year</span>
                                    </button>
                                </div>
                            )}

                            {mode === 'realestate' && (
                                <div className="space-y-4">
                                    <CurrencyInput
                                        label="Purchase Price"
                                        value={purchasePrice}
                                        onChange={setPurchasePrice}
                                    />
                                    <CurrencyInput
                                        label="Down Payment"
                                        value={downPayment}
                                        onChange={setDownPayment}
                                    />
                                    <CurrencyInput
                                        label="Annual Rental Income"
                                        value={annualRent}
                                        onChange={setAnnualRent}
                                    />
                                    <CurrencyInput
                                        label="Annual Operating Expenses"
                                        value={annualExpenses}
                                        onChange={setAnnualExpenses}
                                    />
                                    <NumberInput
                                        label="Annual Appreciation Rate (%)"
                                        value={appreciationRate}
                                        onChange={setAppreciationRate}
                                        suffix="%"
                                        max={20}
                                    />
                                    <NumberInput
                                        label="Investment Period (Years)"
                                        value={investmentYears}
                                        onChange={setInvestmentYears}
                                        min={1}
                                        max={30}
                                    />
                                </div>
                            )}

                            {mode === 'business' && (
                                <div className="space-y-4">
                                    <CurrencyInput
                                        label="Initial Investment"
                                        value={businessInvestment}
                                        onChange={setBusinessInvestment}
                                    />

                                    {yearlyRevenues.map((rev, idx) => (
                                        <div key={idx} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Year {idx + 1}</h4>
                                                {yearlyRevenues.length > 1 && (
                                                    <button
                                                        onClick={() => {
                                                            const newRevs = yearlyRevenues.filter((_, i) => i !== idx);
                                                            const newCosts = yearlyCosts.filter((_, i) => i !== idx);
                                                            setYearlyRevenues(newRevs);
                                                            setYearlyCosts(newCosts);
                                                        }}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                                                        aria-label={`Remove year ${idx + 1} from business project`}
                                                        title="Remove year"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <CurrencyInput
                                                    label="Revenue"
                                                    value={rev}
                                                    onChange={(v) => {
                                                        const newRevs = [...yearlyRevenues];
                                                        newRevs[idx] = v;
                                                        setYearlyRevenues(newRevs);
                                                    }}
                                                />
                                                <CurrencyInput
                                                    label="Costs"
                                                    value={yearlyCosts[idx] || 0}
                                                    onChange={(v) => {
                                                        const newCosts = [...yearlyCosts];
                                                        newCosts[idx] = v;
                                                        setYearlyCosts(newCosts);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => {
                                            setYearlyRevenues([...yearlyRevenues, 0]);
                                            setYearlyCosts([...yearlyCosts, 0]);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                                        aria-label="Add another year to business project"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span className="font-medium">Add Year</span>
                                    </button>

                                    <CurrencyInput
                                        label="Terminal Value (Optional)"
                                        value={terminalValue}
                                        onChange={setTerminalValue}
                                    />
                                </div>
                            )}

                            {mode === 'npv' && (
                                <div className="space-y-4">
                                    <NumberInput
                                        label="Discount Rate (%)"
                                        value={discountRate}
                                        onChange={setDiscountRate}
                                        suffix="%"
                                        min={0}
                                        max={100}
                                    />

                                    {npvCashFlows.map((cf, idx) => (
                                        <div key={idx} className="flex gap-2 items-end">
                                            <div className="flex-1">
                                                <CurrencyInput
                                                    label={`${idx === 0 ? 'Initial Investment' : `Year ${idx}`}`}
                                                    value={Math.abs(cf)}
                                                    onChange={(v) => {
                                                        const newFlows = [...npvCashFlows];
                                                        newFlows[idx] = idx === 0 ? -Math.abs(v) : v;
                                                        setNpvCashFlows(newFlows);
                                                    }}
                                                />
                                            </div>
                                            {idx > 0 && npvCashFlows.length > 2 && (
                                                <button
                                                    onClick={() => {
                                                        const newFlows = npvCashFlows.filter((_, i) => i !== idx);
                                                        setNpvCashFlows(newFlows);
                                                    }}
                                                    className="mb-2 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                                                    aria-label={`Remove year ${idx} from NPV cash flows`}
                                                    title="Remove year"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => setNpvCashFlows([...npvCashFlows, 0])}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                                        aria-label="Add another year to NPV analysis"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span className="font-medium">Add Year</span>
                                    </button>
                                </div>
                            )}

                            {/* Advanced Options */}
                            <details className="group" open={showAdvanced} onToggle={(e) => setShowAdvanced((e.target as HTMLDetailsElement).open)}>
                                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 list-none flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <span className="flex items-center">
                                        <Info className="w-4 h-4 mr-2" />
                                        Advanced Options
                                    </span>
                                    <ChevronDown className="w-4 h-4 transition group-open:rotate-180" />
                                </summary>
                                <div className="mt-4 space-y-4 p-4 border border-gray-100 dark:border-gray-800 rounded-xl">
                                    <NumberInput
                                        label="Inflation Rate (%)"
                                        value={inflationRate}
                                        onChange={setInflationRate}
                                        suffix="%"
                                        max={20}
                                    />
                                    <NumberInput
                                        label="Tax Rate (%)"
                                        value={taxRate}
                                        onChange={setTaxRate}
                                        suffix="%"
                                        max={50}
                                    />
                                    <NumberInput
                                        label="Reinvestment Rate (%)"
                                        value={reinvestmentRate}
                                        onChange={setReinvestmentRate}
                                        suffix="%"
                                        max={30}
                                    />
                                </div>
                            </details>

                            <CalculateButton
                                onClick={handleCalculate}
                                label="Calculate IRR"
                                icon="📊"
                            />
                        </div>

                        {/* Results Section */}
                        <div className="lg:col-span-8 space-y-6">
                            {!hasCalculated ? (
                                <div className="h-full flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 min-h-[400px]">
                                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full mb-4">
                                        <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Results Preview</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                                        Configure your cash flows and click Calculate to see IRR analysis
                                    </p>
                                </div>
                            ) : results ? (
                                <>
                                    {/* Hero Metrics */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
                                            <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium mb-1">IRR</p>
                                            <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                                                {results.result.irr.toFixed(2)}%
                                            </p>
                                            <p className={`text-xs mt-1 ${results.result.converged ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {results.result.converged ? '✓ Converged' : '⚠ Approximate'}
                                            </p>
                                        </div>
                                        {results.result.mirr && (
                                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                                                <p className="text-xs text-purple-700 dark:text-purple-300 font-medium mb-1">MIRR</p>
                                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                                    {results.result.mirr.toFixed(2)}%
                                                </p>
                                            </div>
                                        )}
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-4 rounded-xl border border-green-100 dark:border-green-800">
                                            <p className="text-xs text-green-700 dark:text-green-300 font-medium mb-1">NPV at IRR</p>
                                            <p className="text-xl font-bold text-green-900 dark:text-green-100">
                                                {formatCurrency(results.result.npvAtIRR)}
                                            </p>
                                        </div>
                                        {results.result.paybackPeriod !== undefined && (
                                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 p-4 rounded-xl border border-orange-100 dark:border-orange-800">
                                                <p className="text-xs text-orange-700 dark:text-orange-300 font-medium mb-1">Payback</p>
                                                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                                                    {results.result.paybackPeriod.toFixed(1)}y
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Charts */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {waterfallChartData && (
                                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cash Flow Waterfall</h4>
                                                <div className="h-64" role="img" aria-label="Bar chart showing cash flow waterfall by year with positive flows in green and negative flows in red">
                                                    <Bar
                                                        data={waterfallChartData}
                                                        options={{
                                                            responsive: true,
                                                            maintainAspectRatio: false,
                                                            plugins: {
                                                                legend: { display: false }
                                                            },
                                                            scales: {
                                                                y: {
                                                                    beginAtZero: true,
                                                                    grid: { color: 'rgba(107, 114, 128, 0.1)' },
                                                                    ticks: { color: '#6B7280' }
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
                                        )}

                                        {sensitivityChartData && (
                                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">NPV Sensitivity</h4>
                                                <div className="h-64" role="img" aria-label="Line chart showing Net Present Value sensitivity analysis across different discount rates">
                                                    <Line
                                                        data={sensitivityChartData}
                                                        options={{
                                                            responsive: true,
                                                            maintainAspectRatio: false,
                                                            plugins: {
                                                                legend: { display: false }
                                                            },
                                                            scales: {
                                                                y: {
                                                                    grid: { color: 'rgba(107, 114, 128, 0.1)' },
                                                                    ticks: { color: '#6B7280' }
                                                                },
                                                                x: {
                                                                    grid: { display: false },
                                                                    ticks: { color: '#6B7280', maxRotation: 45 }
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Cash Flow Table */}
                                    {results.schedule && (
                                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Cash Flow Schedule</h4>
                                                <button
                                                    onClick={handleExportPDF}
                                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-sm text-sm cursor-pointer"
                                                    aria-label="Export IRR analysis report as PDF"
                                                >
                                                    <Download size={16} />
                                                    Export PDF
                                                </button>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 uppercase text-xs font-medium">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left">Period</th>
                                                            <th className="px-6 py-3 text-right">Cash Flow</th>
                                                            <th className="px-6 py-3 text-right">Cumulative</th>
                                                            <th className="px-6 py-3 text-right">Discounted</th>
                                                            <th className="px-6 py-3 text-right">NPV</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                        {paginatedSchedule.map((item: CashFlowItem, idx: number) => (
                                                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                                <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                                                                    Year {item.period}
                                                                </td>
                                                                <td className={`px-6 py-4 text-right font-semibold ${item.cashFlow >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                                    {formatCurrency(item.cashFlow)}
                                                                </td>
                                                                <td className="px-6 py-4 text-right text-gray-900 dark:text-white">
                                                                    {formatCurrency(item.cumulative)}
                                                                </td>
                                                                <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                                                                    {formatCurrency(item.discountedCF)}
                                                                </td>
                                                                <td className={`px-6 py-4 text-right font-medium ${item.npv >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                                    {formatCurrency(item.npv)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Pagination */}
                                            {totalPages > 1 && (
                                                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                    <button
                                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                        disabled={currentPage === 1}
                                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                        aria-label="Go to previous page of cash flow schedule"
                                                    >
                                                        Previous
                                                    </button>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        Page {currentPage} of {totalPages}
                                                    </span>
                                                    <button
                                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                        disabled={currentPage === totalPages}
                                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                        aria-label="Go to next page of cash flow schedule"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* AI Suggestions */}
                                    {suggestions.length > 0 && (
                                        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
                                            <div className="flex items-center mb-4">
                                                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    Investment Insights
                                                </h4>
                                            </div>
                                            <div className="space-y-3">
                                                {suggestions.map((suggestion, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-white/80 dark:bg-gray-900/60 p-4 rounded-lg border border-purple-100 dark:border-purple-800"
                                                    >
                                                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                                            {suggestion}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="p-12 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">Unable to calculate. Please check your inputs.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
