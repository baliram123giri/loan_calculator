'use client';

import React, { useState, useEffect } from 'react';
import { calculateAffordability } from './logic';
import { AffordabilityInput, AffordabilityResult, StateData } from './schema';
import statesData from './states.json';
import { ChevronDown, ChevronUp, Info, RotateCcw, FileText } from 'lucide-react';
import { CalculateButton } from '@/components/Shared/CalculateButton';
import jsPDF from 'jspdf';

export default function HouseAffordabilityCalculator() {
    const [input, setInput] = useState<AffordabilityInput>({
        annualIncome: 80000,
        monthlyDebts: 500,
        downPayment: 20000,
        interestRate: 6.5,
        loanTermYears: 30,
        hoaFees: 0,
        propertyTaxRate: 1.2, // Default average
        homeownersInsurance: 100,
        creditScore: 720,
        mortgageType: 'Conventional'
    });

    // Initialize with default calculation
    const getDefaultResult = (): AffordabilityResult => {
        const defaultInput: AffordabilityInput = {
            annualIncome: 80000,
            monthlyDebts: 500,
            downPayment: 20000,
            interestRate: 6.5,
            loanTermYears: 30,
            hoaFees: 0,
            propertyTaxRate: 1.2,
            homeownersInsurance: 100,
            creditScore: 720,
            mortgageType: 'Conventional'
        };
        return calculateAffordability(defaultInput);
    };

    const [result, setResult] = useState<AffordabilityResult>(getDefaultResult());
    const [selectedState, setSelectedState] = useState<string>('');

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const stateName = e.target.value;
        setSelectedState(stateName);
        const state = (statesData as StateData[]).find(s => s.name === stateName);
        if (state) {
            setInput(prev => ({ ...prev, propertyTaxRate: state.rate }));
        }
    };

    const performCalculation = () => {
        const res = calculateAffordability(input);
        setResult(res);
    };

    const handleInputChange = (field: keyof AffordabilityInput, value: any) => {
        setInput(prev => ({ ...prev, [field]: value }));
    };

    const resetToDefaults = () => {
        const defaults: AffordabilityInput = {
            annualIncome: 80000,
            monthlyDebts: 500,
            downPayment: 20000,
            interestRate: 6.5,
            loanTermYears: 30,
            hoaFees: 0,
            propertyTaxRate: 1.2,
            homeownersInsurance: 100,
            creditScore: 720,
            mortgageType: 'Conventional'
        };

        setInput(defaults);
        setSelectedState('');

        // Immediately recalculate with default values
        const res = calculateAffordability(defaults);
        setResult(res);
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
        doc.text('House Affordability Report', 14, 18);

        // Subtitle
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const today = new Date();
        const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
        doc.text(`Generated on ${formattedDate}`, 14, 26);

        // Reset text color
        doc.setTextColor(0, 0, 0);

        // Main Result Box
        doc.setFillColor(239, 246, 255); // Blue-50
        doc.setDrawColor(191, 219, 254); // Blue-200
        doc.roundedRect(14, 42, 182, 28, 3, 3, 'FD');

        doc.setFontSize(12);
        doc.setTextColor(30, 64, 175); // Blue-800
        doc.setFont('helvetica', 'normal');
        doc.text('You can afford a house up to:', 20, 52);

        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text(`$${result.maxHomePrice.toLocaleString()}`, 20, 62);

        // Input Details Section
        let yPos = 80;
        doc.setFillColor(248, 250, 252); // Slate-50
        doc.setDrawColor(226, 232, 240); // Slate-200
        doc.roundedRect(14, yPos - 5, 182, 50, 3, 3, 'FD');

        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59); // Slate-800
        doc.setFont('helvetica', 'bold');
        doc.text('Input Details', 20, yPos + 3);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105); // Slate-600

        const col1X = 20;
        const col2X = 110;
        let detailY = yPos + 12;

        const drawDetail = (label: string, value: string, x: number, y: number) => {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(15, 23, 42);
            doc.text(label, x, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(71, 85, 105);
            doc.text(value, x + 45, y);
        };

        drawDetail('Annual Income:', `$${input.annualIncome.toLocaleString()}`, col1X, detailY);
        drawDetail('Interest Rate:', `${input.interestRate}%`, col2X, detailY);
        detailY += 7;
        drawDetail('Monthly Debts:', `$${input.monthlyDebts.toLocaleString()}`, col1X, detailY);
        drawDetail('Loan Term:', `${input.loanTermYears} years`, col2X, detailY);
        detailY += 7;
        drawDetail('Down Payment:', `$${input.downPayment.toLocaleString()}`, col1X, detailY);
        drawDetail('Mortgage Type:', input.mortgageType, col2X, detailY);
        detailY += 7;
        drawDetail('Property Tax Rate:', `${input.propertyTaxRate}%`, col1X, detailY);
        drawDetail('Credit Score:', input.creditScore.toString(), col2X, detailY);

        // Monthly Payment Breakdown
        yPos = detailY + 15;
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(14, yPos - 5, 182, 45, 3, 3, 'FD');

        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.text('Monthly Payment Breakdown', 20, yPos + 3);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);

        let breakdownY = yPos + 12;
        drawDetail('Principal & Interest:', `$${result.breakdown.principalAndInterest.toLocaleString()}`, col1X, breakdownY);
        drawDetail('Property Tax:', `$${result.breakdown.propertyTax.toLocaleString()}`, col2X, breakdownY);
        breakdownY += 7;
        drawDetail('Home Insurance:', `$${result.breakdown.homeownersInsurance.toLocaleString()}`, col1X, breakdownY);
        if (result.breakdown.pmi > 0) {
            drawDetail('PMI:', `$${result.breakdown.pmi.toLocaleString()}`, col2X, breakdownY);
            breakdownY += 7;
        }

        // Total Monthly Payment
        breakdownY += 3;
        doc.setDrawColor(226, 232, 240);
        doc.line(20, breakdownY, 190, breakdownY);
        breakdownY += 7;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text('Total Monthly Payment:', col1X, breakdownY);
        doc.setTextColor(37, 99, 235); // Blue-600
        doc.text(`$${result.monthlyPayment.toLocaleString()}`, col2X, breakdownY);

        // Risk Assessment
        yPos = breakdownY + 15;
        const riskColor = result.riskLevel === 'Low' ? [220, 252, 231] :
            result.riskLevel === 'Medium' ? [254, 249, 195] : [254, 226, 226];
        const riskBorderColor = result.riskLevel === 'Low' ? [187, 247, 208] :
            result.riskLevel === 'Medium' ? [254, 240, 138] : [254, 202, 202];
        const riskTextColor = result.riskLevel === 'Low' ? [22, 101, 52] :
            result.riskLevel === 'Medium' ? [133, 77, 14] : [153, 27, 27];

        doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
        doc.setDrawColor(riskBorderColor[0], riskBorderColor[1], riskBorderColor[2]);
        doc.roundedRect(14, yPos - 5, 182, 35, 3, 3, 'FD');

        doc.setFontSize(12);
        doc.setTextColor(riskTextColor[0], riskTextColor[1], riskTextColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(`Affordability Health: ${result.riskLevel} Risk`, 20, yPos + 3);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Debt-to-Income Ratio (DTI): ${result.dti}%`, 20, yPos + 12);

        // Insights
        let insightY = yPos + 20;
        doc.setFontSize(9);
        result.insights.slice(0, 2).forEach((insight) => {
            doc.text(`• ${insight}`, 20, insightY);
            insightY += 5;
        });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text('This report is for informational purposes only and does not constitute financial advice.', 14, 285);

        // Save PDF
        const timestamp = Date.now();
        doc.save(`House_Affordability_Report_${timestamp}.pdf`);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Inputs */}
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Your Financial Details</h2>
                        <button
                            onClick={resetToDefaults}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reset
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual Income ($)</label>
                        <input
                            type="number"
                            value={input.annualIncome}
                            onChange={(e) => handleInputChange('annualIncome', Number(e.target.value))}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Debts ($)</label>
                        <input
                            type="number"
                            value={input.monthlyDebts}
                            onChange={(e) => handleInputChange('monthlyDebts', Number(e.target.value))}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Down Payment ($)</label>
                        <input
                            type="number"
                            value={input.downPayment}
                            onChange={(e) => handleInputChange('downPayment', Number(e.target.value))}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location (State)</label>
                        <select
                            value={selectedState}
                            onChange={handleStateChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select State (Auto-fills Tax Rate)</option>
                            {(statesData as StateData[]).map(state => (
                                <option key={state.name} value={state.name}>{state.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Loan Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interest Rate (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={input.interestRate}
                                onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Term (Years)</label>
                            <select
                                value={input.loanTermYears}
                                onChange={(e) => handleInputChange('loanTermYears', Number(e.target.value))}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value={15}>15 Years</option>
                                <option value={20}>20 Years</option>
                                <option value={30}>30 Years</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mortgage Type</label>
                        <select
                            value={input.mortgageType}
                            onChange={(e) => handleInputChange('mortgageType', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="Conventional">Conventional</option>
                            <option value="FHA">FHA</option>
                            <option value="VA">VA</option>
                        </select>
                    </div>
                </div>

                {/* Advanced Settings */}
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Advanced Settings</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Front-End DTI (%)</label>
                            <input
                                type="number"
                                placeholder={input.mortgageType === 'FHA' ? '31' : '28'}
                                value={input.frontEndDTI || ''}
                                onChange={(e) => handleInputChange('frontEndDTI', e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Back-End DTI (%)</label>
                            <input
                                type="number"
                                placeholder={input.mortgageType === 'FHA' ? '43' : '36'}
                                value={input.backEndDTI || ''}
                                onChange={(e) => handleInputChange('backEndDTI', e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PMI Rate (%)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder={input.mortgageType === 'FHA' ? '0.85' : '0.5'}
                                value={input.pmiRate !== undefined ? input.pmiRate : ''}
                                onChange={(e) => handleInputChange('pmiRate', e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Calculate Button */}
                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                    <CalculateButton onClick={performCalculation} label="Calculate Affordability" />
                </div>
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-7 space-y-6">
                {result && (
                    <>
                        <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg text-center">
                            <p className="text-lg opacity-90 mb-2">You can afford a house up to</p>
                            <h2 className="text-5xl font-bold mb-4">${result.maxHomePrice.toLocaleString()}</h2>
                            <p className="text-sm opacity-80">
                                Est. Monthly Payment: ${result.monthlyPayment.toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Monthly Breakdown</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Principal & Interest</span>
                                    <span className="font-medium text-gray-900 dark:text-white">${result.breakdown.principalAndInterest.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Property Tax ({input.propertyTaxRate}%)</span>
                                    <span className="font-medium text-gray-900 dark:text-white">${result.breakdown.propertyTax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Homeowners Insurance</span>
                                    <span className="font-medium text-gray-900 dark:text-white">${result.breakdown.homeownersInsurance.toLocaleString()}</span>
                                </div>
                                {result.breakdown.pmi > 0 && (
                                    <div className="flex justify-between text-sm text-orange-600 dark:text-orange-400">
                                        <span>PMI (Private Mortgage Insurance)</span>
                                        <span className="font-medium">${result.breakdown.pmi.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between font-bold">
                                    <span className="text-gray-900 dark:text-white">Total Monthly</span>
                                    <span className="text-blue-600 dark:text-blue-400">${result.monthlyPayment.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className={`p-4 rounded-xl border ${result.riskLevel === 'Low' ? 'bg-green-50 border-green-200 text-green-800' :
                            result.riskLevel === 'Medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                                'bg-red-50 border-red-200 text-red-800'
                            }`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Info size={20} />
                                <h4 className="font-bold">Affordability Health: {result.riskLevel} Risk</h4>
                            </div>
                            <p className="text-sm">
                                Debt-to-Income Ratio (DTI): <strong>{result.dti}%</strong>
                            </p>
                            <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                                {result.insights.map((insight, i) => (
                                    <li key={i}>{insight}</li>
                                ))}
                            </ul>
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
    );
}
