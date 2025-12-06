'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SavingsRow {
    year: number;
    month: number;
    date: Date;
    totalContributed: number;
    interestEarned: number;
    totalInterest: number;
    balance: number;
}

interface SavingsTableProps {
    schedule: SavingsRow[];
    currencySymbol?: string;
    inputs?: {
        initialDeposit: number;
        monthlyContribution: number;
        interestRate: number;
        years: number;
        compoundingFrequency: string;
        inflationRate: number;
        taxRate: number;
        startDate: string;
    };
}

export default function SavingsTable({ schedule, currencySymbol = "$", inputs }: SavingsTableProps) {
    // State for expanded years.
    // Default expand the first year available in schedule
    const firstYear = schedule.length > 0 ? schedule[0].year : new Date().getFullYear();
    const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set([firstYear]));

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

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const downloadCSV = () => {
        const headers = ["Date", "Year", "Month No.", "Total Contributed", "Interest Earned", "Total Interest", "Balance"];
        const csvRows = [headers.join(",")];

        schedule.forEach(row => {
            const values = [
                formatDate(row.date),
                row.year,
                row.month,
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

        // 1. Helper: Format Date "MM/DD/YYYY" (2-digit)
        // Defined at top scope for consistent usage
        const formatPdfDate = (d: Date | string) => {
            return new Date(d).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        };

        // --- Header Section ---
        doc.setFontSize(18);
        doc.setTextColor(16, 185, 129); // Green color
        doc.text("Savings Calculator Report", 14, 20);

        let startY = 35;

        // --- Inputs Summary Box (Top) ---
        if (inputs) {
            doc.setDrawColor(200);
            doc.setFillColor(248, 250, 252); // Light gray bg
            doc.roundedRect(14, 30, 182, 35, 3, 3, 'FD'); // Box ends at Y=65

            doc.setFontSize(11);
            doc.setTextColor(50);
            doc.setFont("helvetica", "bold");
            doc.text("Simulation Details", 18, 38);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);

            // Column 1
            doc.text(`Initial Deposit: ${formatCurrency(inputs.initialDeposit)}`, 18, 46);
            doc.text(`Monthly Contribution: ${formatCurrency(inputs.monthlyContribution)}`, 18, 52);
            doc.text(`Interest Rate: ${inputs.interestRate}%`, 18, 58);

            // Column 2
            doc.text(`Period: ${inputs.years} Years`, 80, 46);
            doc.text(`Frequency: ${inputs.compoundingFrequency}`, 80, 52);
            // FIX: Use formatPdfDate for header date
            doc.text(`Start Date: ${formatPdfDate(inputs.startDate)}`, 80, 58);

            // Column 3
            doc.text(`Inflation Rate: ${inputs.inflationRate}%`, 140, 46);
            doc.text(`Tax Rate: ${inputs.taxRate}%`, 140, 52);
        }

        // --- Visual Breakdown Section (Below Summary Box) ---
        // New Y position below the box (Box ends at 65)
        let chartY = 75;

        const lastRow = schedule[schedule.length - 1];
        if (lastRow) {
            const total = lastRow.balance;

            // Legend
            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(30);
            doc.text("Projected Breakdown", 14, chartY);

            // Legend Circles
            // Principal
            doc.setFillColor(37, 99, 235); // Blue
            doc.circle(60, chartY - 1, 1.5, 'F');
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text("Principal", 64, chartY);

            // Interest
            doc.setFillColor(22, 163, 74); // Green
            doc.circle(90, chartY - 1, 1.5, 'F');
            doc.text("Interest", 94, chartY);

            // Full Width Stacked Bar
            // Y = 80
            const barX = 14;
            const barY = chartY + 5;
            const barW = 182; // Full width matching box
            const barH = 8;

            const pWidth = (lastRow.totalContributed / total) * barW;

            // Draw Principal Part (Blue)
            doc.setFillColor(37, 99, 235);
            doc.rect(barX, barY, pWidth, barH, 'F');

            // Draw Interest Part (Green)
            doc.setFillColor(22, 163, 74);
            doc.rect(barX + pWidth, barY, barW - pWidth, barH, 'F');

            // Percentage Labels (Centered in segments)
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(7);
            doc.setFont("helvetica", "bold");

            const pPct = Math.round(lastRow.totalContributed / total * 100);
            const iPct = Math.round(lastRow.totalInterest / total * 100);

            if (pPct > 5) {
                doc.text(`${pPct}%`, barX + pWidth / 2 - 2, barY + 5);
            }
            if (iPct > 5) {
                doc.text(`${iPct}%`, barX + pWidth + (barW - pWidth) / 2 - 2, barY + 5);
            }

            // Move table start down
            startY = 100;
        }

        // --- Table ---
        const tableColumn = ["Month/Year", "Total Contributed", "Interest Earned", "Total Interest", "Balance"];

        let pdfRows = schedule.map(row => [
            formatDate(row.date), // Use "Dec 2025" format for table columns
            formatCurrency(row.totalContributed),
            formatCurrency(row.interestEarned),
            formatCurrency(row.totalInterest),
            formatCurrency(row.balance),
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: pdfRows,
            startY: startY,
            theme: 'grid',
            headStyles: {
                fillColor: [16, 185, 129],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'right'
            },
            styles: {
                fontSize: 8,
                cellPadding: 3,
                valign: 'middle'
            },
            columnStyles: {
                0: { halign: 'left', cellWidth: 30 },
                1: { halign: 'right', fontStyle: 'bold' }, // Total Contributed
                2: { halign: 'right' },
                3: { halign: 'right' },
                4: { halign: 'right', fontStyle: 'bold' }, // Balance
            },
            didParseCell: function (data) {
                // Header alignment override
                if (data.section === 'head' && data.column.index === 0) {
                    data.cell.styles.halign = 'left';
                }

                // Body Color Logic
                if (data.section === 'body') {
                    if (data.column.index === 1) {
                        // Total Contributed -> Blue
                        data.cell.styles.textColor = [37, 99, 235];
                    }
                    if (data.column.index === 2 || data.column.index === 3) {
                        // Interest Columns -> Green
                        data.cell.styles.textColor = [22, 163, 74];
                    }
                }
            }
        });

        doc.save("savings_simulation_report.pdf");
    };

    const years = Object.keys(groupedData).map(Number).sort((a, b) => a - b);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Savings Schedule</h3>
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
                <div className="grid grid-cols-12 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wider py-4 px-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="col-span-2">Year / Date</div>
                    <div className="col-span-2 text-right">Total Invested</div>
                    <div className="col-span-2 text-right">Interest (Yr/Mo)</div>
                    <div className="col-span-3 text-right">Total Interest</div>
                    <div className="col-span-3 text-right">End Balance</div>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {years.map(year => {
                        const yearRows = groupedData[year];
                        const lastRow = yearRows[yearRows.length - 1];

                        // Calculate Interest Earned THIS Year
                        const interestEarnedThisYear = yearRows.reduce((sum, row) => sum + row.interestEarned, 0);

                        const isExpanded = expandedYears.has(year);

                        return (
                            <div key={year} className="group transition-colors">
                                {/* Parent Row */}
                                <div
                                    onClick={() => toggleYear(year)}
                                    className="grid grid-cols-12 py-4 px-6 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer items-center transition-colors font-semibold"
                                >
                                    <div className="col-span-2 flex items-center font-bold text-gray-900 dark:text-white">
                                        <button className="mr-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500">
                                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                        </button>
                                        {year}
                                    </div>
                                    <div className="col-span-2 text-right text-gray-600 dark:text-gray-400 text-sm">
                                        {formatCurrency(lastRow.totalContributed)}
                                    </div>
                                    <div className="col-span-2 text-right text-green-600 dark:text-green-400 text-sm">
                                        +{formatCurrency(interestEarnedThisYear)}
                                    </div>
                                    <div className="col-span-3 text-right text-green-700 dark:text-green-300 text-sm">
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
                                                <div className="col-span-2 pl-10 text-gray-500 dark:text-gray-400 font-medium">
                                                    {formatDate(row.date)}
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
                    * Showing collapsible yearly projections for {years.length} years. Click on a year to expand monthly details.
                </p>
            </div>
        </div>
    );
}
