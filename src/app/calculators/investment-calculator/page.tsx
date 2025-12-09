import React from 'react';
import type { Metadata } from 'next';
import InvestmentCalculator from '@/components/InvestmentCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import {
    Calculator,
    TrendingUp,
    DollarSign,
    HelpCircle,
    Target,
    Shield,
    PiggyBank,
    Zap
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Investment Calculator | SIP, Lumpsum & Goal Planning Calculator',
    description: 'Advanced investment calculator for SIP, lumpsum, and goal planning. Calculate returns, visualize growth with charts, and get AI-powered investment insights. Free, accurate, and easy to use.',
    keywords: 'investment calculator, SIP calculator, lumpsum calculator, systematic investment plan, retirement planning, wealth calculator, compound interest, investment returns, goal planner, financial planning',
};

export default function InvestmentCalculatorPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Hero Section */}
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-900/50 border-b border-gray-200 dark:border-gray-800 pb-12 pt-16 mb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto mb-12">
                        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Build Your Wealth with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                                Smart Investment Planning
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            Calculate investment returns for SIP, lumpsum, or combined strategies. Visualize your wealth growth and get AI-powered insights to reach your financial goals faster.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Calculator Component */}
                <div className="-mt-20 relative z-10">
                    <InvestmentCalculator />
                </div>

                {/* SEO Content */}
                <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-12 space-y-12">

                        {/* Introduction */}
                        <section className="prose dark:prose-invert max-w-none">
                            <h2 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                <Calculator className="w-8 h-8 mr-3 text-purple-600" />
                                🗽 Your Path to Financial Freedom Starts Here
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                Whether you're saving for retirement, a dream home, your child's education, or simply building wealth,
                                understanding how your investments will grow is crucial. Our advanced investment calculator helps you make
                                informed decisions by showing exactly what your money could become over time.
                            </p>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                                With support for multiple investment strategies—lumpsum, SIP (Systematic Investment Plan), combined approaches,
                                step-up SIPs, and goal-based planning—you can model virtually any investment scenario and see your potential
                                future wealth visualized through interactive charts and detailed breakdowns.
                            </p>
                        </section>

                        {/* Investment Types */}
                        <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                📊 Understanding Investment Strategies
                            </h2>

                            <div className="space-y-6">
                                <div className="border-l-4 border-blue-500 pl-6">
                                    <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3">
                                        Lumpsum Investment
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                                        A one-time investment of a significant amount. Best when you have a windfall (bonus, inheritance,
                                        sale proceeds) and want to invest it all at once.
                                    </p>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>Best for:</strong></p>
                                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                                            <li>• Investors with substantial capital available</li>
                                            <li>• Those confident in their market timing</li>
                                            <li>• Long-term wealth building (10+ years)</li>
                                            <li>• Tax-saving fixed deposits or bonds</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="border-l-4 border-green-500 pl-6">
                                    <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-3">
                                        SIP (Systematic Investment Plan)
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                                        Regular, fixed investments made monthly. The most popular and disciplined way to invest,
                                        especially for salaried individuals.
                                    </p>
                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>Best for:</strong></p>
                                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                                            <li>• Salaried professionals with regular income</li>
                                            <li>• Risk-averse investors (rupee cost averaging)</li>
                                            <li>• Building discipline and habit</li>
                                            <li>• Starting small and growing wealth systematically</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="border-l-4 border-purple-500 pl-6">
                                    <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-3">
                                        Step-Up SIP
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                                        A SIP where you increase your investment amount annually (typically 5-15%). This strategy
                                        aligns with your growing income and dramatically accelerates wealth creation.
                                    </p>
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>Why it's powerful:</strong></p>
                                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                                            <li>• Beats inflation automatically</li>
                                            <li>• Compounds wealth exponentially</li>
                                            <li>• Matches salary increments naturally</li>
                                            <li>• Can create 50-100% more wealth than regular SIP</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Investment Formulas */}
                        <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                🧮 The Math Behind the Magic
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Transparency is key to trust. Here are the exact financial formulas used in this calculator to determine your future wealth.
                            </p>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Lumpsum Calculation
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm text-blue-600 dark:text-blue-400 mb-4 overflow-x-auto">
                                        A = P(1 + r)^t
                                    </div>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <li>• <strong>A</strong>: Future Value of the investment</li>
                                        <li>• <strong>P</strong>: Principal amount (initial investment)</li>
                                        <li>• <strong>r</strong>: Annual interest rate (decimal)</li>
                                        <li>• <strong>t</strong>: Number of years</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        SIP Calculation
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm text-green-600 dark:text-green-400 mb-4 overflow-x-auto">
                                        M = P × [((1 + i)^n - 1) / i] × (1 + i)
                                    </div>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <li>• <strong>M</strong>: Maturity Amount</li>
                                        <li>• <strong>P</strong>: Monthly SIP amount</li>
                                        <li>• <strong>i</strong>: Monthly interest rate (Annual Rate / 12 / 100)</li>
                                        <li>• <strong>n</strong>: Total number of months</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* The Power of Compounding */}
                        <section>
                            <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                <Zap className="w-6 h-6 mr-3 text-yellow-600" />
                                ✨ The Magic of Compound Interest
                            </h2>

                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                Albert Einstein called compound interest "the eighth wonder of the world." Those who understand it
                                earn it; those who don't, pay it. When you invest, you earn returns not just on your principal
                                but also on the accumulated interest—this is compounding.
                            </p>

                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800 mb-6">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Real-World Example:</h4>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            <strong className="text-gray-900 dark:text-white">Scenario A:</strong> Start at age 25
                                        </p>
                                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                            <li>• Monthly SIP: $500</li>
                                            <li>• Duration: 35 years (till 60)</li>
                                            <li>• Total invested: $210,000</li>
                                            <li>• @ 12% returns: <strong className="text-green-600 dark:text-green-400">$1.77 Million</strong></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            <strong className="text-gray-900 dark:text-white">Scenario B:</strong> Start at age 35
                                        </p>
                                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                            <li>• Monthly SIP: $500</li>
                                            <li>• Duration: 25 years (till 60)</li>
                                            <li>• Total invested: $150,000</li>
                                            <li>• @ 12% returns: <strong className="text-orange-600 dark:text-orange-400">$567,000</strong></li>
                                        </ul>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 font-medium">
                                    Starting 10 years earlier with $60,000 less investment creates <strong>3.1X more wealth</strong>.
                                    Time is your greatest asset!
                                </p>
                            </div>
                        </section>

                        {/* Smart Investment Strategies */}
                        <section className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-8 border border-green-100 dark:border-green-800">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                📈 7 Smart Strategies to Maximize Returns
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center font-bold mr-4">1</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Start Early, Stay Long</h4>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Time in the market beats timing the market. A 20-year investment horizon gives compounding
                                            room to work its magic. Start with whatever you can afford—even $100/month grows significantly.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center font-bold mr-4">2</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Increase SIP with Salary Hikes</h4>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Every time you get a raise, increase your SIP by at least 50% of the increment. If you got
                                            a 10% raise, bump your SIP by 5%. You won't miss the money, and your wealth will soar.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center font-bold mr-4">3</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Diversify Across Asset Classes</h4>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Don't put all eggs in one basket. Allocate across equity (60-70% for long-term), debt (20-30%),
                                            and gold/commodities (10%). This balances risk and return beautifully.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center font-bold mr-4">4</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Never Stop Your SIPs</h4>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Market crashes are your friends when investing via SIP. You buy more units when prices are low.
                                            Stopping SIPs during downturns is the biggest mistake most investors make.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center font-bold mr-4">5</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Reinvest Dividends & Bonuses</h4>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Got a year-end bonus or tax refund? Resist the urge to splurge. Investing windfalls as lumpsum
                                            additions supercharges your wealth. Your future self will thank you.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center font-bold mr-4">6</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Take Advantage of Tax Benefits</h4>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Invest in tax-advantaged accounts like 401(k), IRA, or ELSS funds (Section 80C in India).
                                            Tax savings are guaranteed returns—often 20-30% right off the bat.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center font-bold mr-4">7</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Review and Rebalance Annually</h4>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Once a year, review your portfolio. If equity has grown to 85% (from your target 70%),
                                            book profits and rebalance to your original allocation. This locks in gains and maintains discipline.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Common Mistakes */}
                        <section>
                            <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                <Shield className="w-6 h-6 mr-3 text-red-600" />
                                🛑 5 Investment Mistakes to Avoid
                            </h2>

                            <div className="space-y-4">
                                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-800">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Chasing Past Performance</h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Just because a fund gave 40% last year doesn't mean it will repeat. Past performance ≠ future results.
                                        Focus on consistency over 5-10 years, not short-term spikes.
                                    </p>
                                </div>

                                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-800">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Trying to Time the Market</h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Professional fund managers with billion-dollar resources can't consistently time markets.
                                        You shouldn't try either. SIPs solve this problem automatically through rupee cost averaging.
                                    </p>
                                </div>

                                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-800">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Ignoring Inflation</h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        If inflation is 5% and your FD gives 6%, you're making only 1% real returns. Always think
                                        in real returns (return minus inflation). Equity historically beats inflation by 6-7%.
                                    </p>
                                </div>

                                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-800">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Not Having Clear Goals</h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Investing without goals is like driving without a destination. Define specific goals
                                        (retirement, house down payment, child's education) and build portfolios for each.
                                    </p>
                                </div>

                                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-800">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5. Panic Selling During Crashes</h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Markets crash 30-40% every few years. That's normal. Selling in panic locks in losses.
                                        History shows markets always recover and reach new highs. Stay calm, keep investing.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section>
                            <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-8">
                                <HelpCircle className="w-6 h-6 mr-3 text-gray-600" />
                                ❓ Frequently Asked Questions
                            </h2>

                            <div className="space-y-6">
                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                        What is a realistic expected return rate?
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        For equity mutual funds or stock index funds, historical averages are 10-12% annually over 15+ years.
                                        Balanced funds (equity + debt) average 8-10%. Pure debt funds give 6-8%. Be conservative in your
                                        estimates—use 10-11% for equity rather than hoping for 15-20%.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                        Is SIP better than lumpsum?
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Both have merits. Lumpsum generates higher returns if markets go up continuously. SIP is better for
                                        discipline, rupee cost averaging, and volatility management. For most people with regular income,
                                        SIP is more practical. But if you have a lumpsum, invest 50% immediately and rest via SIP over 6-12 months.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                        How much should I invest monthly?
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        A good rule: Save at least 20-30% of your take-home salary. Of this, allocate 50% to equity SIPs
                                        (for long-term goals), 30% to debt/PPF (for medium-term goals), and 20% to emergency fund/liquid funds.
                                        If you're starting, even $100-200/month is great—just start!
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                        What if I need to withdraw money before my goal?
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        That's why you maintain separate portfolios for different time horizons. For goals within 3 years,
                                        use debt funds. For 3-7 years, use balanced funds. Only use pure equity for 7+ years. Also,
                                        always keep 6 months of expenses in an emergency fund—never touch your investments for emergencies.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                        Should I invest in individual stocks or mutual funds?
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Unless you're a full-time investor with deep market knowledge, stick to mutual funds or ETFs.
                                        They offer instant diversification across 30-100 companies. Index funds like S&P 500 or Nifty 50
                                        are even better—lower costs, no fund manager risk, and historically beat 80% of active funds over 15+ years.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                        How does Step-Up SIP work?
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Start with a SIP amount you're comfortable with, say $500/month. Every year, increase it by
                                        10-15% (so year 2: $550, year 3: $605, and so on). This keeps pace with your salary growth
                                        and inflation. Over 20-30 years, step-up SIPs can generate 50-100% more wealth than regular SIPs!
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                        What about taxes on investment returns?
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        In the US: Long-term capital gains (held &gt;1 year) on stocks are taxed at 0%, 15%, or 20%
                                        depending on income—much better than your regular income tax rate. Use tax-advantaged accounts
                                        like Roth IRA (grows tax-free) or 401(k) (tax-deferred). In other countries, check ELSS, PPF,
                                        or retirement accounts for tax benefits.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                        Can I become a millionaire with SIP?
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Absolutely! Investing $500/month at 12% returns for 30 years gives you $1.76 million.
                                        Start with $1,000/month, and you get $3.5 million. The key is starting early, staying consistent,
                                        and never stopping. Millions of SIP investors have achieved this—you can too!
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                        What's the minimum investment to start?
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Most mutual funds accept SIPs starting at $100-500/month. Some even allow as low as $25/month.
                                        The important thing is to start. Beginning with $100/month is infinitely better than waiting
                                        to save $10,000. You can always increase it as your income grows.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                        How often should I check my investments?
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        For long-term investments, check quarterly or annually—that's it. Checking daily or weekly
                                        leads to emotional decisions and panic selling. Set up SIPs on autopilot, review once a year
                                        to rebalance if needed, and let compounding work its magic. The less you interfere, the better!
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                </div>

            </div>
            <div className="w-[80%] mx-auto space-y-8 mt-12 bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                <RelatedCalculators
                    links={[
                        {
                            href: "/calculators/compound-interest",
                            title: "Compound Interest",
                            description: "Calculate compound growth",
                            icon: TrendingUp,
                            iconColorClass: "text-blue-600",
                            iconBgClass: "bg-blue-100",
                            hoverBgClass: "group-hover:bg-blue-600"
                        },
                        {
                            href: "/calculators/simple-interest",
                            title: "Simple Interest",
                            description: "Calculate simple returns",
                            icon: DollarSign,
                            iconColorClass: "text-green-600",
                            iconBgClass: "bg-green-100",
                            hoverBgClass: "group-hover:bg-green-600"
                        },
                        {
                            href: "/calculators/real-estate-calculator",
                            title: "Real Estate ROI",
                            description: "Property investment returns",
                            icon: PiggyBank,
                            iconColorClass: "text-purple-600",
                            iconBgClass: "bg-purple-100",
                            hoverBgClass: "group-hover:bg-purple-600"
                        }
                    ]}
                    title="Related Financial Tools"
                />
            </div>
        </div>
    );
}
