'use client';

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InputNumber } from './Shared/InputNumber';
import { Slider } from './Shared/Slider';

import { AdvancedOptions } from './AdvancedOptions';
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
    // No longer needed here as they are handled inside AdvancedOptions component or via state updates
    // But wait, AdvancedOptions component takes callbacks to update state.
    // So we just need the state setters.

    const handlePrepaymentsChange = (newPrepayments: Prepayment[]) => {
        setPrepayments(newPrepayments);
    };

    const handleRateChangesChange = (newRateChanges: RateChange[]) => {
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
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Calculator</h2>

                {/* Mode Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setMode('fixed-term')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${mode === 'fixed-term'
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        Calculate Payment
                    </button>
                    <button
                        onClick={() => setMode('fixed-payment')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${mode === 'fixed-payment'
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
            <AdvancedOptions
                prepayments={prepayments}
                onPrepaymentsChange={handlePrepaymentsChange}
                rateChanges={rateChanges}
                onRateChangesChange={handleRateChangesChange}
                startDate={startDate}
            />
        </div>
    );
}
