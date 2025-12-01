import React from 'react';
import type { Metadata } from 'next';
import AutoLoanCalculator from '@/components/AutoLoanCalculator';
import { Car, DollarSign, Percent, Calendar } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Auto Loan Calculator | Calculate Car Payments & Affordability',
    description: 'Free auto loan calculator to estimate monthly car payments or determine how much car you can afford. Includes trade-in value, sales tax, and fees.',
    keywords: 'auto loan calculator, car payment calculator, car affordability calculator, auto loan amortization, car loan interest calculator',
};

export default function AutoLoanCalculatorPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Auto Loan <span className="text-blue-600">Calculator</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Estimate your monthly car payments or find out how much vehicle you can afford based on your budget.
                    </p>
                </div>
                <div className="mb-16">
                    <AutoLoanCalculator />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Understanding Your Auto Loan</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">How to Use This Calculator</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Our Auto Loan Calculator offers two powerful modes to help you make the best car buying decision. Use &apos;By Vehicle Price&apos; if you have a specific car in mind and want to know the monthly payment. Use &apos;By Monthly Payment&apos; if you have a set budget and want to know the maximum vehicle price you can afford. You can also expand the &apos;Advanced Options&apos; to include sales tax, trade-in value, and other fees for a precise estimate.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Factors Affecting Your Car Payment</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Several variables impact your monthly auto loan payment: the vehicle price, your down payment, trade-in value, interest rate (APR), and the loan term. A larger down payment or trade-in reduces the principal amount, lowering your monthly payment. A lower interest rate saves you money over the life of the loan, while a longer loan term lowers monthly payments but increases the total interest paid.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Dealership vs. Direct Financing</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        When financing a car, you have two main options: dealership financing and direct lending. Dealership financing is convenient but may come with higher interest rates. Direct lending from a bank, credit union, or online lender often provides better rates and gives you more bargaining power at the dealership. It&apos;s recommended to get pre-approved for a loan before visiting the dealer.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Don&apos;t Forget About Fees</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        The sticker price isn&apos;t the only cost. Remember to account for sales tax, title and registration fees, and dealership documentation fees. These can add thousands to your total loan amount. Our calculator allows you to include these in your estimate to avoid surprises.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Auto Loan Tips</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg text-blue-600 mt-1">
                                        <Percent className="w-5 h-5" />
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-semibold text-gray-900">Check Your Credit</h4>
                                        <p className="text-sm text-gray-600">Your credit score significantly impacts your interest rate. Improve it before applying.</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 p-2 bg-green-50 rounded-lg text-green-600 mt-1">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-semibold text-gray-900">Larger Down Payment</h4>
                                        <p className="text-sm text-gray-600">Aim for at least 20% down to avoid being &apos;upside down&apos; on your loan.</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 p-2 bg-purple-50 rounded-lg text-purple-600 mt-1">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-semibold text-gray-900">Shorten the Term</h4>
                                        <p className="text-sm text-gray-600">Opt for the shortest term you can afford to save on interest.</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 p-2 bg-orange-50 rounded-lg text-orange-600 mt-1">
                                        <Car className="w-5 h-5" />
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-semibold text-gray-900">Trade-In Value</h4>
                                        <p className="text-sm text-gray-600">Know your trade-in&apos;s value beforehand to negotiate a fair price.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
