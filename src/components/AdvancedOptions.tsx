import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Prepayment, RateChange } from '@/lib/calc/paymentCalc';

interface AdvancedOptionsProps {
    prepayments: Prepayment[];
    onPrepaymentsChange: (prepayments: Prepayment[]) => void;
    rateChanges: RateChange[];
    onRateChangesChange: (rateChanges: RateChange[]) => void;
    startDate: Date;
}

export function AdvancedOptions({
    prepayments,
    onPrepaymentsChange,
    rateChanges,
    onRateChangesChange,
    startDate
}: AdvancedOptionsProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const addPrepayment = () => {
        const nextMonth = new Date(startDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        onPrepaymentsChange([...prepayments, { date: nextMonth, amount: 1000, type: 'reduce-tenure' }]);
    };

    const removePrepayment = (index: number) => {
        onPrepaymentsChange(prepayments.filter((_, i) => i !== index));
    };

    const updatePrepayment = (index: number, field: keyof Prepayment, value: any) => {
        const newPrepayments = [...prepayments];
        newPrepayments[index] = { ...newPrepayments[index], [field]: value };
        onPrepaymentsChange(newPrepayments);
    };

    const addRateChange = () => {
        const nextYear = new Date(startDate);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        onRateChangesChange([...rateChanges, { date: nextYear, newRate: 5.0 }]); // Default rate? Maybe pass current rate?
    };

    const removeRateChange = (index: number) => {
        onRateChangesChange(rateChanges.filter((_, i) => i !== index));
    };

    const updateRateChange = (index: number, field: keyof RateChange, value: any) => {
        const newRateChanges = [...rateChanges];
        newRateChanges[index] = { ...newRateChanges[index], [field]: value };
        onRateChangesChange(newRateChanges);
    };

    return (
        <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                Advanced Options (Prepayments & Rate Changes)
            </button>

            {isOpen && (
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
    );
}
