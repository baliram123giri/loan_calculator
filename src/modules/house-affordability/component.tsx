'use client';

import React, { useState, useEffect } from 'react';
import { calculateAffordability } from './logic';
import { AffordabilityInput, AffordabilityResult, StateData } from './schema';
import statesData from './states.json';
import { ChevronDown, ChevronUp, Info, RotateCcw } from 'lucide-react';

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

    useEffect(() => {
        const res = calculateAffordability(input);
        setResult(res);
    }, [input]);

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
