import React from 'react';
import Link from 'next/link';
import { Calculator, Scale, Percent, Receipt, PiggyBank, Home, DollarSign } from 'lucide-react';

export default function LandingPage() {
  const tools = [
    {
      title: 'Mortgage Calculator',
      description: 'Calculate monthly mortgage payments with taxes and insurance.',
      icon: Home,
      href: '/calculators/mortgage',
      color: 'bg-blue-500'
    },
    {
      title: 'Loan Calculator',
      description: 'Generic loan calculator for personal, car, or education loans.',
      icon: Calculator,
      href: '/calculators/loan',
      color: 'bg-green-500'
    },
    {
      title: 'Simple Interest',
      description: 'Calculate simple interest with yearly breakdown.',
      icon: Percent,
      href: '/calculators/simple-interest',
      color: 'bg-purple-500'
    },
    {
      title: 'Compound Interest',
      description: 'Calculate compound interest with multiple frequencies.',
      icon: Percent,
      href: '/calculators/compound-interest',
      color: 'bg-indigo-500'
    },
    {
      title: 'Sales Tax',
      description: 'Calculate sales tax for any US state.',
      icon: Receipt,
      href: '/calculators/sales-tax',
      color: 'bg-orange-500'
    },
    {
      title: 'Property Tax',
      description: 'Estimate property taxes based on home value.',
      icon: DollarSign,
      href: '/calculators/property-tax',
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
          US Finance Calculator Suite
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400">
          Free, accurate, and easy-to-use financial calculators for your everyday needs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="relative group bg-white dark:bg-gray-900 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800"
            >
              <div className={`rounded-lg inline-flex p-3 ring-4 ring-white dark:ring-gray-900 ${tool.color} text-white`}>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {tool.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {tool.description}
                </p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
