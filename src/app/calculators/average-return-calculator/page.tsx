import React from 'react';
import type { Metadata } from 'next';
import AverageReturnCalculator from '@/components/AverageReturnCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import {
    Calculator,
    TrendingUp,
    Percent,
    PieChart,
    BarChart3,
    ArrowUpRight,
    HelpCircle
} from 'lucide-react';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
    const params = await searchParams;
    const initial = params?.initialInvestment ? Number(params.initialInvestment).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) : null;
    const final = params?.finalValue ? Number(params.finalValue).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) : null;

    let ogParams = new URLSearchParams();
    ogParams.set('title', 'Average Return Calculator');

    if (initial && final) {
        ogParams.set('subtitle', `My investment grew from ${initial} to ${final}`);

        // Calculate rough CAGR if possible for the highlight
        ogParams.set('highlight', 'See my results 🚀');
    } else {
        ogParams.set('subtitle', 'Calculate CAGR & Real Returns instantly');
    }

    const ogUrl = `/api/og?${ogParams.toString()}`;

    return {
        title: 'Average Return Calculator | Calculate CAGR & Total Return',
        description: 'Calculate average annual return (CAGR), total return, and real return adjusted for inflation. Free online Rate of Return calculator for investors.',
        keywords: 'average return calculator, rate of return calculator, CAGR calculator, investment return, annualized return calculator, portfolio growth',
        openGraph: {
            title: 'Average Return Calculator | calcbz.com',
            description: initial && final ? `Check out this calculation: ${initial} → ${final}` : 'Determine the true performance of your investments.',
            images: [
                {
                    url: ogUrl,
                    width: 1200,
                    height: 630,
                    alt: 'Average Return Calculator Result',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Average Return Calculator | calcbz.com',
            description: initial && final ? `Check out this calculation: ${initial} → ${final}` : 'Determine the true performance of your investments.',
            images: [ogUrl],
        }
    };
}

export default function AverageReturnCalculatorPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950/50 border-b border-gray-200 dark:border-gray-800 pb-16 pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4">
                            <TrendingUp className="w-4 h-4" />
                            <span>Investment Analysis Tool</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Average Return <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">
                                Calculator
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            Determine the true performance of your investments. Calculate Compound Annual Growth Rate (CAGR),
                            simple average returns, and inflation-adjusted real returns in seconds.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Calculator Component */}
                <div className="-mt-20 relative z-10">
                    <React.Suspense fallback={<div className="h-96 flex items-center justify-center bg-white dark:bg-gray-900 rounded-xl shadow-lg"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
                        <AverageReturnCalculator />
                    </React.Suspense>
                </div>

                {/* SEO Content */}
                <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-12 space-y-12">

                        {/* Introduction */}
                        <section className="prose dark:prose-invert max-w-none">
                            <h2 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                <BarChart3 className="w-8 h-8 mr-3 text-indigo-600" />
                                📈 Understanding Your Rate of Return
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                Whether you're analyzing a stock, a mutual fund, or a real estate investment, knowing your actual
                                rate of return is crucial. The <strong>Average Return Calculator</strong> helps you look past simple
                                price changes to understand the <em>annualized</em> efficiency of your capital.
                            </p>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                                Most investors confuse "Total Return" with "Annualized Return". Total return tells you how much you made in total,
                                but it ignores time. Making 50% in 1 year is very different from making 50% in 10 years. Our calculator
                                uses <strong>CAGR (Compound Annual Growth Rate)</strong> to give you the true annual speed of success.
                            </p>
                        </section>

                        {/* Math Formulas Section */}
                        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-8 border border-blue-100 dark:border-blue-900/50">
                            <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                🧮 The Formulas We Use
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-6">
                                Transparency is key. Here is exactly how we calculate your returns:
                            </p>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        1. CAGR (Compound Annual Growth Rate)
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        The geometric progression ratio that provides a constant rate of return over the time period.
                                    </p>
                                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg font-mono text-sm text-indigo-600 dark:text-indigo-400 mb-4 overflow-x-auto border border-gray-200 dark:border-gray-800 shadow-sm">
                                        CAGR = ( End Value / Start Value )^(1 / n) - 1
                                    </div>
                                    <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-500">
                                        <li>• <strong>n</strong>: Number of years</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        2. Total Return %
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        The simple percentage change from start to finish, ignoring time.
                                    </p>
                                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg font-mono text-sm text-indigo-600 dark:text-indigo-400 mb-4 overflow-x-auto border border-gray-200 dark:border-gray-800 shadow-sm">
                                        Total Return = ((End - Start) / Start) × 100
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Concept Explanations */}
                        <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                                💡 Key Concepts Explained
                            </h2>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-4">
                                        <ArrowUpRight className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">CAGR vs Simple Average</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        <strong>Simple Average</strong> just divides total return by years. It overestimates return because it ignores the effect of compounding.
                                        <strong>CAGR</strong> is more accurate for investments that compound over time.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center mb-4">
                                        <Percent className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Impact of Inflation</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        Inflation eats away at your purchasing power. A 7% return with 3% inflation is really only a 4% "Real Return".
                                        Always check the real return metric.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4">
                                        <PieChart className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Geometric Mean</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        CAGR is technically a "geometric mean". It smoothes out the volatility of an investment's journey to a single constant growth rate
                                        that connects the start and end points.
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
                                {[
                                    {
                                        q: "What is a good Average Annual Return?",
                                        a: "Historically, the S&P 500 has returned about 10% annually (before inflation). A good return usually beats this benchmark or at least beats inflation (2-3%) by a healthy margin."
                                    },
                                    {
                                        q: "Why is CAGR lower than Simple Average?",
                                        a: "Because of volatility. If you lose 50% one year, you need a 100% gain the next just to break even. Simple average would say (-50+100)/2 = +25%, but your actual money growth is 0%. CAGR captures this reality."
                                    },
                                    {
                                        q: "How do I calculate returns for fractional years?",
                                        a: "Our calculator checks the 'Months' input. The formula uses fractional exponents (e.g., ^(1/2.5) for 2.5 years) to accurately compute the rate for any duration."
                                    },
                                    {
                                        q: "Does this calculator account for dividends?",
                                        a: "Only if you include reinvested dividends in your 'Final Value'. If you took dividends as cash, add them to your final value to get your Total Return."
                                    }
                                ].map((faq, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                            {faq.q}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {faq.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Related Tools Section */}
                    <div className="lg:col-span-12 bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <RelatedCalculators
                            links={[
                                {
                                    href: "/calculators/investment-calculator",
                                    title: "Investment Calculator",
                                    description: "Project future value with contributions",
                                    icon: TrendingUp,
                                    iconColorClass: "text-blue-600",
                                    iconBgClass: "bg-blue-100",
                                    hoverBgClass: "group-hover:bg-blue-600"
                                },
                                {
                                    href: "/calculators/compound-interest",
                                    title: "Compound Interest",
                                    description: "Visualize compounding effects",
                                    icon: Calculator,
                                    iconColorClass: "text-green-600",
                                    iconBgClass: "bg-green-100",
                                    hoverBgClass: "group-hover:bg-green-600"
                                },
                                {
                                    href: "/calculators/inflation-calculator",
                                    title: "Inflation Calculator",
                                    description: "Calculate purchasing power loss",
                                    icon: Percent,
                                    iconColorClass: "text-purple-600",
                                    iconBgClass: "bg-purple-100",
                                    hoverBgClass: "group-hover:bg-purple-600"
                                }
                            ]}
                            title="More Investment Tools"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
