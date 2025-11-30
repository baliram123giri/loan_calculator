'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { InputNumber } from './Shared/InputNumber';
import { Slider } from './Shared/Slider';
import { calculateSimpleInterest, calculateAdvancedSimpleInterest, InterestCalculation } from '@/lib/calc/interest';
import { Prepayment, RateChange } from '@/lib/calc/paymentCalc';
import { Download, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ShareButton from '@/components/ShareButton';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

    // Helper functions for advanced features
    const addPrepayment = () => {
        const nextMonth = new Date(startDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        setPrepayments([...prepayments, { date: nextMonth, amount: 1000, type: 'reduce-tenure' }]);
    };

    const removePrepayment = (index: number) => {
        setPrepayments(prepayments.filter((_, i) => i !== index));
    };

    const updatePrepayment = (index: number, field: keyof Prepayment, value: any) => {
        const newPrepayments = [...prepayments];
        newPrepayments[index] = { ...newPrepayments[index], [field]: value };
        setPrepayments(newPrepayments);
    };

    const addRateChange = () => {
        const nextYear = new Date(startDate);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        setRateChanges([...rateChanges, { date: nextYear, newRate: rate + 0.5 }]);
    };

    const removeRateChange = (index: number) => {
        setRateChanges(rateChanges.filter((_, i) => i !== index));
    };

    const updateRateChange = (index: number, field: keyof RateChange, value: any) => {
        const newRateChanges = [...rateChanges];
        newRateChanges[index] = { ...newRateChanges[index], [field]: value };
        setRateChanges(newRateChanges);
    };

    useEffect(() => {
        const p = searchParams.get('p');
        const r = searchParams.get('r');
        const t = searchParams.get('t');

        if (p) setPrincipal(Number(p));
        if (r) setRate(Number(r));
        if (t) setTime(Number(t));
    }, [searchParams]);

    useEffect(() => {
        const res = calculateAdvancedSimpleInterest(principal, rate, time, startDate, prepayments, rateChanges);
        setResult(res);
    }, [principal, rate, time, startDate, prepayments, rateChanges]);

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

    const handleExportPDF = () => {
        if (!result) return;
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('Simple Interest Schedule', 14, 22);

        doc.setFontSize(12);
        doc.text(`Principal: ${formatCurrency(principal)}`, 14, 32);
        doc.text(`Rate: ${rate}%`, 14, 38);
        doc.text(`Time: ${time} years`, 14, 44);

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
            startY: 55,
        });

        doc.save('simple-interest.pdf');
    };

    const shareData = {
        p: principal,
        r: rate,
        t: time
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Input Details</h2>

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

                    {/* Advanced Options */}
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            Advanced Options (Prepayments & Rate Changes)
                        </button>

                        {showAdvanced && (
                            <div className="mt-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-200">
                                {/* Prepayments */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Prepayments</h3>
                                        <button
                                            onClick={addPrepayment}
                                            className="text-xs flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                        >
                                            <Plus size={14} /> Add
                                        </button>
                                    </div>

                                    {prepayments.length === 0 && (
                                        <p className="text-xs text-gray-500 italic">No prepayments added.</p>
                                    )}

                                    <div className="space-y-3">
                                        {prepayments.map((p, index) => (
                                            <div key={index} className="flex gap-2 items-start bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                                                <div className="flex-1 space-y-2">
                                                    <DatePicker
                                                        selected={p.date}
                                                        onChange={(date) => date && updatePrepayment(index, 'date', date)}
                                                        dateFormat="MMM yyyy"
                                                        showMonthYearPicker
                                                        className="w-full text-xs px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={p.amount}
                                                        onChange={(e) => updatePrepayment(index, 'amount', Number(e.target.value))}
                                                        className="w-full text-xs px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                                                        placeholder="Amount"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => removePrepayment(index)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Rate Changes */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Rate Changes</h3>
                                        <button
                                            onClick={addRateChange}
                                            className="text-xs flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                        >
                                            <Plus size={14} /> Add
                                        </button>
                                    </div>

                                    {rateChanges.length === 0 && (
                                        <p className="text-xs text-gray-500 italic">No rate changes added.</p>
                                    )}

                                    <div className="space-y-3">
                                        {rateChanges.map((rc, index) => (
                                            <div key={index} className="flex gap-2 items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                                                <div className="flex-1 space-y-2">
                                                    <DatePicker
                                                        selected={rc.date}
                                                        onChange={(date) => date && updateRateChange(index, 'date', date)}
                                                        dateFormat="MMM yyyy"
                                                        showMonthYearPicker
                                                        className="w-full text-xs px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={rc.newRate}
                                                            onChange={(e) => updateRateChange(index, 'newRate', Number(e.target.value))}
                                                            className="w-full text-xs px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                                                            placeholder="New Rate"
                                                            step="0.1"
                                                        />
                                                        <span className="text-xs text-gray-500">%</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeRateChange(index)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
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
