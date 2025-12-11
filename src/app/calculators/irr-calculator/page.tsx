import React from 'react';
import type { Metadata } from 'next';
import IRRCalculator from '@/components/IRRCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import {
    TrendingUp,
    Calculator,
    DollarSign,
    PieChart,
    HelpCircle,
    ArrowUpRight,
    Target,
    BarChart3,
    CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'IRR Calculator | Internal Rate of Return Calculator - Free Online Tool',
    description: 'Calculate Internal Rate of Return (IRR) instantly with our advanced calculator. Features NPV, MIRR, cash flow analysis, sensitivity charts, and detailed investment reports. Perfect for real estate, business projects, and investment analysis.',
    keywords: 'IRR calculator, internal rate of return, IRR formula, investment calculator, NPV calculator, MIRR calculator, cash flow analysis, real estate IRR, business project IRR, rate of return, discount rate calculator',
    openGraph: {
        title: 'IRR Calculator | Internal Rate of Return Analysis',
        description: 'Calculate IRR, NPV, and MIRR for your investments. Advanced features including cash flow schedules, sensitivity analysis, and AI-powered insights.',
        images: [
            {
                url: '/api/og?title=IRR Calculator&subtitle=Calculate Internal Rate of Return',
                width: 1200,
                height: 630,
                alt: 'IRR Calculator - Internal Rate of Return',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'IRR Calculator | Investment Analysis Tool',
        description: 'Advanced IRR calculator with NPV sensitivity, MIRR, and cash flow analysis',
        images: ['/api/og?title=IRR Calculator&subtitle=Calculate Internal Rate of Return'],
    },
};

export default function IRRCalculatorPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-indigo-950/50 border-b border-gray-200 dark:border-gray-800 pb-16 pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4">
                            <TrendingUp className="w-4 h-4" />
                            <span>Investment Analysis Tool</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                            IRR Calculator <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                Internal Rate of Return
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            Calculate the profitability of your investments with precision. Analyze IRR, NPV, MIRR,
                            and cash flows for real estate, business projects, and investment portfolios.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Calculator Component */}
                <div className="-mt-20 relative z-10">
                    <React.Suspense fallback={
                        <div className="h-96 flex items-center justify-center bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    }>
                        <IRRCalculator />
                    </React.Suspense>
                </div>

                {/* SEO Content */}
                <div className="mt-24 space-y-16">
                    {/* What is IRR */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            <BarChart3 className="w-8 h-8 mr-3 text-indigo-600" />
                            📊 What is Internal Rate of Return (IRR)?
                        </h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            The <strong>Internal Rate of Return (IRR)</strong> is a financial metric used to evaluate the profitability
                            of potential investments. It represents the discount rate at which the Net Present Value (NPV) of all cash
                            flows from a project equals zero. In simpler terms, IRR is the annualized rate of return you can expect
                            from an investment over its lifetime.
                        </p>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                            Unlike simple return calculations, IRR accounts for the <em>time value of money</em> – the principle that
                            money today is worth more than the same amount in the future. This makes IRR particularly useful for comparing
                            investments with different time horizons and cash flow patterns.
                        </p>

                        <div className="grid md:grid-cols-3 gap-6 mt-8">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900/50">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Time Value of Money</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    IRR accounts for when cash flows occur, recognizing that earlier returns are more valuable than later ones.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-6 rounded-xl border border-purple-100 dark:border-purple-900/50">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4">
                                    <Target className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Universal Benchmark</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Express returns as a percentage, making it easy to compare different investments regardless of size or duration.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-6 rounded-xl border border-green-100 dark:border-green-900/50">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-4">
                                    <ArrowUpRight className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Investment Decision Tool</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    If IRR exceeds your required rate of return (hurdle rate), the investment creates value. If not, it destroys value.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* IRR Formula */}
                    <section className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-900/50">
                        <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            🧮 The IRR Formula & How It's Calculated
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            The IRR is the rate (r) that satisfies this equation, where NPV equals zero:
                        </p>

                        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl font-mono text-base text-indigo-600 dark:text-indigo-400 mb-6 overflow-x-auto border border-gray-200 dark:border-gray-800 shadow-sm">
                            <div className="text-center">
                                NPV = Σ [CF<sub>t</sub> / (1 + IRR)<sup>t</sup>] = 0
                            </div>
                            <div className="text-sm mt-4 text-gray-600 dark:text-gray-400 text-center">
                                Where CF<sub>t</sub> = Cash flow at time t | IRR = Internal Rate of Return | t = Time period
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    Newton-Raphson Method
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    Since the IRR equation cannot be solved algebraically for most real-world cash flow series,
                                    we use the <strong>Newton-Raphson iterative method</strong>:
                                </p>
                                <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                                    <li><strong>Start with an initial guess</strong> (typically 10%)</li>
                                    <li><strong>Calculate NPV</strong> at that rate</li>
                                    <li><strong>Calculate the derivative</strong> of NPV with respect to the discount rate</li>
                                    <li><strong>Update the guess</strong> using: New IRR = Old IRR - (NPV / dNPV)</li>
                                    <li><strong>Repeat</strong> until NPV is sufficiently close to zero (convergence)</li>
                                </ol>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <strong>💡 Pro Tip:</strong> Our calculator uses a tolerance of 0.00001 and a maximum of 100 iterations
                                    to ensure accurate results. If IRR doesn't converge, you'll see a warning in your results.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* How to Interpret IRR */}
                    <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                            💡 How to Interpret Your IRR Results
                        </h2>

                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-200 dark:border-green-800">
                                    <h3 className="font-bold text-green-900 dark:text-green-100 text-lg mb-2 flex items-center">
                                        <span className="text-2xl mr-2">✅</span>
                                        Good IRR
                                    </h3>
                                    <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                                        <li>• <strong>Above 15%:</strong> Excellent for most investments</li>
                                        <li>• <strong>10-15%:</strong> Beats stock market average</li>
                                        <li>• <strong>Above hurdle rate:</strong> Creates shareholder value</li>
                                        <li>• <strong>Real estate:</strong> 8-12% is typically considered good</li>
                                    </ul>
                                </div>

                                <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl border border-red-200 dark:border-red-800">
                                    <h3 className="font-bold text-red-900 dark:text-red-100 text-lg mb-2 flex items-center">
                                        <span className="text-2xl mr-2">⚠️</span>
                                        Warning Signs
                                    </h3>
                                    <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                                        <li>• <strong>Below WACC:</strong> Destroys company value</li>
                                        <li>• <strong>Below inflation:</strong> Losing purchasing power</li>
                                        <li>• <strong>Negative IRR:</strong> Project loses money</li>
                                        <li>• <strong>Too high (&gt;30%):</strong> Verify inputs, might be unrealistic</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-5 rounded-xl border border-amber-200 dark:border-amber-800">
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-3">
                                    📏 Decision Rule
                                </h3>
                                <div className="grid md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="font-semibold text-green-700 dark:text-green-400 mb-1">IRR &gt; Hurdle Rate</p>
                                        <p className="text-gray-700 dark:text-gray-300">✓ Accept the project</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-yellow-700 dark:text-yellow-400 mb-1">IRR = Hurdle Rate</p>
                                        <p className="text-gray-700 dark:text-gray-300">⚖️ Break-even, neutral</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-red-700 dark:text-red-400 mb-1">IRR &lt; Hurdle Rate</p>
                                        <p className="text-gray-700 dark:text-gray-300">✗ Reject the project</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* IRR vs Other Metrics */}
                    <section>
                        <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-8">
                            <PieChart className="w-6 h-6 mr-3 text-gray-600" />
                            📈 IRR vs Other Investment Metrics
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    title: 'IRR vs ROI',
                                    irr: 'Annualized rate, accounts for time value of money, considers cash flow timing',
                                    other: 'Simple percentage return, ignores time value, doesn\'t account for timing',
                                    winner: 'IRR is better for multi-period investments'
                                },
                                {
                                    title: 'IRR vs NPV',
                                    irr: 'Returns a percentage rate, relative measure, can\'t show absolute value',
                                    other: 'Returns dollar amount, absolute measure, shows total value created',
                                    winner: 'Use both together for comprehensive analysis'
                                },
                                {
                                    title: 'IRR vs Payback Period',
                                    irr: 'Considers all cash flows, accounts for time value, shows profitability',
                                    other: 'Only shows time to recover investment, ignores later cash flows',
                                    winner: 'IRR provides more complete picture'
                                },
                                {
                                    title: 'IRR vs MIRR',
                                    irr: 'Assumes reinvestment at IRR rate, can have multiple solutions',
                                    other: 'Uses realistic reinvestment rate, always gives single answer',
                                    winner: 'MIRR is more conservative and realistic'
                                }
                            ].map((comparison, idx) => (
                                <div key={idx} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">
                                        {comparison.title}
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex gap-2">
                                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[50px]">IRR:</span>
                                            <p className="text-gray-600 dark:text-gray-400">{comparison.irr}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-purple-600 dark:text-purple-400 font-semibold min-w-[50px]">Other:</span>
                                            <p className="text-gray-600 dark:text-gray-400">{comparison.other}</p>
                                        </div>
                                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                            <p className="text-green-600 dark:text-green-400 font-semibold">
                                                ✓ {comparison.winner}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section>
                        <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-8">
                            <HelpCircle className="w-6 h-6 mr-3 text-gray-600" />
                            ❓ Frequently Asked Questions
                        </h2>

                        <div className="space-y-6">
                            {[
                                {
                                    q: "What is a good IRR for an investment?",
                                    a: "A 'good' IRR depends on your industry and risk profile. Generally, 10-15% is considered solid for most investments, beating the stock market average of ~10%. Real estate typically targets 8-12%, while venture capital might seek 20-30%. The key is that your IRR should exceed your weighted average cost of capital (WACC) or hurdle rate."
                                },
                                {
                                    q: "What's the difference between IRR and ROI?",
                                    a: "ROI (Return on Investment) is a simple calculation: (Gain - Cost) / Cost × 100. It doesn't account for the time value of money or when cash flows occur. IRR, on the other hand, is an annualized rate that considers the timing of all cash flows. For a one-year investment, they might be similar, but for multi-year projects, IRR gives a much more accurate picture of profitability."
                                },
                                {
                                    q: "Can IRR be negative?",
                                    a: "Yes, a negative IRR means the investment loses money over time. It indicates that even with a 0% discount rate, the project's cash outflows exceed its inflows. This is a clear signal to reject the investment unless there are significant non-financial strategic reasons to proceed."
                                },
                                {
                                    q: "How do you calculate IRR manually?",
                                    a: "Calculating IRR manually is extremely difficult because the IRR equation cannot be solved directly. You would need to use trial and error: guess a discount rate, calculate NPV, adjust your guess based on whether NPV is positive or negative, and repeat until NPV ≈ 0. This is why we use iterative algorithms like Newton-Raphson in our calculator, which can find the answer in seconds with high precision."
                                },
                                {
                                    q: "When should I use MIRR instead of IRR?",
                                    a: "Use MIRR (Modified IRR) when: (1) You want a more realistic assumption about reinvestment rates – IRR assumes you can reinvest at the same IRR, which is often overly optimistic; (2) Your project has both positive and negative cash flows after the initial investment (non-conventional cash flows); (3) You're comparing projects with very different scales. MIRR addresses IRR's main weaknesses and often provides a more conservative estimate."
                                },
                                {
                                    q: "What are IRR's limitations?",
                                    a: "IRR has several important limitations: (1) It doesn't show the absolute value of an investment (NPV does); (2) It assumes reinvestment at the IRR rate, which may be unrealistic; (3) Projects with non-conventional cash flows can have multiple IRRs; (4) It can mislead when comparing projects of different sizes or durations. Always use IRR alongside NPV, payback period, and qualitative factors for comprehensive investment decisions."
                                }
                            ].map((faq, index) => (
                                <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">
                                        {faq.q}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Related Calculators */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <RelatedCalculators
                            links={[
                                {
                                    href: "/calculators/investment-calculator",
                                    title: "Investment Calculator",
                                    description: "Calculate SIP, lumpsum, and step-up returns",
                                    icon: TrendingUp,
                                    iconColorClass: "text-blue-600",
                                    iconBgClass: "bg-blue-100",
                                    hoverBgClass: "group-hover:bg-blue-600"
                                },
                                {
                                    href: "/calculators/average-return-calculator",
                                    title: "CAGR Calculator",
                                    description: "Calculate compound annual growth rate",
                                    icon: BarChart3,
                                    iconColorClass: "text-green-600",
                                    iconBgClass: "bg-green-100",
                                    hoverBgClass: "group-hover:bg-green-600"
                                },
                                {
                                    href: "/calculators/real-estate-calculator",
                                    title: "Real Estate ROI",
                                    description: "Analyze property investment returns",
                                    icon: DollarSign,
                                    iconColorClass: "text-purple-600",
                                    iconBgClass: "bg-purple-100",
                                    hoverBgClass: "group-hover:bg-purple-600"
                                }
                            ]}
                            title="Related Investment Tools"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
