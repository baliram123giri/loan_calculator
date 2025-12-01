'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { calculateEMI, EMIResult } from '@/lib/calc/emi';
import CurrencyInput from '@/components/CurrencyInput';
import NumberInput from '@/components/NumberInput';
import { ChevronDown, ChevronUp, RefreshCw, Calendar, DollarSign, Percent, Info } from 'lucide-react';
import ExportButton from '@/components/ExportButton';
import AmortizationTable from '@/components/AmortizationTable';

const ChartBreakup = dynamic(() => import('@/components/ChartBreakup'), { ssr: false });
const ChartBalance = dynamic(() => import('@/components/ChartBalance'), { ssr: false });

interface DownPaymentResult extends EMIResult {
    monthlyTax: number;
    monthlyInsurance: number;
    monthlyHOA: number;
    monthlyPMI: number;
    totalMonthlyPayment: number;
    closingCostsAmount: number;
    cashToClose: number;
    loanAmount: number;
}

export default function DownPaymentCalculator() {
    // --- State ---
    const [homePrice, setHomePrice] = useState(300000);
    const [downPayment, setDownPayment] = useState(60000);
    const [downPaymentPercent, setDownPaymentPercent] = useState(20);
    const [interestRate, setInterestRate] = useState(6.5);
    const [loanTermYears, setLoanTermYears] = useState(30);
    const [startDate, setStartDate] = useState(new Date());

    // Closing Costs
    const [closingCostsPercent, setClosingCostsPercent] = useState(3);
    const [closingCostsAmount, setClosingCostsAmount] = useState(9000);
    const [financeClosingCosts, setFinanceClosingCosts] = useState(false);

    // Advanced
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [propertyTaxRate, setPropertyTaxRate] = useState(1.2); // Annual %
    const [homeInsurance, setHomeInsurance] = useState(100); // Monthly
    const [hoaFees, setHoaFees] = useState(0); // Monthly
    const [pmiRate, setPmiRate] = useState(0.5); // Annual % if DP < 20%

    // --- Effects for Linked Inputs ---

    // Update Down Payment Amount when Percent changes
    const handleDownPaymentPercentChange = (val: number) => {
        setDownPaymentPercent(val);
        setDownPayment((homePrice * val) / 100);
    };

    // Update Down Payment Percent when Amount changes
    const handleDownPaymentAmountChange = (val: number) => {
        setDownPayment(val);
        setDownPaymentPercent((val / homePrice) * 100);
    };

    // Update Closing Costs Amount when Percent changes
    const handleClosingCostsPercentChange = (val: number) => {
        setClosingCostsPercent(val);
        setClosingCostsAmount((homePrice * val) / 100);
    };

    // Update Closing Costs Percent when Amount changes
    const handleClosingCostsAmountChange = (val: number) => {
        setClosingCostsAmount(val);
        setClosingCostsPercent((val / homePrice) * 100);
    };

    // Update amounts when Home Price changes
    useEffect(() => {
        setDownPayment((homePrice * downPaymentPercent) / 100);
        setClosingCostsAmount((homePrice * closingCostsPercent) / 100);
    }, [homePrice]);


    // --- Calculation ---
    const result: DownPaymentResult = useMemo(() => {
        let loanPrincipal = homePrice - downPayment;

        if (financeClosingCosts) {
            loanPrincipal += closingCostsAmount;
        }

        // Prevent negative loan
        if (loanPrincipal < 0) loanPrincipal = 0;

        const emiRes = calculateEMI(
            loanPrincipal,
            interestRate,
            loanTermYears * 12,
            [],
            startDate
        );

        // Monthly Extras
        const monthlyTax = (homePrice * (propertyTaxRate / 100)) / 12;

        // PMI Calculation
        // Usually PMI applies if LTV > 80% (Down Payment < 20%)
        // PMI is calculated on the Loan Amount
        let monthlyPMI = 0;
        if (downPaymentPercent < 20) {
            monthlyPMI = (loanPrincipal * (pmiRate / 100)) / 12;
        }

        const totalMonthlyPayment = emiRes.emi + monthlyTax + homeInsurance + hoaFees + monthlyPMI;

        const cashToClose = financeClosingCosts ? downPayment : downPayment + closingCostsAmount;

        return {
            ...emiRes,
            monthlyTax,
            monthlyInsurance: homeInsurance,
            monthlyHOA: hoaFees,
            monthlyPMI,
            totalMonthlyPayment,
            closingCostsAmount,
            cashToClose,
            loanAmount: loanPrincipal
        };
    }, [
        homePrice, downPayment, downPaymentPercent, interestRate, loanTermYears, startDate,
        closingCostsAmount, financeClosingCosts, propertyTaxRate, homeInsurance, hoaFees, pmiRate
    ]);

    // --- Comparison Logic ---
    const comparisonScenarios = useMemo(() => {
        const scenarios = [3.5, 10, 20]; // Percentages
        return scenarios.map(pct => {
            const dp = (homePrice * pct) / 100;
            const loan = homePrice - dp; // Assuming closing costs not financed for simplicity in comparison or consistent with main toggle
            // Let's keep comparison simple: standard loan, no financed costs to show pure down payment impact

            const r = interestRate / 12 / 100;
            const n = loanTermYears * 12;
            let emi = 0;
            if (r === 0) {
                emi = loan / n;
            } else {
                const pow = Math.pow(1 + r, n);
                emi = (loan * r * pow) / (pow - 1);
            }

            let pmi = 0;
            if (pct < 20) {
                pmi = (loan * (pmiRate / 100)) / 12;
            }

            return {
                percent: pct,
                downPayment: dp,
                monthlyPayment: emi + pmi, // Principal + Interest + PMI
                pmi: pmi,
                totalInterest: (emi * n) - loan
            };
        });
    }, [homePrice, interestRate, loanTermYears, pmiRate]);


    const handleReset = () => {
        setHomePrice(300000);
        setDownPaymentPercent(20);
        setDownPayment(60000);
        setInterestRate(6.5);
        setLoanTermYears(30);
        setStartDate(new Date());
        setClosingCostsPercent(3);
        setClosingCostsAmount(9000);
        setFinanceClosingCosts(false);
        setPropertyTaxRate(1.2);
        setHomeInsurance(100);
        setHoaFees(0);
        setPmiRate(0.5);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Inputs */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <DollarSign className="text-blue-600" />
                            Loan Details
                        </h2>
                        <button
                            onClick={handleReset}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Reset Calculator"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Home Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Home Price
                            </label>
                            <CurrencyInput
                                value={homePrice}
                                onChange={setHomePrice}
                            />
                        </div>

                        {/* Down Payment */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Down Payment ($)
                                </label>
                                <CurrencyInput
                                    value={downPayment}
                                    onChange={handleDownPaymentAmountChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Percent (%)
                                </label>
                                <NumberInput
                                    value={downPaymentPercent}
                                    onChange={handleDownPaymentPercentChange}
                                    suffix="%"
                                    max={100}
                                />
                            </div>
                        </div>

                        {/* Interest Rate & Term */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Interest Rate
                                </label>
                                <NumberInput
                                    value={interestRate}
                                    onChange={setInterestRate}
                                    suffix="%"
                                    max={100}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Loan Term
                                </label>
                                <NumberInput
                                    value={loanTermYears}
                                    onChange={setLoanTermYears}
                                    suffix="Years"
                                    max={50}
                                />
                            </div>
                        </div>

                        {/* Closing Costs */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
                                    Closing Costs
                                    <div className="group relative">
                                        <Info size={14} className="text-gray-400 cursor-help" />
                                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                                            Fees for processing the loan (appraisal, title, etc.). Typically 2-5% of home price.
                                        </div>
                                    </div>
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <CurrencyInput
                                    value={closingCostsAmount}
                                    onChange={handleClosingCostsAmountChange}
                                    className="bg-white dark:bg-gray-900"
                                />
                                <NumberInput
                                    value={closingCostsPercent}
                                    onChange={handleClosingCostsPercentChange}
                                    suffix="%"
                                    max={20}
                                    className="bg-white dark:bg-gray-900"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="financeClosingCosts"
                                    checked={financeClosingCosts}
                                    onChange={(e) => setFinanceClosingCosts(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor="financeClosingCosts" className="text-sm text-gray-700 dark:text-gray-300">
                                    Include Closing Costs in Loan
                                </label>
                            </div>
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Start Date
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar size={16} className="text-gray-500" />
                                </div>
                                <input
                                    type="date"
                                    value={startDate.toISOString().split('T')[0]}
                                    onChange={(e) => setStartDate(new Date(e.target.value))}
                                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Advanced Options Toggle */}
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors w-full justify-center py-2 mt-4"
                    >
                        {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                    </button>

                    {/* Advanced Options Content */}
                    {showAdvanced && (
                        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 mt-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Property Tax (Annual %)</label>
                                <NumberInput
                                    value={propertyTaxRate}
                                    onChange={setPropertyTaxRate}
                                    suffix="%"
                                    step={0.1}
                                    className="text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Home Insurance ($/mo)</label>
                                <CurrencyInput
                                    value={homeInsurance}
                                    onChange={setHomeInsurance}
                                    className="text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">HOA Fees ($/mo)</label>
                                <CurrencyInput
                                    value={hoaFees}
                                    onChange={setHoaFees}
                                    className="text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">PMI Rate (Annual %)</label>
                                <NumberInput
                                    value={pmiRate}
                                    onChange={setPmiRate}
                                    suffix="%"
                                    step={0.1}
                                    className="text-sm"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Applied if Down Payment &lt; 20%</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-8 space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                        <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Monthly Payment</p>
                        <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">${result.totalMonthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">
                            Principal & Interest: ${result.emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                        <p className="text-sm text-green-600 dark:text-green-400 mb-1">Cash to Close</p>
                        <p className="text-3xl font-bold text-green-900 dark:text-green-100">${result.cashToClose.toLocaleString()}</p>
                        <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">
                            Down Payment + {financeClosingCosts ? '0 (Financed)' : 'Closing Costs'}
                        </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                        <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Loan Amount</p>
                        <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">${result.loanAmount.toLocaleString()}</p>
                        <p className="text-xs text-purple-600/80 dark:text-purple-400/80 mt-1">
                            {financeClosingCosts ? 'Includes Closing Costs' : 'Base Loan Amount'}
                        </p>
                    </div>
                </div>

                {/* Comparison Section */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Down Payment Comparison</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {comparisonScenarios.map((scenario) => (
                            <div
                                key={scenario.percent}
                                className={`p-4 rounded-xl border ${Math.abs(scenario.percent - downPaymentPercent) < 0.1
                                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 ring-1 ring-blue-500'
                                    : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-900 dark:text-white">{scenario.percent}% Down</span>
                                    {scenario.pmi > 0 && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">PMI</span>}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Upfront:</span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">${scenario.downPayment.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Monthly (P&I+PMI):</span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">${scenario.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <span>Total Interest:</span>
                                        <span>${scenario.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Charts & Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Monthly Payment Breakdown</h3>
                        <div className="mb-6 w-full h-[300px]">
                            <ChartBreakup
                                data={[
                                    { name: 'Principal & Interest', value: result.emi, color: '#3B82F6' },
                                    { name: 'Property Tax', value: result.monthlyTax, color: '#22C55E' },
                                    { name: 'Home Insurance', value: result.monthlyInsurance, color: '#A855F7' },
                                    ...(result.monthlyPMI > 0 ? [{ name: 'PMI', value: result.monthlyPMI, color: '#F59E0B' }] : []),
                                    ...(result.monthlyHOA > 0 ? [{ name: 'HOA Fees', value: result.monthlyHOA, color: '#6B7280' }] : [])
                                ]}
                                legendType='none'
                                centerLabel="Total"
                                centerValue={`$${result.totalMonthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                                variant="donut"
                            />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Principal & Interest</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">${result.emi.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Property Tax</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">${result.monthlyTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Home Insurance</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">${result.monthlyInsurance.toLocaleString()}</span>
                            </div>
                            {result.monthlyPMI > 0 && (
                                <div className="flex justify-between items-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">PMI (Mortgage Insurance)</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">${result.monthlyPMI.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                </div>
                            )}
                            {result.monthlyHOA > 0 && (
                                <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">HOA Fees</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">${result.monthlyHOA.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 h-96">
                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Balance Over Time</h3>
                        <ChartBalance data={result.amortization} />
                    </div>
                </div>

                {/* Amortization Table */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex flex-col gap-1 w-full lg:w-auto">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Amortization Schedule</h3>
                        </div>
                        <div className="flex-shrink-0 w-full lg:w-auto">
                            <ExportButton
                                result={result}
                                principal={result.loanAmount}
                                rate={interestRate}
                                tenureMonths={loanTermYears * 12}
                                currencySymbol="$"
                            />
                        </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        <AmortizationTable schedule={result.amortization} currencySymbol="$" />
                    </div>
                </div>
            </div>
        </div>
    );
}
