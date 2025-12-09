import React from 'react';
import type { Metadata } from 'next';
import BondCalculator from '@/components/BondCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import {
    Calculator,
    TrendingUp,
    DollarSign,
    HelpCircle,
    Shield,
    Clock,
    Landmark,
    Briefcase,
    Activity,
    AlertTriangle
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Bond Calculator | Calculate Price, YTM, and Duration',
    description: 'Advanced Bond Calculator to calculate Bond Price, Yield to Maturity (YTM), Current Yield, and Duration. Visualize "Pull to Par" and assess interest rate risk.',
    keywords: 'bond calculator, bond price calculator, yield to maturity calculator, YTM calculator, bond yield calculator, macaulay duration, bond valuation, fixed income calculator',
};

export default function BondCalculatorPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/10 border-b border-gray-200 dark:border-gray-800 pb-12 pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto mb-12">
                        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Master Your Fixed Income Strategy with Our{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                                Bond Calculator
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            Accurately value bonds, solve for Yield to Maturity (YTM), and analyze interest rate risk with professional-grade tools.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Calculator Component */}
                <div className="-mt-20 relative z-10">
                    <BondCalculator />
                </div>

                {/* SEO Content */}
                <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-12 space-y-12">

                        {/* Introduction */}
                        <section className="prose dark:prose-invert max-w-none">
                            <h2 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                <Landmark className="w-8 h-8 mr-3 text-blue-600" />
                                Understanding Bond Valuation
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                Bonds are the cornerstone of a diversified portfolio, offering predictable income streams and capital preservation. However, valuing them correctly requires understanding the relationship between interest rates, coupon payments, and time.
                            </p>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                                Our calculator performs complex <strong>Discounted Cash Flow (DCF)</strong> analysis instantly. Whether you are a student learning about fixed income or an investor checking a trade, this tool helps you find the theoretical fair value of a bond or determine the yield you are actually earning.
                            </p>
                        </section>

                        {/* How it works */}
                        <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                                📊 Key Metrics Decoded
                            </h2>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mr-4">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Yield to Maturity (YTM)</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                The total annualized return you will earn if you hold the bond until it matures and reinvest all coupons at the same rate. It is the gold standard for comparing bonds.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center mr-4">
                                            <DollarSign className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Current Yield</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                A simple measure of your annual income relative to the bond's current price (Annual Coupon / Price). It ignores capital gains or losses at maturity.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mr-4">
                                            <Activity className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Duration & Convexity</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                Advanced risk metrics. <strong>Duration</strong> measures how sensitive the bond's price is to interest rate changes. Higher duration = higher risk.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center mr-4">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Pull to Par</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                As a bond approaches maturity, its price naturally gravitates towards its Face Value (Par). Our interactive chart visualizes this trajectory.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Guide Section */}
                        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Discount vs. Premium Bonds
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                                Bonds rarely trade exactly at their face value. The market price fluctuates based on prevailing interest rates.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-6 mt-6">
                                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                                        <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                                        Premium Bond (Price {'>'} Par)
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Occurs when the bond's coupon rate is <strong>higher</strong> than current market rates. Investors pay extra to get those juicy coupon payments.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                                        <TrendingUp className="w-4 h-4 mr-2 text-red-500 rotate-180" />
                                        Discount Bond (Price {'<'} Par)
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Occurs when the bond's coupon rate is <strong>lower</strong> than current market rates. The bond sells for less to compensate investors for the lower income.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section>
                            <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-8">
                                <HelpCircle className="w-6 h-6 mr-3 text-gray-600" />
                                Frequently Asked Questions
                            </h2>

                            <div className="space-y-6">
                                {[
                                    {
                                        q: "Why does bond price move inversely to yield?",
                                        a: "It's simple math. If new bonds are issued paying 5%, nobody wants your old bond paying 3% unless you sell it at a discount. Conversely, if rates drop to 2%, your 3% bond becomes valuable and trades at a premium."
                                    },
                                    {
                                        q: "What is Macaulay Duration?",
                                        a: "It is the weighted average time to receive the bond's cash flows. It serves as a measure of interest rate risk. A duration of 5 years means if interest rates rise by 1%, the bond price will fall by approximately 5%."
                                    },
                                    {
                                        q: "What is the 'Face Value'?",
                                        a: "Also known as Par Value, it is the amount the issuer promises to pay back at maturity. It is typically $1,000 for corporate bonds."
                                    },
                                    {
                                        q: "Does this calculator account for Accrued Interest?",
                                        a: "This simplified calculator assumes the valuation is done on a coupon payment date (clean price). In the real market, buyers must also pay the seller for any interest earned since the last coupon date."
                                    },
                                    {
                                        q: "What is a 'Clean Price' vs 'Dirty Price'?",
                                        a: "Clean Price is the price of the bond excluding accrued interest. Dirty Price includes accrued interest and is what you actually pay to buy the bond."
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
                                    href: "/calculators/cd-calculator",
                                    title: "CD Calculator",
                                    description: "Compare bonds with guaranteed bank CDs",
                                    icon: Briefcase,
                                    iconColorClass: "text-blue-600",
                                    iconBgClass: "bg-blue-100",
                                    hoverBgClass: "group-hover:bg-blue-600"
                                },
                                {
                                    href: "/calculators/investment-calculator",
                                    title: "Investment Calculator",
                                    description: "Project stock market growth",
                                    icon: TrendingUp,
                                    iconColorClass: "text-green-600",
                                    iconBgClass: "bg-green-100",
                                    hoverBgClass: "group-hover:bg-green-600"
                                },
                                {
                                    href: "/calculators/compound-interest",
                                    title: "Compound Interest",
                                    description: "See the power of reinvesting coupons",
                                    icon: Calculator,
                                    iconColorClass: "text-purple-600",
                                    iconBgClass: "bg-purple-100",
                                    hoverBgClass: "group-hover:bg-purple-600"
                                }
                            ]}
                            title="Compare Other Investment Options"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
