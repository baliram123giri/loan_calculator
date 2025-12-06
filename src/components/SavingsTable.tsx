'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';
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
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 12; // Show one year per page if monthly, or customized

    // Filter to show annual summary or monthly details? 
    // Usually monthly tables are long. Let's do monthly pagination.
    const totalPages = Math.ceil(schedule.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentRows = schedule.slice(startIndex, startIndex + rowsPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(val).replace('$', currencySymbol);
    };

    const downloadCSV = () => {
        const headers = ["Year", "Month", "Total Contributed", "Interest Earned", "Total Interest", "Balance"];
        const csvRows = [headers.join(",")];

        schedule.forEach(row => {
            const values = [
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
        doc.text("Savings Growth Schedule", 14, 20);

        const tableColumn = ["Year", "Month", "Total Contributed", "Interest", "Total Interest", "Balance"];
        const tableRows = schedule.map(row => [
            row.year,
            row.month,
            formatCurrency(row.totalContributed),
            formatCurrency(row.interestEarned),
            formatCurrency(row.totalInterest),
            formatCurrency(row.balance),
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            theme: 'striped',
            headStyles: { fillColor: [16, 185, 129] }, // Emerald color
        });

        doc.save("savings_schedule.pdf");
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end gap-3">
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

            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium dark:bg-gray-900 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-4">Year/Month</th>
                            <th className="px-6 py-4">Total Invested</th>
                            <th className="px-6 py-4">Interest</th>
                            <th className="px-6 py-4">Total Interest</th>
                            <th className="px-6 py-4 text-right">End Balance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-950">
                        {currentRows.map((row, index) => (
                            <tr key={`${row.year}-${row.month}`} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">
                                    {row.month % 12 === 0 ? `Year ${row.year}` : `Mo ${row.month}`}
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">
                                    {formatCurrency(row.totalContributed)}
                                </td>
                                <td className="px-6 py-4 text-green-600 dark:text-green-400">
                                    +{formatCurrency(row.interestEarned)}
                                </td>
                                <td className="px-6 py-4 text-green-700 dark:text-green-300 font-medium">
                                    {formatCurrency(row.totalInterest)}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(row.balance)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 pt-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, schedule.length)} of {schedule.length} months
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 px-2">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
