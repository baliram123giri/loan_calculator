"use client";

import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import CurrencyInput from './CurrencyInput';
import NumberInput from './NumberInput';
import AmortizationTable from './AmortizationTable';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AutoLoanCalculatorProps {
    title?: string;
}

const AutoLoanCalculator: React.FC<AutoLoanCalculatorProps> = ({ title = "Auto Loan Calculator" }) => {
    const [mode, setMode] = useState<'price' | 'monthly'>('price');
    const [vehiclePrice, setVehiclePrice] = useState<number>(35000);
    const [monthlyBudget, setMonthlyBudget] = useState<number>(600);
    const [downPayment, setDownPayment] = useState<number>(5000);
    const [tradeInValue, setTradeInValue] = useState<number>(0);
    const [amountOwedOnTrade, setAmountOwedOnTrade] = useState<number>(0);
    const [interestRate, setInterestRate] = useState<number>(5.5);
    const [loanTerm, setLoanTerm] = useState<number>(60);
    const [salesTaxRate, setSalesTaxRate] = useState<number>(0);
    const [fees, setFees] = useState<number>(0);
    const [includeTaxInLoan, setIncludeTaxInLoan] = useState<boolean>(true);
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

    const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
    const [totalLoanAmount, setTotalLoanAmount] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number>(0);
    const [payoffDate, setPayoffDate] = useState<string>('');
    const [amortizationSchedule, setAmortizationSchedule] = useState<any[]>([]);

    useEffect(() => {
        calculateLoan();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only calculate on mount, then wait for button click

    const calculateLoan = () => {
        let principal = 0;
        let calculatedMonthlyPayment = 0;
        const netTradeIn = tradeInValue - amountOwedOnTrade;
        const taxAmount = (vehiclePrice * salesTaxRate) / 100;
        const totalFees = fees + (includeTaxInLoan ? taxAmount : 0);

        if (mode === 'price') {
            principal = vehiclePrice + totalFees - downPayment - netTradeIn;
            if (principal <= 0) {
                setMonthlyPayment(0);
                setTotalLoanAmount(0);
                setTotalInterest(0);
                setTotalCost(0);
                setAmortizationSchedule([]);
                return;
            }
            const r = interestRate / 100 / 12;
            const n = loanTerm;
            calculatedMonthlyPayment = interestRate === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        } else {
            const r = interestRate / 100 / 12;
            const n = loanTerm;
            const maxLoanAmount = interestRate === 0 ? monthlyBudget * n : (monthlyBudget * (1 - Math.pow(1 + r, -n))) / r;
            const effectiveTaxRate = includeTaxInLoan ? salesTaxRate / 100 : 0;
            const calculatedPrice = (maxLoanAmount - fees + downPayment + netTradeIn) / (1 + effectiveTaxRate);
            setVehiclePrice(calculatedPrice > 0 ? calculatedPrice : 0);
            principal = maxLoanAmount;
            calculatedMonthlyPayment = monthlyBudget;
        }

        setMonthlyPayment(calculatedMonthlyPayment);
        setTotalLoanAmount(principal);

        const schedule = [];
        let balance = principal;
        let totalInt = 0;
        const r = interestRate / 100 / 12;
        const start = new Date(startDate);

        for (let i = 1; i <= loanTerm; i++) {
            const interest = balance * r;
            const principalPayment = calculatedMonthlyPayment - interest;
            balance -= principalPayment;
            if (balance < 0) balance = 0;
            totalInt += interest;
            const date = new Date(start);
            date.setMonth(start.getMonth() + i);
            schedule.push({
                month: i,
                date: date.toLocaleDateString(),
                payment: calculatedMonthlyPayment,
                principal: principalPayment,
                interest: interest,
                balance: balance,
                totalInterest: totalInt,
                totalPrincipal: principal - balance
            });
        }

        setTotalInterest(totalInt);
        setTotalCost(principal + totalInt);
        setAmortizationSchedule(schedule);
        const payoff = new Date(start);
        payoff.setMonth(start.getMonth() + loanTerm);
        setPayoffDate(payoff.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    };

    const resetToDefaults = () => {
        setMode('price');
        setVehiclePrice(35000);
        setMonthlyBudget(600);
        setDownPayment(5000);
        setTradeInValue(0);
        setAmountOwedOnTrade(0);
        setInterestRate(5.5);
        setLoanTerm(60);
        setSalesTaxRate(0);
        setFees(0);
        setIncludeTaxInLoan(true);
        setStartDate(new Date().toISOString().split('T')[0]);
        setShowAdvanced(false);
        // We might want to trigger calculation here or let user click calculate
        // For now, let's keep consistency and NOT calculate on reset, but reset values.
        // Wait, if values reset, old results might be misleading. 
        // Better to clear results or calculate new defaults. 
        // BondCalculator approach: set initial state.
        // Actually, let's trigger calculation after reset state update?
        // React state updates are async, so difficult.
        // Easiest: User clicks reset, then Calculate.
    };

    const donutData = {
        labels: ['Principal', 'Interest'],
        datasets: [{
            data: [totalLoanAmount, totalInterest],
            backgroundColor: ['#3B82F6', '#10B981'],
            borderColor: ['#2563EB', '#059669'],
            borderWidth: 1,
        }],
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                        <button
                            onClick={() => {
                                resetToDefaults();
                                setTimeout(calculateLoan, 0); // Hack to run after state update if we wanted auto-calc, but sticking to manual means just reset inputs.
                                // Actually user expects Reset to give clean slate. 
                            }}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reset
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                                <button onClick={() => setMode('price')} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all cursor-pointer ${mode === 'price' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                    By Vehicle Price
                                </button>
                                <button onClick={() => setMode('monthly')} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all cursor-pointer ${mode === 'monthly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                    By Monthly Payment
                                </button>
                            </div>
                            <div className="space-y-4">
                                {mode === 'price' ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Price</label>
                                        <CurrencyInput value={vehiclePrice} onChange={setVehiclePrice} placeholder="Enter vehicle price" />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Budget</label>
                                        <CurrencyInput value={monthlyBudget} onChange={setMonthlyBudget} placeholder="Enter monthly budget" />
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment</label>
                                        <CurrencyInput value={downPayment} onChange={setDownPayment} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Trade-in Value</label>
                                        <CurrencyInput value={tradeInValue} onChange={setTradeInValue} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                                        <NumberInput value={interestRate} onChange={setInterestRate} suffix="%" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (Months)</label>
                                        <NumberInput value={loanTerm} onChange={setLoanTerm} suffix="mo" />
                                    </div>
                                </div>
                                <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm mt-2 cursor-pointer">
                                    {showAdvanced ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                                    {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options (Taxes & Fees)'}
                                </button>
                                {showAdvanced && (
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-4 mt-2 border border-gray-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Sales Tax (%)</label>
                                                <NumberInput value={salesTaxRate} onChange={setSalesTaxRate} suffix="%" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Title, Reg & Other Fees</label>
                                                <CurrencyInput value={fees} onChange={setFees} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Owed on Trade-in</label>
                                            <CurrencyInput value={amountOwedOnTrade} onChange={setAmountOwedOnTrade} />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="checkbox" id="includeTax" checked={includeTaxInLoan} onChange={(e) => setIncludeTaxInLoan(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                                            <label htmlFor="includeTax" className="text-sm text-gray-700 cursor-pointer">Include taxes and fees in loan</label>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={calculateLoan}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg transform transition-all active:scale-[0.98] shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                                >
                                    Calculate Auto Loan 🚀
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Loan Summary</h3>
                        <div className="mb-8 text-center">
                            <p className="text-sm text-gray-500 mb-1">{mode === 'price' ? 'Estimated Monthly Payment' : 'Estimated Vehicle Price'}</p>
                            <div className="text-4xl font-bold text-blue-600">
                                {mode === 'price' ? `$${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `$${vehiclePrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                            </div>
                            {mode === 'monthly' && <p className="text-sm text-gray-500 mt-1">with ${monthlyBudget}/mo budget</p>}
                        </div>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Loan Amount</span>
                                <span className="font-semibold text-gray-900">${totalLoanAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Interest</span>
                                <span className="font-semibold text-gray-900">${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Cost (Loan + Interest)</span>
                                <span className="font-semibold text-gray-900">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Payoff Date</span>
                                <span className="font-semibold text-gray-900">{payoffDate}</span>
                            </div>
                        </div>
                        <div className="h-64 flex items-center justify-center">
                            <Doughnut data={donutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } } }} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-12">
                <AmortizationTable schedule={amortizationSchedule} />
            </div>
        </>
    );
};

export default AutoLoanCalculator;
