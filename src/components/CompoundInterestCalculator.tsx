'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { InputNumber } from './Shared/InputNumber';
import { Slider } from './Shared/Slider';
import { calculateCompoundInterest, calculateAPY, InterestCalculation } from '@/lib/calc/interest';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { CalculateButton } from './Shared/CalculateButton';
import { ResetButton } from './Shared/ResetButton';

export default function CompoundInterestCalculator() {
    const searchParams = useSearchParams();
    const [principal, setPrincipal] = useState(10000);
    const [rate, setRate] = useState(5);
    const [time, setTime] = useState(5);
    const [frequency, setFrequency] = useState<'yearly' | 'half-yearly' | 'quarterly' | 'monthly' | 'daily'>('yearly');
    const [result, setResult] = useState<InterestCalculation | null>(null);
    const [apy, setApy] = useState<number>(0);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    const calculate = (
        p: number = principal,
        r: number = rate,
        t: number = time,
        f: 'yearly' | 'half-yearly' | 'quarterly' | 'monthly' | 'daily' = frequency
    ) => {
        const res = calculateCompoundInterest(p, r, t, f);
        setResult(res);
        setApy(calculateAPY(r, f));
        setCurrentPage(1);
    };

    const resetToDefaults = () => {
        const defaultPrincipal = 10000;
        const defaultRate = 5;
        const defaultTime = 5;
        const defaultFrequency = 'yearly';

        setPrincipal(defaultPrincipal);
        setRate(defaultRate);
        setTime(defaultTime);
        setFrequency(defaultFrequency);

        // Calculate immediately with defaults
        const res = calculateCompoundInterest(defaultPrincipal, defaultRate, defaultTime, defaultFrequency);
        setResult(res);
        setApy(calculateAPY(defaultRate, defaultFrequency));
        setCurrentPage(1);
    };

    useEffect(() => {
        const p = searchParams.get('p');
        const r = searchParams.get('r');
        const t = searchParams.get('t');
        const f = searchParams.get('f');

        if (p || r || t || f) {
            const newP = p ? Number(p) : 10000;
            const newR = r ? Number(r) : 5;
            const newT = t ? Number(t) : 5;
            const newF = (f && ['yearly', 'half-yearly', 'quarterly', 'monthly', 'daily'].includes(f))
                ? (f as 'yearly' | 'half-yearly' | 'quarterly' | 'monthly' | 'daily')
                : 'yearly';

            setPrincipal(newP);
            setRate(newR);
            setTime(newT);
            setFrequency(newF);

            // Trigger calculation
            calculate(newP, newR, newT, newF);
        } else {
            // Initial calculation
            calculate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

    const handleExportPDF = () => {
        if (!result) return;
        const doc = new jsPDF();

        // Header
        doc.setFillColor(79, 70, 229); // Indigo 600
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text('Compound Interest Calculator', 105, 25, { align: 'center' });

        // Loan Details Box
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(14, 50, 182, 40, 3, 3, 'S');

        // Loan Details Content
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Investment Summary', 20, 62);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        // Left Column
        doc.text('Principal Amount:', 20, 72);
        doc.text(formatCurrency(principal), 60, 72);

        doc.text('Annual Rate:', 20, 80);
        doc.text(`${rate}% (${frequency})`, 60, 80);

        doc.text('Time Period:', 20, 88);
        doc.text(`${time} years`, 60, 88);

        // Right Column
        doc.text('Total Interest:', 110, 72);
        if (result.interest < 0) {
            doc.setTextColor(220, 38, 38); // Red
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

        doc.setFont('helvetica', 'normal');
        doc.text('APY:', 110, 88);
        doc.text(`${apy}%`, 150, 88);

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
            startY: 100,
            headStyles: {
                fillColor: [79, 70, 229],
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
                        data.cell.styles.textColor = [220, 38, 38]; // Red
                    } else {
                        data.cell.styles.textColor = [22, 163, 74]; // Green
                    }
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        });

        const dateStr = new Date().toISOString().split('T')[0];
        doc.save(`compound-interest-calculator-${dateStr}.pdf`);
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Input Details</h2>
                        <ResetButton onClick={resetToDefaults} />
                    </div>

                    <div className="space-y-4">
                        <InputNumber
                            label="Principal Amount"
                            symbol="$"
                            value={principal}
                            onChange={(e) => setPrincipal(Number(e.target.value))}
                            min={100}
                            max={10000000}
                        />
                        <Slider
                            value={principal}
                            min={100}
                            max={100000}
                            step={100}
                            onChange={(e) => setPrincipal(Number(e.target.value))}
                        />
                    </div>

                    <div className="space-y-4">
                        <InputNumber
                            label="Annual Rate (%)"
                            symbol="%"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            min={0.1}
                            max={100}
                            step={0.1}
                        />
                        <Slider
                            value={rate}
                            min={0.1}
                            max={20}
                            step={0.1}
                            onChange={(e) => setRate(Number(e.target.value))}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Compounding Frequency
                        </label>
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value as any)}
                            className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-950 dark:border-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="yearly">Yearly</option>
                            <option value="half-yearly">Half-Yearly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="monthly">Monthly</option>
                            <option value="daily">Daily</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <InputNumber
                            label="Time Period (Years)"
                            value={time}
                            onChange={(e) => setTime(Number(e.target.value))}
                            min={1}
                            max={50}
                        />
                        <Slider
                            value={time}
                            min={1}
                            max={30}
                            step={1}
                            onChange={(e) => setTime(Number(e.target.value))}
                        />
                    </div>

                    <CalculateButton onClick={() => calculate()} />
                </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
                {result && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-xl col-span-1 md:col-span-2 transform transition hover:scale-105">
                                <div className="relative z-10">
                                    <p className="text-blue-100 text-sm font-medium mb-1">Total Interest</p>
                                    <h3 className={`text-3xl font-bold ${result.interest < 0 ? 'text-red-200' : 'text-white'}`}>
                                        {formatCurrency(result.interest)}
                                    </h3>
                                    <div className="mt-2 text-sm bg-white/20 inline-block px-2 py-1 rounded backdrop-blur-sm">
                                        APY: {apy}%
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                            </div>

                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-gray-500 text-sm font-medium mb-1">Total Amount</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                                    {formatCurrency(result.totalAmount)}
                                </h3>
                            </div>

                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-gray-500 text-sm font-medium mb-1">Principal</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(result.principal)}
                                </h3>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Yearly Breakdown</h3>
                                <button
                                    onClick={handleExportPDF}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md font-medium text-sm cursor-pointer"
                                >
                                    <Download size={16} />
                                    Export PDF
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 font-medium border-b border-gray-100 dark:border-gray-800">
                                        <tr>
                                            <th className="px-6 py-4 whitespace-nowrap">Year</th>
                                            <th className="px-6 py-4 whitespace-nowrap">Opening Balance</th>
                                            <th className="px-6 py-4 whitespace-nowrap">Interest Earned</th>
                                            <th className="px-6 py-4 whitespace-nowrap">Closing Balance</th>
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
    );
}
