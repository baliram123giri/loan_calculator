'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SavingsRow {
    year: number;
    month: number;
    totalContributed: number;
    interestEarned: number;
    totalInterest: number;
    balance: number;
}

interface SavingsTableProps {
    schedule: SavingsRow[];
    currencySymbol?: string;
}

export default function SavingsTable({ schedule, currencySymbol = "$" }: SavingsTableProps) {
    // State for expanded years. Key = year number
    const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set([1])); // Year 1 open by default

    const toggleYear = (year: number) => {
        const newExpanded = new Set(expandedYears);
        if (newExpanded.has(year)) {
            newExpanded.delete(year);
        } else {
            newExpanded.add(year);
        }
        setExpandedYears(newExpanded);
    };

    // Group data by year
    const groupedData = useMemo(() => {
        const groups: { [key: number]: SavingsRow[] } = {};
        schedule.forEach(row => {
            if (!groups[row.year]) groups[row.year] = [];
            groups[row.year].push(row);
        });
        return groups;
    }, [schedule]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(val).replace('$', currencySymbol);
    };

    const getMonthName = (monthNum: number) => {
        // monthNum is 1-based cumulative index in the loop, but usually 1-12 relative to year
        // We need 1-12. In the generation logic: 'm' goes from 1 to years*12.
        // So modulo logic needed.
        const date = new Date(0, (monthNum - 1) % 12);
        return date.toLocaleString('default', { month: 'short' });
    };

    const downloadCSV = () => {
        const headers = ["Year", "Month", "Total Contributed", "Interest Earned", "Total Interest", "Balance"];
        const csvRows = [headers.join(",")];

        schedule.forEach(row => {
            const values = [
                row.year,
                getMonthName(row.month),
                row.totalContributed.toFixed(2),
                row.interestEarned.toFixed(2),
                row.totalInterest.toFixed(2),
                row.balance.toFixed(2)
            ];
            csvRows.push(values.join(","));
        });

        const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "savings_schedule.csv";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Savings Growth Schedule", 14, 20);

        const tableColumn = ["Year", "Month", "Total Contributed", "Interest Earned", "Total Interest", "Balance"];
        const tableRows = schedule.map(row => [
            row.year,
            getMonthName(row.month),
            formatCurrency(row.totalContributed),
            formatCurrency(row.interestEarned),
            formatCurrency(row.totalInterest),
            formatCurrency(row.balance),
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [16, 185, 129] }, // Emerald color
            styles: { fontSize: 8, cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 20 }, // Year
                1: { cellWidth: 20 }, // Month
                // Align numbers to right? AutoTable detects numbers usually but formatted strings are strings.
                2: { halign: 'right' },
                3: { halign: 'right' },
                4: { halign: 'right' },
                5: { halign: 'right' },
            }
        });

        doc.save("savings_schedule.pdf");
    };

    const years = Object.keys(groupedData).map(Number).sort((a, b) => a - b);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Amortization Schedule</h3>
                <div className="flex gap-3">
                    <button
                        onClick={downloadCSV}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer shadow-sm transition-all"
                    >
                        <FileText className="w-4 h-4" />
                        Export CSV
                    </button>
                    <button
                        onClick={downloadPDF}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 cursor-pointer shadow-sm transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950">
                <div className="grid grid-cols-12 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider py-4 px-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="col-span-2">Year</div>
                    <div className="col-span-2 text-right">Total Contributed</div>
                    <div className="col-span-2 text-right">Interest (Yr)</div>
                    <div className="col-span-3 text-right">Total Interest</div>
                    <div className="col-span-3 text-right">End Balance</div>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {years.map(year => {
                        const yearRows = groupedData[year];
                        const lastRow = yearRows[yearRows.length - 1];
                        const firstRow = yearRows[0];
                        // Calculate Interest Earned THIS Year
                        const interestEarnedThisYear = yearRows.reduce((sum, row) => sum + row.interestEarned, 0);
                        const contributedThisYear = yearRows.reduce((sum, row) => sum + (row.totalContributed - (schedule[schedule.indexOf(row) - 1]?.totalContributed || 0)), 0);
                        // Actually easier: totalContributed is cumulative. So Year Contrib = LastRow.total - (PrevYearLastRow.total).
                        // But let's simplify display to just "Cumulative Total Contributed" as per header, or "Contributed"?
                        // Table header says "Total Invested". Let's show Cumulative.

                        const isExpanded = expandedYears.has(year);

                        return (
                            <div key={year} className="group transition-colors">
                                {/* Parent Row */}
                                <div
                                    onClick={() => toggleYear(year)}
                                    className="grid grid-cols-12 py-4 px-6 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer items-center transition-colors"
                                >
                                    <div className="col-span-2 flex items-center font-bold text-gray-900 dark:text-white">
                                        <button className="mr-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500">
                                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                        </button>
                                        Year {year}
                                    </div>
                                    <div className="col-span-2 text-right text-gray-600 dark:text-gray-400 font-medium text-sm">
                                        {formatCurrency(lastRow.totalContributed)}
                                    </div>
                                    <div className="col-span-2 text-right text-green-600 dark:text-green-400 font-medium text-sm">
                                        +{formatCurrency(interestEarnedThisYear)}
                                    </div>
                                    <div className="col-span-3 text-right text-green-700 dark:text-green-300 font-medium text-sm">
                                        {formatCurrency(lastRow.totalInterest)}
                                    </div>
                                    <div className="col-span-3 text-right font-bold text-gray-900 dark:text-white text-sm">
                                        {formatCurrency(lastRow.balance)}
                                    </div>
                                </div>

                                {/* Child Rows (Months) */}
                                {isExpanded && (
                                    <div className="bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 fade-in duration-200">
                                        {yearRows.map((row) => (
                                            <div key={row.month} className="grid grid-cols-12 py-3 px-6 text-sm border-b border-gray-100/50 dark:border-gray-800/50 last:border-0 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
                                                <div className="col-span-2 pl-10 text-gray-500 dark:text-gray-400">
                                                    {getMonthName(row.month)}
                                                </div>
                                                <div className="col-span-2 text-right text-gray-500 dark:text-gray-500">
                                                    {formatCurrency(row.totalContributed)}
                                                </div>
                                                <div className="col-span-2 text-right text-green-600/80 dark:text-green-400/80">
                                                    {formatCurrency(row.interestEarned)}
                                                </div>
                                                <div className="col-span-3 text-right text-green-600/80 dark:text-green-400/80">
                                                    {formatCurrency(row.totalInterest)}
                                                </div>
                                                <div className="col-span-3 text-right font-medium text-gray-700 dark:text-gray-300">
                                                    {formatCurrency(row.balance)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                    * Showing collapsible yearly summaries. Click on a year to see monthly details.
                </p>
            </div>
        </div>
    );
}

