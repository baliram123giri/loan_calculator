import React from 'react';
import type { Metadata } from 'next';
import DownPaymentCalculator from '@/components/DownPaymentCalculator';
import DownPaymentSeoContent from '@/components/DownPaymentSeoContent';

export const metadata: Metadata = {
    title: 'Down Payment Calculator | Calculate Cash to Close & PMI',
    description: 'Free Down Payment Calculator. Estimate your upfront cash to close, monthly payments, and see how different down payment amounts affect your loan and PMI.',
    keywords: 'down payment calculator, cash to close calculator, mortgage down payment, PMI calculator, closing costs calculator, home buying calculator',
    openGraph: {
        title: 'Down Payment Calculator | Calculate Cash to Close & PMI',
        description: 'Calculate your total cash to close and see how your down payment affects your monthly mortgage payment and PMI.',
        type: 'website',
    }
};

export default function DownPaymentCalculatorPage() {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                    Plan Your Down Payment with{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                        Precision
                    </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    Determine how much you should put down on a house and calculate your total cash to close, including closing costs.
                </p>
            </header>

            <section aria-label="Down payment calculator tool">
                <DownPaymentCalculator />
            </section>

            {/* SEO Content */}
            <DownPaymentSeoContent />
        </main>
    );
}
