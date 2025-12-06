"use client";

import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import CurrencyInput from './CurrencyInput';
import NumberInput from './NumberInput';
import { Info, RotateCcw, ChevronDown, ChevronUp, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
);

const AutoLeaseCalculator = () => {
    // Inputs
    const [msrp, setMsrp] = useState<number>(35000);
    const [negotiatedPrice, setNegotiatedPrice] = useState<number>(33500);
    const [downPayment, setDownPayment] = useState<number>(3000);
    const [tradeInValue, setTradeInValue] = useState<number>(0);
    const [salesTaxRate, setSalesTaxRate] = useState<number>(7.5);
    const [leaseTerm, setLeaseTerm] = useState<number>(36);
    const [moneyFactor, setMoneyFactor] = useState<number>(0.0025);
    const [useApr, setUseApr] = useState<boolean>(false);
    const [apr, setApr] = useState<number>(6.0);

    // Changed: Residual Value is now in Dollars
    const [residualValue, setResidualValue] = useState<number>(20300); // Default ~58% of 35k

    const [annualMileage, setAnnualMileage] = useState<number>(12000);
    const [mileagePenalty, setMileagePenalty] = useState<number>(0.25);
    const [fees, setFees] = useState<number>(500);

    // New Options
    const [isTaxMonthly, setIsTaxMonthly] = useState<boolean>(true);
    const [areFeesUpfront, setAreFeesUpfront] = useState<boolean>(true);

    // Results
    const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
    const [monthlyTax, setMonthlyTax] = useState<number>(0);
    const [totalLeaseCost, setTotalLeaseCost] = useState<number>(0);
    const [depreciationFee, setDepreciationFee] = useState<number>(0);
    const [rentCharge, setRentCharge] = useState<number>(0);
    const [financeCharge, setFinanceCharge] = useState<number>(0);
    const [upfrontTax, setUpfrontTax] = useState<number>(0);

    // AI Suggestions
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        calculateLease();
        generateSuggestions();
    }, [msrp, negotiatedPrice, downPayment, tradeInValue, salesTaxRate, leaseTerm, moneyFactor, useApr, apr, residualValue, annualMileage, fees, isTaxMonthly, areFeesUpfront]);

    const calculateLease = () => {
        // 1. Capitalized Cost
        // If fees are NOT upfront, they are added to the cap cost
        const grossCapCost = negotiatedPrice + (areFeesUpfront ? 0 : fees);

        // If taxes are NOT monthly (i.e., upfront), they might be added to cap cost or paid upfront.
        // Usually, "Upfront Tax" is paid at drive-off. If rolled in, it's added to cap cost.
        // For simplicity, let's assume "Upfront" means paid at drive-off (out of pocket).
        // If user wants to roll it in, that's a "Zero Drive-off" scenario which is more complex.
        // Let's stick to: Upfront = Paid at signing. Monthly = Added to payment.

        const capCostReduction = downPayment + tradeInValue;
        const adjustedCapCost = grossCapCost - capCostReduction;

        // 2. Residual Value (Now directly from input)
        // const residual = msrp * (residualValuePercent / 100); 
        // setResidualValue(residual); 

        // 3. Depreciation Fee
        const depreciation = (adjustedCapCost - residualValue) / leaseTerm;
        setDepreciationFee(depreciation);

        // 4. Rent Charge (Finance Fee)
        const mf = useApr ? apr / 2400 : moneyFactor;
        const rent = (adjustedCapCost + residualValue) * mf;
        setRentCharge(rent);

        // 5. Monthly Payment (Pre-Tax)
        const baseMonthlyPayment = depreciation + rent;

        // 6. Taxes
        let monthlyTaxAmount = 0;
        let upfrontTaxAmount = 0;

        if (isTaxMonthly) {
            // Most common: Tax on monthly payment
            monthlyTaxAmount = baseMonthlyPayment * (salesTaxRate / 100);
        } else {
            // Upfront Tax: Usually on the Total Lease Payments OR Total Vehicle Price depending on state.
            // Let's use "Tax on Total Lease Payments" (Depreciation + Rent + Down) as a middle ground, 
            // or "Tax on Selling Price" (Texas style).
            // Let's go with Tax on Selling Price as it's the distinct "Upfront" alternative.
            upfrontTaxAmount = negotiatedPrice * (salesTaxRate / 100);
        }

        setMonthlyTax(monthlyTaxAmount);
        setUpfrontTax(upfrontTaxAmount);

        // 7. Total Monthly Payment
        const totalMonthly = baseMonthlyPayment + monthlyTaxAmount;
        setMonthlyPayment(totalMonthly);

        // 8. Total Lease Cost
        // (Monthly * Term) + Down + Trade + Fees (if upfront) + Upfront Tax
        const totalCost = (totalMonthly * leaseTerm) + downPayment + tradeInValue + (areFeesUpfront ? fees : 0) + upfrontTaxAmount;
        setTotalLeaseCost(totalCost);

        setFinanceCharge(rent * leaseTerm);
    };

    const generateSuggestions = () => {
        const tips: string[] = [];
        const currentMF = useApr ? apr / 2400 : moneyFactor;
        const equivalentAPR = currentMF * 2400;

        if (equivalentAPR > 8) {
            tips.push(`Your Money Factor translates to an APR of ${equivalentAPR.toFixed(2)}%. This is relatively high. If you have good credit (720+), try negotiating for a lower rate.`);
        }

        const residualPercent = (residualValue / msrp) * 100;
        if (residualPercent < 50 && leaseTerm <= 36) {
            tips.push(`The residual value is quite low (${residualPercent.toFixed(1)}%). This increases your monthly payments. Ensure this aligns with market values.`);
        }

        if (!isTaxMonthly && salesTaxRate > 0) {
            tips.push("Paying taxes upfront significantly increases your initial cost. Ensure you have the cash on hand.");
        }

        if (downPayment > (negotiatedPrice * 0.2)) {
            tips.push("Caution: Putting a large down payment on a lease is risky. If the asset is lost or damaged early, you likely won't get that money back.");
        }

        if (negotiatedPrice >= msrp) {
            tips.push("You are paying List Price or above. Try to negotiate the price down. Even a 5% discount can significantly lower your monthly payment.");
        }

        setSuggestions(tips);
    };

    const resetToDefaults = () => {
        setMsrp(35000);
        setNegotiatedPrice(33500);
        setDownPayment(3000);
        setTradeInValue(0);
        setSalesTaxRate(7.5);
        setLeaseTerm(36);
        setMoneyFactor(0.0025);
        setUseApr(false);
        setApr(6.0);
        setResidualValue(20300);
        setAnnualMileage(12000);
        setFees(500);
        setIsTaxMonthly(true);
        setAreFeesUpfront(true);
    };

    // Chart Data
    const donutData = {
        labels: ['Depreciation', 'Rent Charge', 'Taxes', 'Fees'],
        datasets: [
            {
                data: [
                    depreciationFee * leaseTerm,
                    rentCharge * leaseTerm,
                    (monthlyTax * leaseTerm) + upfrontTax,
                    fees
                ],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)', // Blue
                    'rgba(16, 185, 129, 0.8)', // Green
                    'rgba(245, 158, 11, 0.8)', // Amber
                    'rgba(107, 114, 128, 0.8)', // Gray
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(107, 114, 128, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Inputs Section */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Info className="w-5 h-5 mr-2 text-blue-600" />
                                Lease Details
                            </h3>
                            <button
                                onClick={resetToDefaults}
                                className="flex items-center text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                            >
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Reset
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">List Price (MSRP)</label>
                                <CurrencyInput value={msrp} onChange={setMsrp} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Agreed Price</label>
                                <CurrencyInput value={negotiatedPrice} onChange={setNegotiatedPrice} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment</label>
                                    <CurrencyInput value={downPayment} onChange={setDownPayment} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trade-in Credit</label>
                                    <CurrencyInput value={tradeInValue} onChange={setTradeInValue} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lease Term</label>
                                    <select
                                        value={leaseTerm}
                                        onChange={(e) => setLeaseTerm(Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    >
                                        <option value={24}>24 Months</option>
                                        <option value={36}>36 Months</option>
                                        <option value={39}>39 Months</option>
                                        <option value={48}>48 Months</option>
                                        <option value={60}>60 Months</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sales Tax (%)</label>
                                    <NumberInput value={salesTaxRate} onChange={setSalesTaxRate} suffix="%" />
                                </div>
                            </div>

                            {/* Tax Method Toggle - Redesigned */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Payment Method</label>
                                <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => setIsTaxMonthly(true)}
                                        className={`py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${isTaxMonthly
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Monthly (Rolled In)
                                    </button>
                                    <button
                                        onClick={() => setIsTaxMonthly(false)}
                                        className={`py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${!isTaxMonthly
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Upfront
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">Interest Rate Type</label>
                                    <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                                        <button
                                            onClick={() => setUseApr(false)}
                                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${!useApr ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Money Factor
                                        </button>
                                        <button
                                            onClick={() => setUseApr(true)}
                                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${useApr ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            APR
                                        </button>
                                    </div>
                                </div>
                                {useApr ? (
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Annual Percentage Rate (APR)</label>
                                        <NumberInput value={apr} onChange={setApr} suffix="%" />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Money Factor (e.g., 0.0025)</label>
                                        <NumberInput value={moneyFactor} onChange={setMoneyFactor} decimalScale={5} />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-gray-700">Residual Value ($)</label>
                                        <span className="text-xs text-gray-500">
                                            {((residualValue / msrp) * 100).toFixed(1)}% of List Price
                                        </span>
                                    </div>
                                    <CurrencyInput value={residualValue} onChange={setResidualValue} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Acquisition/Doc Fees</label>
                                    <CurrencyInput value={fees} onChange={setFees} />
                                </div>
                                <div className="flex items-end pb-2">
                                    <button
                                        onClick={() => setAreFeesUpfront(!areFeesUpfront)}
                                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                                    >
                                        {areFeesUpfront ? 'Pay Upfront' : 'Roll into Loan'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Main Result Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium mb-1">Estimated Monthly Payment</p>
                                    <h2 className="text-4xl font-bold">
                                        ${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </h2>
                                    <p className="text-blue-200 text-xs mt-1">
                                        {isTaxMonthly
                                            ? `(Includes $${monthlyTax.toFixed(2)} tax)`
                                            : '(Tax paid upfront)'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-blue-100 text-sm font-medium mb-1">Total Lease Cost</p>
                                    <p className="text-2xl font-bold">
                                        ${totalLeaseCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                            </div>
                            {upfrontTax > 0 && (
                                <div className="mt-4 pt-4 border-t border-blue-500/30">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-blue-100">Upfront Taxes Due</span>
                                        <span className="font-bold">${upfrontTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* AI Suggestions */}
                        <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
                            <h4 className="text-purple-800 font-bold flex items-center mb-3">
                                <Sparkles className="w-5 h-5 mr-2" />
                                AI Smart Tips
                            </h4>
                            <div className="space-y-2">
                                {suggestions.length > 0 ? (
                                    suggestions.map((tip, index) => (
                                        <div key={index} className="flex items-start gap-2 text-sm text-purple-900">
                                            <div className="min-w-[4px] h-[4px] rounded-full bg-purple-500 mt-2" />
                                            <p>{tip}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-purple-700">Enter your lease details to get personalized insights.</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Breakdown Chart */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">Total Cost Breakdown</h4>
                                <div className="h-48 flex justify-center">
                                    <Doughnut data={donutData} options={{ maintainAspectRatio: false }} />
                                </div>
                            </div>

                            {/* Detailed Stats */}
                            <div className="space-y-3">
                                <div className="flex justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-sm text-gray-600">Residual Value</span>
                                    <span className="text-sm font-semibold text-gray-900">${residualValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="flex justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-sm text-gray-600">Total Finance Charge</span>
                                    <span className="text-sm font-semibold text-gray-900">${financeCharge.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="flex justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-sm text-gray-600">Total Depreciation</span>
                                    <span className="text-sm font-semibold text-gray-900">${(depreciationFee * leaseTerm).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="flex justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-sm text-gray-600">Equivalent APR</span>
                                    <span className="text-sm font-semibold text-gray-900">{(useApr ? apr : moneyFactor * 2400).toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutoLeaseCalculator;
