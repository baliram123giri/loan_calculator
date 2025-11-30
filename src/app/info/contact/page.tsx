import React from 'react';
import { Metadata } from 'next';
import { Mail, MessageSquare, HelpCircle } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
    title: 'Contact Us - Loanly | Get in Touch',
    description: 'Have questions about our financial calculators? Contact the Loanly team. We\'re here to help with your mortgage, loan, and tax calculation needs.',
    alternates: {
        canonical: 'https://loanly.com/info/contact'
    }
};

export default function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Us
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                We'd love to hear from you! Whether you have questions, feedback, or suggestions, we're here to help.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8">
                    <Mail className="w-10 h-10 text-blue-600 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Email Us</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        For general inquiries, feedback, or support questions:
                    </p>
                    <a href="mailto:support@loanly.com" className="text-blue-600 hover:text-blue-700 font-medium">
                        support@loanly.com
                    </a>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8">
                    <HelpCircle className="w-10 h-10 text-green-600 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">FAQ</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Check out our frequently asked questions for quick answers:
                    </p>
                    <a href="/info/faq" className="text-blue-600 hover:text-blue-700 font-medium">
                        Visit FAQ Page →
                    </a>
                </div>
            </div>

            <ContactForm />

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 mt-8">
                <MessageSquare className="w-10 h-10 text-purple-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What We Can Help With</h2>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span><strong>Calculator Questions:</strong> How to use our tools, understanding results, or feature requests</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span><strong>Technical Issues:</strong> Bugs, errors, or problems accessing the calculators</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span><strong>Feedback:</strong> Suggestions for improvements or new calculator ideas</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span><strong>Partnerships:</strong> Business inquiries or collaboration opportunities</span>
                    </li>
                </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-800 p-8 mt-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Important Note</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>We cannot provide personalized financial advice.</strong> Our calculators are tools for informational purposes only. For specific financial guidance regarding your situation, please consult with:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span>A licensed financial advisor for investment and retirement planning</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span>A mortgage broker or lender for home loan decisions</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span>A tax professional for tax-related questions</span>
                    </li>
                </ul>
            </div>

            <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
                <p>We typically respond to inquiries within 1-2 business days.</p>
            </div>
        </div>
    );
}
