import React from 'react';
import type { Metadata } from 'next';
import DownPaymentCalculator from '@/components/DownPaymentCalculator';

export const metadata: Metadata = {
    title: 'Down Payment Calculator | Calculate Cash to Close & PMI',
    description: 'Free Down Payment Calculator. Estimate your upfront cash to close, monthly payments, and see how different down payment amounts affect your loan and PMI.',
    keywords: 'down payment calculator, cash to close calculator, mortgage down payment, PMI calculator, closing costs calculator, home buying calculator',
    openGraph: {
        title: 'Down Payment Calculator | Calculate Cash to Close & PMI',
        description: 'Calculate your total cash to close and see how your down payment affects your monthly mortgage payment and PMI.',
        type: 'website',
    }
};

export default function DownPaymentCalculatorPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Down Payment Calculator
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Determine how much you should put down on a house and calculate your total cash to close, including closing costs.
                </p>
            </div>

            <DownPaymentCalculator />

            {/* SEO Content */}
            <div className="max-w-4xl mx-auto mt-16 space-y-12">
                {/* Introduction Section */}
                <section className="prose dark:prose-invert max-w-none">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Understanding Your Down Payment
                    </h2>

                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        A down payment is the portion of the home's purchase price that you pay upfront. It is one of the most significant costs when buying a home.
                        The amount you put down affects your monthly mortgage payment, your interest rate, and whether you need to pay Private Mortgage Insurance (PMI).
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        While 20% is often cited as the "gold standard" for a down payment because it avoids PMI, many homebuyers purchase homes with much less—often as low as 3% or 3.5% for conventional and FHA loans respectively.
                    </p>
                </section>

                {/* Closing Costs Section */}
                <section className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Don't Forget Closing Costs!
                    </h3>

                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        Your "Cash to Close" is more than just your down payment. You also need to pay closing costs, which typically range from <strong>2% to 5%</strong> of the loan amount.
                        These include:
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Lender Fees</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Origination fees, application fees, and underwriting fees charged by your lender.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Third-Party Fees</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Appraisal, title insurance, and credit report fees paid to other service providers.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Prepaid Items</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Property taxes, homeowner's insurance, and HOA fees paid in advance.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Financing Options</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Some loan programs allow you to roll these costs into your loan amount, reducing your upfront cash requirement.
                            </p>
                        </div>
                    </div>
                </section>

                {/* PMI Section */}
                <section className="prose dark:prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        What is PMI?
                    </h3>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        Private Mortgage Insurance (PMI) is a type of insurance that protects the lender if you stop making payments.
                        It is usually required if your down payment is less than 20% of the home's value.
                    </p>

                    <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800 mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">How to Remove PMI</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            PMI isn't permanent! You can typically remove it when:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                            <li>You reach 20% equity in your home.</li>
                            <li>You refinance into a new loan after your home's value has increased.</li>
                            <li>You reach the midpoint of your loan term (automatic termination).</li>
                        </ul>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="prose dark:prose-invert max-w-none">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        Common Questions
                    </h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Is it better to put 20% down?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Putting 20% down avoids PMI and lowers your monthly payment, but it requires a large amount of cash.
                                If waiting to save 20% means you'll miss out on home appreciation or pay rent for years, buying sooner with a smaller down payment might be a better financial decision.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Can I borrow my down payment?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Generally, lenders require the down payment to come from your own funds or a gift from a family member.
                                You typically cannot take out a personal loan for a down payment. However, there are down payment assistance programs available for first-time buyers.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                What is the minimum down payment?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                For a conventional loan, the minimum is usually 3% for first-time buyers. FHA loans require 3.5%.
                                VA loans and USDA loans often allow 0% down for eligible borrowers.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Related Tools Section */}
                <section className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        More Home Buying Tools
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <a
                            href="/calculators/mortgage"
                            className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                        >
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Mortgage Calculator</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Standard mortgage payment estimation</p>
                        </a>
                        <a
                            href="/calculators/house-affordability"
                            className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                        >
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">House Affordability</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Find out how much house you can afford</p>
                        </a>
                        <a
                            href="/calculators/fha-loan-calculator"
                            className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                        >
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">FHA Loan Calculator</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Calculate FHA payments with MIP</p>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
