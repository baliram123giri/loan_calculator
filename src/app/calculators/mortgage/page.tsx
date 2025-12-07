import React from 'react';
import MortgageCalculator from '@/components/MortgageCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import { DollarSign, FileText, Calculator } from 'lucide-react';
import { generateCalculatorMetadata } from '@/lib/seo/metadata';
import { calculatorSchemas } from '@/lib/seo/schema';

export const metadata = generateCalculatorMetadata('mortgage');
export const dynamic = 'force-dynamic';

export default function MortgagePage() {
    const schemas = [
        calculatorSchemas.mortgage.software,
        calculatorSchemas.mortgage.breadcrumb
    ];

    return (
        <>
            {/* JSON-LD Structured Data */}
            {schemas.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Calculate Your Mortgage with{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                                Confidence
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                            Calculate your monthly mortgage payments including principal, interest, taxes, and insurance (PITI).
                        </p>
                    </div>
                </div>

                <MortgageCalculator />

                {/* SEO Content */}
                <div className="max-w-4xl mx-auto mt-16 space-y-12">
                    {/* Introduction Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            🏠 Understanding Your Mortgage Payment
                        </h2>

                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Buying a home is likely the biggest financial decision you'll ever make. Understanding exactly what
                            you'll pay each month—and over the life of your loan—is essential for making a smart choice. Our
                            mortgage calculator breaks down your payment into all its components so there are no surprises.
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Most homebuyers focus solely on the home's price, but your monthly payment depends on much more:
                            your down payment, interest rate, loan term, property taxes, homeowners insurance, and potentially
                            PMI (Private Mortgage Insurance). Each of these factors can significantly impact your budget.
                        </p>
                    </section>

                    {/* PITI Breakdown */}
                    <section className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            📊 What's Included in Your Monthly Payment (PITI)
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Your total monthly mortgage payment consists of four main components, commonly referred to as PITI.
                            Understanding each helps you budget accurately and avoid payment shock.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 my-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Principal</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    The portion of your payment that goes toward paying down the actual loan amount. Early in your
                                    mortgage, this is a small percentage. Over time, more goes to principal as less goes to interest.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Interest</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    The cost of borrowing money from your lender. Your interest rate determines how much you pay.
                                    Even a 0.5% difference in rate can mean tens of thousands over 30 years.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Taxes</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Property taxes paid to your local government, typically 0.5-2.5% of your home's value annually.
                                    Your lender collects 1/12 of the annual amount each month and pays it on your behalf.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Insurance</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Homeowners insurance protects your property from damage. If you put down less than 20%, you'll
                                    also pay PMI (Private Mortgage Insurance) to protect the lender.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mt-6">
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Example Payment Breakdown
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                On a <strong className="text-blue-600 dark:text-blue-400">$300,000 home</strong> with{' '}
                                <strong className="text-blue-600 dark:text-blue-400">20% down ($60,000)</strong> at{' '}
                                <strong className="text-blue-600 dark:text-blue-400">6.5% interest</strong> for{' '}
                                <strong className="text-blue-600 dark:text-blue-400">30 years</strong>:<br />
                                • Principal & Interest: <strong>$1,517/month</strong><br />
                                • Property Taxes (1.2%): <strong>$300/month</strong><br />
                                • Homeowners Insurance: <strong>$100/month</strong><br />
                                • <strong className="text-blue-600 dark:text-blue-400">Total: $1,917/month</strong>
                            </p>
                        </div>
                    </section>

                    {/* Down Payment Impact */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            💰 How Your Down Payment Affects Everything
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Your down payment is more than just money upfront—it impacts your monthly payment, interest rate,
                            and whether you'll pay PMI. Here's how different down payment amounts change your situation.
                        </p>

                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-6 border border-red-200 dark:border-red-800">
                                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">3-5%</div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Minimum Down</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    FHA loans allow as little as 3.5% down. You'll pay PMI for the life of the loan (FHA) or until
                                    you reach 20% equity (conventional). Higher monthly payments and interest rates.
                                </p>
                            </div>

                            <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">10-15%</div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Middle Ground</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Lower monthly payments than 5% down, but you'll still pay PMI. Some lenders offer better rates
                                    at 15% down. PMI drops off when you reach 20% equity through payments or appreciation.
                                </p>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-6 border border-green-200 dark:border-green-800">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">20%+</div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Sweet Spot</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    No PMI, best interest rates, lowest monthly payments. You'll also have instant equity and a
                                    stronger negotiating position. This is the gold standard if you can afford it.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Money-Saving Tips */}
                    <section className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-8 border border-green-100 dark:border-green-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            💡 Smart Strategies to Lower Your Mortgage Costs
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Improve Your Credit Score Before Applying</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    A jump from 680 to 740 credit score can lower your rate by 0.5-0.75%, saving you $50,000+ over
                                    30 years on a $300,000 loan. Spend 6-12 months paying down debts, fixing credit report errors,
                                    and avoiding new credit inquiries before you apply.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Shop Multiple Lenders</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Rates can vary by 0.5% or more between lenders for the same borrower. Get quotes from at least
                                    3-5 lenders including banks, credit unions, and online lenders. All inquiries within 45 days count
                                    as one for credit scoring purposes.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Consider Buying Points</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Paying 1% of the loan amount upfront (one "point") typically lowers your rate by 0.25%. If you
                                    plan to stay in the home 5+ years, this can save significant money. Calculate your break-even
                                    point before deciding.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Make Bi-Weekly Payments</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Instead of 12 monthly payments, make half-payments every two weeks (26 half-payments = 13 full
                                    payments per year). This extra payment goes straight to principal, potentially cutting years off
                                    your loan and saving tens of thousands in interest.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5. Avoid PMI If Possible</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    PMI typically costs 0.5-1% of the loan amount annually ($1,200-$2,400/year on a $240,000 loan).
                                    If you can't put 20% down, consider a piggyback loan (80-10-10) or wait until you've saved more.
                                    Once you have 20% equity, request PMI removal immediately.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            ❓ Common Mortgage Questions
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Should I choose a 15-year or 30-year mortgage?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    A 15-year mortgage has higher monthly payments but significantly lower total interest—often
                                    saving $100,000+ compared to 30 years. You'll also get a lower interest rate (typically 0.5-0.75%
                                    less). Choose 15 years if you can comfortably afford the higher payment. Choose 30 years if you
                                    need lower payments or want to invest the difference elsewhere.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What's the difference between fixed and adjustable-rate mortgages?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Fixed-rate mortgages maintain the same interest rate for the entire loan term, providing payment
                                    stability. Adjustable-rate mortgages (ARMs) start with a lower rate for 3, 5, 7, or 10 years,
                                    then adjust annually based on market rates. ARMs are risky if rates rise but can save money if
                                    you'll sell or refinance before the adjustment period.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    How much house can I actually afford?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Lenders use the 28/36 rule: your housing payment shouldn't exceed 28% of gross monthly income,
                                    and total debts shouldn't exceed 36%. However, just because you qualify doesn't mean you should
                                    max out. Consider your other financial goals, job stability, and desired lifestyle. Many financial
                                    advisors recommend keeping housing costs below 25% of take-home pay.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    When should I refinance my mortgage?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Refinancing makes sense when you can lower your rate by at least 0.75-1%, plan to stay in the
                                    home long enough to recoup closing costs (typically 2-4 years), or want to switch from an ARM
                                    to a fixed rate. You can also refinance to remove PMI once you have 20% equity or to cash out
                                    equity for home improvements.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What credit score do I need for the best mortgage rates?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    You'll get the best rates with a score of 740 or higher. Scores of 700-739 get good rates with
                                    slightly higher costs. 660-699 is acceptable but with higher rates and fees. Below 660, you'll
                                    face significantly higher costs or may need FHA financing. Below 580, you'll struggle to qualify
                                    for most conventional loans.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Related Tools Section */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <RelatedCalculators
                            links={[
                                {
                                    href: "/calculators/house-affordability",
                                    title: "House Affordability",
                                    description: "Find out how much house you can afford",
                                    icon: DollarSign,
                                    iconColorClass: "text-blue-600",
                                    iconBgClass: "bg-blue-100",
                                    hoverBgClass: "group-hover:bg-blue-600"
                                },
                                {
                                    href: "/calculators/property-tax",
                                    title: "Property Tax",
                                    description: "Estimate your annual property taxes",
                                    icon: FileText,
                                    iconColorClass: "text-green-600",
                                    iconBgClass: "bg-green-100",
                                    hoverBgClass: "group-hover:bg-green-600"
                                },
                                {
                                    href: "/calculators/rent-calculator",
                                    title: "Rent vs Buy",
                                    description: "Compare renting vs buying a home",
                                    icon: Calculator,
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
        </>
    );
}
