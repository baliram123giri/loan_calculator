'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { InputNumber } from './Shared/InputNumber';
import { Slider } from './Shared/Slider';
import { calculateSimpleInterest, calculateAdvancedSimpleInterest, InterestCalculation } from '@/lib/calc/interest';
import { Prepayment, RateChange } from '@/lib/calc/paymentCalc';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AdvancedOptions } from './AdvancedOptions';
import { CalculateButton } from './Shared/CalculateButton';
import { ResetButton } from './Shared/ResetButton';

export default function SimpleInterestCalculator() {
    const searchParams = useSearchParams();
    const [principal, setPrincipal] = useState(10000);
    const [rate, setRate] = useState(5);
    const [time, setTime] = useState(5);
    const [result, setResult] = useState<InterestCalculation | null>(null);

    // Advanced Options State
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [prepayments, setPrepayments] = useState<Prepayment[]>([]);
    const [rateChanges, setRateChanges] = useState<RateChange[]>([]);

    const handlePrepaymentsChange = (newPrepayments: Prepayment[]) => {
        setPrepayments(newPrepayments);
    };

    const handleRateChangesChange = (newRateChanges: RateChange[]) => {
        setRateChanges(newRateChanges);
    };

    const calculate = (
        p: number = principal,
        r: number = rate,
        t: number = time,
        start: Date = startDate,
        pre: Prepayment[] = prepayments,
        rc: RateChange[] = rateChanges
    ) => {
        const res = calculateAdvancedSimpleInterest(p, r, t, start, pre, rc);
        setResult(res);
    };

    const resetToDefaults = () => {
        const defaultPrincipal = 10000;
        const defaultRate = 5;
        const defaultTime = 5;
        const defaultDate = new Date();

        setPrincipal(defaultPrincipal);
        setRate(defaultRate);
        setTime(defaultTime);
        setStartDate(defaultDate);
        setPrepayments([]);
        setRateChanges([]);
        setShowAdvanced(false);

        // Calculate immediately with defaults
        const res = calculateAdvancedSimpleInterest(
            defaultPrincipal,
            defaultRate,
            defaultTime,
            defaultDate,
            [],
            []
        );
        setResult(res);
    };

    useEffect(() => {
        const p = searchParams.get('p');
        const r = searchParams.get('r');
        const t = searchParams.get('t');

        if (p || r || t) {
            const newP = p ? Number(p) : 10000;
            const newR = r ? Number(r) : 5;
            const newT = t ? Number(t) : 5;

            setPrincipal(newP);
            setRate(newR);
            setTime(newT);

            // Trigger calculation with these new values
            const res = calculateAdvancedSimpleInterest(newP, newR, newT, startDate, prepayments, rateChanges);
            setResult(res);
        } else {
            // Initial calculation with defaults if no params
            calculate();
        }
    }, [searchParams]);

    // Removed auto-calculation useEffect

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

    const handleExportPDF = () => {
        if (!result) return;
        const doc = new jsPDF();

        // Header
        doc.setFillColor(79, 70, 229); // Indigo 600
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text('Simple Interest Calculator', 105, 25, { align: 'center' });

        // Loan Details Box
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(14, 50, 182, 40, 3, 3, 'S');

        // Loan Details Content
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Loan Summary', 20, 62);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        // Left Column
        doc.text('Principal Amount:', 20, 72);
        doc.text(formatCurrency(principal), 60, 72);

        doc.text('Annual Rate:', 20, 80);
        doc.text(`${rate}%`, 60, 80);

        doc.text('Time Period:', 20, 88); // Added spacing
        doc.text(`${time} years`, 60, 88);

        // Right Column
        doc.text('Total Interest:', 110, 72);
        if (result.interest < 0) {
            doc.setTextColor(220, 38, 38); // Red
        } else {
            doc.setTextColor(22, 163, 74); // Green
        }
        doc.setFont('helvetica', 'bold');
        doc.text(formatCurrency(result.interest), 150, 72);

        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text('Total Payment:', 110, 80);
        doc.setFont('helvetica', 'bold');
        doc.text(formatCurrency(result.totalAmount), 150, 80);

        const tableColumn = ["Year", "Opening Balance", "Interest", "Closing Balance"];
        const tableRows = result.breakdown.map(row => [
            row.year,
            formatCurrency(row.openingBalance),
            formatCurrency(row.interest),
            formatCurrency(row.closingBalance)
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 100,
            headStyles: {
                fillColor: [79, 70, 229],
                halign: 'center'
            },
            styles: {
                fontSize: 9,
                halign: 'center',
                cellPadding: 3
            },
            alternateRowStyles: { fillColor: [245, 247, 255] },
            didParseCell: (data) => {
                if (data.section === 'body' && data.column.index === 2) {
                    const rawInterest = result.breakdown[data.row.index].interest;
                    if (rawInterest < 0) {
                        data.cell.styles.textColor = [220, 38, 38]; // Red
                    } else {
                        data.cell.styles.textColor = [22, 163, 74]; // Green
                    }
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        });

        const dateStr = new Date().toISOString().split('T')[0];
        doc.save(`simple-interest-calculator-${dateStr}.pdf`);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Input Details</h2>
                        <ResetButton onClick={resetToDefaults} />
                    </div>

                    <div className="space-y-4">
                        <InputNumber
                            label="Principal Amount"
                            symbol="$"
                            value={principal}
                            onChange={(e) => setPrincipal(Number(e.target.value))}
                            min={100}
                            max={10000000}
                        />
                        <Slider
                            value={principal}
                            min={100}
                            max={100000}
                            step={100}
                            onChange={(e) => setPrincipal(Number(e.target.value))}
                        />
                    </div>

                    <div className="space-y-4">
                        <InputNumber
                            label="Annual Rate (%)"
                            symbol="%"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            min={0.1}
                            max={100}
                            step={0.1}
                        />
                        <Slider
                            value={rate}
                            min={0.1}
                            max={20}
                            step={0.1}
                            onChange={(e) => setRate(Number(e.target.value))}
                        />
                    </div>

                    <div className="space-y-4">
                        <InputNumber
                            label="Time Period (Years)"
                            value={time}
                            onChange={(e) => setTime(Number(e.target.value))}
                            min={1}
                            max={50}
                        />
                        <Slider
                            value={time}
                            min={1}
                            max={30}
                            step={1}
                            onChange={(e) => setTime(Number(e.target.value))}
                        />
                    </div>

                    {/* Start Date */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Start Date
                        </label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date: Date | null) => date && setStartDate(date)}
                            dateFormat="dd MMM yyyy"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            wrapperClassName="w-full"
                        />
                    </div>

                    <CalculateButton onClick={() => calculate()} />

                    {/* Advanced Options */}
                    <AdvancedOptions
                        prepayments={prepayments}
                        onPrepaymentsChange={handlePrepaymentsChange}
                        rateChanges={rateChanges}
                        onRateChangesChange={handleRateChangesChange}
                        startDate={startDate}
                    />
                </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
                {result && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
                                <p className="text-blue-100 text-sm mb-1">Total Interest</p>
                                <h3 className="text-3xl font-bold">{formatCurrency(result.interest)}</h3>
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <p className="text-gray-500 text-sm mb-1">Total Amount</p>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(result.totalAmount)}</h3>
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <p className="text-gray-500 text-sm mb-1">Principal</p>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(result.principal)}</h3>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <h3 className="text-lg font-bold">Yearly Breakdown</h3>
                                <button
                                    onClick={handleExportPDF}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium text-sm cursor-pointer"
                                >
                                    <Download size={16} />
                                    Export PDF
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 font-medium">
                                        <tr>
                                            <th className="px-6 py-4">Year</th>
                                            <th className="px-6 py-4">Opening Balance</th>
                                            <th className="px-6 py-4">Interest Earned</th>
                                            <th className="px-6 py-4">Closing Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {result.breakdown.map((row) => (
                                            <tr key={row.year} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="px-6 py-4 font-medium">{row.year}</td>
                                                <td className="px-6 py-4">{formatCurrency(row.openingBalance)}</td>
                                                <td className="px-6 py-4 text-green-600 font-medium">+{formatCurrency(row.interest)}</td>
                                                <td className="px-6 py-4 font-bold">{formatCurrency(row.closingBalance)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
