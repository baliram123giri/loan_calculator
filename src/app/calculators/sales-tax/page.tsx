import React from 'react';
import SalesTaxCalculator from '@/components/SalesTaxCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Building, Calculator, Home } from 'lucide-react';
import { generateCalculatorMetadata } from '@/lib/seo/metadata';
import { calculatorSchemas } from '@/lib/seo/schema';

export const metadata = generateCalculatorMetadata('sales-tax');
export const dynamic = 'force-dynamic';

export default function SalesTaxPage() {
    const schemas = [
        calculatorSchemas['sales-tax'].software,
        calculatorSchemas['sales-tax'].breadcrumb
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
                <div className="bg-gradient-to-r from-pink-600 to-rose-700 rounded-3xl p-8 sm:p-12 mb-10 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                        <Building size={400} />
                    </div>
                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-pink-100 text-sm font-medium mb-6">
                            <Calculator size={16} />
                            <span>Consumer Finance</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                            Sales Tax Calculator
                        </h1>
                        <p className="text-xl text-pink-100 mb-8 leading-relaxed max-w-2xl">
                            Calculate the total cost of any purchase including state and local sales tax to budget accurately.
                        </p>
                    </div>
                </div>

                <SalesTaxCalculator />

                {/* SEO Content */}
                <div className="max-w-4xl mx-auto mt-16 space-y-12">
                    {/* Introduction Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            🏠 Understanding Sales Tax in the United States
                        </h2>

                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Sales tax is a consumption tax imposed by state and local governments on the sale of goods and services.
                            Unlike many countries that use a national VAT (Value Added Tax), the United States has no federal sales
                            tax. Instead, each state sets its own rate, and local jurisdictions can add additional taxes on top.
                            This creates a complex patchwork of rates across the country.
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Sales tax rates range from 0% in states like Oregon and New Hampshire to over 10% in some California
                            cities when combining state, county, and city taxes. Understanding sales tax helps you budget accurately
                            for purchases, compare prices across locations, and plan major purchases strategically.
                        </p>
                    </section>

                    {/* How Sales Tax Works */}
                    <section className="bg-pink-50 dark:bg-pink-900/10 rounded-2xl p-8 border border-pink-100 dark:border-pink-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            📊 How Sales Tax Is Calculated
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Sales tax is calculated as a percentage of the purchase price and added at the point of sale. The total
                            rate is the sum of state, county, city, and special district taxes. Understanding each component helps
                            you know where your tax dollars go.
                        </p>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 my-6">
                            <h4 className="font-semibold text-pink-600 dark:text-pink-400 mb-3">The Calculation</h4>
                            <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-6 mb-4">
                                <p className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                    Sales Tax = Purchase Price × Tax Rate
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    Total Cost = Purchase Price + Sales Tax
                                </p>
                            </div>
                            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                                <p><strong>Example 1:</strong> $100 item with 7% tax = $7 tax = $107 total</p>
                                <p><strong>Example 2:</strong> $1,500 laptop with 8.5% tax = $127.50 tax = $1,627.50 total</p>
                                <p><strong>Example 3:</strong> $25,000 car with 6.25% tax = $1,562.50 tax = $26,562.50 total</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Combined Tax Rate Example (Los Angeles, CA)
                            </p>
                            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
                                    <span>California State Tax</span>
                                    <span className="font-semibold">7.25%</span>
                                </div>
                                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
                                    <span>Los Angeles County Tax</span>
                                    <span className="font-semibold">0.25%</span>
                                </div>
                                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
                                    <span>City of LA Tax</span>
                                    <span className="font-semibold">1.50%</span>
                                </div>
                                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
                                    <span>Special District Tax</span>
                                    <span className="font-semibold">1.00%</span>
                                </div>
                                <div className="flex justify-between p-3 bg-pink-50 dark:bg-pink-900/20 rounded border-2 border-pink-500 font-bold">
                                    <span>Total Combined Rate</span>
                                    <span className="text-pink-600 dark:text-pink-400">10.00%</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* State-by-State Rates */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            🗺️ Sales Tax Rates Across America
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Sales tax varies dramatically by state. Some states have no sales tax at all, while others combine
                            state and local taxes to reach double digits. Here's what you need to know about the extremes.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 my-8">
                            <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-6 border border-green-200 dark:border-green-800">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">No Sales Tax States (5)</h4>
                                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                    <p>• <strong>Alaska:</strong> 0% state (locals may charge up to 7.5%)</p>
                                    <p>• <strong>Delaware:</strong> 0% (no state or local tax)</p>
                                    <p>• <strong>Montana:</strong> 0% state (resort areas may charge)</p>
                                    <p>• <strong>New Hampshire:</strong> 0% (no state or local tax)</p>
                                    <p>• <strong>Oregon:</strong> 0% (no state or local tax)</p>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 italic">
                                    Note: These states often have higher income or property taxes to compensate.
                                </p>
                            </div>

                            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-6 border border-red-200 dark:border-red-800">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Highest Combined Rates</h4>
                                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                    <p>• <strong>Louisiana:</strong> Up to 11.45% (state + local)</p>
                                    <p>• <strong>Tennessee:</strong> Up to 9.55% (state + local)</p>
                                    <p>• <strong>Arkansas:</strong> Up to 11.625% (state + local)</p>
                                    <p>• <strong>Alabama:</strong> Up to 13.50% (state + local)</p>
                                    <p>• <strong>California:</strong> Up to 10.75% (state + local)</p>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 italic">
                                    Combined rates include state, county, city, and special district taxes.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Tax-Saving Strategies */}
                    <section className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-8 border border-green-100 dark:border-green-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            💡 Smart Ways to Save on Sales Tax
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Shop During Sales Tax Holidays</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Many states offer sales tax holidays, typically before back-to-school season or hurricane season.
                                    During these periods (usually 2-7 days), certain items are exempt from sales tax. Common categories
                                    include clothing under $100, school supplies, computers, and emergency supplies. Plan major purchases
                                    around these dates to save 5-10%.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Buy in States with Lower or No Sales Tax</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    For major purchases like cars, electronics, or furniture, it might be worth traveling to a neighboring
                                    state with lower sales tax. On a $30,000 car, the difference between 9% and 0% tax is $2,700—more than
                                    enough to cover travel costs. However, check if your home state requires you to pay "use tax" on items
                                    purchased elsewhere.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Know What's Exempt</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Most states exempt groceries, prescription medications, and sometimes clothing from sales tax. Some
                                    states exempt textbooks, newspapers, or manufacturing equipment. Knowing your state's exemptions helps
                                    you budget accurately. For example, buying groceries instead of restaurant meals saves both money and
                                    sales tax.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Use Business Purchases Wisely</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    If you have a business, items purchased for business use may be exempt from sales tax with a resale
                                    certificate or tax-exempt number. This applies to inventory you'll resell, raw materials for manufacturing,
                                    and sometimes equipment. Consult a tax professional to ensure you're using exemptions correctly.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5. Consider Online Shopping Strategically</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Since 2018, most online retailers collect sales tax regardless of where they're located (thanks to the
                                    Supreme Court's Wayfair decision). However, small sellers under certain thresholds may not collect tax.
                                    This isn't tax evasion—you're technically supposed to pay "use tax" on these purchases, but enforcement
                                    is minimal for individuals.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            ❓ Sales Tax Questions
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Do I pay sales tax on online purchases?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Yes, in most cases. Since the 2018 Supreme Court Wayfair decision, online retailers must collect sales
                                    tax if they have "economic nexus" in your state (typically $100,000+ in sales or 200+ transactions).
                                    Major retailers like Amazon collect tax in all states with sales tax. If a seller doesn't collect tax,
                                    you're technically required to pay "use tax" when filing your state tax return.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What items are typically exempt from sales tax?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Common exemptions include groceries (in most states), prescription medications, medical devices, and
                                    sometimes clothing. Some states exempt newspapers, textbooks, or agricultural supplies. Services are
                                    often exempt, though this varies—some states tax haircuts, car repairs, or legal services. Check your
                                    state's department of revenue website for a complete list.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    How is sales tax different from VAT?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Sales tax is charged only at the final point of sale to consumers, while VAT (Value Added Tax, used in
                                    Europe and elsewhere) is charged at each stage of production and distribution. Sales tax is added on top
                                    of the listed price, while VAT is typically included in the price you see. Both are consumption taxes,
                                    but VAT is generally more efficient to collect and harder to evade.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Can I deduct sales tax on my federal tax return?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Yes, if you itemize deductions. You can deduct either state income tax or sales tax (not both). This
                                    benefits people in states with no income tax (like Florida, Texas, Washington) or those who made major
                                    purchases. You can use actual receipts or the IRS's sales tax calculator. However, most people take the
                                    standard deduction instead of itemizing, making this irrelevant.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Why do some states have no sales tax?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    States without sales tax make up the revenue through other means: higher income taxes (Oregon), higher
                                    property taxes (New Hampshire), or resource extraction taxes (Alaska's oil revenue). Delaware attracts
                                    businesses through corporate-friendly laws and fees. Montana relies on tourism and natural resource taxes.
                                    No state can truly operate without tax revenue—it just comes from different sources.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Related Tools Section */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <RelatedCalculators
                            links={[
                                {
                                    href: "/calculators/property-tax",
                                    title: "Property Tax",
                                    description: "Calculate annual property taxes",
                                    icon: Building,
                                    iconColorClass: "text-blue-600",
                                    iconBgClass: "bg-blue-100",
                                    hoverBgClass: "group-hover:bg-blue-600"
                                },
                                {
                                    href: "/calculators/loan",
                                    title: "Loan Calculator",
                                    description: "Plan loan payments and interest",
                                    icon: Calculator,
                                    iconColorClass: "text-green-600",
                                    iconBgClass: "bg-green-100",
                                    hoverBgClass: "group-hover:bg-green-600"
                                },
                                {
                                    href: "/calculators/mortgage",
                                    title: "Mortgage Calculator",
                                    description: "Calculate home loan costs",
                                    icon: Home,
                                    iconColorClass: "text-purple-600",
                                    iconBgClass: "bg-purple-100",
                                    hoverBgClass: "group-hover:bg-purple-600"
                                }
                            ]}
                            title="More Tax and Financial Tools"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
