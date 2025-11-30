import React from 'react';
import { Download, FileText } from 'lucide-react';
import { EMIResult } from '@/lib/calc/emi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportButtonProps {
    result: EMIResult;
    principal: number;
    rate: number;
    tenureMonths: number;
}

export default function ExportButton({ result, principal, rate, tenureMonths }: ExportButtonProps) {
    const handleExportCSV = async () => {
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
            console.error('Export error:', error);
            alert('Failed to export CSV. Please try again.');
        }
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('Loan Amortization Schedule', 14, 22);

        // Loan Details
        doc.setFontSize(12);
        doc.text(`Principal: ${principal.toLocaleString()}`, 14, 32);
        doc.text(`Interest Rate: ${rate}%`, 14, 38);
        doc.text(`Tenure: ${tenureMonths} months`, 14, 44);
        doc.text(`EMI: ${result.emi.toLocaleString()}`, 14, 50);

        // Summary
        doc.text(`Total Interest: ${result.totalInterest.toLocaleString()}`, 14, 60);
        doc.text(`Total Payment: ${result.totalPayment.toLocaleString()}`, 14, 66);

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
