'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, PieChart as PieChartIcon, AlertCircle, CheckCircle, Info, TrendingUp, RotateCcw, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import CurrencyInput from './CurrencyInput';
import jsPDF from 'jspdf';
import { CalculateButton } from './Shared/CalculateButton';

type CalculationMode = 'affordability' | 'income-needed';

export default function RentCalculator() {
    const [mode, setMode] = useState<CalculationMode>('affordability');
    const [income, setIncome] = useState<number>(60000);
    const [debt, setDebt] = useState<number>(0);
    const [rent, setRent] = useState<number>(1500);
    const [ratio, setRatio] = useState<number>(30); // 30% rule default
    const [utilities, setUtilities] = useState<number>(150);
    const [savings, setSavings] = useState<number>(500);

    // Initialize with default calculation
    const getDefaultResult = () => {
        const defaultMode = 'affordability';
        const defaultIncome = 60000;
        const defaultDebt = 0;
        const defaultRent = 1500;
        const defaultRatio = 30;
        const defaultUtilities = 150;
        const defaultSavings = 500;

        if (defaultMode === 'affordability') {
            const monthlyIncome = defaultIncome / 12;
            const affordableRentByRatio = monthlyIncome * (defaultRatio / 100);
            const totalHousingCost = affordableRentByRatio + defaultUtilities;
            const totalMonthlyObligations = totalHousingCost + defaultDebt;
            const dti = (totalMonthlyObligations / monthlyIncome) * 100;
            const remaining = monthlyIncome - affordableRentByRatio - defaultDebt - defaultUtilities - defaultSavings;

            let score = 100;
            if (dti > 43) score -= 30;
            else if (dti > 36) score -= 15;
            if (remaining < 0) score -= 40;
            else if (remaining < 500) score -= 20;
            if (defaultSavings < 300) score -= 10;

            return {
                affordableRent: affordableRentByRatio,
                monthlyIncome,
                debt: defaultDebt,
                utilities: defaultUtilities,
                savings: defaultSavings,
                remaining: Math.max(0, remaining),
                dti,
                score: Math.max(0, score),
                isAffordable: remaining > 0 && dti < 43
            };
        }
        return null;
    };

    const [result, setResult] = useState<any>(getDefaultResult());

    const resetToDefaults = () => {
        const defaults = {
            mode: 'affordability' as CalculationMode,
            income: 60000,
            debt: 0,
            rent: 1500,
            ratio: 30,
            utilities: 150,
            savings: 500
        };

        setMode(defaults.mode);
        setIncome(defaults.income);
        setDebt(defaults.debt);
        setRent(defaults.rent);
        setRatio(defaults.ratio);
        setUtilities(defaults.utilities);
        setSavings(defaults.savings);

        // Immediately recalculate with default values
        const monthlyIncome = defaults.income / 12;
        const affordableRentByRatio = monthlyIncome * (defaults.ratio / 100);
        const totalHousingCost = affordableRentByRatio + defaults.utilities;
        const totalMonthlyObligations = totalHousingCost + defaults.debt;
        const dti = (totalMonthlyObligations / monthlyIncome) * 100;
        const remaining = monthlyIncome - affordableRentByRatio - defaults.debt - defaults.utilities - defaults.savings;

        let score = 100;
        if (dti > 43) score -= 30;
        else if (dti > 36) score -= 15;
        if (remaining < 0) score -= 40;
        else if (remaining < 500) score -= 20;
        if (defaults.savings < 300) score -= 10;

        setResult({
            affordableRent: affordableRentByRatio,
            monthlyIncome,
            debt: defaults.debt,
            utilities: defaults.utilities,
            savings: defaults.savings,
            remaining: Math.max(0, remaining),
            dti,
            score: Math.max(0, score),
            isAffordable: remaining > 0 && dti < 43
        });
    };

    // Recalculate when mode changes
    useEffect(() => {
        performCalculation();
    }, [mode]);

    const performCalculation = () => {
        calculate();
    };

    const calculate = () => {
        if (mode === 'affordability') {
            // Calculate Affordable Rent
            const monthlyIncome = income / 12;
            const affordableRentByRatio = monthlyIncome * (ratio / 100);

            // Calculate DTI (Debt-to-Income)
            const totalHousingCost = affordableRentByRatio + utilities;
            const totalMonthlyObligations = totalHousingCost + debt;
            const dti = (totalMonthlyObligations / monthlyIncome) * 100;

            // Calculate remaining after all expenses
            const remaining = monthlyIncome - affordableRentByRatio - debt - utilities - savings;

            // Affordability Score (0-100)
            let score = 100;
            if (dti > 43) score -= 30;
            else if (dti > 36) score -= 15;
            if (remaining < 0) score -= 40;
            else if (remaining < 500) score -= 20;
            if (savings < 300) score -= 10;

            setResult({
                affordableRent: affordableRentByRatio,
                monthlyIncome,
                debt,
                utilities,
                savings,
                remaining: Math.max(0, remaining),
                dti,
                score: Math.max(0, score),
                isAffordable: remaining > 0 && dti < 43
            });
        } else {
            // Calculate Income Needed
            const requiredMonthlyIncome = rent / (ratio / 100);
            const requiredAnnualIncome = requiredMonthlyIncome * 12;

            // Calculate what's left after rent
            const totalHousingCost = rent + utilities;
            const remaining = requiredMonthlyIncome - totalHousingCost - debt - savings;
            const dti = ((totalHousingCost + debt) / requiredMonthlyIncome) * 100;

            setResult({
                requiredAnnualIncome,
                requiredMonthlyIncome,
                rent,
                utilities,
                debt,
                savings,
                remaining: Math.max(0, remaining),
                dti,
                ratio
            });
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(val);
    };

    const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6']; // Blue, Red, Orange, Green, Purple

    const getDataForPieChart = () => {
        if (!result) return [];
        if (mode === 'affordability') {
            return [
                { name: 'Rent', value: result.affordableRent },
                { name: 'Debt', value: result.debt },
                { name: 'Utilities', value: result.utilities },
                { name: 'Savings', value: result.savings },
                { name: 'Remaining', value: result.remaining },
            ].filter(item => item.value > 0);
        } else {
            return [
                { name: 'Rent', value: result.rent },
                { name: 'Debt', value: result.debt },
                { name: 'Utilities', value: result.utilities },
                { name: 'Savings', value: result.savings },
                { name: 'Remaining', value: result.remaining },
            ].filter(item => item.value > 0);
        }
    };

    const getDataForBarChart = () => {
        if (!result) return [];
        if (mode === 'affordability') {
            return [
                { category: 'Rent', amount: result.affordableRent },
                { category: 'Debt', amount: result.debt },
                { category: 'Utilities', amount: result.utilities },
                { category: 'Savings', amount: result.savings },
                { category: 'Remaining', amount: result.remaining },
            ];
        } else {
            return [
                { category: 'Rent', amount: result.rent },
                { category: 'Debt', amount: result.debt },
                { category: 'Utilities', amount: result.utilities },
                { category: 'Savings', amount: result.savings },
                { category: 'Remaining', amount: result.remaining },
            ];
        }
    };

    const getAffordabilityMessage = () => {
        if (!result || mode !== 'affordability') return null;

        if (result.score >= 80) {
            return {
                icon: <CheckCircle className="text-green-500" size={20} />,
                text: "Excellent! This rent is very affordable for your income.",
                color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            };
        } else if (result.score >= 60) {
            return {
                icon: <Info className="text-blue-500" size={20} />,
                text: "Good. This rent is manageable but leaves limited room for unexpected expenses.",
                color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            };
        } else if (result.score >= 40) {
            return {
                icon: <AlertCircle className="text-orange-500" size={20} />,
                text: "Caution! This rent may strain your budget. Consider reducing expenses or finding a lower rent.",
                color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
            };
        } else {
            return {
                icon: <AlertCircle className="text-red-500" size={20} />,
                text: "Warning! This rent is not affordable with your current income and expenses.",
                color: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            };
        }
    };

    const handleExportPDF = () => {
        if (!result) return;

        const doc = new jsPDF();

        // Header with gradient effect (simulated with color)
        doc.setFillColor(59, 130, 246); // Blue-600
        doc.rect(0, 0, 210, 35, 'F');

        // Title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Rent Affordability Report', 14, 18);

        // Subtitle
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const today = new Date();
        const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
        doc.text(`Generated on ${formattedDate}`, 14, 26);

        // Reset text color
        doc.setTextColor(0, 0, 0);

        let yPos = 42;

        if (mode === 'affordability') {
            // Main Result Box
            doc.setFillColor(239, 246, 255); // Blue-50
            doc.setDrawColor(191, 219, 254); // Blue-200
            doc.roundedRect(14, yPos, 182, 28, 3, 3, 'FD');

            doc.setFontSize(12);
            doc.setTextColor(30, 64, 175); // Blue-800
            doc.setFont('helvetica', 'normal');
            doc.text('You can afford monthly rent up to:', 20, yPos + 10);

            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text(`$${result.affordableRent.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 20, yPos + 22);

            yPos += 38;

            // Affordability Score
            doc.setFillColor(248, 250, 252); // Slate-50
            doc.setDrawColor(226, 232, 240); // Slate-200
            doc.roundedRect(14, yPos, 182, 25, 3, 3, 'FD');

            doc.setFontSize(14);
            doc.setTextColor(30, 41, 59); // Slate-800
            doc.setFont('helvetica', 'bold');
            doc.text('Affordability Score', 20, yPos + 10);

            doc.setFontSize(18);
            doc.setTextColor(37, 99, 235); // Blue-600
            doc.text(`${result.score}/100`, 160, yPos + 10);

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(71, 85, 105);
            doc.text(`DTI Ratio: ${result.dti.toFixed(1)}%`, 20, yPos + 19);
            doc.text(`Monthly Remaining: $${result.remaining.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 90, yPos + 19);

            yPos += 35;
        } else {
            // Income Needed Mode
            doc.setFillColor(239, 246, 255); // Blue-50
            doc.setDrawColor(191, 219, 254); // Blue-200
            doc.roundedRect(14, yPos, 182, 28, 3, 3, 'FD');

            doc.setFontSize(12);
            doc.setTextColor(30, 64, 175); // Blue-800
            doc.setFont('helvetica', 'normal');
            doc.text(`For $${rent.toLocaleString()} monthly rent, you need:`, 20, yPos + 10);

            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text(`$${result.requiredAnnualIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 20, yPos + 22);

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`(approx. $${result.requiredMonthlyIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })} / month)`, 90, yPos + 22);

            yPos += 38;
        }

        // Input Details Section
        doc.setFillColor(248, 250, 252); // Slate-50
        doc.setDrawColor(226, 232, 240); // Slate-200
        doc.roundedRect(14, yPos, 182, 40, 3, 3, 'FD');

        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59); // Slate-800
        doc.setFont('helvetica', 'bold');
        doc.text('Input Details', 20, yPos + 10);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105); // Slate-600

        const col1X = 20;
        const col2X = 110;
        let detailY = yPos + 20;

        const drawDetail = (label: string, value: string, x: number, y: number) => {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(15, 23, 42);
            doc.text(label, x, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(71, 85, 105);
            doc.text(value, x + 45, y);
        };

        if (mode === 'affordability') {
            drawDetail('Annual Income:', `$${income.toLocaleString()}`, col1X, detailY);
            drawDetail('Rent Ratio:', `${ratio}%`, col2X, detailY);
            detailY += 7;
            drawDetail('Monthly Debts:', `$${debt.toLocaleString()}`, col1X, detailY);
            drawDetail('Utilities:', `$${utilities.toLocaleString()}`, col2X, detailY);
            detailY += 7;
            drawDetail('Savings Goal:', `$${savings.toLocaleString()}`, col1X, detailY);
        } else {
            drawDetail('Target Rent:', `$${rent.toLocaleString()}`, col1X, detailY);
            drawDetail('Rent Ratio:', `${ratio}%`, col2X, detailY);
            detailY += 7;
            drawDetail('Monthly Debts:', `$${debt.toLocaleString()}`, col1X, detailY);
            drawDetail('Utilities:', `$${utilities.toLocaleString()}`, col2X, detailY);
            detailY += 7;
            drawDetail('Savings Goal:', `$${savings.toLocaleString()}`, col1X, detailY);
        }

        yPos = detailY + 15;

        // Monthly Budget Breakdown
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(14, yPos, 182, 55, 3, 3, 'FD');

        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.text('Monthly Budget Breakdown', 20, yPos + 10);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);

        let breakdownY = yPos + 20;
        const rentAmount = mode === 'affordability' ? result.affordableRent : result.rent;
        const monthlyInc = mode === 'affordability' ? result.monthlyIncome : result.requiredMonthlyIncome;

        drawDetail('Rent:', `$${rentAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, col1X, breakdownY);
        drawDetail('Utilities:', `$${utilities.toLocaleString()}`, col2X, breakdownY);
        breakdownY += 7;
        drawDetail('Debt Payments:', `$${debt.toLocaleString()}`, col1X, breakdownY);
        drawDetail('Savings:', `$${savings.toLocaleString()}`, col2X, breakdownY);
        breakdownY += 7;
        drawDetail('Remaining:', `$${result.remaining.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, col1X, breakdownY);

        // Total
        breakdownY += 10;
        doc.setDrawColor(226, 232, 240);
        doc.line(20, breakdownY, 190, breakdownY);
        breakdownY += 7;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text('Monthly Income:', col1X, breakdownY);
        doc.setTextColor(37, 99, 235); // Blue-600
        doc.text(`$${monthlyInc.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, col2X, breakdownY);

        yPos = breakdownY + 15;

        // Recommendations
        if (mode === 'affordability') {
            const scoreColor = result.score >= 80 ? [220, 252, 231] :
                result.score >= 60 ? [239, 246, 255] :
                    result.score >= 40 ? [255, 237, 213] : [254, 226, 226];
            const scoreBorderColor = result.score >= 80 ? [187, 247, 208] :
                result.score >= 60 ? [191, 219, 254] :
                    result.score >= 40 ? [254, 215, 170] : [254, 202, 202];
            const scoreTextColor = result.score >= 80 ? [22, 101, 52] :
                result.score >= 60 ? [30, 64, 175] :
                    result.score >= 40 ? [154, 52, 18] : [153, 27, 27];

            doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
            doc.setDrawColor(scoreBorderColor[0], scoreBorderColor[1], scoreBorderColor[2]);
            doc.roundedRect(14, yPos, 182, 30, 3, 3, 'FD');

            doc.setFontSize(12);
            doc.setTextColor(scoreTextColor[0], scoreTextColor[1], scoreTextColor[2]);
            doc.setFont('helvetica', 'bold');
            const message = getAffordabilityMessage();
            if (message) {
                doc.text('Assessment:', 20, yPos + 10);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                const lines = doc.splitTextToSize(message.text, 160);
                doc.text(lines, 20, yPos + 18);
            }
        }

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text('This report is for informational purposes only and does not constitute financial advice.', 14, 285);

        // Save PDF
        const timestamp = Date.now();
        doc.save(`Rent_Affordability_Report_${timestamp}.pdf`);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <DollarSign className="text-blue-500" />
                                Rent Affordability Calculator
                            </h2>
                            <button
                                onClick={resetToDefaults}
                                className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer ml-4"
                            >
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Reset
                            </button>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                            {mode === 'affordability'
                                ? 'Calculate how much rent you can afford based on your income.'
                                : 'Calculate how much income you need for a specific rent.'}
                        </p>
                    </div>

                    <button
                        onClick={() => setMode(mode === 'affordability' ? 'income-needed' : 'affordability')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium text-sm cursor-pointer"
                    >
                        <RefreshCw size={16} />
                        Switch to {mode === 'affordability' ? 'Income Needed' : 'Rent Affordability'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {/* Inputs Section */}
                    <div className="space-y-6">
                        {mode === 'affordability' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Annual Pre-tax Income
                                    </label>
                                    <CurrencyInput
                                        value={income}
                                        onChange={setIncome}
                                        min={0}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Monthly Debt Payments
                                    </label>
                                    <CurrencyInput
                                        value={debt}
                                        onChange={setDebt}
                                        min={0}
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Credit cards, car loans, student loans, etc.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Target Monthly Rent
                                    </label>
                                    <CurrencyInput
                                        value={rent}
                                        onChange={setRent}
                                        min={0}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Monthly Debt Payments
                                    </label>
                                    <CurrencyInput
                                        value={debt}
                                        onChange={setDebt}
                                        min={0}
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Credit cards, car loans, student loans, etc.</p>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Monthly Utilities (Estimated)
                            </label>
                            <CurrencyInput
                                value={utilities}
                                onChange={setUtilities}
                                min={0}
                            />
                            <p className="mt-1 text-xs text-gray-500">Electric, gas, water, internet, etc.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Monthly Savings Goal
                            </label>
                            <CurrencyInput
                                value={savings}
                                onChange={setSavings}
                                min={0}
                            />
                            <p className="mt-1 text-xs text-gray-500">Emergency fund, retirement, investments</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Rent-to-Income Ratio (%)
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="10"
                                    max="50"
                                    value={ratio}
                                    onChange={(e) => setRatio(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                                    style={{
                                        background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(ratio - 10) / 0.4}%, #e5e7eb ${(ratio - 10) / 0.4}%, #e5e7eb 100%)`
                                    }}
                                />
                                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400 w-12">
                                    {ratio}%
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Standard recommendation is 30%. Landlords typically require income to be 3x rent (33%).
                            </p>
                        </div>

                        {/* Calculate Button */}
                        <div className="pt-4">
                            <CalculateButton onClick={performCalculation} label="Calculate Rent Affordability" />
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="space-y-6">
                        {result && (
                            <>
                                <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg text-center">
                                    <p className="text-lg opacity-90 mb-2">
                                        {mode === 'affordability' ? 'You Can Afford' : 'You Need Annual Income'}
                                    </p>
                                    <div className="text-5xl font-bold mb-4">
                                        {mode === 'affordability'
                                            ? formatCurrency(result.affordableRent)
                                            : formatCurrency(result.requiredAnnualIncome)
                                        }
                                    </div>
                                    <p className="text-sm opacity-80">
                                        {mode === 'affordability'
                                            ? '/ month in rent'
                                            : `(approx. ${formatCurrency(result.requiredMonthlyIncome)} / month)`
                                        }
                                    </p>
                                </div>

                                {mode === 'affordability' && (
                                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Affordability Score</span>
                                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.score}/100</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                                            <div
                                                className={`h-3 rounded-full transition-all ${result.score >= 80 ? 'bg-green-500' :
                                                    result.score >= 60 ? 'bg-blue-500' :
                                                        result.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${result.score}%` }}
                                            />
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex justify-between mb-1">
                                                <span>Debt-to-Income Ratio:</span>
                                                <span className="font-semibold">{result.dti.toFixed(1)}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Monthly Remaining:</span>
                                                <span className="font-semibold">{formatCurrency(result.remaining)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {mode === 'affordability' && getAffordabilityMessage() && (
                                    <div className={`rounded-xl p-4 border flex items-start gap-3 ${getAffordabilityMessage()?.color}`}>
                                        {getAffordabilityMessage()?.icon}
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {getAffordabilityMessage()?.text}
                                        </p>
                                    </div>
                                )}

                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                                        <PieChartIcon size={16} />
                                        Monthly Budget Breakdown
                                    </h3>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={getDataForPieChart()}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={50}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {getDataForPieChart().map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value: number) => formatCurrency(value)}
                                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                />
                                                <Legend verticalAlign="bottom" height={36} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Export PDF Button */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={handleExportPDF}
                                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm cursor-pointer shadow-sm"
                                    >
                                        <FileText size={18} />
                                        Export PDF Report
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
