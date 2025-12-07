'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { InputNumber } from './Shared/InputNumber';
import { Slider } from './Shared/Slider';
import { calculateSalesTax, TaxResult } from '@/lib/calc/tax';
import ShareButton from '@/components/ShareButton';
import { RotateCcw, FileText } from 'lucide-react';
import { CalculateButton } from './Shared/CalculateButton';
import jsPDF from 'jspdf';

export default function SalesTaxCalculator() {
    const searchParams = useSearchParams();
    const [amount, setAmount] = useState(100);
    const [rate, setRate] = useState(7.25); // Default to a common US rate
    const [result, setResult] = useState<TaxResult | null>(null);

    useEffect(() => {
        const p = searchParams.get('p');
        const r = searchParams.get('r');

        if (p) setAmount(Number(p));
        if (r) setRate(Number(r));

        // Initial calculation if params exist or load
        setResult(calculateSalesTax(p ? Number(p) : 100, r ? Number(r) : 7.25));
    }, [searchParams]);

    const performCalculation = () => {
        setResult(calculateSalesTax(amount, rate));
    };

    const resetToDefaults = () => {
        setAmount(100);
        setRate(7.25);
        setResult(calculateSalesTax(100, 7.25));
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    const handleExportPDF = () => {
        if (!result) return;
        const doc = new jsPDF();

        // Header
        doc.setFillColor(37, 99, 235); // Blue-600
        doc.rect(0, 0, 210, 30, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Sales Tax Calculation', 14, 18);

        const today = new Date();
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on ${today.toLocaleDateString()}`, 14, 25);

        // Input Details
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Transaction Details', 14, 45);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Price Before Tax: ${formatCurrency(amount)}`, 14, 55);
        doc.text(`Sales Tax Rate: ${rate}%`, 14, 62);

        // Results
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Total Cost Breakdown', 14, 80);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Sales Tax Amount: ${formatCurrency(result.taxAmount)}`, 14, 90);
        doc.text(`Total Price (After Tax): ${formatCurrency(result.totalAmount)}`, 14, 97);

        doc.save(`Sales_Tax_Calculation_${Date.now()}.pdf`);
    };

    const shareData = {
        p: amount,
        r: rate
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Input Details</h2>
                        <button
                            onClick={resetToDefaults}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reset
                        </button>
                    </div>

                    <div className="space-y-4">
                        <InputNumber
                            label="Price Before Tax"
                            symbol="$"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            min={0}
                        />
                    </div>

                    <div className="space-y-4">
                        <InputNumber
                            label="Sales Tax Rate (%)"
                            symbol="%"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            min={0}
                            max={20}
                            step={0.01}
                        />
                        <Slider
                            value={rate}
                            min={0}
                            max={15}
                            step={0.05}
                            onChange={(e) => setRate(Number(e.target.value))}
                        />
                        <p className="text-xs text-gray-500">
                            Common US rates: CA (7.25%), NY (4%), TX (6.25%), FL (6%)
                        </p>
                    </div>
                </div>

                <CalculateButton onClick={performCalculation} label="Calculate Tax" />
            </div>

            <div className="lg:col-span-8 space-y-8">
                {result && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <p className="text-gray-500 text-sm mb-1">Sales Tax Amount</p>
                                <h3 className="text-3xl font-bold text-red-600">{formatCurrency(result.taxAmount)}</h3>
                            </div>
                            <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
                                <p className="text-blue-100 text-sm mb-1">Total Price (After Tax)</p>
                                <h3 className="text-3xl font-bold">{formatCurrency(result.totalAmount)}</h3>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <ShareButton data={shareData} />
                            <button
                                onClick={handleExportPDF}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm cursor-pointer shadow-sm"
                            >
                                <FileText size={16} />
                                Export PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
