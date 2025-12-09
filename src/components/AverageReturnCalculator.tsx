"use client";

import { useState, useMemo, useEffect, Fragment } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
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
    ArcElement,
    BarElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import {
    Heart,
    Target,
    Calendar,
    ChevronRight,
    TrendingUp,
    Download,
    Info,
    ChevronDown,
    Sparkles
} from 'lucide-react';
import { CalculateButton } from './Shared/CalculateButton';
import { ResetButton } from './Shared/ResetButton';
import { DatePicker } from './Shared/DatePicker';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import CurrencyInput from './CurrencyInput';
import NumberInput from './NumberInput';
import { loadUnicodeFont } from '@/utils/pdfUtils';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

interface ScheduleItem {
    year: number;
    value: number;
    gain: number;
    date: string;
    months?: ScheduleItem[];
}


export default function AverageReturnCalculator() {
    // Basic Inputs
    const [initialInvestment, setInitialInvestment] = useState(10000);
    const [finalValue, setFinalValue] = useState(15000);
    const [years, setYears] = useState(5);
    const [months, setMonths] = useState(0);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    // Advanced Inputs
    const [inflationRate, setInflationRate] = useState(0);
    const [taxRate, setTaxRate] = useState(0);

    // AI Suggestions
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [liked, setLiked] = useState(false);
    const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());

    const toggleYear = (year: number) => {
        const newExpanded = new Set(expandedYears);
        if (newExpanded.has(year)) {
            newExpanded.delete(year);
        } else {
            newExpanded.add(year);
        }
        setExpandedYears(newExpanded);
    };

    // Snapshot state for calculation
    const [calculatedValues, setCalculatedValues] = useState({
        initialInvestment: 10000,
        finalValue: 15000,
        years: 5,
        months: 0,
        startDate: new Date().toISOString().split('T')[0],
        inflationRate: 0,
        taxRate: 0
    });
    const [hasCalculated, setHasCalculated] = useState(true);

    const handleCalculate = () => {
        setCalculatedValues({
            initialInvestment,
            finalValue,
            years,
            months,
            startDate,
            inflationRate,
            taxRate
        });
        setHasCalculated(true);
    };

    // Calculation Logic
    const { result, schedule } = useMemo(() => {
        const start = calculatedValues.initialInvestment;
        const end = calculatedValues.finalValue;
        const time = calculatedValues.years + (calculatedValues.months / 12);

        // Validation
        if (start <= 0 || time <= 0) {
            return {
                result: {
                    totalReturn: 0,
                    totalReturnPercent: 0,
                    cagr: 0,
                    simpleAnnualReturn: 0,
                    realReturn: 0,
                    afterTaxEnd: 0
                },
                schedule: []
            };
        }

        const totalGain = end - start;
        const totalReturnPercent = (totalGain / start) * 100;

        // CAGR Formula: (End/Start)^(1/t) - 1
        // Handle negative growth gracefully for Math.pow
        // If End/Start is negative (impossible for price/value unless leverage involved, assuming value >= 0)
        const ratio = end / start;
        const cagrDec = Math.pow(ratio, 1 / time) - 1;
        const cagr = cagrDec * 100;

        // Simple Annual Return: Total Return % / Time
        const simpleAnnualReturn = totalReturnPercent / time;

        // Real Return (Inflation Adjusted): (1 + nominal) / (1 + inflation) - 1 ~= nominal - inflation
        // More precise: Real CAGR = ((1 + cagr) / (1 + inflation)) - 1
        const inflationDec = calculatedValues.inflationRate / 100;
        const realCagrDec = ((1 + cagrDec) / (1 + inflationDec)) - 1;
        const realReturn = realCagrDec * 100;

        // Tax Calculation (Capital Gains style)
        // Gain = end - start. Tax = Gain * TaxRate
        const taxAmount = Math.max(0, totalGain) * (calculatedValues.taxRate / 100);
        const afterTaxEnd = end - taxAmount;
        const afterTaxGain = afterTaxEnd - start;
        const afterTaxCagrDec = Math.pow(afterTaxEnd / start, 1 / time) - 1;
        // We generally output the After Tax Value, maybe After Tax CAGR too?
        // Let's stick to After Tax End Value for simplicity in main result

        // Generate Schedule for Chart (Interpolating CAGR curve)
        const scheduleData: ScheduleItem[] = [];
        const startObj = new Date(calculatedValues.startDate);
        const steps = Math.ceil(time);

        // Year 0 (Initial)
        scheduleData.push({
            year: 0,
            value: start,
            gain: 0,
            date: startObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
            months: []
        });

        for (let i = 1; i <= steps; i++) {
            const t = Math.min(i, time);
            const val = start * Math.pow(1 + cagrDec, t);

            const yearStart = new Date(startObj);
            yearStart.setFullYear(yearStart.getFullYear() + (i - 1));

            const yearEnd = new Date(startObj);
            // Calculate end date for this row
            if (t === i) {
                // Full year
                yearEnd.setFullYear(yearEnd.getFullYear() + i);
            } else {
                // Partial year end
                const partialMonths = Math.round((t - (i - 1)) * 12);
                yearEnd.setFullYear(yearEnd.getFullYear() + (i - 1));
                yearEnd.setMonth(yearEnd.getMonth() + partialMonths);
            }

            // Label: Standard date for all, range/financial year ONLY for the last row
            let label;
            if (i === steps) {
                label = `${yearStart.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - ${yearEnd.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`;
            } else {
                label = yearEnd.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            }

            const row: ScheduleItem = {
                year: t,
                value: val,
                gain: val - start,
                date: label,
                months: []
            };

            // Generate months ONLY for the last row as requested
            if (i === steps) {
                const monthlyItems: ScheduleItem[] = [];
                // Round to nearest integer to avoid float errors like 11.99
                const monthsCount = Math.round((t - (i - 1)) * 12);

                for (let m = 1; m <= monthsCount; m++) {
                    const monthT = (i - 1) + (m / 12);
                    const mVal = start * Math.pow(1 + cagrDec, monthT);

                    const mDate = new Date(yearStart);
                    mDate.setMonth(mDate.getMonth() + m);

                    monthlyItems.push({
                        year: monthT,
                        value: mVal,
                        gain: mVal - start,
                        date: mDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    });
                }
                row.months = monthlyItems;
            }

            scheduleData.push(row);
        }

        return {
            result: {
                totalReturn: totalGain,
                totalReturnPercent,
                cagr,
                simpleAnnualReturn,
                realReturn,
                afterTaxEnd,
                taxAmount,
                afterTaxCagr: afterTaxCagrDec * 100
            },
            schedule: scheduleData
        };
    }, [calculatedValues]);

    // AI Suggestions
    useEffect(() => {
        const newSuggestions = [];
        const { cagr, totalReturnPercent, realReturn } = result;
        const { inflationRate, years } = calculatedValues;

        if (cagr > 10) {
            newSuggestions.push("🚀 High Performance: Your Annualized Return (CAGR) exceeds 10%, which beats the historical average of the S&P 500 (approx. 10%). Excellent growth!");
        } else if (cagr > 5) {
            newSuggestions.push("📈 Solid Growth: A CAGR between 5% and 10% is a healthy return, typically outpacing standard savings accounts and bonds.");
        } else if (cagr > 0) {
            newSuggestions.push("🛡️ Positive Returns: You made a profit, but the rate is modest. Ensure it beats inflation to maintain purchasing power.");
        } else {
            newSuggestions.push("📉 Negative Trend: The investment lost value. Review your strategy or consider if this was a planned capital spend.");
        }

        if (inflationRate > 0 && cagr < inflationRate) {
            newSuggestions.push(`⚠️ Inflation Warning: Your return of ${cagr.toFixed(2)}% is lower than inflation (${inflationRate}%). In real terms, your money is losing value.`);
        }

        if (totalReturnPercent > 100) {
            newSuggestions.push("💰 Doubler: You've more than doubled your initial investment! This is a significant milestone.");
        }

        setSuggestions(newSuggestions);
    }, [result, calculatedValues]);

    // Chart Data
    const chartData = {
        labels: schedule.map(item => `Year ${parseFloat(item.year.toFixed(2))}`),
        datasets: [
            {
                label: 'Investment Value',
                data: schedule.map(item => item.value),
                borderColor: 'rgb(79, 70, 229)', // Indigo 600
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                label: 'Initial Principal',
                data: schedule.map(() => calculatedValues.initialInvestment),
                borderColor: 'rgb(156, 163, 175)', // Gray 400
                borderDash: [5, 5],
                fill: false,
                tension: 0.4,
                pointRadius: 0
            }
        ]
    };

    const barChartData = {
        labels: schedule.map(item => `Year ${parseFloat(item.year.toFixed(2))}`),
        datasets: [
            {
                label: 'Cumulative Gain',
                data: schedule.map(item => item.gain),
                backgroundColor: 'rgba(16, 185, 129, 0.6)', // Green 500
                borderRadius: 4,
            }
        ]
    };

    const { currency } = useCurrency();

    const formatCurrency = (val: number) => {
        return `${currency.symbol}${val.toLocaleString(currency.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatCurrencyForPDF = (val: number) => {
        return `${currency.code} ${val.toLocaleString(currency.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const resetCalculator = () => {
        const defaults = {
            initialInvestment: 10000,
            finalValue: 15000,
            years: 5,
            months: 0,
            startDate: new Date().toISOString().split('T')[0],
            inflationRate: 0,
            taxRate: 0
        };
        setInitialInvestment(defaults.initialInvestment);
        setFinalValue(defaults.finalValue);
        setYears(defaults.years);
        setMonths(defaults.months);
        setStartDate(defaults.startDate);
        setInflationRate(defaults.inflationRate);
        setTaxRate(defaults.taxRate);

        setCalculatedValues(defaults);
        setHasCalculated(true);
    };

    const handleExportPDF = async () => {
        const doc = new jsPDF();

        // Load custom font for Unicode support (e.g. Rupee symbol)
        await loadUnicodeFont(doc);

        // Header
        doc.setFillColor(79, 70, 229); // Indigo 600
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text('Average Return Report', 105, 25, { align: 'center' });

        // Summary Inputs
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text('Input Parameters', 14, 50);

        const inputData = [
            ['Initial Investment', formatCurrency(calculatedValues.initialInvestment)],
            ['Final Value', formatCurrency(calculatedValues.finalValue)],
            ['Time Period', `${calculatedValues.years} Years, ${calculatedValues.months} Months`],
            ['Inflation Rate', `${calculatedValues.inflationRate}%`],
            ['Tax Rate', `${calculatedValues.taxRate}%`]
        ];

        autoTable(doc, {
            startY: 55,
            head: [['Parameter', 'Value']],
            body: inputData,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229] },
            columnStyles: {
                1: { font: 'NotoSans' } // Only apply to Value column
            }
        });

        // Results
        doc.text('Performance Spec', 14, (doc as any).lastAutoTable.finalY + 15);

        const resultData = [
            ['CAGR (Annualized)', `${result.cagr.toFixed(2)}%`],
            ['Total Return %', `${result.totalReturnPercent.toFixed(2)}%`],
            ['Total Profit/Loss', formatCurrency(result.totalReturn)],
            ['Simple Annual Return', `${result.simpleAnnualReturn.toFixed(2)}%`],
            ['Real Return (Inf. Adj)', `${result.realReturn.toFixed(2)}%`],
            ['After-Tax Value', formatCurrency(result.afterTaxEnd)]
        ];

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 20,
            head: [['Metric', 'Result']],
            body: resultData,
            theme: 'striped',
            headStyles: { fillColor: [16, 185, 129] }, // Green
            columnStyles: {
                1: { font: 'NotoSans' } // Only apply to Result column
            }
        });

        // Schedule
        if (schedule.length > 0) {
            doc.text('Growth Schedule (Annual & Final Monthly)', 14, (doc as any).lastAutoTable.finalY + 15);

            const scheduleRows: any[] = [];
            schedule.forEach(row => {
                // Annual Row
                scheduleRows.push([
                    row.date,
                    formatCurrency(row.value),
                    formatCurrency(row.gain)
                ]);

                // Monthly Rows (if any) - Indented or distinct
                if (row.months && row.months.length > 0) {
                    row.months.forEach(m => {
                        scheduleRows.push([
                            `   ${m.date}`, // Indent
                            formatCurrency(m.value),
                            formatCurrency(m.gain)
                        ]);
                    });
                }
            });

            autoTable(doc, {
                startY: (doc as any).lastAutoTable.finalY + 20,
                head: [['Period', 'Value', 'Gain/Loss']],
                body: scheduleRows,
                theme: 'grid', // Ensure borders
                styles: {
                    fontSize: 9,
                    lineColor: [200, 200, 200], // Gray borders
                    lineWidth: 0.1
                },
                columnStyles: {
                    1: { font: 'NotoSans' }, // Value
                    2: { font: 'NotoSans' }  // Gain/Loss
                },
                headStyles: {
                    fillColor: [79, 70, 229],
                    textColor: 255
                },
                didParseCell: (data) => {
                    if (data.section === 'body' && data.column.index === 2) {
                        const cellText = data.cell.raw as string; // e.g. "$1,200.00" or "-$500.00"
                        // Simple check for negative sign or parenthesis often used in accounting
                        if (cellText.includes('-') || cellText.includes('(')) {
                            data.cell.styles.textColor = [220, 38, 38]; // Red
                        } else {
                            data.cell.styles.textColor = [22, 163, 74]; // Green
                        }
                    }
                }
            });
        }


        const timestamp = Date.now();
        doc.save(`average-return-report-${timestamp}.pdf`);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Inputs Section */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                    <Target className="w-5 h-5 mr-2 text-indigo-600" />
                                    Investment Details
                                </h3>
                                <ResetButton onClick={resetCalculator} />
                            </div>

                            <div className="space-y-6">
                                <CurrencyInput
                                    label="Initial Investment"
                                    value={initialInvestment}
                                    onChange={setInitialInvestment}
                                    min={0}
                                    placeholder="e.g. 10000"
                                />

                                <CurrencyInput
                                    label="Final Value"
                                    value={finalValue}
                                    onChange={setFinalValue}
                                    min={0}
                                    placeholder="e.g. 15000"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <NumberInput
                                        label="years"
                                        value={years}
                                        onChange={setYears}
                                        min={0}
                                        max={100}
                                    />
                                    <NumberInput
                                        label="Months"
                                        value={months}
                                        onChange={setMonths}
                                        min={0}
                                        max={11}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Start Date
                                    </label>
                                    <div className="relative">
                                        <DatePicker
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Advanced Options Toggle */}
                                <details className="group">
                                    <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 list-none flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        <span className="flex items-center">
                                            <Info className="w-4 h-4 mr-2" />
                                            Advanced (Inflation & Tax)
                                        </span>
                                        <span className="transition group-open:rotate-180">
                                            <ChevronDown className="w-4 h-4" />
                                        </span>
                                    </summary>
                                    <div className="mt-4 space-y-4 p-4 border border-gray-100 dark:border-gray-800 rounded-xl animate-in fade-in slide-in-from-top-2">
                                        <NumberInput
                                            label="Inflation Rate"
                                            value={inflationRate}
                                            onChange={setInflationRate}
                                            min={0}
                                            max={100}
                                            suffix="%"
                                            placeholder="0"
                                        />
                                        <NumberInput
                                            label="Tax Rate on Gains"
                                            value={taxRate}
                                            onChange={setTaxRate}
                                            min={0}
                                            max={100}
                                            suffix="%"
                                            placeholder="0"
                                        />
                                    </div>
                                </details>
                            </div>

                            <CalculateButton onClick={handleCalculate} label="Calculate Return" />
                        </div>

                        {/* Results Section */}
                        <div className="lg:col-span-8 space-y-8">
                            {!hasCalculated ? (
                                <div className="h-full flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 min-h-[400px]">
                                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full mb-4">
                                        <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Result Preview</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                                        Enter your starting and ending values to see your Annualized Return (CAGR) and total growth.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Main Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
                                            <div className="relative z-10">
                                                <p className="text-indigo-100 text-sm font-medium mb-1">CAGR / Annualized Return</p>
                                                <div className="text-4xl font-bold tracking-tight mb-2">
                                                    {result.cagr.toFixed(2)}%
                                                </div>
                                                <div className="flex items-center text-sm text-indigo-100 space-x-2">
                                                    <span>Annual Growth Rate</span>
                                                </div>
                                            </div>
                                            <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-1/4 translate-x-1/4">
                                                <TrendingUp className="w-32 h-32" />
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-center">
                                            <div className="flex justify-between items-end mb-4">
                                                <div>
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Profit/Loss</p>
                                                    <p className={`text-2xl font-bold ${result.totalReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                        {result.totalReturn >= 0 ? '+' : ''}{formatCurrency(result.totalReturn)}
                                                    </p>
                                                </div>
                                                <div className={`px-2 py-1 rounded-lg text-xs font-bold ${result.totalReturnPercent >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {result.totalReturnPercent.toFixed(2)}% Total
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${result.totalReturn >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                                    style={{ width: '100%' }} // Just a visual bar, 100% full
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Secondary Metrics */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Simple Avg Return</p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">{result.simpleAnnualReturn.toFixed(2)}%</p>
                                            <p className="text-[10px] text-gray-400">Arith. Mean</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Real Return</p>
                                            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{result.realReturn.toFixed(2)}%</p>
                                            <p className="text-[10px] text-gray-400">Inf. Adjusted</p>
                                        </div>
                                        {calculatedValues.taxRate > 0 && (
                                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Est. Tax</p>
                                                <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(result.taxAmount as number)}</p>
                                            </div>
                                        )}
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Final Value</p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(calculatedValues.finalValue)}</p>
                                        </div>
                                    </div>

                                    {/* Chart */}
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Growth Trajectory</h4>
                                            <div className="h-64 sm:h-80 w-full">
                                                <Line
                                                    data={chartData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                position: 'top',
                                                                labels: { color: '#6B7280' }
                                                            }
                                                        },
                                                        scales: {
                                                            y: {
                                                                beginAtZero: false,
                                                                grid: { color: 'rgba(107, 114, 128, 0.1)' },
                                                                ticks: {
                                                                    color: '#6B7280',
                                                                    callback: (val) => {
                                                                        if (typeof val === 'number') {
                                                                            return formatCurrency(val).split('.')[0];
                                                                        }
                                                                        return '';
                                                                    }
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

                                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Cumulative Gains</h4>
                                            <div className="h-64 sm:h-80 w-full">
                                                <Bar
                                                    data={barChartData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                position: 'top',
                                                                labels: { color: '#6B7280' }
                                                            }
                                                        },
                                                        scales: {
                                                            y: {
                                                                beginAtZero: true,
                                                                grid: { color: 'rgba(107, 114, 128, 0.1)' },
                                                                ticks: {
                                                                    color: '#6B7280',
                                                                    callback: (val) => {
                                                                        if (typeof val === 'number') {
                                                                            return formatCurrency(val).split('.')[0];
                                                                        }
                                                                        return '';
                                                                    }
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

                                    {/* Growth Table */}
                                    <div className="mt-8">
                                        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Annual Growth Schedule</h4>
                                            <button
                                                onClick={handleExportPDF}
                                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-sm text-sm cursor-pointer"
                                            >
                                                <Download size={16} />
                                                Download PDF
                                            </button>
                                        </div>
                                        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 uppercase font-medium">
                                                    <tr>
                                                        <th className="px-6 py-4">Year</th>
                                                        <th className="px-6 py-4 text-right">Investment Value</th>
                                                        <th className="px-6 py-4 text-right">Total Gain/Loss</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                                                    {schedule.map((row, index) => (
                                                        <Fragment key={index}>
                                                            <tr
                                                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                                                                onClick={() => row.months && row.months.length > 0 && toggleYear(row.year)}
                                                            >
                                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                                    {row.months && row.months.length > 0 && (
                                                                        <span className="text-gray-400 transition-transform duration-200" style={{ transform: expandedYears.has(row.year) ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                                                                            <ChevronRight className="w-4 h-4" />
                                                                        </span>
                                                                    )}
                                                                    {row.date}
                                                                </td>
                                                                <td className="px-6 py-4 text-right font-bold text-indigo-600 dark:text-indigo-400">
                                                                    {formatCurrency(row.value)}
                                                                </td>
                                                                <td className={`px-6 py-4 text-right font-medium ${row.gain >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                                    {row.gain >= 0 ? '+' : ''}{formatCurrency(row.gain)}
                                                                </td>
                                                            </tr>
                                                            {/* Expanded Months */}
                                                            {expandedYears.has(row.year) && row.months && row.months.map((month, mIndex) => (
                                                                <tr key={`${index}-m-${mIndex}`} className="bg-gray-50/50 dark:bg-gray-900/30 text-sm animate-in fade-in slide-in-from-top-1">
                                                                    <td className="px-6 py-3 pl-12 text-gray-500 dark:text-gray-400">
                                                                        {month.date}
                                                                    </td>
                                                                    <td className="px-6 py-3 text-right text-gray-600 dark:text-gray-400">
                                                                        {formatCurrency(month.value)}
                                                                    </td>
                                                                    <td className={`px-6 py-3 text-right font-medium ${month.gain >= 0 ? 'text-green-600/80 dark:text-green-400/80' : 'text-red-600/80 dark:text-red-400/80'}`}>
                                                                        {month.gain >= 0 ? '+' : ''}{formatCurrency(month.gain)}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </Fragment>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Full Width Bottom Sections */}
                    {hasCalculated && (
                        <>
                            {/* AI Suggestions */}
                            {suggestions.length > 0 && (
                                <div className="mt-12">
                                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-purple-100 dark:border-purple-800">
                                        <div className="flex items-center mb-6">
                                            <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg mr-3">
                                                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Analysis & Insights</h3>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {suggestions.map((suggestion, index) => (
                                                <div key={index} className="bg-white/80 dark:bg-gray-900/80 p-5 rounded-xl border border-white dark:border-gray-700 shadow-sm transition-transform hover:scale-[1.02]">
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                                        {suggestion}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Saved Button Only - PDF moved up */}
                            <div className="mt-12 flex flex-col items-center border-t border-gray-100 dark:border-gray-800 pt-8">
                                <button
                                    onClick={() => setLiked(!liked)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium border cursor-pointer ${liked
                                        ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-900/50'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                                    {liked ? 'Saved' : 'Save Result'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
