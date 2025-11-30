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
    const [isAddingPrepayment, setIsAddingPrepayment] = React.useState(false);
    const [newPrepayment, setNewPrepayment] = React.useState<{ type: 'reduce-tenure' | 'reduce-emi', startMonth: number, amount: number }>({
        type: 'reduce-tenure',
        startMonth: 1,
        amount: 5000
    });

    const [isAddingRateChange, setIsAddingRateChange] = React.useState(false);
    const [newRateChange, setNewRateChange] = React.useState<{ startMonth: number, newRate: number }>({
        startMonth: 12,
        newRate: 5.0
    });

    const handleAddPrepayment = () => {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + newPrepayment.startMonth);
        onPrepaymentsChange([...prepayments, { date, amount: newPrepayment.amount, type: newPrepayment.type }]);
        setIsAddingPrepayment(false);
    };

    const handleAddRateChange = () => {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + newRateChange.startMonth);
        onRateChangesChange([...rateChanges, { date, newRate: newRateChange.newRate }]);
        setIsAddingRateChange(false);
    };

    const removePrepayment = (index: number) => {
        onPrepaymentsChange(prepayments.filter((_, i) => i !== index));
    };

    const removeRateChange = (index: number) => {
        onRateChangesChange(rateChanges.filter((_, i) => i !== index));
    };

    return (
        <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="mt-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-200">
                {/* Prepayments */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Prepayments</h3>
                        {!isAddingPrepayment && (
                            <button
                                onClick={() => setIsAddingPrepayment(true)}
                                className="text-sm flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium"
                            >
                                <Plus size={16} /> Add
                            </button>
                        )}
                    </div>

                    {isAddingPrepayment ? (
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 space-y-6">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium text-gray-900 dark:text-white">New Prepayment</h4>
                                <button
                                    onClick={() => setIsAddingPrepayment(false)}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Cancel
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600 dark:text-gray-400">Type</label>
                                    <select
                                        value={newPrepayment.type}
                                        onChange={(e) => setNewPrepayment({ ...newPrepayment, type: e.target.value as any })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="reduce-tenure">Reduce Tenure</option>
                                        <option value="reduce-emi">Reduce EMI</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600 dark:text-gray-400">Start Month</label>
                                    <input
                                        type="number"
                                        value={newPrepayment.startMonth}
                                        onChange={(e) => setNewPrepayment({ ...newPrepayment, startMonth: Number(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        min={1}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-600 dark:text-gray-400">Amount</label>
                                <input
                                    type="number"
                                    value={newPrepayment.amount}
                                    onChange={(e) => setNewPrepayment({ ...newPrepayment, amount: Number(e.target.value) })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="5000"
                                />
                            </div>

                            <button
                                onClick={handleAddPrepayment}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                            >
                                Add Payment
                            </button>
                        </div>
                    ) : (
                        <>
                            {prepayments.length === 0 && (
                                <p className="text-sm text-gray-500 italic">No prepayments added.</p>
                            )}

                            <div className="space-y-3">
                                {prepayments.map((p, index) => (
                                    <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {p.type === 'reduce-tenure' ? 'Reduce Tenure' : 'Reduce EMI'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {p.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} • ${p.amount.toLocaleString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removePrepayment(index)}
                                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Rate Changes */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Rate Changes</h3>
                        {!isAddingRateChange && (
                            <button
                                onClick={() => setIsAddingRateChange(true)}
                                className="text-sm flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium"
                            >
                                <Plus size={16} /> Add
                            </button>
                        )}
                    </div>

                    {isAddingRateChange ? (
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 space-y-6">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium text-gray-900 dark:text-white">New Rate Change</h4>
                                <button
                                    onClick={() => setIsAddingRateChange(false)}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Cancel
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600 dark:text-gray-400">Start Month</label>
                                    <input
                                        type="number"
                                        value={newRateChange.startMonth}
                                        onChange={(e) => setNewRateChange({ ...newRateChange, startMonth: Number(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        min={1}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600 dark:text-gray-400">New Rate (%)</label>
                                    <input
                                        type="number"
                                        value={newRateChange.newRate}
                                        onChange={(e) => setNewRateChange({ ...newRateChange, newRate: Number(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        step={0.1}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAddRateChange}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                            >
                                Add Rate Change
                            </button>
                        </div>
                    ) : (
                        <>
                            {rateChanges.length === 0 && (
                                <p className="text-sm text-gray-500 italic">No rate changes added.</p>
                            )}

                            <div className="space-y-3">
                                {rateChanges.map((rc, index) => (
                                    <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {rc.newRate}% Interest Rate
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Effective from {rc.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeRateChange(index)}
                                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
