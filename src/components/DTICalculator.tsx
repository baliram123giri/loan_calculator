'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, AlertCircle, CheckCircle, RotateCcw, Download } from 'lucide-react';
import {
    calculateDTI,
    type IncomeSource,
    type HousingCosts,
    type DebtItem,
    type DTIResult,
} from '@/lib/calculations/dti';
import { InputNumber } from './Shared/InputNumber';
import { CalculateButton } from './Shared/CalculateButton';

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

    // State for DTI result
    const [dtiResult, setDtiResult] = useState<DTIResult>(() => {
        return calculateDTI({
            primary: 5000,
            secondary: 0,
            bonus: 0,
            rental: 0,
            other: 0,
        }, {
            mortgageOrRent: 1200,
            propertyTax: 200,
            homeInsurance: 100,
            hoaFees: 0,
        }, [
            { id: '1', name: 'Car Loan', monthlyPayment: 350, balance: 15000, interestRate: 5.5, type: 'auto' },
            { id: '2', name: 'Student Loan', monthlyPayment: 250, balance: 25000, interestRate: 4.5, type: 'student' },
        ]);
    });

    // Calculate DTI - manual calculation function
    const performCalculation = useCallback(() => {
        const result = calculateDTI(income, housing, debts);
        setDtiResult(result);
    }, [income, housing, debts]);

    // Calculate once on mount
    useEffect(() => {
        performCalculation();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

    const resetToDefaults = () => {
        const defaults = {
            income: {
                primary: 5000,
                secondary: 0,
                bonus: 0,
                rental: 0,
                other: 0,
            },
            housing: {
                mortgageOrRent: 1200,
                propertyTax: 200,
                homeInsurance: 100,
                hoaFees: 0,
            },
            debts: [
                { id: '1', name: 'Car Loan', monthlyPayment: 350, balance: 15000, interestRate: 5.5, type: 'auto' as const },
                { id: '2', name: 'Student Loan', monthlyPayment: 250, balance: 25000, interestRate: 4.5, type: 'student' as const },
            ]
        };

        setIncome(defaults.income);
        setHousing(defaults.housing);
        setDebts(defaults.debts);

        // Immediately recalculate with default values
        const result = calculateDTI(defaults.income, defaults.housing, defaults.debts);
        setDtiResult(result);
    };

    const exportToPDF = async () => {
        const jsPDF = (await import('jspdf')).default;
        const doc = new jsPDF();

        // Header with gradient-like bar
        doc.setFillColor(99, 102, 241); // Indigo-600
        doc.rect(0, 0, 210, 24, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text('Debt-to-Income Ratio Report', 14, 16);

        let yPos = 34;

        // DTI Ratios Section
        doc.setFillColor(239, 246, 255); // Blue-50
        doc.setDrawColor(191, 219, 254); // Blue-200
        doc.roundedRect(14, yPos, 182, 50, 3, 3, 'FD');

        doc.setTextColor(30, 58, 138); // Blue-900
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('DTI Ratios', 20, yPos + 10);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(55, 65, 81); // Gray-700

        // Front-End Ratio
        doc.setFont('helvetica', 'bold');
        doc.text('Front-End Ratio:', 20, yPos + 22);
        doc.setFont('helvetica', 'normal');
        const frontEndColor = dtiResult.frontEndRatio <= 28 ? [34, 197, 94] : dtiResult.frontEndRatio <= 31 ? [234, 179, 8] : [239, 68, 68];
        doc.setTextColor(frontEndColor[0], frontEndColor[1], frontEndColor[2]);
        doc.text(`${dtiResult.frontEndRatio.toFixed(1)}%`, 70, yPos + 22);
        doc.setTextColor(107, 114, 128);
        doc.text(`(Housing: $${dtiResult.totalHousingCosts.toLocaleString()} / Income: $${dtiResult.totalMonthlyIncome.toLocaleString()})`, 90, yPos + 22);

        // Back-End Ratio
        doc.setTextColor(55, 65, 81);
        doc.setFont('helvetica', 'bold');
        doc.text('Back-End Ratio:', 20, yPos + 32);
        doc.setFont('helvetica', 'normal');
        const backEndColor = dtiResult.backEndRatio <= 36 ? [34, 197, 94] : dtiResult.backEndRatio <= 43 ? [234, 179, 8] : [239, 68, 68];
        doc.setTextColor(backEndColor[0], backEndColor[1], backEndColor[2]);
        doc.text(`${dtiResult.backEndRatio.toFixed(1)}%`, 70, yPos + 32);
        doc.setTextColor(107, 114, 128);
        doc.text(`(Total Debts: $${dtiResult.totalMonthlyDebts.toLocaleString()} / Income: $${dtiResult.totalMonthlyIncome.toLocaleString()})`, 90, yPos + 32);

        // Health Status
        doc.setTextColor(55, 65, 81);
        doc.setFont('helvetica', 'bold');
        doc.text('Financial Health:', 20, yPos + 42);
        doc.setFont('helvetica', 'normal');
        const healthBadge = getHealthBadge(dtiResult.healthStatus);
        const healthColor = dtiResult.healthStatus === 'excellent' || dtiResult.healthStatus === 'good' ? [34, 197, 94] :
            dtiResult.healthStatus === 'moderate' ? [234, 179, 8] : [239, 68, 68];
        doc.setTextColor(healthColor[0], healthColor[1], healthColor[2]);
        doc.text(healthBadge.text, 70, yPos + 42);

        yPos += 60;

        // Income Breakdown
        doc.setFillColor(240, 253, 244); // Green-50
        doc.setDrawColor(187, 247, 208); // Green-200
        doc.roundedRect(14, yPos, 88, 45, 3, 3, 'FD');

        doc.setTextColor(6, 78, 59); // Green-900
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Monthly Income', 20, yPos + 10);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(55, 65, 81);
        let incomeY = yPos + 18;
        if (income.primary > 0) {
            doc.text(`Primary: $${income.primary.toLocaleString()}`, 20, incomeY);
            incomeY += 6;
        }
        if (income.secondary > 0) {
            doc.text(`Secondary: $${income.secondary.toLocaleString()}`, 20, incomeY);
            incomeY += 6;
        }
        if (income.bonus > 0) {
            doc.text(`Bonus: $${income.bonus.toLocaleString()}`, 20, incomeY);
            incomeY += 6;
        }
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(22, 163, 74);
        doc.text(`Total: $${dtiResult.totalMonthlyIncome.toLocaleString()}`, 20, yPos + 40);

        // Housing Costs
        doc.setFillColor(254, 249, 195); // Yellow-100
        doc.setDrawColor(253, 224, 71); // Yellow-300
        doc.roundedRect(108, yPos, 88, 45, 3, 3, 'FD');

        doc.setTextColor(120, 53, 15); // Yellow-900
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Housing Costs', 114, yPos + 10);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(55, 65, 81);
        let housingY = yPos + 18;
        doc.text(`Mortgage/Rent: $${housing.mortgageOrRent.toLocaleString()}`, 114, housingY);
        housingY += 6;
        if (housing.propertyTax > 0) {
            doc.text(`Property Tax: $${housing.propertyTax.toLocaleString()}`, 114, housingY);
            housingY += 6;
        }
        if (housing.homeInsurance > 0) {
            doc.text(`Insurance: $${housing.homeInsurance.toLocaleString()}`, 114, housingY);
            housingY += 6;
        }
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(202, 138, 4);
        doc.text(`Total: $${dtiResult.totalHousingCosts.toLocaleString()}`, 114, yPos + 40);

        yPos += 55;

        // Loan Qualification
        doc.setFillColor(243, 244, 246); // Gray-100
        doc.setDrawColor(209, 213, 219); // Gray-300
        doc.roundedRect(14, yPos, 182, 35, 3, 3, 'FD');

        doc.setTextColor(17, 24, 39); // Gray-900
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Loan Qualification Status', 20, yPos + 10);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const qualY = yPos + 20;

        doc.setTextColor(55, 65, 81);
        doc.text('Conventional (28/36):', 20, qualY);
        doc.setTextColor(dtiResult.qualification.conventional ? 34 : 239, dtiResult.qualification.conventional ? 197 : 68, dtiResult.qualification.conventional ? 94 : 68);
        doc.text(dtiResult.qualification.conventional ? 'YES - Qualified' : 'NO - Not Qualified', 70, qualY);

        doc.setTextColor(55, 65, 81);
        doc.text('FHA (31/43):', 110, qualY);
        doc.setTextColor(dtiResult.qualification.fha ? 34 : 239, dtiResult.qualification.fha ? 197 : 68, dtiResult.qualification.fha ? 94 : 68);
        doc.text(dtiResult.qualification.fha ? 'YES - Qualified' : 'NO - Not Qualified', 145, qualY);

        doc.setTextColor(55, 65, 81);
        doc.text('VA (41):', 20, qualY + 8);
        doc.setTextColor(dtiResult.qualification.va ? 34 : 239, dtiResult.qualification.va ? 197 : 68, dtiResult.qualification.va ? 94 : 68);
        doc.text(dtiResult.qualification.va ? 'YES - Qualified' : 'NO - Not Qualified', 70, qualY + 8);

        // Save PDF
        const timestamp = Date.now();
        doc.save(`DTI_Report_${timestamp}.pdf`);
    };

    return (
        <div className="w-full space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">DTI Calculator</h2>
                <button
                    onClick={resetToDefaults}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                </button>
            </div>
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
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                Type
                                            </label>
                                            <select
                                                value={debt.type}
                                                onChange={(e) => updateDebt(debt.id, 'type', e.target.value)}
                                                className="w-full h-10 px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                    {/* Calculate Button */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <CalculateButton onClick={performCalculation} label="Calculate DTI" />
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

                        {/* Export PDF Button */}
                        <div className="mt-6">
                            <button
                                onClick={exportToPDF}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
                            >
                                <Download className="w-5 h-5" />
                                Export PDF Report
                            </button>
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
                            {dtiResult.recommendations.map((rec, index) => {
                                // Extract emoji if present (emojis are typically 1-2 characters)
                                const emojiMatch = rec.match(/^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/u);
                                const emoji = emojiMatch ? emojiMatch[0] : null;
                                const text = emoji ? rec.slice(emoji.length).trim() : rec;

                                return (
                                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        {emoji && (
                                            <span className="text-xl flex-shrink-0 leading-none">{emoji}</span>
                                        )}
                                        <p className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${!emoji ? 'ml-0' : ''}`}>
                                            {text}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
