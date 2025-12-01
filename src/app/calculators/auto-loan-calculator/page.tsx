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
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Understanding APR vs. Interest Rate</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        While often used interchangeably, APR (Annual Percentage Rate) and interest rate are different. The interest rate is what you pay to borrow money, while APR includes the interest rate plus other costs like origination fees and closing costs. When comparing loan offers, always look at the APR for a true apples-to-apples comparison. A loan with a lower interest rate but high fees might actually cost more than one with a slightly higher rate and minimal fees.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">The Impact of Loan Term Length</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Car loan terms typically range from 36 to 84 months. While a longer term means lower monthly payments, you&apos;ll pay significantly more in interest over the life of the loan. For example, on a $30,000 loan at 6% APR, a 60-month term costs about $3,200 in interest, while a 72-month term costs nearly $3,900. Plus, longer loans increase the risk of being &quot;upside down&quot; on your loan—owing more than the car is worth.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">What credit score do I need for a car loan?</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        While you can get approved with a credit score as low as 500, the best rates are reserved for scores above 720. If your score is between 600-660, you&apos;ll likely qualify but at higher interest rates. Consider improving your credit before applying if possible—even a 50-point increase can save you thousands over the life of the loan.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">How much should I put down on a car?</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Financial experts typically recommend putting down at least 20% for a new car and 10% for a used car. This helps you avoid negative equity and reduces your monthly payment. If you can&apos;t afford 20% down, consider a less expensive vehicle or wait until you&apos;ve saved more. Remember, your trade-in can count toward your down payment.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Should I finance through the dealer or my bank?</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Get pre-approved by your bank or credit union first—this gives you a baseline to compare against dealer offers. Dealers sometimes have promotional rates (like 0% APR) that beat bank rates, but they may also mark up rates to increase their profit. Having pre-approval gives you negotiating power and helps you avoid being pressured into a bad deal.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I pay off my car loan early?</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Most car loans allow early payoff without penalties, but always check your loan agreement. Paying extra toward principal each month or making a lump sum payment can save you significant interest. Even an extra $50-100 per month can shave months off your loan and save hundreds in interest charges.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">What&apos;s the difference between new and used car loan rates?</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        New car loans typically have lower interest rates than used car loans because new cars are considered less risky collateral. The rate difference is usually 1-2 percentage points. However, used cars depreciate less quickly, so you might come out ahead financially even with a slightly higher rate. Run the numbers for both scenarios to see which makes more sense for your situation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Smart Car Buying Strategies</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Time Your Purchase Right</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        The best times to buy a car are typically at the end of the month, end of the quarter, or end of the year when dealers are trying to meet sales quotas. You&apos;ll also find better deals on outgoing model years when new models arrive (usually late summer/early fall). Holiday weekends like Memorial Day and Labor Day often feature special promotions.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Negotiate the Price, Not the Payment</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Dealers love to focus on monthly payments because it&apos;s easier to hide the true cost. Instead, negotiate the total purchase price first, then discuss financing separately. Know the fair market value of the car you want (use resources like Kelley Blue Book or Edmunds) and don&apos;t be afraid to walk away if the dealer won&apos;t meet your price.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Consider Total Cost of Ownership</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Your monthly payment is just one piece of the puzzle. Factor in insurance costs (which can vary dramatically between models), fuel economy, maintenance costs, and depreciation. A car with a lower purchase price might cost more in the long run if it&apos;s expensive to insure or maintain. Use online tools to estimate these costs before committing.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Don&apos;t Forget About Hidden Fees</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Beyond the sticker price, watch out for dealer add-ons like extended warranties, paint protection, and fabric protection. These are often overpriced and negotiable. Also be aware of documentation fees, which can range from $100 to $500 depending on your state. Some fees are legitimate and required by law, but others are pure profit for the dealer.
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
