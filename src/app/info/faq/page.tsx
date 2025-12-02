import React from 'react';
import { Metadata } from 'next';
import { HelpCircle, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'FAQ - Loanly | Frequently Asked Questions',
    description: 'Find answers to common questions about Loanly\'s financial calculators. Learn how to use our mortgage, loan, interest, and tax calculators.',
    alternates: {
        canonical: 'https://loanly.com/info/faq'
    }
};

export default function FAQPage() {
    const faqs = [
        {
            category: 'General Questions',
            questions: [
                {
                    q: 'Is Loanly really free?',
                    a: 'Yes! Loanly is completely free to use. There are no subscriptions, no hidden fees, no premium features, and no credit card required. All our calculators are available to everyone at no cost.'
                },
                {
                    q: 'Do I need to create an account?',
                    a: 'No. You can use all our calculators without creating an account or providing any personal information. Just visit the calculator you need and start calculating.'
                },
                {
                    q: 'Is my data private?',
                    a: 'Absolutely. Your calculations stay on your device. We don\'t collect, store, or share your financial information. See our Privacy Policy for complete details.'
                },
                {
                    q: 'Can I use Loanly on my phone?',
                    a: 'Yes! All our calculators are mobile-responsive and work great on phones, tablets, and desktop computers.'
                }
            ]
        },
        {
            category: 'Calculator Questions',
            questions: [
                {
                    q: 'How accurate are the calculators?',
                    a: 'Our calculators use standard financial formulas and are designed to provide accurate estimates. However, results are estimates only and may not reflect your actual loan terms, which depend on factors like credit score, lender policies, and current market rates.'
                },
                {
                    q: 'Can I save my calculations?',
                    a: 'If you accept cookies, we\'ll save your calculator inputs in your browser\'s session storage so you don\'t lose your work if you refresh the page. This data stays on your device and expires after 24 hours.'
                },
                {
                    q: 'Can I share my calculation results?',
                    a: 'Yes! Click the "Share" button on any calculator to copy a link with your inputs. You can share this link with others, and they\'ll see the same calculation.'
                },
                {
                    q: 'Can I export results to PDF or CSV?',
                    a: 'Yes. Most calculators include export options. Look for the "Export PDF" or "Export CSV" buttons to download your amortization schedules and results.'
                }
            ]
        },
        {
            category: 'Mortgage Calculator',
            questions: [
                {
                    q: 'What\'s included in the monthly payment?',
                    a: 'The mortgage calculator shows principal and interest. You can also add property taxes and homeowners insurance to see your complete monthly housing cost (often called PITI - Principal, Interest, Taxes, Insurance).'
                },
                {
                    q: 'Can I calculate ARM (Adjustable Rate Mortgage) payments?',
                    a: 'Yes! The mortgage calculator supports rate changes. You can add multiple rate adjustments to see how your payment changes over time with an ARM.'
                },
                {
                    q: 'How do I model extra payments?',
                    a: 'Use the "Extra Payments" feature to add one-time or recurring additional payments. The calculator will show you how much interest you\'ll save and how much faster you\'ll pay off your mortgage.'
                }
            ]
        },
        {
            category: 'Interest Calculators',
            questions: [
                {
                    q: 'What\'s the difference between simple and compound interest?',
                    a: 'Simple interest is calculated only on the principal amount. Compound interest is calculated on the principal plus previously earned interest, creating exponential growth. Compound interest typically results in higher returns over time.'
                },
                {
                    q: 'What is APY?',
                    a: 'APY (Annual Percentage Yield) is the effective annual rate of return accounting for compound interest. It\'s always higher than the stated interest rate when compounding occurs more than once per year.'
                },
                {
                    q: 'Which compounding frequency should I choose?',
                    a: 'Use the frequency that matches your investment or savings account. Most US savings accounts compound daily or monthly. Bonds typically compound semi-annually.'
                }
            ]
        },
        {
            category: 'Tax Calculators',
            questions: [
                {
                    q: 'Why don\'t I see my exact local sales tax rate?',
                    a: 'Sales tax rates vary by state, county, and city in the US. We provide common state rates as references, but you should verify your exact local rate for precise calculations.'
                },
                {
                    q: 'How do I find my property tax rate?',
                    a: 'Your property tax rate is usually shown on your annual tax bill or assessment notice. You can also contact your local tax assessor\'s office or check your county\'s website.'
                },
                {
                    q: 'Are these tax calculators for federal taxes?',
                    a: 'No. Our sales tax and property tax calculators are for state and local taxes only. We don\'t currently offer federal income tax calculators.'
                }
            ]
        },
        {
            category: 'Technical Issues',
            questions: [
                {
                    q: 'The calculator isn\'t working. What should I do?',
                    a: 'Try refreshing the page or clearing your browser cache. If the problem persists, please contact us at support@loanly.com with details about the issue and what browser you\'re using.'
                },
                {
                    q: 'Why can\'t I see my saved calculations?',
                    a: 'Calculator sessions are saved in your browser\'s session storage and expire after 24 hours. If you cleared your browser data or declined cookies, your calculations won\'t be saved.'
                },
                {
                    q: 'Which browsers are supported?',
                    a: 'Loanly works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, please use the latest version of your browser.'
                }
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-10 h-10 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    Frequently Asked Questions
                </h1>
            </div>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
                Find answers to common questions about using Loanly's financial calculators.
            </p>

            <div className="space-y-12">
                {faqs.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <ChevronRight className="w-6 h-6 text-blue-600" />
                            {category.category}
                        </h2>
                        <div className="space-y-6">
                            {category.questions.map((faq, faqIndex) => (
                                <div
                                    key={faqIndex}
                                    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                        {faq.q}
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 border border-blue-100 dark:border-blue-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Still Have Questions?
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    If you couldn't find the answer you're looking for, we're here to help!
                </p>
                <a
                    href="/info/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                    Contact Us
                    <ChevronRight className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
}
