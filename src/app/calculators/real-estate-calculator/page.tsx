import React from 'react';
import RealEstateCalculator from '@/components/RealEstateCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Home, Calculator, FileText } from 'lucide-react';
import { generateCalculatorMetadata } from '@/lib/seo/metadata';
import { calculatorSchemas } from '@/lib/seo/schema';

export const metadata = generateCalculatorMetadata('real-estate-calculator');
export const dynamic = 'force-dynamic';

export default function RealEstateCalculatorPage() {
    const schemas = [
        calculatorSchemas['real-estate-calculator'].software,
        calculatorSchemas['real-estate-calculator'].breadcrumb
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
                        Real Estate Investment Calculator
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Analyze rental properties with precision. Calculate Cash Flow, Cap Rate, Cash on Cash Return, and 30-year projections for the US market.
                    </p>
                </div>

                <RealEstateCalculator />

                {/* SEO Content */}
                <div className="max-w-4xl mx-auto mt-16 space-y-12">
                    {/* Introduction Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            Why You Need a Real Estate Investment Calculator
                        </h2>

                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Successful real estate investing isn't about guessing; it's about the numbers. Whether you're analyzing a
                            single-family home, a duplex, or a multi-unit property, understanding your potential return on investment (ROI)
                            is crucial before you make an offer.
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Our US-focused Real Estate Calculator helps you evaluate deals like a pro. It accounts for all major expenses—including
                            property taxes, insurance, vacancy rates, and maintenance—to give you a clear picture of your
                            <strong>Monthly Cash Flow</strong>, <strong>Cap Rate</strong>, and <strong>Cash on Cash Return</strong>.
                        </p>
                    </section>

                    {/* Key Metrics Breakdown */}
                    <section className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Key Investment Metrics Explained
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Don't just look at the price. These three metrics tell you the true story of an investment property's performance.
                        </p>

                        <div className="grid md:grid-cols-3 gap-6 my-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Cash Flow</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    The net profit you pocket each month after all expenses and mortgage payments. Positive cash flow is the lifeblood of a rental portfolio.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Cash on Cash Return</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Measures the return on the actual cash you invested (down payment + closing costs). It's the best way to compare real estate to other investments like stocks.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Cap Rate</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    The rate of return on a property assuming you paid all cash. It helps you compare properties regardless of financing terms.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mt-6">
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Pro Tip: The 1% Rule
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                A quick rule of thumb for screening properties: The monthly rent should be at least <strong>1% of the purchase price</strong>.
                                For example, a $200,000 house should rent for at least $2,000/month. While not a hard rule, properties meeting this
                                criteria often have strong cash flow.
                            </p>
                        </div>
                    </section>

                    {/* Tax Benefits */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Tax Benefits of Real Estate Investing (USA)
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            One of the biggest advantages of US real estate is the tax treatment. Our calculator estimates
                            <strong>Annual Depreciation</strong>, a powerful "paper loss" that can offset your rental income and lower your tax bill.
                        </p>

                        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                            <li><strong>Depreciation:</strong> Residential properties are depreciated over 27.5 years. You can deduct ~3.636% of the building value each year.</li>
                            <li><strong>Mortgage Interest:</strong> Interest paid on your rental property mortgage is fully tax-deductible.</li>
                            <li><strong>Operating Expenses:</strong> Repairs, insurance, property management fees, and travel to the property are deductible.</li>
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
                                    What is a good Cash on Cash Return?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Most investors target a Cash on Cash (CoC) return of <strong>8-12%</strong>. However, in high-appreciation markets,
                                    investors might accept a lower CoC (4-6%) banking on the property value increasing over time. In cash-flow markets,
                                    investors often seek 12%+.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    How do I estimate maintenance costs?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    A common standard is to budget <strong>1% of the property value per year</strong> or <strong>10-15% of the gross rent</strong>.
                                    Older homes will generally require a higher maintenance budget than newer construction.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What is DSCR?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    The Debt Service Coverage Ratio (DSCR) measures a property's ability to cover its debt.
                                    DSCR = Net Operating Income / Total Debt Service. Lenders typically look for a DSCR of <strong>1.25 or higher</strong>,
                                    meaning the property generates 25% more income than the mortgage payment.
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
                                    description: "Calculate monthly payments & amortization",
                                    icon: Home,
                                    iconColorClass: "text-blue-600",
                                    iconBgClass: "bg-blue-100",
                                    hoverBgClass: "group-hover:bg-blue-600"
                                },
                                {
                                    href: "/calculators/rent-calculator",
                                    title: "Rent vs Buy",
                                    description: "Should you rent or buy a home?",
                                    icon: Calculator,
                                    iconColorClass: "text-green-600",
                                    iconBgClass: "bg-green-100",
                                    hoverBgClass: "group-hover:bg-green-600"
                                },
                                {
                                    href: "/calculators/property-tax",
                                    title: "Property Tax",
                                    description: "Estimate annual property taxes",
                                    icon: FileText,
                                    iconColorClass: "text-purple-600",
                                    iconBgClass: "bg-purple-100",
                                    hoverBgClass: "group-hover:bg-purple-600"
                                }
                            ]}
                            title="More Real Estate Tools"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
