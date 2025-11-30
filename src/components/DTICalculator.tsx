'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Trash2, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import {
    calculateDTI,
    type IncomeSource,
    type HousingCosts,
    type DebtItem,
    type DTIResult,
} from '@/lib/calculations/dti';
import { InputNumber } from './Shared/InputNumber';

export default function DTICalculator() {
    // Income state
    const [income, setIncome] = useState<IncomeSource>({
        primary: 5000,
        secondary: 0,
        bonus: 0,
        rental: 0,
        other: 0,
    });

    // Housing costs state
    const [housing, setHousing] = useState<HousingCosts>({
        mortgageOrRent: 1200,
        propertyTax: 200,
        homeInsurance: 100,
        hoaFees: 0,
    });

    // Debts state
    const [debts, setDebts] = useState<DebtItem[]>([
        { id: '1', name: 'Car Loan', monthlyPayment: 350, balance: 15000, interestRate: 5.5, type: 'auto' },
        { id: '2', name: 'Student Loan', monthlyPayment: 250, balance: 25000, interestRate: 4.5, type: 'student' },
    ]);

    // Calculate DTI
    const dtiResult: DTIResult = useMemo(() => {
        return calculateDTI(income, housing, debts);
    }, [income, housing, debts]);

    // Add new debt
    const addDebt = () => {
        const newDebt: DebtItem = {
            id: Date.now().toString(),
            name: 'New Debt',
            monthlyPayment: 0,
            balance: 0,
            interestRate: 0,
            type: 'other',
        };
        setDebts([...debts, newDebt]);
    };

    // Remove debt
    const removeDebt = (id: string) => {
        setDebts(debts.filter(debt => debt.id !== id));
    };

    // Update debt
    const updateDebt = (id: string, field: keyof DebtItem, value: string | number) => {
        setDebts(debts.map(debt =>
            debt.id === id ? { ...debt, [field]: value } : debt
        ));
    };

    // Get color based on DTI ratio
    const getDTIColor = (ratio: number) => {
        if (ratio <= 33) return 'text-green-600 dark:text-green-400';
        if (ratio <= 36) return 'text-lime-600 dark:text-lime-400';
        if (ratio <= 43) return 'text-yellow-600 dark:text-yellow-400';
        if (ratio <= 50) return 'text-orange-600 dark:text-orange-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getHealthBadge = (status: DTIResult['healthStatus']) => {
        const badges = {
            'excellent': { text: 'Excellent', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
            'good': { text: 'Good', color: 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200' },
            'moderate': { text: 'Moderate', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
            'risky': { text: 'Risky', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
            'high-risk': { text: 'High Risk', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
        };
        return badges[status];
    };

    return (
        <div className="w-full">
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column - Inputs */}
                <div className="space-y-6">
                    {/* Income Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            Monthly Income
                        </h3>
                        <div className="space-y-4">
                            <InputNumber
                                label="Primary Income"
                                value={income.primary}
                                onChange={(e) => setIncome({ ...income, primary: parseFloat(e.target.value) || 0 })}
                                symbol="$"
                            />
                            <InputNumber
                                label="Secondary Income"
                                value={income.secondary}
                                onChange={(e) => setIncome({ ...income, secondary: parseFloat(e.target.value) || 0 })}
                                symbol="$"
                            />
                            <InputNumber
                                label="Bonus/Commission (Monthly Avg)"
                                value={income.bonus}
                                onChange={(e) => setIncome({ ...income, bonus: parseFloat(e.target.value) || 0 })}
                                symbol="$"
                            />
                            <InputNumber
                                label="Rental Income"
                                value={income.rental}
                                onChange={(e) => setIncome({ ...income, rental: parseFloat(e.target.value) || 0 })}
                                symbol="$"
                            />
                            <InputNumber
                                label="Other Income"
                                value={income.other}
                                onChange={(e) => setIncome({ ...income, other: parseFloat(e.target.value) || 0 })}
                                symbol="$"
                            />
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-900 dark:text-white">Total Monthly Income</span>
                                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                        ${dtiResult.totalMonthlyIncome.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Housing Costs Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Housing Costs
                        </h3>
                        <div className="space-y-4">
                            <InputNumber
                                label="Mortgage/Rent Payment"
                                value={housing.mortgageOrRent}
                                onChange={(e) => setHousing({ ...housing, mortgageOrRent: parseFloat(e.target.value) || 0 })}
                                symbol="$"
                            />
                            <InputNumber
                                label="Property Tax (Monthly)"
                                value={housing.propertyTax}
                                onChange={(e) => setHousing({ ...housing, propertyTax: parseFloat(e.target.value) || 0 })}
                                symbol="$"
                            />
                            <InputNumber
                                label="Home Insurance (Monthly)"
                                value={housing.homeInsurance}
                                onChange={(e) => setHousing({ ...housing, homeInsurance: parseFloat(e.target.value) || 0 })}
                                symbol="$"
                            />
                            <InputNumber
                                label="HOA/Co-op Fees"
                                value={housing.hoaFees}
                                onChange={(e) => setHousing({ ...housing, hoaFees: parseFloat(e.target.value) || 0 })}
                                symbol="$"
                            />
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-900 dark:text-white">Total Housing Costs</span>
                                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                        ${dtiResult.totalHousingCosts.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Other Debts Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Other Monthly Debts
                            </h3>
                            <button
                                onClick={addDebt}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Debt
                            </button>
                        </div>
                        <div className="space-y-4">
                            {debts.map((debt) => (
                                <div key={debt.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between items-start mb-3">
                                        <input
                                            type="text"
                                            value={debt.name}
                                            onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                                            className="text-sm font-semibold bg-transparent border-none focus:outline-none text-gray-900 dark:text-white"
                                        />
                                        <button
                                            onClick={() => removeDebt(debt.id)}
                                            className="text-red-600 hover:text-red-700 dark:text-red-400"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <InputNumber
                                            label="Monthly Payment"
                                            value={debt.monthlyPayment}
                                            onChange={(e) => updateDebt(debt.id, 'monthlyPayment', parseFloat(e.target.value) || 0)}
                                            symbol="$"
                                        />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Type
                                            </label>
                                            <select
                                                value={debt.type}
                                                onChange={(e) => updateDebt(debt.id, 'type', e.target.value)}
                                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="auto">Auto Loan</option>
                                                <option value="student">Student Loan</option>
                                                <option value="credit">Credit Card</option>
                                                <option value="personal">Personal Loan</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {debts.length === 0 && (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                    No other debts added. Click "Add Debt" to include other monthly obligations.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Results */}
                <div className="space-y-6">
                    {/* DTI Ratios Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-blue-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            Your DTI Ratios
                        </h3>

                        {/* Front-End Ratio */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Front-End Ratio</span>
                                <span className={`text-2xl font-bold ${getDTIColor(dtiResult.frontEndRatio)}`}>
                                    {dtiResult.frontEndRatio.toFixed(1)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all ${dtiResult.frontEndRatio <= 28 ? 'bg-green-500' :
                                            dtiResult.frontEndRatio <= 31 ? 'bg-yellow-500' :
                                                'bg-red-500'
                                        }`}
                                    style={{ width: `${Math.min(dtiResult.frontEndRatio, 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                Housing costs: ${dtiResult.totalHousingCosts.toLocaleString()} / Income: ${dtiResult.totalMonthlyIncome.toLocaleString()}
                            </p>
                        </div>

                        {/* Back-End Ratio */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Back-End Ratio</span>
                                <span className={`text-2xl font-bold ${getDTIColor(dtiResult.backEndRatio)}`}>
                                    {dtiResult.backEndRatio.toFixed(1)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all ${dtiResult.backEndRatio <= 36 ? 'bg-green-500' :
                                            dtiResult.backEndRatio <= 43 ? 'bg-yellow-500' :
                                                dtiResult.backEndRatio <= 50 ? 'bg-orange-500' :
                                                    'bg-red-500'
                                        }`}
                                    style={{ width: `${Math.min(dtiResult.backEndRatio, 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                Total debts: ${dtiResult.totalMonthlyDebts.toLocaleString()} / Income: ${dtiResult.totalMonthlyIncome.toLocaleString()}
                            </p>
                        </div>

                        {/* Health Status Badge */}
                        <div className="flex items-center justify-center gap-2 mt-4">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getHealthBadge(dtiResult.healthStatus).color}`}>
                                {getHealthBadge(dtiResult.healthStatus).text}
                            </span>
                        </div>
                    </div>

                    {/* Loan Qualification Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Loan Qualification
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Conventional Loan</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">28% / 36% limits</p>
                                </div>
                                {dtiResult.qualification.conventional ? (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                )}
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">FHA Loan</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">31% / 43% limits</p>
                                </div>
                                {dtiResult.qualification.fha ? (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                )}
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">VA Loan</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">41% back-end limit</p>
                                </div>
                                {dtiResult.qualification.va ? (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recommendations Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Recommendations
                        </h3>
                        <div className="space-y-3">
                            {dtiResult.recommendations.map((rec, index) => (
                                <div key={index} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                    <span className="text-lg">{rec.split(' ')[0]}</span>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {rec.split(' ').slice(1).join(' ')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
