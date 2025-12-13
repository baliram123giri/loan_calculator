import React, { useState, useEffect } from 'react';
import { AmortizationRow } from '@/lib/calc/emi';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { loadUnicodeFont } from '@/utils/pdfUtils';

interface AmortizationTableProps {
    schedule: AmortizationRow[];
    currencySymbol?: string;
    calculatorName?: string;
    loanDetails?: {
        loanAmount: number;
        interestRate: number;
        loanTerm: number;
        monthlyPayment: number;
        totalInterest: number;
        totalCost: number;
        // VA-specific fields
        fundingFee?: number;
        fundingFeeRate?: number;
        // FHA-specific fields
        upfrontMIP?: number;
        annualMIPRate?: number;
        totalMIPPaid?: number;
    };
    pdfHeaderColor?: string; // Tailwind gradient classes like "from-green-600 to-emerald-600"
}

export default function AmortizationTable({ schedule, currencySymbol = "$", calculatorName, loanDetails, pdfHeaderColor }: AmortizationTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [yearView, setYearView] = useState<'CY' | 'FY' | 'none'>('none');
    const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
    const rowsPerPage = 12;

    const totalPages = Math.ceil(schedule.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentRows = schedule.slice(startIndex, startIndex + rowsPerPage);

    // Toggle year expansion
    const toggleYear = (year: string) => {
        const newExpanded = new Set(expandedYears);
        if (newExpanded.has(year)) {
            newExpanded.delete(year);
        } else {
            newExpanded.add(year);
        }
        setExpandedYears(newExpanded);
    };

    // Group rows by year
    const groupByYear = (rows: AmortizationRow[], type: 'CY' | 'FY') => {
        const groups: { [key: string]: AmortizationRow[] } = {};

        rows.forEach(row => {
            const date = new Date(row.date);
            let yearKey: string;

            if (type === 'CY') {
                // Calendar Year: Jan-Dec
                yearKey = date.getFullYear().toString();
            } else {
                // Financial Year: Apr-Mar
                const month = date.getMonth(); // 0-11
                const year = date.getFullYear();
                if (month >= 3) { // Apr onwards
                    yearKey = `FY ${year}-${(year + 1).toString().slice(-2)}`;
                } else { // Jan-Mar
                    yearKey = `FY ${year - 1}-${year.toString().slice(-2)}`;
                }
            }

            if (!groups[yearKey]) {
                groups[yearKey] = [];
            }
            groups[yearKey].push(row);
        });

        return groups;
    };

    // Reset expanded years when view changes
    useEffect(() => {
        if (yearView !== 'none') {
            // Collapse all years by default when switching to year view
            setExpandedYears(new Set());
        }
    }, [yearView]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value).replace('$', currencySymbol);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            year: 'numeric'
        }).format(new Date(date));
    };

    // Calculate overall totals
    const overallTotals = schedule.reduce((acc, row) => ({
        principal: acc.principal + row.principal,
        interest: acc.interest + row.interest,
        payment: acc.payment + row.payment
    }), { principal: 0, interest: 0, payment: 0 });

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleExportPDF = async () => {
        const doc = new jsPDF();
        await loadUnicodeFont(doc);

        // Parse gradient color or use default blue
        let headerColor: [number, number, number] = [37, 99, 235]; // Default blue-600
        if (pdfHeaderColor) {
            // Extract color from Tailwind gradient class
            if (pdfHeaderColor.includes('green')) {
                headerColor = [22, 163, 74]; // green-600
            } else if (pdfHeaderColor.includes('purple')) {
                headerColor = [147, 51, 234]; // purple-600
            } else if (pdfHeaderColor.includes('orange')) {
                headerColor = [234, 88, 12]; // orange-600
            } else if (pdfHeaderColor.includes('emerald')) {
                headerColor = [16, 185, 129]; // emerald-600
            }
        }

        // 1. Header Section with Gradient-like Bar
        doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
        doc.rect(0, 0, 210, 24, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        const headerTitle = calculatorName ? `${calculatorName} Schedule` : 'Amortization Schedule';
        doc.text(headerTitle, 14, 16);

        let startY = 34;

        // 2. Loan Details Section (Modern Box UI)
        if (loanDetails) {
            const boxX = 14;
            const boxY = 32;
            const boxWidth = 182;
            const boxHeight = 38;

            // Draw Box Background
            doc.setFillColor(248, 250, 252); // Slate-50
            doc.setDrawColor(226, 232, 240); // Slate-200
            doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3, 'FD');

            // Loan Details Title
            doc.setTextColor(30, 41, 59); // Slate-800
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text("Loan Overview", boxX + 6, boxY + 10);

            // Details Grid with tighter spacing
            doc.setFontSize(10);
            const col1X = boxX + 6;
            const col2X = boxX + 98;
            const row1Y = boxY + 19;
            const row2Y = boxY + 26;
            const row3Y = boxY + 33;

            const drawDetail = (label: string, value: string, x: number, y: number) => {
                // Label (Key) - Bold & Dark
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(15, 23, 42); // Slate-900
                doc.text(label, x, y);

                // Value - Normal & Lighter - closer to label
                doc.setFont('NotoSans', 'normal');
                doc.setTextColor(71, 85, 105); // Slate-600
                doc.text(value, x + 38, y);
            };

            // Left Column
            drawDetail("Loan Amount:", formatCurrency(loanDetails.loanAmount), col1X, row1Y);
            drawDetail("Interest Rate:", `${loanDetails.interestRate}%`, col1X, row2Y);
            drawDetail("Loan Term:", `${loanDetails.loanTerm} months`, col1X, row3Y);

            // Right Column
            drawDetail("Monthly Payment:", formatCurrency(loanDetails.monthlyPayment), col2X, row1Y);
            drawDetail("Total Interest:", formatCurrency(loanDetails.totalInterest), col2X, row2Y);
            drawDetail("Total Cost:", formatCurrency(loanDetails.totalCost), col2X, row3Y);

            // Add FHA/VA specific details if present
            let additionalY = boxY + boxHeight;
            if (loanDetails.fundingFee !== undefined && loanDetails.fundingFee > 0) {
                additionalY += 8;
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(30, 41, 59);
                doc.text("VA Funding Fee:", col1X, additionalY);
                doc.setFont('NotoSans', 'normal');
                doc.setTextColor(71, 85, 105);
                doc.text(`${formatCurrency(loanDetails.fundingFee)} (${loanDetails.fundingFeeRate}%)`, col1X + 38, additionalY);
                startY = additionalY + 6;
            } else if (loanDetails.upfrontMIP !== undefined && loanDetails.upfrontMIP > 0) {
                additionalY += 8;
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(30, 41, 59);
                doc.text("Upfront MIP:", col1X, additionalY);
                doc.setFont('NotoSans', 'normal');
                doc.setTextColor(71, 85, 105);
                doc.text(formatCurrency(loanDetails.upfrontMIP), col1X + 38, additionalY);

                doc.setFont('helvetica', 'bold');
                doc.setTextColor(30, 41, 59);
                doc.text("Total MIP Paid:", col2X, additionalY);
                doc.setFont('NotoSans', 'normal');
                doc.setTextColor(71, 85, 105);
                doc.text(formatCurrency(loanDetails.totalMIPPaid || 0), col2X + 38, additionalY);
                startY = additionalY + 6;
            } else {
                startY = boxY + boxHeight + 8;
            }
        }

        const tableBody = schedule.map(row => [
            row.month.toString(),
            formatDate(new Date(row.date)),
            formatCurrency(row.principal),
            formatCurrency(row.interest),
            formatCurrency(row.payment),
            formatCurrency(row.balance)
        ]);

        // Generate Table with Perfect Alignment
        autoTable(doc, {
            startY: startY,
            head: [['Sr', 'Date', 'Principal', 'Interest', 'Payment', 'Balance']],
            body: tableBody,
            theme: 'grid',
            headStyles: {
                fillColor: headerColor, // Use custom color
                textColor: 255,
                fontStyle: 'bold',
                halign: 'center', // Center headers for symmetry
                lineWidth: 0.1,
                lineColor: [200, 200, 200]
            },
            bodyStyles: {
                lineWidth: 0.1,
                lineColor: [226, 232, 240], // Slate-200
                textColor: [51, 65, 85] // Slate-700
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252] // Slate-50
            },
            styles: {
                fontSize: 9,
                cellPadding: 3,
                valign: 'middle',
                overflow: 'linebreak'
            },
            columnStyles: {
                0: { halign: 'center', cellWidth: 15 }, // Sr
                1: { halign: 'left' },   // Date
                2: { halign: 'right', font: 'NotoSans' }, // Principal
                3: { halign: 'right', font: 'NotoSans' }, // Interest
                4: { halign: 'right', font: 'NotoSans' }, // Payment
                5: { halign: 'right', font: 'NotoSans' }  // Balance
            }
        });

        const timestamp = Date.now().toString();
        const filename = calculatorName
            ? `${calculatorName.replace(/\s+/g, '_')}_${timestamp}.pdf`
            : `Amortization_Schedule_${timestamp}.pdf`;

        doc.save(filename);
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Controls Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
                >
                    <Download size={16} />
                    Export PDF
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={() => setYearView('none')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${yearView === 'none'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                    >
                        All Months
                    </button>
                    <button
                        onClick={() => setYearView('CY')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${yearView === 'CY'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                    >
                        Calendar Year
                    </button>
                    <button
                        onClick={() => setYearView('FY')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${yearView === 'FY'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                    >
                        Financial Year
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium dark:bg-gray-900 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-3">Sr</th>
                            <th className="px-4 py-3">Month</th>
                            <th className="px-4 py-3">Principal</th>
                            <th className="px-4 py-3">Interest</th>
                            <th className="px-4 py-3">Total Payment</th>
                            <th className="px-4 py-3">Balance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-950">
                        {yearView === 'none' ? (
                            // Regular view - show current page rows
                            currentRows.map((row) => (
                                <tr key={row.month} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{row.month}</td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(row.date)}</td>
                                    <td className="px-4 py-3 text-green-600 dark:text-green-400">{formatCurrency(row.principal)}</td>
                                    <td className="px-4 py-3 text-orange-600 dark:text-orange-400">{formatCurrency(row.interest)}</td>
                                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{formatCurrency(row.payment)}</td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatCurrency(row.balance)}</td>
                                </tr>
                            ))
                        ) : (
                            // Grouped view - show all rows grouped by year with accordion
                            Object.entries(groupByYear(schedule, yearView)).map(([year, rows]) => {
                                const yearTotals = rows.reduce((acc, row) => ({
                                    principal: acc.principal + row.principal,
                                    interest: acc.interest + row.interest,
                                    payment: acc.payment + row.payment
                                }), { principal: 0, interest: 0, payment: 0 });

                                const isExpanded = expandedYears.has(year);

                                return (
                                    <React.Fragment key={year}>
                                        {/* Year Header - Clickable Accordion */}
                                        <tr
                                            className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                            onClick={() => toggleYear(year)}
                                        >
                                            <td className="px-4 py-3 font-bold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800">
                                                <div className="flex items-center gap-2">
                                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800">
                                                {year}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400 font-semibold bg-gray-100 dark:bg-gray-800">
                                                {formatCurrency(yearTotals.principal)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-orange-600 dark:text-orange-400 font-semibold bg-gray-100 dark:bg-gray-800">
                                                {formatCurrency(yearTotals.interest)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-semibold bg-gray-100 dark:bg-gray-800">
                                                {formatCurrency(yearTotals.payment)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-semibold bg-gray-100 dark:bg-gray-800">
                                                {rows.length} months
                                            </td>
                                        </tr>
                                        {/* Year Rows - Collapsible */}
                                        {isExpanded && rows.map((row) => (
                                            <tr key={row.month} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100 pl-8">{row.month}</td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(row.date)}</td>
                                                <td className="px-4 py-3 text-green-600 dark:text-green-400">{formatCurrency(row.principal)}</td>
                                                <td className="px-4 py-3 text-orange-600 dark:text-orange-400">{formatCurrency(row.interest)}</td>
                                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{formatCurrency(row.payment)}</td>
                                                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatCurrency(row.balance)}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                    <tfoot className="bg-blue-50 dark:bg-blue-900/20 border-t-2 border-blue-200 dark:border-blue-800">
                        <tr className="font-bold">
                            <td colSpan={2} className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                Overall Total
                            </td>
                            <td className="px-4 py-3 text-green-600 dark:text-green-400">
                                {formatCurrency(overallTotals.principal)}
                            </td>
                            <td className="px-4 py-3 text-orange-600 dark:text-orange-400">
                                {formatCurrency(overallTotals.interest)}
                            </td>
                            <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                {formatCurrency(overallTotals.payment)}
                            </td>
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                -
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Pagination Controls */}
            {
                totalPages > 1 && yearView === 'none' && (
                    <div className="flex items-center justify-between px-2">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, schedule.length)} of {schedule.length} months
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Previous Page"
                            >
                                <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
                            </button>

                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Next Page"
                            >
                                <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
