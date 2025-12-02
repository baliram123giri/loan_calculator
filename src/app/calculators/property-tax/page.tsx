import React from 'react';
import PropertyTaxCalculator from '@/components/PropertyTaxCalculator';
import { generateCalculatorMetadata } from '@/lib/seo/metadata';
import { calculatorSchemas } from '@/lib/seo/schema';

export const metadata = generateCalculatorMetadata('property-tax');
export const dynamic = 'force-dynamic';

export default function PropertyTaxPage() {
    const schemas = [
        calculatorSchemas['property-tax'].software,
        calculatorSchemas['property-tax'].breadcrumb
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Property Tax Calculator
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Estimate your annual property taxes based on home value and local tax rates.
                    </p>
                </div>

                <PropertyTaxCalculator />

                {/* SEO Content */}
                <div className="max-w-4xl mx-auto mt-16 space-y-12">
                    {/* Introduction Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            Understanding Property Taxes in the United States
                        </h2>

                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Property taxes are one of the largest ongoing costs of homeownership, yet they're often overlooked
                            when budgeting for a home. These taxes fund essential local services like schools, police and fire
                            departments, road maintenance, and public libraries. Understanding how they're calculated and what
                            you'll owe is crucial for accurate home affordability planning.
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Property tax rates vary dramatically across the United States—from as low as 0.28% in Hawaii to over
                            2.49% in New Jersey. On a $300,000 home, that's the difference between $840/year and $7,470/year.
                            Location matters enormously when it comes to your tax burden.
                        </p>
                    </section>

                    {/* How Property Taxes Work */}
                    <section className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl p-8 border border-orange-100 dark:border-orange-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            How Property Taxes Are Calculated
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Property taxes are based on your home's assessed value multiplied by your local tax rate. However,
                            the process is more complex than it appears, with multiple layers of government potentially taxing
                            the same property.
                        </p>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 my-6">
                            <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-3">The Calculation Formula</h4>
                            <div className="space-y-3">
                                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Step 1: Assessed Value</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Your local assessor determines your property's value, usually a percentage of market value
                                        (assessment ratio). Some areas assess at 100% of market value, others at 80%, 50%, or even lower.
                                    </p>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Step 2: Apply Exemptions</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Subtract any exemptions you qualify for (homestead, senior, veteran, disability). These can
                                        reduce your taxable value by thousands to tens of thousands of dollars.
                                    </p>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Step 3: Multiply by Tax Rate</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Your taxable value is multiplied by the combined tax rate (often called "millage rate").
                                        This includes county, city, school district, and special district taxes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Example Calculation
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                <strong className="text-orange-600 dark:text-orange-400">$350,000 home</strong> in Texas:<br />
                                • Market Value: $350,000<br />
                                • Assessment Ratio: 100% = <strong>$350,000 assessed value</strong><br />
                                • Homestead Exemption: -$40,000 = <strong>$310,000 taxable value</strong><br />
                                • Combined Tax Rate: 2.18% (county + city + school + special districts)<br />
                                • <strong className="text-orange-600 dark:text-orange-400">Annual Tax: $6,758</strong> ($563/month)
                            </p>
                        </div>
                    </section>

                    {/* State-by-State Variations */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Property Tax Rates Across America
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Property tax rates vary wildly by state and even more by county and city. Here's what you need to
                            know about high-tax and low-tax states.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 my-8">
                            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-6 border border-red-200 dark:border-red-800">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Highest Tax States</h4>
                                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                    <p>• <strong>New Jersey:</strong> 2.49% avg ($7,470 on $300k)</p>
                                    <p>• <strong>Illinois:</strong> 2.27% avg ($6,810 on $300k)</p>
                                    <p>• <strong>Connecticut:</strong> 2.14% avg ($6,420 on $300k)</p>
                                    <p>• <strong>New Hampshire:</strong> 2.09% avg ($6,270 on $300k)</p>
                                    <p>• <strong>Vermont:</strong> 1.90% avg ($5,700 on $300k)</p>
                                </div>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-6 border border-green-200 dark:border-green-800">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Lowest Tax States</h4>
                                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                    <p>• <strong>Hawaii:</strong> 0.28% avg ($840 on $300k)</p>
                                    <p>• <strong>Alabama:</strong> 0.41% avg ($1,230 on $300k)</p>
                                    <p>• <strong>Louisiana:</strong> 0.55% avg ($1,650 on $300k)</p>
                                    <p>• <strong>Wyoming:</strong> 0.61% avg ($1,830 on $300k)</p>
                                    <p>• <strong>South Carolina:</strong> 0.57% avg ($1,710 on $300k)</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800 my-6">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">⚠️ Important Note</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Low property taxes don't always mean lower overall tax burden. States with low property taxes often
                                have higher income or sales taxes to compensate. Consider your complete tax picture when choosing
                                where to buy.
                            </p>
                        </div>
                    </section>

                    {/* Ways to Reduce Property Taxes */}
                    <section className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-8 border border-green-100 dark:border-green-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Strategies to Lower Your Property Tax Bill
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Apply for All Available Exemptions</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Homestead exemptions (for primary residences), senior exemptions (age 65+), veteran exemptions,
                                    and disability exemptions can save you hundreds to thousands annually. Many homeowners miss out
                                    because they don't apply. Check your county assessor's website for eligibility requirements.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Review Your Assessment for Errors</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Assessors make mistakes. Check your property record for errors in square footage, number of rooms,
                                    lot size, or property features. Even small errors can inflate your assessment by thousands. Request
                                    a correction if you find discrepancies—it's usually a simple process.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Appeal Your Assessment</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    If your assessed value is higher than comparable homes in your area, you can appeal. Gather evidence:
                                    recent sales of similar homes, professional appraisals, photos of property issues. About 30-60% of
                                    appeals succeed, with average reductions of 10-15%. The process is free in most areas.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Don't Over-Improve Your Property</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Major renovations increase your home's value—and your taxes. A $50,000 kitchen remodel might add
                                    $1,000-1,500 to your annual tax bill. Consider the long-term tax impact before major improvements.
                                    Some improvements (like energy-efficient upgrades) may qualify for tax breaks.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5. Consider Tax Freezes and Caps</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Many states offer property tax freezes for seniors or disabled homeowners, preventing increases even
                                    as home values rise. Some states cap annual assessment increases (like California's Prop 13 at 2% max).
                                    Research your state's programs—they can save tens of thousands over time.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            Property Tax Questions
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    How often are property taxes assessed?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Most areas reassess property values every 1-3 years, though some do it annually and others less
                                    frequently. Your tax rate can change annually based on local budget needs. Even if your home's
                                    value doesn't change, your taxes might increase if your municipality raises rates to fund services.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Can I include property taxes in my mortgage payment?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Yes, through an escrow account. Your lender collects 1/12 of your annual tax bill each month along
                                    with your mortgage payment, then pays the taxes when due. This is often required with less than 20%
                                    down and makes budgeting easier. However, you lose the ability to earn interest on that money.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Are property taxes tax-deductible?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Yes, but with limits. You can deduct up to $10,000 in combined state and local taxes (SALT), including
                                    property taxes, if you itemize deductions. For many homeowners, especially in high-tax states, this
                                    cap significantly reduces the benefit. The standard deduction ($13,850 single, $27,700 married for 2023)
                                    is often better than itemizing.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What happens if I don't pay my property taxes?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Unpaid property taxes accrue interest and penalties (often 10-18% annually). After a certain period
                                    (varies by state, typically 1-3 years), the government can place a tax lien on your property or even
                                    sell it at a tax sale to recover the debt. Property taxes take priority over mortgages, so lenders
                                    often pay delinquent taxes and add them to your loan balance.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Do property taxes increase every year?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Usually, but not always. Taxes can increase due to rising property values, higher tax rates, or both.
                                    Some states cap annual increases (California limits to 2% per year). In declining markets, taxes can
                                    decrease, though municipalities are often slow to lower assessments. Budget for 2-5% annual increases
                                    to be safe.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Related Tools Section */}
                    <section className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Complete Home Ownership Planning
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Factor in all costs of homeownership with these tools:
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                            <a
                                href="/calculators/mortgage"
                                className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                            >
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Mortgage Calculator</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Include taxes in total payment</p>
                            </a>
                            <a
                                href="/calculators/house-affordability"
                                className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                            >
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">House Affordability</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Factor taxes into buying power</p>
                            </a>
                            <a
                                href="/calculators/rent-calculator"
                                className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                            >
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Rent vs Buy</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Compare total costs of renting vs owning</p>
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
