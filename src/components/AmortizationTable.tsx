import React, { useState } from 'react';
import { AmortizationRow } from '@/lib/calc/emi';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AmortizationTableProps {
    schedule: AmortizationRow[];
}

export default function AmortizationTable({ schedule }: AmortizationTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 12;

    const totalPages = Math.ceil(schedule.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentRows = schedule.slice(startIndex, startIndex + rowsPerPage);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium dark:bg-gray-900 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-3">Month</th>
                            <th className="px-4 py-3">Principal</th>
                            <th className="px-4 py-3">Interest</th>
                            <th className="px-4 py-3">Total Payment</th>
                            <th className="px-4 py-3">Balance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-950">
                        {currentRows.map((row) => (
                            <tr key={row.month} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{row.month}</td>
                                <td className="px-4 py-3 text-green-600 dark:text-green-400">{formatCurrency(row.principal)}</td>
                                <td className="px-4 py-3 text-orange-600 dark:text-orange-400">{formatCurrency(row.interest)}</td>
                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{formatCurrency(row.payment)}</td>
                                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatCurrency(row.balance)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
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
            )}
        </div>
    );
}
