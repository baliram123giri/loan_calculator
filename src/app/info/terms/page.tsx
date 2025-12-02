import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service - Loanly | Usage Terms',
    description: 'Read Loanly\'s terms of service. Understand your rights and responsibilities when using our free financial calculators.',
    alternates: {
        canonical: 'https://loanly.com/info/terms'
    }
};

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Terms of Service
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                Last Updated: November 30, 2024
            </p>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        By accessing and using Loanly ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Description of Service</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Loanly provides free online financial calculators for informational and educational purposes. Our calculators include:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Mortgage calculators</li>
                        <li>Loan payment calculators</li>
                        <li>Interest calculators (simple and compound)</li>
                        <li>Tax calculators (sales and property)</li>
                        <li>Loan comparison tools</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. No Financial Advice</h2>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            <strong>IMPORTANT:</strong> Loanly provides calculators and tools for informational purposes only. We do NOT provide:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Financial advice or recommendations</li>
                            <li>Investment guidance</li>
                            <li>Tax advice</li>
                            <li>Legal counsel</li>
                            <li>Mortgage or loan approval</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 mt-4">
                            Always consult with qualified professionals (financial advisors, tax professionals, attorneys) before making financial decisions.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Accuracy of Calculations</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        While we strive for accuracy, our calculators use standard formulas and may not account for all variables specific to your situation. Results are estimates and should not be considered exact or guaranteed. Actual loan terms, interest rates, and tax amounts may vary based on numerous factors including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                        <li>Credit score and financial history</li>
                        <li>Lender-specific policies and fees</li>
                        <li>Local tax rates and regulations</li>
                        <li>Market conditions and rate changes</li>
                        <li>Individual circumstances and qualifications</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. User Responsibilities</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        When using our Service, you agree to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Use the calculators for lawful purposes only</li>
                        <li>Not attempt to hack, disrupt, or damage the Service</li>
                        <li>Not use automated systems to access the Service excessively</li>
                        <li>Verify all calculations with qualified professionals</li>
                        <li>Not rely solely on our calculators for financial decisions</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Intellectual Property</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        All content on Loanly, including text, graphics, logos, and software, is the property of Loanly and protected by United States and international copyright laws. You may use our calculators for personal, non-commercial purposes. You may not:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                        <li>Copy, modify, or distribute our content without permission</li>
                        <li>Use our calculators in commercial products or services</li>
                        <li>Remove copyright or proprietary notices</li>
                        <li>Reverse engineer or extract source code</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Disclaimer of Warranties</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. We do not warrant that:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                        <li>The Service will be uninterrupted or error-free</li>
                        <li>Calculations will be accurate or complete</li>
                        <li>The Service will meet your specific requirements</li>
                        <li>Any errors will be corrected</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Limitation of Liability</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, LOANLY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                        <li>Your use or inability to use the Service</li>
                        <li>Any inaccuracies in calculations or results</li>
                        <li>Financial decisions made based on our calculators</li>
                        <li>Unauthorized access to or alteration of your data</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Changes to Terms</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        We reserve the right to modify these Terms of Service at any time. We will notify users of significant changes by posting the new terms on this page with an updated "Last Updated" date. Your continued use of the Service after changes constitutes acceptance of the new terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Governing Law</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Contact Information</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        If you have questions about these Terms of Service, please contact us at:
                    </p>
                    <p className="text-blue-600 hover:text-blue-700 mt-2">
                        <a href="mailto:legal@loanly.com">legal@loanly.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
}
