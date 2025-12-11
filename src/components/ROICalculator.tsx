"use client";

import { loadUnicodeFont } from '@/utils/pdfUtils';
import { formatCurrency as formatCurrencyUtil, formatPercentage as formatPercentageUtil, formatCurrencyForPDF as formatCurrencyForPDFUtil } from '@/utils/formatUtils';
import React, { useState, useMemo } from 'react';
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
import { Pie, Line } from 'react-chartjs-2';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Info,
    Download,
    Sparkles,
    AlertCircle
} from 'lucide-react';
import { CalculateButton } from './Shared/CalculateButton';
import { ResetButton } from './Shared/ResetButton';
import { DatePicker } from './Shared/DatePicker';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import CurrencyInput from './CurrencyInput';
import NumberInput from './NumberInput';
import { useCurrency } from '@/context/CurrencyContext';

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

interface ROICalculationResult {
    invested: number;
    returned: number;
    profit: number;
    roi: number; // percentage
    annualizedRoi: number; // percentage
    realRoi?: number; // inflation-adjusted ROI percentage
    years: number;
}

export default function ROICalculator() {
    const { currency } = useCurrency();

    // Inputs
    const [amountInvested, setAmountInvested] = useState(10000);
    const [amountReturned, setAmountReturned] = useState(15000);
    const [investmentLength, setInvestmentLength] = useState(3);
    const [lengthUnit, setLengthUnit] = useState<'years' | 'months'>('years');

    // Duration Input Mode
    const [durationMode, setDurationMode] = useState<'manual' | 'dates'>('manual');

    // Date Based Inputs (Optional)
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Advanced Options
    const [inflationRate, setInflationRate] = useState(0);

    // Snapshot for calculation
    const [calculatedValues, setCalculatedValues] = useState<ROICalculationResult | null>({
        invested: 10000,
        returned: 15000,
        profit: 5000,
        roi: 50,
        annualizedRoi: (Math.pow(15000 / 10000, 1 / 3) - 1) * 100,
        years: 3
    });

    const handleCalculate = () => {
        if (amountInvested <= 0) {
            setCalculatedValues({
                invested: amountInvested,
                returned: amountReturned,
                profit: amountReturned - amountInvested,
                roi: 0,
                annualizedRoi: 0,
                years: 0
            });
            return;
        }

        const profit = amountReturned - amountInvested;
        const roi = (profit / amountInvested) * 100;

        let years = 0;

        // Use the selected duration mode strictly
        if (durationMode === 'dates') {
            // Date-based calculation
            if (!startDate || !endDate) {
                alert('Please provide both Start Date and End Date for calculation.');
                return;
            }
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            years = diffDays / 365.25;
        } else {
            // Manual duration calculation
            years = lengthUnit === 'years' ? investmentLength : investmentLength / 12;
        }

        if (years <= 0) {
            setCalculatedValues({
                invested: amountInvested,
                returned: amountReturned,
                profit,
                roi,
                annualizedRoi: 0, // Cannot annualize 0 duration
                years: 0
            });
            return;
        }

        // Annualized ROI formula: ((1 + Total ROI)^(1/n) - 1) * 100
        const annualizedRoi = (Math.pow(amountReturned / amountInvested, 1 / years) - 1) * 100;

        // Real ROI (Inflation-Adjusted CAGR)
        // Formula: Real CAGR = ((1 + Nominal CAGR) / (1 + Inflation Rate)) - 1
        const inflationDec = inflationRate / 100;
        const annualizedRoiDec = annualizedRoi / 100;
        const realRoi = inflationRate > 0
            ? (((1 + annualizedRoiDec) / (1 + inflationDec)) - 1) * 100
            : annualizedRoi;

        setCalculatedValues({
            invested: amountInvested,
            returned: amountReturned,
            profit,
            roi,
            annualizedRoi,
            realRoi,
            years
        });
    };

    const resetToDefaults = () => {
        setAmountInvested(10000);
        setAmountReturned(15000);
        setInvestmentLength(3);
        setLengthUnit('years');
        setDurationMode('manual');
        setStartDate('');
        setEndDate('');
        setInflationRate(0);
        setCalculatedValues({
            invested: 10000,
            returned: 15000,
            profit: 5000,
            roi: 50,
            annualizedRoi: (Math.pow(15000 / 10000, 1 / 3) - 1) * 100,
            years: 3
        });
    };

    // Format helpers using reusable utilities
    const formatCurrency = (value: number) => formatCurrencyUtil(value, currency, 0);
    const formatPercentage = (value: number) => formatPercentageUtil(value, 2);
    const formatCurrencyForPDF = (value: number) => formatCurrencyForPDFUtil(value, currency, 0);

    // Charts
    const pieChartData = useMemo(() => {
        if (!calculatedValues) return null;
        const isProfit = calculatedValues.profit >= 0;

        return {
            labels: ['Invested', isProfit ? 'Profit' : 'Loss'],
            datasets: [{
                data: [calculatedValues.invested, Math.abs(calculatedValues.profit)],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)', // blue
                    isProfit ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)' // green or red
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    isProfit ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 2
            }]
        };
    }, [calculatedValues]);

    // Insights Generation
    const insights = useMemo(() => {
        if (!calculatedValues) return [];
        const tips = [];
        const { roi, annualizedRoi, years } = calculatedValues;

        if (roi < 0) {
            tips.push({
                type: 'warning',
                title: 'Negative Return',
                desc: 'Your investment has resulted in a loss. Consider analyzing the underlying causes or holding longer if market recovery is expected.'
            });
        } else if (annualizedRoi > 20) {
            tips.push({
                type: 'success',
                title: 'Exceptional Performance',
                desc: `An annualized return of ${formatPercentage(annualizedRoi)} exceeds typical market averages (S&P 500 ~10%). Excellent work!`
            });
        } else if (annualizedRoi >= 7) {
            tips.push({
                type: 'success',
                title: 'Solid Growth',
                desc: `Your ${formatPercentage(annualizedRoi)} return is healthy and beats inflation, aligning with long-term equity benchmarks.`
            });
        } else {
            tips.push({
                type: 'neutral',
                title: 'Modest Growth',
                desc: `A ${formatPercentage(annualizedRoi)} return is positive but may barely beat inflation. Consider diversifying into higher-yield assets.`
            });
        }

        if (years < 1) {
            tips.push({
                type: 'info',
                title: 'Short Term Volatility',
                desc: 'Short-term investments can be volatile. Annualized figures might be skewed for durations less than a year.'
            });
        } else if (years > 10) {
            tips.push({
                type: 'info',
                title: 'Long Term Compounding',
                desc: 'Over long periods, even small differences in annualized ROI make a massive impact on total wealth.'
            });
        }

        return tips;
    }, [calculatedValues]);

    const handleExportPDF = async () => {
        if (!calculatedValues) return;
        const doc = new jsPDF();

        // Load Font for Currency
        await loadUnicodeFont(doc);
        doc.setFont('NotoSans');

        // Header
        doc.setFillColor(41, 128, 185);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text('ROI Calculation Report', 105, 25, { align: 'center' });

        // Summary
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text('Investment Summary', 14, 50);

        const summaryData = [
            ['Amount Invested', formatCurrencyForPDF(calculatedValues.invested)],
            ['Amount Returned', formatCurrencyForPDF(calculatedValues.returned)],
            ['Net Profit/Loss', formatCurrencyForPDF(calculatedValues.profit)],
            ['Total ROI', formatPercentage(calculatedValues.roi)],
            ['Annualized ROI (CAGR)', formatPercentage(calculatedValues.annualizedRoi)],
            ['Investment Period', `${calculatedValues.years.toFixed(1)} Years`]
        ];

        // Add dates to summary if used
        if (startDate && endDate) {
            summaryData.push(['Start Date', new Date(startDate).toLocaleDateString()]);
            summaryData.push(['End Date', new Date(endDate).toLocaleDateString()]);
        }

        // Custom styling for Profit/Loss text color in PDF
        autoTable(doc, {
            startY: 55,
            head: [['Metric', 'Value']],
            body: summaryData,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] },
            styles: { font: 'NotoSans' }, // Apply font to table
            didParseCell: function (data) {
                if (data.section === 'body' && data.column.index === 1) {
                    const rowLabel = data.row.raw[0];
                    if (rowLabel === 'Net Profit/Loss' || rowLabel === 'Total ROI' || rowLabel === 'Annualized ROI (CAGR)') {
                        const val = data.cell.raw as string;
                        // clean value to check sign
                        const numVal = parseFloat(val.replace(/[^\d.-]/g, ''));
                        if (numVal < 0) {
                            data.cell.styles.textColor = [220, 38, 38]; // Red
                        } else if (numVal > 0) {
                            data.cell.styles.textColor = [22, 163, 74]; // Green
                        }
                    }
                }
            }
        });

        // Insights Section in PDF
        const finalY = (doc as any).lastAutoTable.finalY + 15;
        doc.text('Investment Insights', 14, finalY);

        const insightsData = insights.map(i => [i.title, i.desc]);

        autoTable(doc, {
            startY: finalY + 5,
            head: [['Insight', 'Details']],
            body: insightsData,
            theme: 'grid',
            headStyles: { fillColor: [100, 116, 139] }, // gray header for insights
            styles: { font: 'NotoSans' },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 50 },
                1: { cellWidth: 'auto' }
            }
        });

        doc.save(`roi-report-${Date.now()}.pdf`);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Input Section */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                    <DollarSign className="w-6 h-6 mr-2 text-blue-600" />
                                    Investment Details
                                </h3>
                                <ResetButton onClick={resetToDefaults} />
                            </div>

                            <div className="space-y-6">
                                <CurrencyInput
                                    label="Amount Invested"
                                    value={amountInvested}
                                    onChange={setAmountInvested}
                                    min={0}
                                />
                                <CurrencyInput
                                    label="Amount Returned"
                                    value={amountReturned}
                                    onChange={setAmountReturned}
                                    min={0}
                                />

                                {/* Duration Input Mode Tabs */}
                                <div className="border-b border-gray-200 dark:border-gray-700" role="tablist" aria-label="Duration input method">
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setDurationMode('manual');
                                                // Clear dates when switching to manual mode
                                                setStartDate('');
                                                setEndDate('');
                                            }}
                                            role="tab"
                                            aria-selected={durationMode === 'manual'}
                                            aria-controls="manual-duration-panel"
                                            className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer border-b-2 ${durationMode === 'manual'
                                                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                                }`}
                                        >
                                            Manual Duration
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setDurationMode('dates');
                                                // Optionally reset manual inputs when switching to dates mode
                                                // This ensures clean state but user may want to keep values
                                            }}
                                            role="tab"
                                            aria-selected={durationMode === 'dates'}
                                            aria-controls="dates-panel"
                                            className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer border-b-2 ${durationMode === 'dates'
                                                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                                }`}
                                        >
                                            By Dates
                                        </button>
                                    </div>
                                </div>

                                {/* Manual Duration Inputs */}
                                {durationMode === 'manual' && (
                                    <div id="manual-duration-panel" role="tabpanel" aria-labelledby="manual-tab" className="grid grid-cols-2 gap-4">
                                        <NumberInput
                                            label="Length"
                                            value={investmentLength}
                                            onChange={setInvestmentLength}
                                            min={1}
                                        />
                                        <div className="space-y-2">
                                            <label id="unit-label" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Unit
                                            </label>
                                            <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden" role="group" aria-labelledby="unit-label">
                                                <button
                                                    type="button"
                                                    onClick={() => setLengthUnit('years')}
                                                    aria-pressed={lengthUnit === 'years'}
                                                    aria-label="Select years as unit"
                                                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${lengthUnit === 'years'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    Years
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setLengthUnit('months')}
                                                    aria-pressed={lengthUnit === 'months'}
                                                    aria-label="Select months as unit"
                                                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${lengthUnit === 'months'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    Months
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Date-Based Inputs */}
                                {durationMode === 'dates' && (
                                    <div id="dates-panel" role="tabpanel" aria-labelledby="dates-tab" className="grid grid-cols-2 gap-4">
                                        <DatePicker
                                            label="Start Date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            aria-label="Investment start date"
                                        />
                                        <DatePicker
                                            label="End Date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            aria-label="Investment end date"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Advanced Options */}
                        <details className="group border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                            <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 list-none flex items-center justify-between p-4">
                                <span className="flex items-center">
                                    <Info className="w-4 h-4 mr-2" />
                                    Advanced Options
                                </span>
                                <span className="transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <div className="p-4 pt-0 space-y-4">
                                <NumberInput
                                    label="Inflation Rate (%) - Optional"
                                    value={inflationRate}
                                    onChange={setInflationRate}
                                    min={0}
                                    max={20}
                                    suffix="%"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    * Inflation adjustment helps you see the "Real ROl".
                                </p>
                            </div>
                        </details>

                        <CalculateButton
                            onClick={handleCalculate}
                            label="Calculate ROI"
                        />
                    </div>

                    {/* Results Section */}
                    {calculatedValues && (
                        <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className={`p-6 rounded-xl border ${calculatedValues.profit >= 0 ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total {calculatedValues.profit >= 0 ? 'Profit' : 'Loss'}</p>
                                    <p className={`text-3xl font-bold ${calculatedValues.profit >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                        {formatCurrency(calculatedValues.profit)}
                                    </p>
                                </div>

                                <div className="p-6 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Total ROI</p>
                                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                                        {formatPercentage(calculatedValues.roi)}
                                    </p>
                                </div>

                                <div className="p-6 rounded-xl bg-purple-50 border border-purple-200 dark:bg-purple-900/20 dark:border-purple-800 sm:col-span-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Annualized ROI (CAGR)</p>
                                            <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                                                {formatPercentage(calculatedValues.annualizedRoi)}
                                            </p>
                                        </div>
                                        <div className="hidden sm:block">
                                            <TrendingUp className="w-12 h-12 text-purple-200 dark:text-purple-800" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-purple-600/80 dark:text-purple-400/80 mt-2">
                                        This is your compound annual growth rate (CAGR)
                                    </p>
                                </div>

                                {/* Real ROI (Inflation-Adjusted) - Only show when inflation rate is set */}
                                {inflationRate > 0 && calculatedValues.realRoi !== undefined && (
                                    <div className="p-6 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-900/20 dark:border-teal-800 sm:col-span-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-teal-600 dark:text-teal-400 mb-1">Real ROI (Inflation-Adjusted)</p>
                                                <p className="text-3xl font-bold text-teal-700 dark:text-teal-300">
                                                    {formatPercentage(calculatedValues.realRoi)}
                                                </p>
                                            </div>
                                            <div className="hidden sm:block">
                                                <AlertCircle className="w-12 h-12 text-teal-200 dark:text-teal-800" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-teal-600/80 dark:text-teal-400/80 mt-2">
                                            Your actual return after accounting for {inflationRate}% inflation
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Charts & Breakdown */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">
                                        Investment Breakdown
                                    </h4>
                                    <div className="h-64 relative" role="img" aria-label={`Investment breakdown chart showing ${formatCurrency(calculatedValues.invested)} invested and ${formatCurrency(Math.abs(calculatedValues.profit))} ${calculatedValues.profit >= 0 ? 'profit' : 'loss'}`}>
                                        {pieChartData && (
                                            <Pie
                                                data={pieChartData}
                                                options={{
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        legend: {
                                                            position: 'bottom',
                                                            labels: { padding: 20 }
                                                        }
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Smart Insights */}
                                <div className="space-y-4">
                                    <div className="flex items-center mb-2">
                                        <Sparkles className="w-5 h-5 text-amber-500 mr-2" />
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Smart Insights</h4>
                                    </div>
                                    <div className="space-y-3">
                                        {insights.map((insight, idx) => (
                                            <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                                <div className="flex items-start">
                                                    {insight.type === 'warning' && <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />}
                                                    {insight.type === 'success' && <TrendingUp className="w-5 h-5 text-green-500 mr-3 mt-0.5" />}
                                                    {insight.type === 'neutral' && <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />}
                                                    {insight.type === 'info' && <Info className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />}

                                                    <div>
                                                        <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {insight.title}
                                                        </h5>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                            {insight.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleExportPDF}
                                aria-label="Download ROI calculation report as PDF"
                                className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 dark:bg-blue-700 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold cursor-pointer"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Download Full Report (PDF)
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
