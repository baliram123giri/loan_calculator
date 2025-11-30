import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy - Loanly | Your Data, Your Control',
    description: 'Read Loanly\'s privacy policy. We respect your privacy and don\'t collect, store, or share your personal information. Learn how we protect your data.',
    alternates: {
        canonical: 'https://loanly.com/info/privacy'
    }
};

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Privacy Policy
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                Last Updated: November 30, 2024
            </p>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Privacy Promise</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        At Loanly, we believe your financial calculations are your business, not ours. We don't collect, store, or share your personal information. Your data stays on your device, period.
                    </p>
                </div>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Information We Don't Collect</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        We do NOT collect:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Personal identification information (name, email, phone number)</li>
                        <li>Financial data (loan amounts, income, assets)</li>
                        <li>Calculator inputs or results</li>
                        <li>Location data beyond general region for analytics</li>
                        <li>Browsing history or behavior across other websites</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Local Storage & Cookies</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        We use browser local storage and session storage to enhance your experience:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li><strong>Cookie Consent:</strong> We store your cookie preference (accept/decline) in local storage</li>
                        <li><strong>Calculator Sessions:</strong> If you consent, we save your calculator inputs in session storage so you don't lose your work if you refresh the page</li>
                        <li><strong>User Preferences:</strong> Theme preferences (dark/light mode) are saved locally</li>
                    </ul>
                    <p className="text-gray-700 dark:text-gray-300 mt-4">
                        All this data stays on YOUR device. We never send it to our servers or third parties. You can clear it anytime by declining cookies or clearing your browser data.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Analytics</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        We use privacy-focused analytics to understand how people use our calculators (which calculators are most popular, general traffic patterns). This data is:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                        <li>Completely anonymous and aggregated</li>
                        <li>Does not include any personal information</li>
                        <li>Does not track you across websites</li>
                        <li>Used solely to improve our calculators</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Third-Party Services</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        We do not use third-party advertising networks, social media trackers, or data brokers. Our website is self-contained and doesn't share data with external services.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Children's Privacy</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        Our service is not directed to children under 13. We do not knowingly collect information from children. If you believe a child has provided us with information, please contact us immediately.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Rights (CCPA & GDPR)</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Under California Consumer Privacy Act (CCPA) and General Data Protection Regulation (GDPR), you have rights regarding your data. However, since we don't collect personal data, there's nothing to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Access (we don't have your data)</li>
                        <li>Delete (we don't store your data)</li>
                        <li>Opt-out of sale (we don't sell data)</li>
                        <li>Port (we don't collect data to port)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to This Policy</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        We may update this privacy policy occasionally. We'll post the new policy on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        If you have questions about this privacy policy, please contact us at:
                    </p>
                    <p className="text-blue-600 hover:text-blue-700 mt-2">
                        <a href="mailto:privacy@loanly.com">privacy@loanly.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
}
