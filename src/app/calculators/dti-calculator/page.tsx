import React from 'react';
import DTICalculator from '@/components/DTICalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Home, DollarSign, Calculator } from 'lucide-react';
import { generateCalculatorMetadata } from '@/lib/seo/metadata';
import { calculatorSchemas } from '@/lib/seo/schema';

export const metadata = generateCalculatorMetadata('dti-calculator');
export const dynamic = 'force-dynamic';

export default function DTICalculatorPage() {
    const schemas = [
        calculatorSchemas['dti-calculator'].software,
        calculatorSchemas['dti-calculator'].breadcrumb
    ];

    return (
        <>
            {/* JSON-LD Structured Data */}
            {schemas.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}

            <div className="container mx-auto py-12 px-4">
                <div className="mb-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Calculate Your DTI with{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                                Clarity
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                            Calculate your DTI ratio to understand your financial health and loan qualification status.
                        </p>
                    </div>
                </div>

                <DTICalculator />

                {/* SEO Content */}
                <div className="max-w-4xl mx-auto mt-16 space-y-12">
                    {/* Introduction Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            📊 Understanding Your Debt-to-Income Ratio
                        </h2>

                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Your debt-to-income (DTI) ratio is one of the most important numbers in your financial life. It's
                            the percentage of your gross monthly income that goes toward paying debts, and lenders use it as a
                            primary factor when deciding whether to approve you for a loan and at what interest rate. Understanding
                            and managing your DTI can be the difference between getting approved for your dream home or being denied.
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Unlike your credit score, which measures how reliably you pay debts, your DTI ratio measures how much
                            debt you're carrying relative to your income. A low DTI shows lenders you have a good balance between
                            debt and income, making you a lower-risk borrower. A high DTI suggests you may be overextended and
                            could struggle to make payments on new debt.
                        </p>
                    </section>

                    {/* Front-End vs Back-End DTI */}
                    <section className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-8 border border-purple-100 dark:border-purple-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            🏠 Front-End vs. Back-End DTI: What's the Difference?
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Lenders actually look at two different DTI ratios when evaluating your loan application. Understanding
                            both helps you see the complete picture of your debt situation.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 my-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-3">Front-End DTI (Housing Ratio)</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                    Only includes housing-related expenses divided by gross monthly income.
                                </p>
                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Includes:</p>
                                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                        <li>• Mortgage or rent payment</li>
                                        <li>• Property taxes</li>
                                        <li>• Homeowners insurance</li>
                                        <li>• HOA/Co-op fees</li>
                                        <li>• PMI (if applicable)</li>
                                    </ul>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                                        <strong>Standard Limit:</strong> 28% for conventional loans
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-3">Back-End DTI (Total Debt Ratio)</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                    Includes all monthly debt payments divided by gross monthly income.
                                </p>
                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Includes:</p>
                                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                        <li>• All housing costs (above)</li>
                                        <li>• Car loans/leases</li>
                                        <li>• Student loans</li>
                                        <li>• Credit card minimum payments</li>
                                        <li>• Personal loans</li>
                                        <li>• Child support/alimony</li>
                                    </ul>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                                        <strong>Standard Limit:</strong> 36% for conventional loans
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mt-6">
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Example Calculation
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                <strong className="text-purple-600 dark:text-purple-400">Monthly gross income: $6,000</strong><br />
                                Housing costs: $1,500 (mortgage, taxes, insurance)<br />
                                Other debts: $600 (car loan, credit cards)<br /><br />
                                Front-End DTI: $1,500 ÷ $6,000 = <strong>25%</strong> ✓<br />
                                Back-End DTI: $2,100 ÷ $6,000 = <strong>35%</strong> ✓<br /><br />
                                This borrower qualifies for conventional financing (28/36 limits).
                            </p>
                        </div>
                    </section>

                    {/* DTI Requirements by Loan Type */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            📋 DTI Requirements by Loan Type
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Different loan programs have different DTI requirements. Knowing these limits helps you understand
                            which loan types you might qualify for and where you need to improve.
                        </p>

                        <div className="space-y-4 my-8">
                            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Conventional Loans</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Most common for borrowers with good credit</p>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
                                        28/36
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Front-end limit: 28% | Back-end limit: 36%. These are the strictest requirements but offer
                                    the best rates. Some lenders may go up to 43% back-end with compensating factors like high
                                    credit score or large down payment.
                                </p>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-6 border border-green-200 dark:border-green-800">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">FHA Loans</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Government-backed, easier qualification</p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
                                        31/43
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Front-end limit: 31% | Back-end limit: 43%. FHA loans are more lenient, making them popular
                                    for first-time buyers or those with lower credit scores. Require mortgage insurance regardless
                                    of down payment.
                                </p>
                            </div>

                            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">VA Loans</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">For veterans and active military</p>
                                    </div>
                                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-semibold">
                                        No front / 41
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    No front-end limit | Back-end limit: 41%. VA loans don't have a front-end requirement, only
                                    looking at total debt. They also use "residual income" calculations to ensure you have enough
                                    left over for living expenses.
                                </p>
                            </div>

                            <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">USDA Loans</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">For rural and suburban properties</p>
                                    </div>
                                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm font-semibold">
                                        29/41
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Front-end limit: 29% | Back-end limit: 41%. USDA loans offer 100% financing for eligible
                                    rural properties. DTI limits are moderate, and compensating factors can push back-end to 43-45%.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* How to Improve DTI */}
                    <section className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-8 border border-green-100 dark:border-green-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            💡 How to Improve Your DTI Ratio
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            If your DTI is too high to qualify for the loan you want, don't despair. There are proven strategies
                            to lower your ratio and improve your borrowing power.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Pay Down Existing Debt</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    The fastest way to improve DTI is reducing your monthly debt payments. Focus on debts with
                                    the highest monthly payments first for maximum impact. Paying off a $400/month car loan could
                                    improve your DTI by 6-7 percentage points if you earn $6,000/month. Even paying off small debts
                                    helps—eliminating a $100/month credit card payment still counts.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Increase Your Income</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    A raise, promotion, or second job directly improves your DTI. However, lenders typically require
                                    2 years of history for self-employment or commission income. Overtime and bonuses count if you've
                                    received them consistently for 2+ years. A $500/month income increase can improve DTI by 8-10
                                    percentage points.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Refinance High-Payment Debts</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Refinancing doesn't reduce your total debt, but it can lower monthly payments by extending the
                                    term or securing a lower rate. Refinancing a $20,000 car loan from 7% to 4% could save $50-100/month.
                                    Consolidating credit cards into a personal loan at a lower rate reduces monthly minimums.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Avoid Taking On New Debt</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    In the months before applying for a mortgage, avoid new car loans, credit cards, or personal loans.
                                    Even if you're approved, new debt increases your DTI and could push you over qualification limits.
                                    Wait until after your home purchase closes to make other major purchases.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5. Consider a Co-Borrower</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Adding a co-borrower with income (spouse, partner, family member) increases your total income
                                    without adding their debts to your DTI calculation—unless they're also on those debts. This can
                                    significantly improve your ratio and borrowing power. However, both borrowers' credit will be checked.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            ❓ DTI Ratio Questions
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What's a good debt-to-income ratio?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    For financial health, aim for a DTI below 36%. Lenders consider 36% or less "good" and you'll
                                    qualify for most loans. 28% or less is excellent and gives you the most options with the best
                                    rates. Between 37-43% is acceptable for some loans (FHA, VA) but limits your options. Above 43%
                                    is considered high risk, and you'll struggle to qualify for most mortgages.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Does DTI affect my credit score?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    No, DTI does not directly affect your credit score. Credit bureaus don't have access to your
                                    income information, so they can't calculate DTI. However, the factors that create high DTI
                                    (carrying lots of debt) often correlate with lower credit scores. High credit card balances
                                    hurt your credit utilization ratio, which does impact your score.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    What debts are included in DTI calculations?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Lenders include all recurring monthly debt obligations: mortgage/rent, car loans, student loans,
                                    credit card minimum payments, personal loans, child support, alimony, and other installment loans.
                                    They don't include utilities, groceries, insurance (except homeowners), medical bills, or other
                                    living expenses. For credit cards, they use the minimum payment shown on your statement.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Can I get a mortgage with a high DTI?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Yes, but your options are limited. FHA loans allow up to 43% DTI (sometimes 50% with strong
                                    compensating factors like high credit score or large down payment). Some portfolio lenders or
                                    non-QM loans go higher but charge premium rates. If your DTI is above 50%, you'll likely need
                                    to pay down debt or increase income before qualifying for a mortgage.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    How quickly can I improve my DTI ratio?
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    It depends on your strategy. Paying off debt can improve DTI immediately—pay off a $300/month
                                    debt today, and your DTI improves tomorrow. Income increases take longer since lenders need to
                                    verify consistency (usually 2 years for self-employment). For most people, a focused 3-6 month
                                    plan of debt payoff and income optimization can improve DTI by 5-10 percentage points.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Related Tools Section */}
                    {/* Related Tools Section */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <RelatedCalculators
                            links={[
                                {
                                    href: "/calculators/house-affordability",
                                    title: "House Affordability",
                                    description: "See how much house you can afford",
                                    icon: Home,
                                    iconColorClass: "text-blue-600",
                                    iconBgClass: "bg-blue-100",
                                    hoverBgClass: "group-hover:bg-blue-600"
                                },
                                {
                                    href: "/calculators/loan",
                                    title: "Loan Calculator",
                                    description: "Calculate loan payments and interest",
                                    icon: DollarSign,
                                    iconColorClass: "text-green-600",
                                    iconBgClass: "bg-green-100",
                                    hoverBgClass: "group-hover:bg-green-600"
                                },
                                {
                                    href: "/calculators/mortgage",
                                    title: "Mortgage Calculator",
                                    description: "Estimate monthly mortgage payments",
                                    icon: Calculator,
                                    iconColorClass: "text-purple-600",
                                    iconBgClass: "bg-purple-100",
                                    hoverBgClass: "group-hover:bg-purple-600"
                                }
                            ]}
                            title="Related Financial Calculators"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
