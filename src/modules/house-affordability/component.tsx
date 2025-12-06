'use client';

import React, { useState, useEffect } from 'react';
import { calculateAffordability } from './logic';
import { AffordabilityInput, AffordabilityResult, StateData } from './schema';
import statesData from './states.json';
import { ChevronDown, ChevronUp, Info, RotateCcw } from 'lucide-react';
import CurrencyInput from '@/components/CurrencyInput';
import NumberInput from '@/components/NumberInput';

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

    const [result, setResult] = useState<AffordabilityResult | null>(null);
    const [selectedState, setSelectedState] = useState<string>('');

    const handleCalculate = () => {
        const res = calculateAffordability(input);
        setResult(res);
    };

    useEffect(() => {
        handleCalculate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const stateName = e.target.value;
        setSelectedState(stateName);
        const state = (statesData as StateData[]).find(s => s.name === stateName);
        if (state) {
            setInput(prev => ({ ...prev, propertyTaxRate: state.rate }));
        }
    };

    const handleInputChange = (field: keyof AffordabilityInput, value: any) => {
        setInput(prev => ({ ...prev, [field]: value }));
    };

    const resetToDefaults = () => {
        setInput({
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
        });
        setSelectedState('');
        setResult(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                House Affordability Calculator
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Your Details</h2>
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
                            <CurrencyInput
                                value={input.annualIncome}
                                onChange={(val) => handleInputChange('annualIncome', val)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Debts ($)</label>
                            <CurrencyInput
                                value={input.monthlyDebts}
                                onChange={(val) => handleInputChange('monthlyDebts', val)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Down Payment ($)</label>
                            <CurrencyInput
                                value={input.downPayment}
                                onChange={(val) => handleInputChange('downPayment', val)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location (State)</label>
                            <select
                                value={selectedState}
                                onChange={handleStateChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
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
                                <NumberInput
                                    value={input.interestRate}
                                    onChange={(val) => handleInputChange('interestRate', val)}
                                    suffix="%"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Term (Years)</label>
                                <select
                                    value={input.loanTermYears}
                                    onChange={(e) => handleInputChange('loanTermYears', Number(e.target.value))}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
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
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
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
                                <NumberInput
                                    value={input.frontEndDTI ?? (input.mortgageType === 'FHA' ? 31 : 28)}
                                    onChange={(val) => handleInputChange('frontEndDTI', val)}
                                    suffix="%"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Back-End DTI (%)</label>
                                <NumberInput
                                    value={input.backEndDTI ?? (input.mortgageType === 'FHA' ? 43 : (input.mortgageType === 'VA' ? 41 : 36))}
                                    onChange={(val) => handleInputChange('backEndDTI', val)}
                                    suffix="%"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PMI Rate (%)</label>
                                <NumberInput
                                    value={input.pmiRate ?? (input.mortgageType === 'FHA' ? 0.85 : 0.5)}
                                    onChange={(val) => handleInputChange('pmiRate', val)}
                                    suffix="%"
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleCalculate}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transform transition-all active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-6"
                    >
                        Calculate Affordability 🚀
                    </button>
                </div>

                {/* Results */}
                <div className="space-y-6">
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
