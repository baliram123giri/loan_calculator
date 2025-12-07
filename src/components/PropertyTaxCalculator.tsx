'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { InputNumber } from './Shared/InputNumber';
import { Slider } from './Shared/Slider';
import { calculatePropertyTax, TaxResult } from '@/lib/calc/tax';
import ShareButton from '@/components/ShareButton';
import { RotateCcw, FileText } from 'lucide-react';
import { CalculateButton } from './Shared/CalculateButton';
import jsPDF from 'jspdf';

export default function PropertyTaxCalculator() {
    const searchParams = useSearchParams();
    const [value, setValue] = useState(300000);
    const [rate, setRate] = useState(1.1); // National average is around 1.1%
    const [result, setResult] = useState<TaxResult | null>(null);

    useEffect(() => {
        const v = searchParams.get('v');
        const r = searchParams.get('r');

        if (v) setValue(Number(v));
        if (r) setRate(Number(r));

        // Initial calculation if params exist or on load
        setResult(calculatePropertyTax(v ? Number(v) : 300000, r ? Number(r) : 1.1));
    }, [searchParams]);

    const performCalculation = () => {
        setResult(calculatePropertyTax(value, rate));
    };

    const resetToDefaults = () => {
        setValue(300000);
        setRate(1.1);
        setResult(calculatePropertyTax(300000, 1.1));
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    const handleExportPDF = () => {
        if (!result) return;
        const doc = new jsPDF();

        // Header
        doc.setFillColor(37, 99, 235); // Blue-600
        doc.rect(0, 0, 210, 30, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Property Tax Estimate', 14, 18);

        const today = new Date();
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on ${today.toLocaleDateString()}`, 14, 25);

        // Input Details
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Property Details', 14, 45);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Assessed Home Value: ${formatCurrency(value)}`, 14, 55);
        doc.text(`Tax Rate: ${rate}%`, 14, 62);

        // Results
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Estimated Tax Obligations', 14, 80);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Annual Property Tax: ${formatCurrency(result.taxAmount)}`, 14, 90);
        doc.text(`Monthly Tax Estimate: ${formatCurrency(result.taxAmount / 12)}`, 14, 97);

        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('Note: This is an estimate based on the provided tax rate. Actual taxes may vary by municipality.', 14, 120);

        doc.save(`Property_Tax_Estimate_${Date.now()}.pdf`);
    };

    const shareData = {
        v: value,
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
                            label="Assessed Home Value"
                            symbol="$"
                            value={value}
                            onChange={(e) => setValue(Number(e.target.value))}
                            min={10000}
                            max={10000000}
                        />
                        <Slider
                            value={value}
                            min={50000}
                            max={2000000}
                            step={10000}
                            onChange={(e) => setValue(Number(e.target.value))}
                        />
                    </div>

                    <div className="space-y-4">
                        <InputNumber
                            label="Property Tax Rate (%)"
                            symbol="%"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            min={0}
                            max={10}
                            step={0.01}
                        />
                        <Slider
                            value={rate}
                            min={0}
                            max={4}
                            step={0.05}
                            onChange={(e) => setRate(Number(e.target.value))}
                        />
                        <p className="text-xs text-gray-500">
                            Avg rates: NJ (2.49%), IL (2.27%), CA (0.76%), HI (0.28%)
                        </p>
                    </div>
                </div>

                <CalculateButton onClick={performCalculation} label="Calculate Tax" />
            </div>

            <div className="lg:col-span-8 space-y-8">
                {result && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
                                <p className="text-blue-100 text-sm mb-1">Annual Property Tax</p>
                                <h3 className="text-3xl font-bold">{formatCurrency(result.taxAmount)}</h3>
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <p className="text-gray-500 text-sm mb-1">Monthly Tax Estimate</p>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(result.taxAmount / 12)}</h3>
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
