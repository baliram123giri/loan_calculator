import React from 'react';
import type { Metadata } from 'next';
import AutoLoanCalculator from '@/components/AutoLoanCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Car, DollarSign, Percent, Calendar, Home, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Auto Loan Calculator | Calculate Car Payments & Affordability',
    description: 'Free auto loan calculator to estimate monthly car payments or determine how much car you can afford. Includes trade-in value, sales tax, and fees.',
    keywords: 'auto loan calculator, car payment calculator, car affordability calculator, auto loan amortization, car loan interest calculator',
};

export default function AutoLoanCalculatorPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/10 border-b border-gray-200 dark:border-gray-800 pb-12 pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto mb-12">
                        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Drive Your Dream Car with Our{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                                Auto Loan Calculator
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            Calculate monthly payments, total interest, and affordability. Make smart financing decisions for your new or used vehicle.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Calculator Component */}
                <div className="-mt-20 relative z-10">
                    <AutoLoanCalculator />
                </div>

                {/* SEO Content */}
                <div className="max-w-4xl mx-auto mt-16 space-y-12">
                    {/* Introduction Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            Understanding Your Auto Loan
                        </h2>

                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Buying a car is a major financial decision, and understanding your auto loan is crucial to making the right choice. Our calculator helps you estimate monthly payments or determine how much vehicle you can afford, taking into account all the factors that affect your loan.
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Whether you're financing a new or used vehicle, the total cost depends on more than just the sticker price. Your down payment, trade-in value, interest rate, loan term, sales tax, and fees all play a role in determining your monthly payment and total loan cost.
                        </p>
                    </section>

                    {/* Key Factors Section */}
                    <section className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Key Factors Affecting Your Car Payment
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Vehicle Price & Down Payment</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    The vehicle price minus your down payment and trade-in value determines your loan amount. A larger down payment (ideally 20% or more) reduces your monthly payment and helps you avoid being "upside down" on your loan.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Interest Rate (APR)</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Your interest rate is determined by your credit score, loan term, and whether the vehicle is new or used. Even a 1% difference in rate can mean thousands of dollars over the life of the loan. New cars typically qualify for lower rates than used cars.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Loan Term Length</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Car loans typically range from 36 to 84 months. Longer terms mean lower monthly payments but significantly more interest paid over time. A 72-month loan can cost $1,000+ more in interest than a 60-month loan on the same vehicle.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Taxes & Fees</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Don't forget sales tax (varies by state), title and registration fees, and dealer documentation fees. These can add thousands to your total loan amount. Our calculator lets you include these costs for an accurate estimate.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Tips Section */}
                    <section className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-8 border border-green-100 dark:border-green-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Smart Auto Loan Strategies
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Improve Your Credit Score Before Applying</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Your credit score has a huge impact on your interest rate. A score above 720 gets you the best rates, while scores below 660 face significantly higher costs. Spend a few months paying down debts and fixing credit report errors before applying.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Get Pre-Approved Before Shopping</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Getting pre-approved by your bank or credit union gives you negotiating power at the dealership. You'll know exactly what you can afford and won't be pressured into a bad financing deal. Compare at least 3-5 lenders to find the best rate.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Negotiate Price, Not Payment</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Dealers love to focus on monthly payments because it's easier to hide the true cost. Instead, negotiate the total purchase price first, then discuss financing separately. Know the fair market value using resources like Kelley Blue Book or Edmunds.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Consider Total Cost of Ownership</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Your monthly payment is just one piece of the puzzle. Factor in insurance costs (which vary dramatically by model), fuel economy, maintenance, and depreciation. A cheaper car might cost more long-term if it's expensive to insure or maintain.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5. Avoid Extended Warranties and Add-Ons</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Dealers make huge profits on extended warranties, paint protection, and fabric protection. These are often overpriced and negotiable. If you want an extended warranty, shop around and buy it separately—you'll often save 50% or more.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            Common Auto Loan Questions
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What credit score do I need for a car loan?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    While you can get approved with a score as low as 500, the best rates are reserved for scores above 720. Scores between 600-660 will qualify but at higher interest rates. Even a 50-point increase can save you thousands over the life of the loan.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    How much should I put down on a car?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Financial experts recommend at least 20% down for new cars and 10% for used cars. This helps you avoid negative equity and reduces your monthly payment. If you can't afford 20% down, consider a less expensive vehicle or wait until you've saved more.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Should I finance through the dealer or my bank?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Get pre-approved by your bank or credit union first—this gives you a baseline to compare. Dealers sometimes have promotional rates (like 0% APR) that beat bank rates, but they may also mark up rates to increase profit. Having pre-approval gives you negotiating power.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Can I pay off my car loan early?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Most car loans allow early payoff without penalties, but always check your loan agreement. Paying extra toward principal each month or making a lump sum payment can save you significant interest. Even an extra $50-100 per month can shave months off your loan.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What's the difference between new and used car loan rates?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    New car loans typically have lower interest rates (often 1-2% less) because new cars are considered less risky collateral. However, used cars depreciate less quickly, so you might come out ahead financially even with a slightly higher rate. Run the numbers for both scenarios.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Related Tools Section */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <RelatedCalculators
                            links={[
                                {
                                    href: "/calculators/loan",
                                    title: "Personal Loan",
                                    description: "Calculate personal loan payments",
                                    icon: DollarSign,
                                    iconColorClass: "text-blue-600",
                                    iconBgClass: "bg-blue-100",
                                    hoverBgClass: "group-hover:bg-blue-600"
                                },
                                {
                                    href: "/calculators/mortgage",
                                    title: "Mortgage",
                                    description: "Estimate home loan payments",
                                    icon: Home,
                                    iconColorClass: "text-green-600",
                                    iconBgClass: "bg-green-100",
                                    hoverBgClass: "group-hover:bg-green-600"
                                },
                                {
                                    href: "/calculators/refinance-calculator",
                                    title: "Refinance",
                                    description: "Compare refinancing options",
                                    icon: RefreshCw,
                                    iconColorClass: "text-purple-600",
                                    iconBgClass: "bg-purple-100",
                                    hoverBgClass: "group-hover:bg-purple-600"
                                }
                            ]}
                            title="More Financial Calculators"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
