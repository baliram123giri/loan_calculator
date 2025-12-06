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
    inputs?: Record<string, string | number>;

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
    inputs,
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

        // Method 1: Generic PDF (New Design)
        if (columns && data) {
            // Title
            doc.setFontSize(22);
            doc.setTextColor(16, 185, 129); // Green-500 (#10B981)
            doc.text(title.replace(/_/g, ' '), 14, 20);

            doc.setFontSize(10);
            doc.setTextColor(107, 114, 128); // Gray-500
            doc.setTextColor(107, 114, 128); // Gray-500
            const today = new Date();
            const dateStr = `Generated on ${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
            doc.text(dateStr, 14, 28);

            let startY = 40;
            if (inputs) {
                // Background Card
                doc.setFillColor(249, 250, 251); // Gray-50 (#F9FAFB)
                doc.setDrawColor(229, 231, 235); // Gray-200
                doc.roundedRect(14, 35, 182, 60, 3, 3, 'FD');

                // Card Header
                doc.setFontSize(14);
                doc.setTextColor(31, 41, 55); // Gray-800 (#1F2937)
                doc.setFont("helvetica", "bold");
                doc.text("Simulation Details", 20, 48);

                // Grid Layout for Inputs
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(75, 85, 99); // Gray-600 (#4B5563)

                let x = 20;
                let y = 58;
                let col = 0;

                Object.entries(inputs).forEach(([key, value]) => {
                    // Truncate key if too long to fit mostly
                    const text = `${key}: ${value}`;
                    doc.text(text, x, y);

                    // Move to next column
                    col++;
                    if (col === 3) {
                        col = 0;
                        x = 20;
                        y += 8;
                    } else {
                        x += 60; // Column width
                    }
                });

                startY = 105; // Space below card
            }

            autoTable(doc, {
                head: [columns],
                body: data,
                startY: startY,
                theme: 'grid',
                headStyles: { fillColor: [59, 130, 246] }, // Blue header
                styles: { fontSize: 10, cellPadding: 3 },
            });

            doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
            return;
        }

        // Method 2: Legacy Loan PDF
        if (result && principal !== undefined && rate !== undefined && tenureMonths !== undefined) {
            // Title
            doc.setFontSize(20);
            doc.setTextColor(0, 0, 0); // Reset to black
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
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm cursor-pointer"
            >
                <Download size={16} />
                Export CSV
            </button>
            <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm cursor-pointer"
            >
                <FileText size={16} />
                Export PDF
            </button>
        </div>
    );
}
