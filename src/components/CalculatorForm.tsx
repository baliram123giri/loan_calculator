'use client';

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InputNumber } from './Shared/InputNumber';
import { Slider } from './Shared/Slider';
import { calculateEMI, EMIResult, ExtraPayment } from '@/lib/calc/emi';
import { LoanTypeConfig } from '@/types/loanTypes';

interface CalculatorFormProps {
    onResultChange: (result: EMIResult, params: { principal: number; rate: number; tenureMonths: number }) => void;
    loanTypeConfig: LoanTypeConfig;
}

export default function CalculatorForm({ onResultChange, loanTypeConfig }: CalculatorFormProps) {
    const [principal, setPrincipal] = useState(loanTypeConfig.minAmount);
    const [rate, setRate] = useState((loanTypeConfig.minRate + loanTypeConfig.maxRate) / 2);
    const [tenureYears, setTenureYears] = useState(Math.floor((loanTypeConfig.minTenure + loanTypeConfig.maxTenure) / 2));
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [extraPayments, setExtraPayments] = useState<ExtraPayment[]>([]);

    // Temporary state for new extra payment input
    const [newExtraType, setNewExtraType] = useState<"monthly" | "lump">("monthly");
    const [newExtraAmount, setNewExtraAmount] = useState(5000);
    const [newExtraStartMonth, setNewExtraStartMonth] = useState(1);
    const [showExtraForm, setShowExtraForm] = useState(false);

    // Reset values when loan type changes
    useEffect(() => {
        setPrincipal(loanTypeConfig.minAmount);
        setRate((loanTypeConfig.minRate + loanTypeConfig.maxRate) / 2);
        setTenureYears(Math.floor((loanTypeConfig.minTenure + loanTypeConfig.maxTenure) / 2));
        setStartDate(new Date());
        setExtraPayments([]);
    }, [loanTypeConfig]);

    useEffect(() => {
        try {
            const tenureMonths = tenureYears * 12;
            const result = calculateEMI(principal, rate, tenureMonths, extraPayments, startDate);
            onResultChange(result, { principal, rate, tenureMonths });
        } catch (e) {
            console.error("Calculation error:", e);
        }
    }, [principal, rate, tenureYears, extraPayments, startDate, onResultChange]);

    const addExtraPayment = () => {
        setExtraPayments([
            ...extraPayments,
            {
                type: newExtraType,
                amount: newExtraAmount,
                startMonth: newExtraStartMonth
            }
        ]);
        setShowExtraForm(false);
    };

    const removeExtraPayment = (index: number) => {
        setExtraPayments(extraPayments.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Loan Details</h2>

            {/* Principal */}
            <div className="space-y-4">
                <InputNumber
                    label="Loan Amount"
                    symbol="₹"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    min={loanTypeConfig.minAmount}
                    max={loanTypeConfig.maxAmount}
                />
                <Slider
                    value={principal}
                    min={loanTypeConfig.minAmount}
                    max={loanTypeConfig.maxAmount}
                    step={10000}
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
                    min={loanTypeConfig.minRate}
                    max={loanTypeConfig.maxRate}
                />
                <Slider
                    value={rate}
                    min={loanTypeConfig.minRate}
                    max={loanTypeConfig.maxRate}
                    step={0.1}
                    onChange={(e) => setRate(Number(e.target.value))}
                    aria-label="Interest Rate Slider"
                />
            </div>

            {/* Tenure */}
            <div className="space-y-4">
                <InputNumber
                    label="Tenure (Years)"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    min={loanTypeConfig.minTenure}
                    max={loanTypeConfig.maxTenure}
                />
                <Slider
                    value={tenureYears}
                    min={loanTypeConfig.minTenure}
                    max={loanTypeConfig.maxTenure}
                    step={1}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    valueDisplay={`${tenureYears} Years`}
                    aria-label="Tenure Slider"
                />
            </div>

            {/* Loan Start Date */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Loan Start Date
                </label>
                <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => date && setStartDate(date)}
                    dateFormat="dd MMM yyyy"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    wrapperClassName="w-full"
                />
            </div>

            {/* Extra Payments Section */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Prepayments</h3>
                    <button
                        onClick={() => setShowExtraForm(!showExtraForm)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        {showExtraForm ? 'Cancel' : '+ Add Extra Payment'}
                    </button>
                </div>

                {showExtraForm && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-4 mb-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                <select
                                    value={newExtraType}
                                    onChange={(e) => setNewExtraType(e.target.value as "monthly" | "lump")}
                                    className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-950 dark:border-gray-800"
                                >
                                    <option value="monthly">Monthly Extra</option>
                                    <option value="lump">Lump Sum</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Start Month</label>
                                <input
                                    type="number"
                                    value={newExtraStartMonth}
                                    onChange={(e) => setNewExtraStartMonth(Number(e.target.value))}
                                    className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-950 dark:border-gray-800"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                            <input
                                type="number"
                                value={newExtraAmount}
                                onChange={(e) => setNewExtraAmount(Number(e.target.value))}
                                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-950 dark:border-gray-800"
                            />
                        </div>
                        <button
                            onClick={addExtraPayment}
                            className="w-full bg-blue-600 text-white rounded-md py-2 text-sm font-medium hover:bg-blue-700"
                        >
                            Add Payment
                        </button>
                    </div>
                )}

                <div className="space-y-2">
                    {extraPayments.map((extra, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg text-sm">
                            <div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {extra.type === 'monthly' ? 'Monthly Extra' : 'Lump Sum'}
                                </span>
                                <span className="text-gray-500 mx-2">•</span>
                                <span className="text-gray-600 dark:text-gray-400">
                                    ₹{extra.amount.toLocaleString()} from Month {extra.startMonth || 1}
                                </span>
                            </div>
                            <button
                                onClick={() => removeExtraPayment(index)}
                                className="text-red-500 hover:text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    {extraPayments.length === 0 && !showExtraForm && (
                        <p className="text-sm text-gray-500 italic">No extra payments added.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
