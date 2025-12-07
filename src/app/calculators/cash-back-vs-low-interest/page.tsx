import React from 'react';
import type { Metadata } from 'next';
import CashBackVsLowInterestCalculator from '@/components/CashBackVsLowInterestCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Car, Calculator, Percent } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Cash Back vs Low Interest Calculator | Compare Auto Loan Offers',
    description: 'Should you take the cash back rebate or the low interest rate? Use our free calculator to compare auto loan offers and find the best deal for your budget.',
    keywords: 'cash back vs low interest calculator, rebate vs low apr, car loan comparison, auto finance calculator, 0% apr vs cash back',
};

export default function CashBackVsLowInterestPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                        Make the Smart Choice:{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                            Cash Back or Low Interest?
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                        Compare manufacturer rebates against low-interest financing offers to determine which option saves you the most money.
                    </p>
                </div>
            </div>

            <CashBackVsLowInterestCalculator />

            {/* SEO Content */}
            <div className="max-w-4xl mx-auto mt-16 space-y-12">
                {/* Introduction Section */}
                <section className="prose dark:prose-invert max-w-none">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Making the Right Choice: Rebate or Rate?
                    </h2>

                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        When buying a new car, you're often presented with two tempting offers: a substantial cash rebate (cash back) or a low-interest financing rate (often as low as 0% APR). It's rarely possible to choose both, so how do you decide?
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        The answer isn't always obvious. While a $3,000 check sounds amazing, a 0% interest rate over 60 months could save you even more. Our calculator does the math for you, comparing the total cost of ownership for both scenarios so you can walk into the dealership with confidence.
                    </p>
                </section>

                {/* Key Factors Section */}
                <section className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        When to Choose Cash Back
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Taking the rebate is often the better choice if:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                        <li><strong>You have your own financing:</strong> If you can get a competitive interest rate from your bank or credit union, combining that with the rebate often yields the lowest total cost.</li>
                        <li><strong>You plan to pay off the loan early:</strong> The benefit of a low interest rate is spread out over time. If you pay off the loan in a year or two, the upfront cash savings from the rebate will likely outweigh the interest savings.</li>
                        <li><strong>The rebate is huge:</strong> Sometimes the cash incentive is so large (e.g., $4,000+) that no amount of interest savings can beat it.</li>
                        <li><strong>You have a lower credit score:</strong> You might not qualify for the advertised 0% or 0.9% APR, which usually requires excellent credit. In this case, the rebate is your best bet.</li>
                    </ul>
                </section>

                <section className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-8 border border-green-100 dark:border-green-800">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        When to Choose Low Interest (0% APR)
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Opting for the low promotional rate is usually smarter if:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                        <li><strong>You're financing a large amount:</strong> The more you borrow, the more interest you pay. On a $50,000 truck, avoiding 6% interest saves you a fortune, likely more than a $2,000 rebate.</li>
                        <li><strong>You want a long loan term:</strong> Over 60, 72, or 84 months, interest accumulates significantly. A 0% APR shields you from this cost entirely.</li>
                        <li><strong>You have excellent credit:</strong> These promotional rates are typically reserved for buyers with top-tier credit scores (often 720+).</li>
                        <li><strong>You plan to keep the loan for the full term:</strong> To maximize the benefit of a low rate, you need to keep the loan long enough for the interest savings to accumulate.</li>
                    </ul>
                </section>

                {/* FAQ Section */}
                <section className="prose dark:prose-invert max-w-none">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        Common Questions
                    </h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Can I get both the cash back and the low interest rate?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Rarely. Manufacturers usually offer these as "either/or" incentives. However, you might find "bonus cash" or "loyalty cash" that can be combined with special financing. Always ask the dealer about stackable incentives.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Does the cash back count as a down payment?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Yes, in most cases, you can apply the rebate directly to the purchase price, effectively acting as a down payment. This reduces the amount you need to finance.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Is 0% APR really free money?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Mathematically, yes—you are borrowing money without paying interest. However, dealers often sell cars at a higher price (closer to MSRP) when you use special financing because they lose the profit they'd make on a standard loan. Always negotiate the car price <em>before</em> discussing financing.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Related Tools Section */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                    <RelatedCalculators
                        links={[
                            {
                                href: "/calculators/auto-loan-calculator",
                                title: "Auto Loan Calculator",
                                description: "Calculate monthly payments",
                                icon: Car,
                                iconColorClass: "text-blue-600",
                                iconBgClass: "bg-blue-100",
                                hoverBgClass: "group-hover:bg-blue-600"
                            },
                            {
                                href: "/calculators/loan",
                                title: "General Loan Calculator",
                                description: "Simple loan amortization",
                                icon: Calculator,
                                iconColorClass: "text-green-600",
                                iconBgClass: "bg-green-100",
                                hoverBgClass: "group-hover:bg-green-600"
                            },
                            {
                                href: "/calculators/apr",
                                title: "APR Calculator",
                                description: "Find the true cost of a loan",
                                icon: Percent,
                                iconColorClass: "text-purple-600",
                                iconBgClass: "bg-purple-100",
                                hoverBgClass: "group-hover:bg-purple-600"
                            }
                        ]}
                        title="More Auto Finance Tools"
                    />
                </div>
            </div>
        </div>
    );
}
