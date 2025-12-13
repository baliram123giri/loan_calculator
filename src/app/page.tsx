import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calculator,
  TrendingUp,
  Home,
  DollarSign,
  Percent,
  Receipt,
  ShieldCheck,
  Zap,
  Globe,
  CheckCircle2,
  BarChart3,
  ChevronRight,
  PieChart,
  Wallet,
  Building2,
  FileText,
  Download,
  Layout,
  MousePointer
} from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calcbz - Free US Financial Calculators | Mortgage, Loans, Taxes',
  description: 'Master your money with Calcbz. Free, accurate, and instant financial calculators for mortgages, loans, investments, and US taxes. No login required.',
};

export default function LandingPage() {
  const tools = [
    {
      title: 'Mortgage Calculator',
      description: 'Accurate monthly payments with taxes, insurance & PMI. Model ARM rates and extra payments.',
      icon: Home,
      href: '/calculators/mortgage',
      color: "blue",
      image: "/images/Mortgage.jpg",
      className: "md:col-span-2 md:row-span-2 bg-gradient-to-br from-gray-900 to-black text-white border-none shadow-xl" // Custom premium style
    },
    {
      title: 'Loan Calculator',
      description: 'Personal & Auto Loan payments.',
      icon: Calculator,
      href: '/calculators/loan',
      color: "emerald",
      className: "md:col-span-1 md:row-span-1"
    },
    {
      title: 'Investment',
      description: 'Compound interest & growth.',
      icon: TrendingUp,
      href: '/calculators/investment-calculator',
      color: "violet",
      className: "md:col-span-1 md:row-span-1"
    },
    {
      title: 'Sales Tax',
      description: 'US State tax rates.',
      icon: Receipt,
      href: '/calculators/sales-tax',
      color: "orange",
      className: "md:col-span-1 md:row-span-1"
    },
    {
      title: 'Property Tax',
      description: 'Annual property tax estimator.',
      icon: Building2,
      href: '/calculators/property-tax',
      color: "rose",
      className: "md:col-span-1 md:row-span-1"
    },
    {
      title: 'DTI Ratio',
      description: 'Debt-to-Income check.',
      icon: Percent,
      href: '/calculators/dti-calculator',
      color: "indigo",
      className: "md:col-span-1 md:row-span-1"
    },
    {
      title: 'Compare',
      description: 'Side-by-side loan comparison.',
      icon: Layout,
      href: '/calculators/compare',
      color: "cyan",
      className: "md:col-span-1 md:row-span-1"
    }
  ];

  return (
    <div className="flex flex-col gap-12 pb-12">

      {/* Hero Section - Compact & Punchy */}
      <section className="relative pt-16 pb-12 lg:pt-24 lg:pb-16 overflow-hidden">
        {/* New Gradient Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/20 dark:to-gray-950">
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-blue-100/40 via-purple-100/40 to-pink-100/40 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wide border border-blue-100 dark:border-blue-800">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Updated for 2025
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
            Finance. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Clarified.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Instant, privacy-first calculators for every financial decision. No login, no data storage, just precise numbers.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link
              href="/calculators/mortgage"
              className="px-8 py-3.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg"
            >
              Start Calculating <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Feature Highlights - Explicit User Request */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center mb-3">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">PDF Export</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Download neat, professional reports instantly.</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-3">
                <Layout className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Clean UI/UX</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Distraction-free, modern experience.</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Instant Results</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Real-time calculations as you type.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Tools Section */}
      <section id="all-calculators" className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Popular Tools</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            const isLarge = tool.className?.includes('col-span-2');
            const isDarkCard = tool.className?.includes('text-white');

            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group relative overflow-hidden rounded-3xl border transition-all hover:shadow-2xl hover:-translate-y-1 ${isDarkCard
                  ? tool.className
                  : `bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 ${tool.className || ''}`
                  }`}
              >
                {/* Image Background */}
                {tool.image && (
                  <React.Fragment>
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={tool.image}
                        alt={tool.title}
                        fill
                        className="object-cover transition-opacity duration-500 mix-blend-overlay"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute opacity-30 inset-0 bg-black h-full w-full top-0 left-0" />
                  </React.Fragment>
                )}

                {/* Background Pattern for Dark Card */}
                {isDarkCard && !tool.image && (
                  <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-center" />
                )}
                {/* Hover Gradient for Light Cards */}
                {!isDarkCard && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                <div className="h-full p-6 flex flex-col justify-between relative z-10">
                  <div className="flex justify-between items-start">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${isDarkCard ? 'bg-white/20 backdrop-blur-sm text-white' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {isLarge && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${isDarkCard ? 'bg-white/20 text-white backdrop-blur-md' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        }`}>
                        Most Popular
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className={`font-bold mb-2 transition-colors ${isDarkCard ? 'text-white text-3xl' : 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 text-lg'
                      }`}>
                      {tool.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${isDarkCard ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                      {tool.description}
                    </p>
                  </div>
                </div>
                {/* Decorative element for large card */}
                {isDarkCard && !tool.image && (
                  <Icon className="absolute -bottom-10 -right-10 w-48 h-48 text-white/10 rotate-12 group-hover:rotate-6 transition-transform duration-500" />
                )}
              </Link>
            )
          })}
          {/* Call to Action Card in Grid */}
          <div className="md:col-span-1 md:row-span-1 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 flex flex-col justify-center items-center text-center text-white">
            <h3 className="font-bold text-xl mb-2">More Coming Soon</h3>
            <p className="text-blue-100 text-sm mb-4">We're adding new tools weekly.</p>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Categorized Links - Content Density */}
      <section className="container mx-auto px-4 max-w-6xl py-12 border-t border-gray-200 dark:border-gray-800 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Home className="w-4 h-4 text-blue-500" /> Real Estate
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/calculators/mortgage" className="hover:text-blue-600">Mortgage Calculator</Link></li>
              <li><Link href="/calculators/refinance-calculator" className="hover:text-blue-600">Refinance Analysis</Link></li>
              <li><Link href="/calculators/fha-loan-calculator" className="hover:text-blue-600">FHA Loan</Link></li>
              <li><Link href="/calculators/va-mortgage-calculator" className="hover:text-blue-600">VA Mortgage</Link></li>
              <li><Link href="/calculators/rent-calculator" className="hover:text-blue-600">Rent vs Buy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-500" /> Personal Finance
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/calculators/loan" className="hover:text-emerald-600">Personal Loan</Link></li>
              <li><Link href="/calculators/dti-calculator" className="hover:text-emerald-600">Debt-to-Income</Link></li>
              <li><Link href="/calculators/compare" className="hover:text-emerald-600">Loan Comparison</Link></li>
              <li><Link href="/calculators/simple-interest" className="hover:text-emerald-600">Simple Interest</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-500" /> Investing
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/calculators/investment-calculator" className="hover:text-violet-600">Investment Growth</Link></li>
              <li><Link href="/calculators/compound-interest" className="hover:text-violet-600">Compound Interest</Link></li>
              <li><Link href="/calculators/roi-calculator" className="hover:text-violet-600">ROI Calculator</Link></li>
              <li><Link href="/calculators/average-return-calculator" className="hover:text-violet-600">Average Return</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-orange-500" /> Taxes
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/calculators/sales-tax" className="hover:text-orange-600">Sales Tax</Link></li>
              <li><Link href="/calculators/property-tax" className="hover:text-orange-600">Property Tax</Link></li>
              <li><Link href="/calculators/inflation-calculator" className="hover:text-orange-600">Inflation</Link></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Trust & Educational Content */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Calculations You Can Trust</h2>
            <p className="text-gray-600 dark:text-gray-400">Built on standard industry formulas used by major financial institutions.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Why Accuracy Matters</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                A small error in an interest rate calculation can mean a difference of thousands of dollars over the life of a loan. Calcbz uses precise algorithms to ensure every decimal point is accounted for.
              </p>
              <Link href="/info/about" className="text-blue-600 font-semibold hover:underline">Learn about our mission →</Link>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Privacy by Design</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Financial data is sensitive. That's why we never transmit your input data to any server. All calculations happen locally on your device, ensuring 100% privacy and security.
              </p>
              <Link href="/info/privacy" className="text-blue-600 font-semibold hover:underline">Read our privacy policy →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* New 'Designed for Everyone' Section */}
      <section className="container mx-auto px-4 max-w-6xl py-20">
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-16 text-white text-center overflow-hidden relative shadow-2xl">
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
              Designed for Everyone.
            </h2>
            <p className="text-blue-100 text-lg md:text-xl mb-10 leading-relaxed">
              Whether you're buying your first home, planning for retirement, or just checking your tax rate, Calcbz gives you the power of a financial advisor in your pocket.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
                <div className="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-2">Homebuyers</h3>
                <p className="text-blue-100 text-sm">Navigate mortgage rates, PMI, and property taxes with confidence.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
                <div className="w-12 h-12 bg-white text-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-2">Investors</h3>
                <p className="text-blue-100 text-sm">Visualize compound growth and ROI to maximize your portfolio.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
                <div className="w-12 h-12 bg-white text-violet-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-2">Everyday Use</h3>
                <p className="text-blue-100 text-sm">Quick checks for sales tax, loans, and inflation comparisons.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 max-w-3xl mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "Are Calcbz calculators free?",
              a: "Yes, 100% free. No hidden fees, no paywalls."
            },
            {
              q: "Can I export my results?",
              a: "Absolutely. Use the 'Export PDF' button on any calculator to download a detailed report."
            },
            {
              q: "Is my data secure?",
              a: "Yes. We process everything in your browser. No data is sent to our servers."
            }
          ].map((item, idx) => (
            <details key={idx} className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <summary className="flex items-center justify-between cursor-pointer p-4 font-medium text-gray-900 dark:text-white">
                {item.q}
                <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-4 pb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}
