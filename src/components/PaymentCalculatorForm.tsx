'use client';

import React, { useState, useEffect } from 'react';
import LocalizedDatePicker from './LocalizedDatePicker';
import { InputNumber } from './Shared/InputNumber';
import { Slider } from './Shared/Slider';
import { CalculateButton } from './Shared/CalculateButton';
import { RotateCcw } from 'lucide-react';

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
    onReset?: () => void;
}

export default function PaymentCalculatorForm({
    onResultChange,
    currencySymbol = "$",
    persistenceKey,
    onReset
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

    // Calculate results - manual calculation function
    const performCalculation = React.useCallback(() => {
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
                    // Check if payment is sufficient before calculating
                    const monthlyRate = rate / 100 / 12;
                    const monthlyInterest = principal * monthlyRate;

                    if (monthlyPayment <= monthlyInterest) {
                        // Payment is too low, don't calculate
                        console.warn("Monthly payment is too low to cover interest");
                        return;
                    }

                    calculatedTenure = calculateLoanTerm(principal, rate, monthlyPayment);
                    result = generatePaymentAmortization(principal, rate, calculatedTenure, monthlyPayment, startDate, prepayments, rateChanges);
                    result.calculatedTermMonths = calculatedTenure;
                } catch (e) {
                    // Handle case where payment is too low
                    console.warn("Payment calculation error:", e);
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

    // Calculate once on mount (only in fixed-term mode to avoid errors)
    useEffect(() => {
        if (mode === 'fixed-term') {
            performCalculation();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="space-y-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Calculator</h2>
                    {onReset && (
                        <button
                            onClick={onReset}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reset
                        </button>
                    )}
                </div>

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
                    aria-label="Loan Amount Slider"
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
                    aria-label="Interest Rate Slider"
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
                        aria-label="Tenure Slider"
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
                        aria-label="Monthly Payment Slider"
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
                <LocalizedDatePicker
                    value={startDate.toISOString().split('T')[0]}
                    onChange={(val) => val && setStartDate(new Date(val))}
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

            {/* Calculate Button */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                <CalculateButton onClick={performCalculation} label="Calculate Payment" />
            </div>
        </div>
    );
}
