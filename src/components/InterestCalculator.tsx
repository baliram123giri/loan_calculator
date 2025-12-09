'use client';

import React, { useState, useEffect } from 'react';
import { calculateSimpleInterest, calculateCompoundInterest, InterestCalculation } from '@/lib/calc/interest';
import { TrendingUp, PieChart, Calculator, DollarSign, Percent, Clock, RotateCcw, Download, ChevronLeft, ChevronRight, Lightbulb, ArrowRight } from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import CurrencyInput from '@/components/CurrencyInput';
import NumberInput from '@/components/NumberInput';
import { CalculateButton } from './Shared/CalculateButton';
import { ResetButton } from './Shared/ResetButton';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    const calculate = () => {
        try {
            let calc: InterestCalculation;
            if (calculationType === 'simple') {
                calc = calculateSimpleInterest(principal, rate, time);
            } else {
                calc = calculateCompoundInterest(principal, rate, time, compoundingFrequency, monthlyContribution);
            }
            setResult(calc);
            generateSuggestions(calc);
            setCurrentPage(1);
        } catch (e) {
            console.error('Interest calculation error:', e);
        }
    };

    const resetToDefaults = () => {
        const defaultType = 'compound';
        const defaultPrincipal = 10000;
        const defaultRate = 7;
        const defaultTime = 10;
        const defaultFreq = 'yearly';
        const defaultContribution = 0;

        setCalculationType(defaultType);
        setPrincipal(defaultPrincipal);
        setRate(defaultRate);
        setTime(defaultTime);
        setCompoundingFrequency(defaultFreq);
        setMonthlyContribution(defaultContribution);
        setCurrentPage(1);

        // Calculate immediately with defaults
        const calc = calculateCompoundInterest(defaultPrincipal, defaultRate, defaultTime, defaultFreq, defaultContribution);
        setResult(calc);
        generateSuggestions(calc);
    };

    // Initial calculation on mount
    useEffect(() => {
        calculate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const generateSuggestions = (calc: InterestCalculation) => {
        const newSuggestions: string[] = [];
        const format = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

        if (calculationType === 'simple') {
            newSuggestions.push("💡 **Tip:** Switching to Compound Interest could significantly increase your returns over time.");
        } else {
            if (compoundingFrequency === 'yearly') {
                const monthlyCalc = calculateCompoundInterest(principal, rate, time, 'monthly', monthlyContribution);
                const diff = monthlyCalc.totalAmount - calc.totalAmount;
                if (diff > 100) {
                    newSuggestions.push(`🚀 **Boost your returns:** If interest were compounded **monthly** instead of yearly, you would earn an extra **${format(diff)}**.`);
                }
            }

            if (monthlyContribution === 0) {
                const withContribution = calculateCompoundInterest(principal, rate, time, compoundingFrequency, 500);
                const extra = withContribution.totalAmount - calc.totalAmount - (500 * 12 * time);
                newSuggestions.push(`💰 **Power of SIP:** Contributing just **$500/month** could earn you an additional **${format(extra)}** in interest alone!`);
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
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const handleExportPDF = () => {
        if (!result) return;
        const doc = new jsPDF();

        // Header
        doc.setFillColor(220, 38, 38); // Red 600
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text('Interest Calculator Report', 105, 25, { align: 'center' });

        // Summary Box
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(14, 50, 182, 45, 3, 3, 'S');

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Investment Summary', 20, 62);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        // Left Column
        doc.text('Calculation Type:', 20, 72);
        doc.setFont('helvetica', 'bold');
        doc.text(calculationType === 'simple' ? 'Simple Interest' : 'Compound Interest', 60, 72);
        doc.setFont('helvetica', 'normal');

        doc.text('Principal Amount:', 20, 80);
        doc.text(formatCurrency(principal), 60, 80);

        doc.text('Time Period:', 20, 88);
        doc.text(`${time} years`, 60, 88);

        // Right Column
        doc.text('Total Interest:', 110, 72);
        if (result.interest < 0) {
            doc.setFillColor(254, 226, 226); // Red 100 for background
            doc.rect(148, 68, 40, 6, 'F'); // Background rectangle for value
            doc.setTextColor(220, 38, 38); // Red text
        } else {
            doc.setTextColor(22, 163, 74); // Green
        }
        doc.setFont('helvetica', 'bold');
        doc.text(formatCurrency(result.interest), 150, 72);

        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text('Total Amount:', 110, 80);
        doc.setFont('helvetica', 'bold');
        doc.text(formatCurrency(result.totalAmount), 150, 80);

        if (calculationType === 'compound') {
            doc.setFont('helvetica', 'normal');
            doc.text('Frequency:', 110, 88);
            doc.text(compoundingFrequency, 150, 88);
        }

        const tableColumn = ["Year", "Opening Balance", "Interest", "Closing Balance"];
        const tableRows = result.breakdown.map(row => [
            row.year,
            formatCurrency(row.openingBalance),
            formatCurrency(row.interest),
            formatCurrency(row.closingBalance)
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 105,
            headStyles: {
                fillColor: [220, 38, 38], // Red 600
                halign: 'center'
            },
            styles: {
                fontSize: 9,
                halign: 'center',
                cellPadding: 3
            },
            alternateRowStyles: { fillColor: [245, 247, 255] },
            didParseCell: (data) => {
                if (data.section === 'body' && data.column.index === 2) {
                    const rawInterest = result.breakdown[data.row.index].interest;
                    if (rawInterest < 0) {
                        data.cell.styles.fillColor = [254, 226, 226]; // Red 100 background
                        data.cell.styles.textColor = [220, 38, 38];
                    } else {
                        data.cell.styles.textColor = [22, 163, 74];
                    }
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        });

        const timestamp = Date.now();
        doc.save(`interest-calculator-report-${timestamp}.pdf`);
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
                data: result?.breakdown.map(b => b.openingBalance + (monthlyContribution * 12)) || [],
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

    // Pagination Logic
    const showPagination = result && result.breakdown.length > ITEMS_PER_PAGE;
    const totalPages = result ? Math.ceil(result.breakdown.length / ITEMS_PER_PAGE) : 0;
    const paginatedData = result
        ? (showPagination
            ? result.breakdown.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
            : result.breakdown)
        : [];

    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Main Calculator Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12">

                    {/* Left Panel: Inputs */}
                    <div className="lg:col-span-4 p-8 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-100 dark:border-gray-800 space-y-6">

                        {/* Header with Reset Button */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                                Calculator Inputs
                            </h3>
                            <ResetButton onClick={resetToDefaults} />
                        </div>

                        {/* Type Toggle */}
                        <div className="bg-white dark:bg-gray-900 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex">
                            <button
                                onClick={() => setCalculationType('simple')}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${calculationType === 'simple'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                Simple Interest
                            </button>
                            <button
                                onClick={() => setCalculationType('compound')}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${calculationType === 'compound'
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
                                <CurrencyInput value={principal} onChange={setPrincipal} />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Percent className="w-4 h-4 mr-2 text-green-500" />
                                    Annual Interest Rate (%)
                                </label>
                                <NumberInput value={rate} onChange={setRate} suffix="%" />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Clock className="w-4 h-4 mr-2 text-purple-500" />
                                    Time Period (Years)
                                </label>
                                <NumberInput value={time} onChange={setTime} />
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
                                            className="w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm cursor-pointer"
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
                                        <CurrencyInput value={monthlyContribution} onChange={setMonthlyContribution} />
                                    </div>
                                </div>
                            )}

                            <CalculateButton
                                onClick={calculate}
                                label={calculationType === 'simple' ? 'Calculate Simple Interest' : 'Calculate Compound Interest'}
                            />
                        </div>
                    </div>

                    {/* Right Panel: Results & Visuals */}
                    <div className="lg:col-span-8 p-8 space-y-8">
                        {result && (
                            <>
                                <div className="flex justify-end">
                                    <ShareButton
                                        data={{
                                            type: calculationType,
                                            principal,
                                            rate,
                                            time,
                                            frequency: compoundingFrequency,
                                            contribution: monthlyContribution
                                        }}
                                    />
                                </div>

                                {/* Result Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-xl transform transition hover:scale-105">
                                        <div className="relative z-10">
                                            <p className="text-blue-100 text-sm font-medium mb-1">Total Interest</p>
                                            <h3 className={`text-3xl font-bold ${result.interest < 0 ? 'text-red-200' : 'text-white'}`}>
                                                {formatCurrency(result.interest)}
                                            </h3>
                                        </div>
                                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                        <p className="text-gray-500 text-sm font-medium mb-1">Total Amount</p>
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {formatCurrency(result.totalAmount)}
                                        </h3>
                                    </div>

                                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                        <p className="text-gray-500 text-sm font-medium mb-1">Principal Invested</p>
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {formatCurrency(result.principal + (monthlyContribution * 12 * time))}
                                        </h3>
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

                                {/* Table */}
                                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Yearly Breakdown</h3>
                                        <button
                                            onClick={handleExportPDF}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm cursor-pointer shadow-sm"
                                        >
                                            <Download size={16} />
                                            Export PDF
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 font-medium">
                                                <tr>
                                                    <th className="px-6 py-4">Year</th>
                                                    <th className="px-6 py-4">Opening Balance</th>
                                                    <th className="px-6 py-4">Interest Earned</th>
                                                    <th className="px-6 py-4">Closing Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                {paginatedData.map((row) => (
                                                    <tr key={row.year} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{row.year}</td>
                                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatCurrency(row.openingBalance)}</td>
                                                        <td className={`px-6 py-4 font-bold ${row.interest >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                            {row.interest >= 0 ? '+' : ''}{formatCurrency(row.interest)}
                                                        </td>
                                                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{formatCurrency(row.closingBalance)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Pagination Controls */}
                                    {showPagination && (
                                        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex justify-between items-center">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                            >
                                                <ChevronLeft size={16} />
                                                Previous
                                            </button>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                            >
                                                Next
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
