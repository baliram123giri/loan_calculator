import React from 'react';
import { Download, FileText } from 'lucide-react';
import { EMIResult } from '@/lib/calc/emi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportButtonProps {
    // Specific to EMI Loan Calculators
    result?: EMIResult;
    principal?: number;
    rate?: number;
    tenureMonths?: number;

    // Generic use (e.g., CD Calculator)
    columns?: string[];
    data?: (string | number)[][];
    title?: string;

    // Common
    currencySymbol?: string;
}

export default function ExportButton({
    result,
    principal,
    rate,
    tenureMonths,
    columns,
    data,
    title = "Schedule",
    currencySymbol = "$"
}: ExportButtonProps) {

    const handleExportCSV = async () => {
        // Method 1: Generic Client-side CSV (Preferred for simple tables)
        if (columns && data) {
            try {
                const csvContent = [
                    columns.join(','),
                    ...data.map(row => row.map(cell =>
                        typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
                    ).join(','))
                ].join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } catch (error) {
                console.error('Generic CSV Export error:', error);
                alert('Failed to export CSV.');
            }
            return;
        }

        // Method 2: Legacy API-based CSV (For existing Loan Calculators)
        if (result && principal !== undefined && rate !== undefined && tenureMonths !== undefined) {
            try {
                const response = await fetch('/api/export/csv', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amortization: result.amortization,
                        principal,
                        rate,
                        tenure: tenureMonths,
                        emi: result.emi,
                        totalInterest: result.totalInterest,
                        totalPayment: result.totalPayment,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Export failed');
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'emi-schedule.csv';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } catch (error) {
                console.error('API CSV Export error:', error);
                alert('Failed to export CSV. Please try again.');
            }
        }
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // method 1: Generic PDF
        if (columns && data) {
            doc.setFontSize(20);
            doc.text(title.replace(/_/g, ' '), 14, 22);

            doc.setFontSize(10);
            doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

            autoTable(doc, {
                head: [columns],
                body: data,
                startY: 40,
                theme: 'grid',
                headStyles: { fillColor: [59, 130, 246] } // Blue header
            });

            doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
            return;
        }

        // Method 2: Legacy Loan PDF
        if (result && principal !== undefined && rate !== undefined && tenureMonths !== undefined) {
            // Title
            doc.setFontSize(20);
            doc.text('Loan Amortization Schedule', 14, 22);

            // Loan Details
            doc.setFontSize(12);
            doc.text(`Principal: ${currencySymbol}${principal.toLocaleString()}`, 14, 32);
            doc.text(`Interest Rate: ${rate}%`, 14, 38);
            doc.text(`Tenure: ${tenureMonths} months`, 14, 44);
            doc.text(`EMI: ${currencySymbol}${result.emi.toLocaleString()}`, 14, 50);

            // Summary
            doc.text(`Total Interest: ${currencySymbol}${result.totalInterest.toLocaleString()}`, 14, 60);
            doc.text(`Total Payment: ${currencySymbol}${result.totalPayment.toLocaleString()}`, 14, 66);

            // Table
            const tableColumn = ["Month", "EMI", "Principal", "Interest", "Balance"];
            const tableRows = result.amortization.map(row => [
                row.month,
                row.payment.toFixed(2),
                row.principal.toFixed(2),
                row.interest.toFixed(2),
                row.balance.toFixed(2)
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 75,
            });

            doc.save('emi-schedule.pdf');
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
            >
                <Download size={16} />
                Export CSV
            </button>
            <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
            >
                <FileText size={16} />
                Export PDF
            </button>
        </div>
    );
}
