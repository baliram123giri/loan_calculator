'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { InputNumber } from './Shared/InputNumber';
import { Slider } from './Shared/Slider';
import { calculateCompoundInterest, calculateAPY, InterestCalculation } from '@/lib/calc/interest';
import { Download, RotateCcw } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ShareButton from '@/components/ShareButton';

export default function CompoundInterestCalculator() {
    const searchParams = useSearchParams();
    const [principal, setPrincipal] = useState(10000);
    const [rate, setRate] = useState(5);
    const [time, setTime] = useState(5);
    const [frequency, setFrequency] = useState<'yearly' | 'half-yearly' | 'quarterly' | 'monthly' | 'daily'>('yearly');
    const [result, setResult] = useState<InterestCalculation | null>(null);
    const [apy, setApy] = useState<number>(0);

    useEffect(() => {
        const p = searchParams.get('p');
        const r = searchParams.get('r');
        const t = searchParams.get('t');
        const f = searchParams.get('f');

        if (p) setPrincipal(Number(p));
        if (r) setRate(Number(r));
        if (t) setTime(Number(t));
        if (f && ['yearly', 'half-yearly', 'quarterly', 'monthly', 'daily'].includes(f)) {
            setFrequency(f as any);
        }
    }, [searchParams]);

    useEffect(() => {
        const res = calculateCompoundInterest(principal, rate, time, frequency);
        setResult(res);
        setApy(calculateAPY(rate, frequency));
    }, [principal, rate, time, frequency]);

    const resetToDefaults = () => {
        setPrincipal(10000);
        setRate(5);
        setTime(5);
        setFrequency('yearly');
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

    const handleExportPDF = () => {
        if (!result) return;
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('Compound Interest Schedule', 14, 22);

        doc.setFontSize(12);
        doc.text(`Principal: ${formatCurrency(principal)}`, 14, 32);
        doc.text(`Rate: ${rate}% (${frequency})`, 14, 38);
        doc.text(`APY: ${apy}%`, 14, 44);
        doc.text(`Time: ${time} years`, 14, 50);

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
            startY: 60,
        });

        doc.save('compound-interest.pdf');
    };

    const shareData = {
        p: principal,
        r: rate,
        t: time,
        f: frequency
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Compounding Frequency
                        </label>
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value as any)}
                            className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-950 dark:border-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="yearly">Yearly</option>
                            <option value="half-yearly">Half-Yearly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="monthly">Monthly</option>
                            <option value="daily">Daily</option>
                        </select>
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
                </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
                {result && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg col-span-1 md:col-span-2">
                                <p className="text-blue-100 text-sm mb-1">Total Interest</p>
                                <h3 className="text-3xl font-bold">{formatCurrency(result.interest)}</h3>
                                <div className="mt-2 text-sm bg-blue-700/50 inline-block px-2 py-1 rounded">
                                    APY: {apy}%
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <p className="text-gray-500 text-sm mb-1">Total Amount</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(result.totalAmount)}</h3>
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <p className="text-gray-500 text-sm mb-1">Principal</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(result.principal)}</h3>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <h3 className="text-lg font-bold">Yearly Breakdown</h3>
                                <div className="flex gap-2">
                                    <ShareButton data={shareData} />
                                    <button
                                        onClick={handleExportPDF}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
                                    >
                                        <Download size={16} />
                                        Export PDF
                                    </button>
                                </div>
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
