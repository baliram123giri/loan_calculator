import React from 'react';
import type { Metadata } from 'next';
import VAMortgageCalculator from '@/components/VAMortgageCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Home, DollarSign, Percent } from 'lucide-react';
import { generateCalculatorMetadata } from '@/lib/seo/metadata';
import { calculatorSchemas } from '@/lib/seo/schema';

export const metadata: Metadata = {
    title: 'VA Mortgage Calculator | Calculate VA Loan Payments & Funding Fee',
    description: 'Free VA Mortgage Calculator. Estimate your monthly payments for VA loans, including the VA Funding Fee, property taxes, and insurance. Supports 0% down payment.',
    keywords: 'VA loan calculator, VA mortgage calculator, VA funding fee calculator, veterans home loan, 0 down mortgage, military housing loan',
    openGraph: {
        title: 'VA Mortgage Calculator | Accurate Payments & Funding Fee',
        description: 'Calculate your VA loan payments instantly. Includes VA Funding Fee logic, disability exemptions, and 0% down payment options.',
        type: 'website',
    }
};

export default function VAMortgageCalculatorPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                        Calculate Your VA Loan with{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                            Confidence
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                        Estimate your monthly payments for a VA loan, including the specific VA Funding Fee and tax implications.
                    </p>
                </div>
            </div>

            <VAMortgageCalculator />

            {/* SEO Content */}
            <div className="max-w-4xl mx-auto mt-16 space-y-12">
                {/* Introduction Section */}
                <section className="prose dark:prose-invert max-w-none">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        📚 Everything You Need to Know About VA Loans
                    </h2>

                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        A VA loan is a mortgage loan issued by private lenders and backed by the U.S. Department of Veterans Affairs (VA).
                        It is designed to help eligible American veterans, active-duty service members, and surviving spouses buy a home with favorable terms.
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        VA loans are widely considered one of the best mortgage products available because they often require no down payment
                        and have no private mortgage insurance (PMI). This can save you thousands of dollars upfront and hundreds of dollars monthly.
                    </p>
                </section>

                {/* Key Benefits */}
                <section className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        💰 Key Benefits of VA Loans
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-xl p-6 border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-2xl">🏠</span>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">No Down Payment</h4>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                Qualified borrowers can often purchase a home with 0% down, keeping your savings for other needs.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl p-6 border border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-2xl">🛡️</span>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">No PMI</h4>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                Unlike conventional and FHA loans, VA loans do not require monthly mortgage insurance, saving you money every month.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl p-6 border border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-2xl">📉</span>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">Competitive Rates</h4>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                VA loans typically offer lower interest rates than conventional loans, reducing your long-term costs.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 rounded-xl p-6 border border-orange-200 dark:border-orange-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-2xl">💼</span>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">Limited Closing Costs</h4>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                The VA limits the amount of closing costs borrowers can be charged, protecting you from excessive fees.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Funding Fee Section */}
                <section className="prose dark:prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        💵 Understanding the VA Funding Fee
                    </h3>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        While there is no monthly mortgage insurance, most VA loans require a one-time "Funding Fee" that helps offset the cost of the program to taxpayers.
                        This fee can be paid upfront or rolled into the loan amount.
                    </p>

                    <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800 mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Funding Fee Exemptions</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            You may be exempt from paying the VA Funding Fee if you:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                            <li>Receive VA compensation for a service-connected disability.</li>
                            <li>Are a surviving spouse of a veteran who died in service or from a service-connected disability.</li>
                        </ul>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 italic">
                            <strong>Tip:</strong> Use the "Service Disability" toggle in our calculator to see how waiving this fee affects your loan.
                        </p>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="prose dark:prose-invert max-w-none">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        ❓ Common VA Loan Questions
                    </h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Can I use a VA loan more than once?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Yes! You can use your VA loan benefit multiple times. However, the Funding Fee may be slightly higher for subsequent uses unless you are exempt.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Is there a maximum loan amount?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                The VA does not set a cap on how much you can borrow. However, lenders still have their own limits based on your credit and income.
                                If you have full entitlement, there is no loan limit for 0% down.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                What credit score do I need?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                The VA doesn't set a minimum credit score, but most lenders look for a score of at least 620. Some lenders may go lower, but rates might be higher.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Related Tools Section */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                    <RelatedCalculators
                        links={[
                            {
                                href: "/calculators/mortgage",
                                title: "Mortgage Calculator",
                                description: "Standard mortgage payment estimation",
                                icon: Home,
                                iconColorClass: "text-blue-600",
                                iconBgClass: "bg-blue-100",
                                hoverBgClass: "group-hover:bg-blue-600"
                            },
                            {
                                href: "/calculators/house-affordability",
                                title: "House Affordability",
                                description: "Find out how much house you can afford",
                                icon: DollarSign,
                                iconColorClass: "text-green-600",
                                iconBgClass: "bg-green-100",
                                hoverBgClass: "group-hover:bg-green-600"
                            },
                            {
                                href: "/calculators/fha-loan-calculator",
                                title: "FHA Loan Calculator",
                                description: "Calculate FHA payments with MIP",
                                icon: Percent,
                                iconColorClass: "text-purple-600",
                                iconBgClass: "bg-purple-100",
                                hoverBgClass: "group-hover:bg-purple-600"
                            }
                        ]}
                        title="More Home Buying Tools"
                    />
                </div>
            </div>
        </div>
    );
}
