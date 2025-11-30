import React, { useState, useEffect } from 'react';
import { AmortizationRow } from '@/lib/calc/emi';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

interface AmortizationTableProps {
    schedule: AmortizationRow[];
    currencySymbol?: string;
}

export default function AmortizationTable({ schedule, currencySymbol = "$" }: AmortizationTableProps) {
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

    return (
        <div className="flex flex-col gap-4">
            {/* Year View Toggle */}
            <div className="flex gap-2 justify-end">
                <button
                    onClick={() => setYearView('none')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${yearView === 'none'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                >
                    All Months
                </button>
                <button
                    onClick={() => setYearView('CY')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${yearView === 'CY'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                >
                    Calendar Year
                </button>
                <button
                    onClick={() => setYearView('FY')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${yearView === 'FY'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                >
                    Financial Year
                </button>
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
                                            <td colSpan={2} className="px-4 py-3 font-bold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800">
                                                <div className="flex items-center gap-2">
                                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                    {year}
                                                </div>
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
            {totalPages > 1 && yearView === 'none' && (
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
