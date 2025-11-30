'use client';

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InputNumber } from './Shared/InputNumber';
import { Slider } from './Shared/Slider';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { calculateMonthlyPayment, calculateLoanTerm, generatePaymentAmortization, PaymentResult, Prepayment, RateChange } from '@/lib/calc/paymentCalc';

interface PaymentCalculatorFormProps {
    onResultChange: (result: PaymentResult, params: {
        principal: number;
        rate: number;
        tenureMonths: number;
        monthlyPayment: number;
        mode: 'fixed-term' | 'fixed-payment';
    }) => void;
    currencySymbol?: string;
    persistenceKey?: string;
}

export default function PaymentCalculatorForm({
    onResultChange,
    currencySymbol = "$",
    persistenceKey
}: PaymentCalculatorFormProps) {
    const [mode, setMode] = useState<'fixed-term' | 'fixed-payment'>('fixed-term');
    const [principal, setPrincipal] = useState(20000);
    const [rate, setRate] = useState(5.0);
    const [tenureYears, setTenureYears] = useState(5);
    const [monthlyPayment, setMonthlyPayment] = useState(400);
    const [startDate, setStartDate] = useState<Date>(new Date());

    // Advanced Features State
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [prepayments, setPrepayments] = useState<Prepayment[]>([]);
    const [rateChanges, setRateChanges] = useState<RateChange[]>([]);

    // Initialize from localStorage if available
    useEffect(() => {
        if (persistenceKey) {
            try {
                const savedState = localStorage.getItem(persistenceKey);
                if (savedState) {
                    const parsed = JSON.parse(savedState);
                    setMode(parsed.mode || 'fixed-term');
                    setPrincipal(parsed.principal || 20000);
                    setRate(parsed.rate || 5.0);
                    setTenureYears(parsed.tenureYears || 5);
                    setMonthlyPayment(parsed.monthlyPayment || 400);
                    if (parsed.startDate) setStartDate(new Date(parsed.startDate));
                }
            } catch (e) {
                console.error("Failed to load state:", e);
            }
        }
    }, [persistenceKey]);

    // Auto-save
    useEffect(() => {
        if (persistenceKey) {
            const stateToSave = {
                mode,
                principal,
                rate,
                tenureYears,
                monthlyPayment,
                startDate: startDate.toISOString()
            };
            localStorage.setItem(persistenceKey, JSON.stringify(stateToSave));
        }
    }, [mode, principal, rate, tenureYears, monthlyPayment, startDate, persistenceKey]);

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

    // Calculate results
    useEffect(() => {
        try {
            let result: PaymentResult;
            let calculatedPayment = monthlyPayment;
            let calculatedTenure = tenureYears * 12;

            if (mode === 'fixed-term') {
                calculatedTenure = tenureYears * 12;
                calculatedPayment = calculateMonthlyPayment(principal, rate, calculatedTenure);
                result = generatePaymentAmortization(principal, rate, calculatedTenure, calculatedPayment, startDate, prepayments, rateChanges);
                result.calculatedMonthlyPayment = calculatedPayment;
            } else {
                // Fixed Payment mode
                try {
                    calculatedTenure = calculateLoanTerm(principal, rate, monthlyPayment);
                    result = generatePaymentAmortization(principal, rate, calculatedTenure, monthlyPayment, startDate, prepayments, rateChanges);
                    result.calculatedTermMonths = calculatedTenure;
                } catch (e) {
                    // Handle case where payment is too low
                    console.error("Payment too low:", e);
                    // Create a dummy result or handle error gracefully
                    // For now, we'll just not update if calculation fails
                    return;
                }
            }

            onResultChange(result, {
                principal,
                rate,
                tenureMonths: calculatedTenure,
                monthlyPayment: calculatedPayment,
                mode
            });
        } catch (e) {
            console.error("Calculation error:", e);
        }
    }, [mode, principal, rate, tenureYears, monthlyPayment, startDate, prepayments, rateChanges, onResultChange]);

    return (
        <div className="space-y-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Calculator</h2>

                {/* Mode Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setMode('fixed-term')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'fixed-term'
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        Calculate Payment
                    </button>
                    <button
                        onClick={() => setMode('fixed-payment')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'fixed-payment'
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        Calculate Term
                    </button>
                </div>
            </div>

            {/* Principal */}
            <div className="space-y-4">
                <InputNumber
                    label="Loan Amount"
                    symbol={currencySymbol}
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    min={1000}
                    max={10000000}
                />
                <Slider
                    value={principal}
                    min={1000}
                    max={1000000}
                    step={1000}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                />
            </div>

            {/* Rate */}
            <div className="space-y-4">
                <InputNumber
                    label="Interest Rate (% p.a.)"
                    symbol="%"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    step={0.1}
                    min={0.1}
                    max={30}
                />
                <Slider
                    value={rate}
                    min={0.1}
                    max={20}
                    step={0.1}
                    onChange={(e) => setRate(Number(e.target.value))}
                />
            </div>

            {/* Conditional Input based on Mode */}
            {mode === 'fixed-term' ? (
                <div className="space-y-4">
                    <InputNumber
                        label="Loan Term (Years)"
                        value={tenureYears}
                        onChange={(e) => setTenureYears(Number(e.target.value))}
                        min={1}
                        max={50}
                    />
                    <Slider
                        value={tenureYears}
                        min={1}
                        max={30}
                        step={1}
                        onChange={(e) => setTenureYears(Number(e.target.value))}
                        valueDisplay={`${tenureYears} Years`}
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    <InputNumber
                        label="Monthly Payment"
                        symbol={currencySymbol}
                        value={monthlyPayment}
                        onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                        min={10}
                        max={100000}
                    />
                    <Slider
                        value={monthlyPayment}
                        min={100}
                        max={10000}
                        step={50}
                        onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Minimum required to cover interest: {currencySymbol}{Math.ceil((principal * (rate / 100 / 12)) + 1)}
                    </p>
                </div>
            )}

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
                                            <select
                                                value={p.type}
                                                onChange={(e) => updatePrepayment(index, 'type', e.target.value as any)}
                                                className="w-full text-xs px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                                            >
                                                <option value="reduce-tenure">Reduce Tenure</option>
                                                <option value="reduce-emi">Reduce EMI</option>
                                            </select>
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
    );
}
