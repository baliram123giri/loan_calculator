import React from 'react';
import { Metadata } from 'next';
import { AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Disclaimer - Loanly | Important Information',
    description: 'Read Loanly\'s disclaimer. Understand the limitations and proper use of our financial calculators.',
    alternates: {
        canonical: 'https://loanly.com/info/disclaimer'
    }
};

export default function DisclaimerPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-10 h-10 text-yellow-600" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    Disclaimer
                </h1>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                Last Updated: November 30, 2024
            </p>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800 mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Please Read Carefully
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                    The information and calculators provided on Loanly are for general informational and educational purposes only. They should not be considered as professional financial, investment, tax, or legal advice.
                </p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Professional Relationship</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        Using our calculators does not create any professional relationship between you and Loanly. We are not:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                        <li>Financial advisors or planners</li>
                        <li>Investment advisors</li>
                        <li>Tax professionals or CPAs</li>
                        <li>Attorneys or legal counsel</li>
                        <li>Mortgage brokers or lenders</li>
                        <li>Insurance agents</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Accuracy and Completeness</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        While we make every effort to ensure our calculators are accurate and up-to-date:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Results are estimates based on the information you provide</li>
                        <li>Calculations may not account for all variables affecting your specific situation</li>
                        <li>Interest rates, tax rates, and regulations change frequently</li>
                        <li>We cannot guarantee the accuracy, completeness, or timeliness of any information</li>
                        <li>Actual results may differ significantly from calculator estimates</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Not a Substitute for Professional Advice</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Our calculators are tools to help you understand financial concepts and estimate potential outcomes. They are NOT substitutes for:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li><strong>Financial Planning:</strong> Consult a certified financial planner for personalized investment and retirement advice</li>
                        <li><strong>Tax Advice:</strong> Consult a CPA or tax professional for tax planning and filing</li>
                        <li><strong>Legal Advice:</strong> Consult an attorney for legal matters related to contracts, real estate, or financial agreements</li>
                        <li><strong>Mortgage Decisions:</strong> Consult with lenders and mortgage brokers for actual loan terms and approval</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Individual Circumstances</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        Every person's financial situation is unique. Factors that may affect your actual results include:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                        <li>Credit score and credit history</li>
                        <li>Income, employment status, and job stability</li>
                        <li>Existing debts and financial obligations</li>
                        <li>Local and state regulations</li>
                        <li>Market conditions and economic factors</li>
                        <li>Lender-specific requirements and fees</li>
                        <li>Property characteristics and location</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Guarantees</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        We make no guarantees, representations, or warranties regarding:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                        <li>Loan approval or qualification</li>
                        <li>Interest rates or terms you may receive</li>
                        <li>Tax savings or liabilities</li>
                        <li>Investment returns or performance</li>
                        <li>Financial outcomes or results</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Third-Party Links</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        Our website may contain links to third-party websites for your convenience. We do not endorse, control, or assume responsibility for the content, privacy policies, or practices of any third-party sites. Use of third-party sites is at your own risk.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes and Updates</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        Financial regulations, tax laws, and market conditions change frequently. While we strive to keep our calculators current, we cannot guarantee that all information reflects the latest changes. Always verify current rates, regulations, and requirements with appropriate authorities and professionals.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Responsibility</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        By using Loanly, you acknowledge and agree that:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                        <li>You are solely responsible for your financial decisions</li>
                        <li>You will verify all calculations and information independently</li>
                        <li>You will consult with qualified professionals before making significant financial decisions</li>
                        <li>You understand the limitations of our calculators</li>
                        <li>You use our Service at your own risk</li>
                    </ul>
                </section>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800 mt-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        Questions?
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        If you have questions about this disclaimer or our calculators, please contact us at{' '}
                        <a href="mailto:support@loanly.com" className="text-blue-600 hover:text-blue-700">
                            support@loanly.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
