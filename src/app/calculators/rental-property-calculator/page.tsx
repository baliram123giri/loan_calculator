import React from 'react';
import RentalPropertyCalculator from '@/components/RentalPropertyCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Home, Building, DollarSign, FileText, RefreshCw, Calculator } from 'lucide-react';
import { generateCalculatorMetadata } from '@/lib/seo/metadata';
import { calculatorSchemas } from '@/lib/seo/schema';

export const metadata = generateCalculatorMetadata('rental-property-calculator');
export const dynamic = 'force-dynamic';

export default function RentalPropertyCalculatorPage() {
    const schemas = [
        calculatorSchemas['rental-property-calculator'].software,
        calculatorSchemas['rental-property-calculator'].breadcrumb
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
                {/* Hero Section */}
                <div className="mb-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Build Wealth Through{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                Smart Investing
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                            Analyze rental property investments with precision. Calculate cash flow, ROI, cap rate, and 30-year projections.
                        </p>
                    </div>
                </div>

                <RentalPropertyCalculator />

                {/* SEO Content */}
                <div className="max-w-4xl mx-auto mt-16 space-y-12">
                    {/* Introduction Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            🏠 How to Analyze a Rental Property Investment
                        </h2>

                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Successful real estate investing isn't about gut feelings—it's about the numbers. Before you make an offer on a rental property,
                            you need to understand whether it will generate positive cash flow, provide a solid return on your investment, and meet your
                            financial goals.
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Our <strong>Rental Property Calculator</strong> is designed for both beginner and experienced investors. It calculates all the
                            key metrics professional investors use: <strong>Cash Flow</strong>, <strong>Cash-on-Cash Return</strong>, <strong>Cap Rate</strong>,
                            <strong>Net Operating Income (NOI)</strong>, <strong>DSCR</strong>, and <strong>Internal Rate of Return (IRR)</strong>. Plus, it
                            projects your returns over 30 years, accounting for rent increases, appreciation, and tax benefits.
                        </p>
                    </section>

                    {/* Key Metrics Explained */}
                    <section className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            📊 Understanding Rental Property Metrics
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Cash Flow</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    This is the money left in your pocket each month after paying all expenses and the mortgage. Positive cash flow means
                                    the property is profitable on a monthly basis. Most investors target at least <strong>$100-$200 per month</strong> in
                                    cash flow per unit.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Cash-on-Cash Return</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    This metric measures your annual return based on the actual cash you invested (down payment + closing costs + rehab).
                                    It's calculated as: <strong>(Annual Cash Flow / Total Cash Invested) × 100</strong>. A good cash-on-cash return is
                                    typically <strong>8-12%</strong>, though this varies by market.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Cap Rate (Capitalization Rate)</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Cap rate shows what your return would be if you paid all cash for the property. It's calculated as:
                                    <strong>(Net Operating Income / Purchase Price) × 100</strong>. Cap rates vary significantly by market—high-growth
                                    markets might have 4-6% cap rates, while cash-flow markets might offer 8-12%.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Net Operating Income (NOI)</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    NOI is your annual rental income minus all operating expenses (property taxes, insurance, maintenance, vacancy, etc.),
                                    but <strong>before</strong> mortgage payments. It's a key metric for comparing properties and calculating cap rate.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">DSCR (Debt Service Coverage Ratio)</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    DSCR measures whether the property generates enough income to cover its debt payments. It's calculated as:
                                    <strong>(NOI / Annual Debt Service)</strong>. Most lenders require a DSCR of at least <strong>1.25</strong>, meaning
                                    the property generates 25% more income than the mortgage payment.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">IRR (Internal Rate of Return)</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    IRR is the most sophisticated return metric. It accounts for the time value of money, cash flow over time, equity
                                    build-up, and appreciation. Our calculator projects IRR over 10 years, giving you a comprehensive view of long-term
                                    profitability.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Investment Strategies */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            💡 Rental Property Investment Strategies
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6 my-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Buy & Hold</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    The classic strategy. Purchase a property, rent it out, and hold for long-term appreciation and cash flow.
                                    Best for building wealth over time.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">BRRRR Method</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Buy, Rehab, Rent, Refinance, Repeat. Purchase undervalued properties, renovate them, rent them out, then refinance
                                    to pull out your capital and repeat the process.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">House Hacking</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Live in one unit of a multi-family property while renting out the others. Your tenants help pay your mortgage,
                                    making it easier to get started with minimal capital.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Operating Expenses Guide */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            💸 Estimating Rental Property Expenses
                        </h2>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Accurately estimating expenses is critical. New investors often underestimate costs, leading to negative cash flow.
                            Here are industry-standard guidelines:
                        </p>

                        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                            <li><strong>Property Taxes:</strong> Check local tax records for exact amounts. These vary widely by location.</li>
                            <li><strong>Insurance:</strong> Get quotes from multiple insurers. Landlord insurance costs more than homeowner's insurance.</li>
                            <li><strong>Property Management:</strong> Typically 8-12% of monthly rent. Even if you self-manage, budget for this in case you need help later.</li>
                            <li><strong>Maintenance & Repairs:</strong> Budget 10-15% of monthly rent. Older properties need more.</li>
                            <li><strong>Vacancy:</strong> Budget 5-10% depending on your market. Even great properties have turnover.</li>
                            <li><strong>CapEx Reserves:</strong> Set aside 5-10% for big-ticket items like roofs, HVAC, and appliances.</li>
                        </ul>

                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800 mt-6">
                            <h4 className="font-semibold text-orange-900 dark:text-orange-400 mb-2">The 50% Rule</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                A quick rule of thumb: Operating expenses (excluding mortgage) typically equal about <strong>50% of gross rental income</strong>.
                                This rule helps you quickly screen properties. If a property doesn't meet the 50% rule, dig deeper to understand why.
                            </p>
                        </div>
                    </section>

                    {/* Tax Benefits */}
                    <section className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-8 border border-green-100 dark:border-green-800">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            💵 Tax Advantages of Rental Property Investing
                        </h2>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Real estate offers some of the best tax benefits of any investment. Our calculator estimates your tax savings based on
                            current IRS rules:
                        </p>

                        <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Depreciation</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    The IRS allows you to depreciate residential rental properties over <strong>27.5 years</strong>. This creates a
                                    "paper loss" that can offset your rental income and lower your tax bill, even if the property is cash flow positive.
                                    You can only depreciate the building value, not the land.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Mortgage Interest Deduction</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    All mortgage interest paid on rental properties is fully tax-deductible. In the early years of a mortgage, most of
                                    your payment is interest, creating significant tax savings.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Operating Expense Deductions</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Property taxes, insurance, repairs, property management fees, utilities, and even travel to your property are all
                                    tax-deductible expenses.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">1031 Exchange</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    When you sell a rental property, you can defer capital gains taxes by reinvesting the proceeds into another
                                    "like-kind" property through a 1031 exchange. This allows you to build wealth faster by avoiding taxes.
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-6 italic">
                            Note: Tax laws are complex and change frequently. Always consult with a qualified tax professional or CPA to understand
                            your specific situation.
                        </p>
                    </section>

                    {/* Investment Rules */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            🎯 Quick Screening Rules for Rental Properties
                        </h2>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Professional investors use these rules of thumb to quickly screen properties before diving into detailed analysis:
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">The 1% Rule</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                    Monthly rent should be at least <strong>1% of the purchase price</strong>.
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Example: A $200,000 property should rent for at least $2,000/month. Properties meeting this rule typically have
                                    strong cash flow. In expensive markets, you might accept 0.7-0.8%.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">The 2% Rule</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                    For exceptional cash flow, look for properties where rent is <strong>2% of purchase price</strong>.
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Example: A $100,000 property renting for $2,000/month. These deals are rare but exist in certain markets,
                                    especially for multi-family properties.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">The 50% Rule</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                    Operating expenses will be about <strong>50% of gross rental income</strong>.
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    This helps you quickly estimate cash flow: If rent is $2,000/month and the mortgage is $800, your cash flow is
                                    approximately $200 ($2,000 - $1,000 expenses - $800 mortgage).
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">DSCR ≥ 1.25</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                    Lenders want to see a <strong>Debt Service Coverage Ratio of 1.25 or higher</strong>.
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    This means your NOI should be at least 125% of your annual mortgage payments. Meeting this threshold makes
                                    financing easier and indicates a safer investment.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            ❓ Frequently Asked Questions
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What is a good cash-on-cash return for a rental property?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Most investors target <strong>8-12% cash-on-cash return</strong>. However, this varies by strategy and market.
                                    In high-appreciation markets (like coastal cities), investors might accept 4-6% returns, banking on property value
                                    increases. In cash-flow markets (like the Midwest), investors often seek 12%+ returns.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    How much should I budget for maintenance and repairs?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    A common standard is <strong>1% of the property value per year</strong> or <strong>10-15% of gross rent</strong>.
                                    For a $200,000 property, budget $2,000/year ($167/month). Older homes require more. New construction might need less
                                    initially but will eventually need major repairs. Always separate maintenance (ongoing repairs) from CapEx (major
                                    replacements like roofs and HVAC).
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What vacancy rate should I assume?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    <strong>5-10% is standard</strong>, depending on your market. Even if you have great tenants, you'll have turnover
                                    eventually. Budget for at least 2-3 weeks of vacancy per year, plus time for cleaning and repairs between tenants.
                                    In hot rental markets, you might use 5%. In slower markets, use 10% or more.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Should I hire a property manager?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    It depends on your situation. Property managers typically charge <strong>8-12% of monthly rent</strong> plus leasing
                                    fees. Hire one if: you don't live near the property, you have multiple properties, you value your time highly, or you
                                    don't want to deal with tenant issues. Even if you self-manage, budget for property management in your analysis—you
                                    might need help later.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    How do I calculate Net Operating Income (NOI)?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    NOI = Gross Rental Income - Operating Expenses. Operating expenses include property taxes, insurance, maintenance,
                                    property management, vacancy, utilities (if you pay them), and CapEx reserves. <strong>Do NOT include mortgage
                                        payments</strong> in NOI—that comes later when calculating cash flow.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What is DSCR and why do lenders care?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    DSCR (Debt Service Coverage Ratio) measures whether a property generates enough income to cover its debt payments.
                                    It's calculated as: <strong>NOI ÷ Annual Debt Service</strong>. Lenders typically require a DSCR of at least
                                    <strong>1.25</strong>, meaning the property generates 25% more income than the mortgage payment. This provides a
                                    safety cushion in case of vacancies or unexpected expenses.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    How accurate are 30-year projections?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Long-term projections are estimates, not guarantees. Markets change, unexpected expenses arise, and economic
                                    conditions shift. However, projections are still valuable for understanding potential long-term returns and comparing
                                    different properties. Use conservative assumptions (lower rent increases, higher expenses) to build in a safety margin.
                                    Review and adjust your assumptions annually.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What's the difference between cap rate and cash-on-cash return?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    <strong>Cap rate</strong> measures return assuming you paid all cash (NOI ÷ Purchase Price). It's useful for comparing
                                    properties regardless of financing. <strong>Cash-on-cash return</strong> measures return on your actual cash invested,
                                    accounting for leverage (Annual Cash Flow ÷ Total Cash Invested). A property might have a 6% cap rate but a 12%
                                    cash-on-cash return due to favorable financing.
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
                                    description: "Calculate monthly payments & amortization schedules",
                                    icon: Home,
                                    iconColorClass: "text-blue-600",
                                    iconBgClass: "bg-blue-100",
                                    hoverBgClass: "group-hover:bg-blue-600"
                                },
                                {
                                    href: "/calculators/real-estate-calculator",
                                    title: "Real Estate Investment",
                                    description: "Advanced investment property analysis",
                                    icon: Building,
                                    iconColorClass: "text-green-600",
                                    iconBgClass: "bg-green-100",
                                    hoverBgClass: "group-hover:bg-green-600"
                                },
                                {
                                    href: "/calculators/house-affordability",
                                    title: "House Affordability",
                                    description: "How much house can you afford?",
                                    icon: DollarSign,
                                    iconColorClass: "text-purple-600",
                                    iconBgClass: "bg-purple-100",
                                    hoverBgClass: "group-hover:bg-purple-600"
                                },
                                {
                                    href: "/calculators/property-tax",
                                    title: "Property Tax Calculator",
                                    description: "Estimate annual property taxes",
                                    icon: FileText,
                                    iconColorClass: "text-orange-600",
                                    iconBgClass: "bg-orange-100",
                                    hoverBgClass: "group-hover:bg-orange-600"
                                },
                                {
                                    href: "/calculators/refinance-calculator",
                                    title: "Refinance Calculator",
                                    description: "Should you refinance your mortgage?",
                                    icon: RefreshCw,
                                    iconColorClass: "text-indigo-600",
                                    iconBgClass: "bg-indigo-100",
                                    hoverBgClass: "group-hover:bg-indigo-600"
                                },
                                {
                                    href: "/calculators/rent-calculator",
                                    title: "Rent vs Buy Calculator",
                                    description: "Should you rent or buy a home?",
                                    icon: Calculator,
                                    iconColorClass: "text-teal-600",
                                    iconBgClass: "bg-teal-100",
                                    hoverBgClass: "group-hover:bg-teal-600"
                                }
                            ]}
                            title="More Real Estate Calculators"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
