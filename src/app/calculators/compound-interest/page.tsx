import React from 'react';
import CompoundInterestCalculator from '@/components/CompoundInterestCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Percent, Home, DollarSign } from 'lucide-react';
import { generateCalculatorMetadata } from '@/lib/seo/metadata';
import { calculatorSchemas } from '@/lib/seo/schema';

export const metadata = generateCalculatorMetadata('compound-interest');
export const dynamic = 'force-dynamic';

export default function CompoundInterestPage() {
    const schemas = [
        calculatorSchemas['compound-interest'].software,
        calculatorSchemas['compound-interest'].breadcrumb
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
                        Compound Interest Calculator
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Calculate how your investments grow with the power of compound interest and regular contributions.
                    </p>
                </div>

                <CompoundInterestCalculator />

                {/* SEO Content */}
                <div className="max-w-4xl mx-auto mt-16 space-y-12">
                    {/* Introduction Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            The Power of Compound Interest
                        </h2>

                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Albert Einstein allegedly called compound interest "the eighth wonder of the world," saying "He who
                            understands it, earns it; he who doesn't, pays it." Whether or not he actually said this, the sentiment
                            is true: compound interest is the most powerful force in building wealth over time. It's the reason
                            starting to save early makes such a dramatic difference in your financial future.
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Unlike simple interest, which only earns interest on your initial investment, compound interest earns
                            interest on your interest. This creates exponential growth that accelerates over time. The longer your
                            money compounds, the more dramatic the effect becomes.
                        </p>
                    </section>

                    {/* How Compound Interest Works */}
                    <section className="bg-teal-50 dark:bg-teal-900/10 rounded-2xl p-8 border border-teal-100 dark:border-teal-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            How Compound Interest Works
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Compound interest calculates interest on both your initial principal and all previously earned interest.
                            Each compounding period, your balance grows, and the next period's interest is calculated on this larger
                            amount. This creates a snowball effect that accelerates your wealth growth.
                        </p>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 my-6">
                            <h4 className="font-semibold text-teal-600 dark:text-teal-400 mb-3">The Compound Interest Formula</h4>
                            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-6 mb-4">
                                <p className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                                    A = P(1 + r/n)^(nt)
                                </p>
                                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                    <p><strong>A</strong> = Final amount</p>
                                    <p><strong>P</strong> = Principal (initial investment)</p>
                                    <p><strong>r</strong> = Annual interest rate (as decimal)</p>
                                    <p><strong>n</strong> = Number of times interest compounds per year</p>
                                    <p><strong>t</strong> = Number of years</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Example: The Difference Compounding Makes
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                <strong className="text-teal-600 dark:text-teal-400">$10,000 invested at 7% for 30 years:</strong>
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Simple Interest</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Interest: $700/year<br />
                                        Total interest: $21,000<br />
                                        <strong>Final amount: $31,000</strong>
                                    </p>
                                </div>
                                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 border-2 border-teal-500">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Compound Interest (Annual)</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Interest: Grows each year<br />
                                        Total interest: $66,148<br />
                                        <strong className="text-teal-600 dark:text-teal-400">Final amount: $76,148</strong><br />
                                        <strong className="text-green-600 dark:text-green-400">$45,148 more!</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Compounding Frequency */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Compounding Frequency Matters
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            How often your interest compounds significantly impacts your returns. The more frequently interest
                            compounds, the more you earn. Here's how different compounding frequencies compare on the same investment.
                        </p>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 my-6 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                                $10,000 at 6% for 10 Years
                            </p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                    <span className="font-medium text-gray-900 dark:text-white">Annually (1x/year)</span>
                                    <span className="text-gray-700 dark:text-gray-300">$17,908</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                    <span className="font-medium text-gray-900 dark:text-white">Semi-Annually (2x/year)</span>
                                    <span className="text-gray-700 dark:text-gray-300">$18,061</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                    <span className="font-medium text-gray-900 dark:text-white">Quarterly (4x/year)</span>
                                    <span className="text-gray-700 dark:text-gray-300">$18,140</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                    <span className="font-medium text-gray-900 dark:text-white">Monthly (12x/year)</span>
                                    <span className="text-gray-700 dark:text-gray-300">$18,194</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border-2 border-teal-500">
                                    <span className="font-medium text-gray-900 dark:text-white">Daily (365x/year)</span>
                                    <span className="font-bold text-teal-600 dark:text-teal-400">$18,221</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 italic">
                                Daily compounding earns $313 more than annual compounding—free money just for choosing the right account!
                            </p>
                        </div>
                    </section>

                    {/* Wealth-Building Strategies */}
                    <section className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-8 border border-green-100 dark:border-green-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Maximize Your Compound Interest Growth
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Start as Early as Possible</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Time is your greatest asset with compound interest. Starting at age 25 versus 35 can mean hundreds
                                    of thousands more at retirement. A 25-year-old investing $200/month at 8% will have $700,000 at 65.
                                    Starting at 35? Only $300,000. Those 10 years cost $400,000!
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Make Regular Contributions</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Adding money regularly dramatically accelerates growth. $10,000 invested once at 7% becomes $76,000
                                    in 30 years. But $10,000 plus $200/month becomes $254,000—over 3x more! Automate contributions to
                                    make it effortless and take advantage of dollar-cost averaging.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Seek Higher Returns (Wisely)</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    A 2% difference in returns has massive long-term impact. $10,000 at 6% for 30 years = $57,000. At
                                    8%? $100,000. At 10%? $175,000. However, higher returns usually mean higher risk. Diversify your
                                    investments and match risk to your timeline and goals.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Reinvest All Dividends and Interest</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Taking dividends as cash kills compounding. Reinvesting them supercharges it. Over 30 years,
                                    reinvested dividends can account for 40-50% of total returns in stock investments. Set all
                                    investment accounts to automatically reinvest dividends and interest.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5. Minimize Fees and Taxes</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    A 1% annual fee doesn't sound like much, but it can cost you 25-30% of your wealth over 30 years.
                                    Choose low-cost index funds (0.03-0.20% fees) over actively managed funds (1-2% fees). Use
                                    tax-advantaged accounts (401k, IRA, HSA) to let your money compound tax-free or tax-deferred.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            Compound Interest Questions
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What's the Rule of 72?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    The Rule of 72 is a quick way to estimate how long it takes to double your money. Divide 72 by
                                    your annual return rate. At 6%, your money doubles in 12 years (72÷6). At 8%, it doubles in 9
                                    years (72÷8). At 10%, just 7.2 years. This rule works best for rates between 6-10%.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    How much should I save for retirement using compound interest?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    A common rule is to save 15% of your gross income starting in your 20s. If you start at 25, saving
                                    $500/month (15% of $40,000 salary) at 8% average returns gives you $1.7 million by 65. Start at 35?
                                    You'd need to save $1,000/month to reach the same goal. The earlier you start, the less you need to
                                    save monthly.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What's a realistic rate of return for long-term investing?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Historically, the S&P 500 has returned about 10% annually before inflation, or 7% after inflation.
                                    Conservative portfolios (bonds, cash) might return 3-5%. Aggressive portfolios (stocks) might return
                                    8-10%. For planning, using 6-8% is reasonable for a balanced portfolio. Never assume you'll beat the
                                    market—most professional investors don't.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Should I pay off debt or invest for compound interest?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Compare interest rates. If you have credit card debt at 18%, pay that off first—you're guaranteed
                                    an 18% "return" by eliminating that interest. Low-rate debt like a 3% mortgage? Invest instead, as
                                    you can likely earn 7-8% in the market. Always pay off high-interest debt (&gt;7%) before investing,
                                    and build a 3-6 month emergency fund first.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    How does inflation affect compound interest?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Inflation erodes purchasing power, so focus on "real returns" (returns minus inflation). If you
                                    earn 8% but inflation is 3%, your real return is 5%. At 3% inflation, $100,000 today will only
                                    have the buying power of $55,000 in 20 years. This is why you need investments that outpace
                                    inflation—savings accounts at 0.5% lose money in real terms.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Related Tools Section */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <RelatedCalculators
                            links={[
                                {
                                    href: "/calculators/simple-interest",
                                    title: "Simple Interest",
                                    description: "Compare with simple interest calculations",
                                    icon: Percent,
                                    iconColorClass: "text-blue-600",
                                    iconBgClass: "bg-blue-100",
                                    hoverBgClass: "group-hover:bg-blue-600"
                                },
                                {
                                    href: "/calculators/mortgage",
                                    title: "Mortgage Calculator",
                                    description: "Plan your home purchase",
                                    icon: Home,
                                    iconColorClass: "text-green-600",
                                    iconBgClass: "bg-green-100",
                                    hoverBgClass: "group-hover:bg-green-600"
                                },
                                {
                                    href: "/calculators/house-affordability",
                                    title: "House Affordability",
                                    description: "Determine your buying power",
                                    icon: DollarSign,
                                    iconColorClass: "text-purple-600",
                                    iconBgClass: "bg-purple-100",
                                    hoverBgClass: "group-hover:bg-purple-600"
                                }
                            ]}
                            title="Plan Your Financial Future"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
