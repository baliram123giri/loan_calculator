import React from 'react';
import RentCalculator from '@/components/RentCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import { DollarSign, Home, Calculator } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Rent Calculator – How Much Rent Can I Afford?',
    description: 'Calculate your affordable rent based on your annual income and debts. Use our 30% rule calculator to find your ideal rental budget.',
    keywords: ['rent calculator', 'how much rent can i afford', 'rent affordability', 'income to rent ratio', '30 percent rule'],
};

export default function RentCalculatorPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <RentCalculator />

            <div className="max-w-4xl mx-auto mt-16 space-y-12">
                {/* Introduction Section */}
                <section className="prose dark:prose-invert max-w-none">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Understanding Rent Affordability
                    </h2>

                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        Finding the right balance between your income and rent is one of the most important financial decisions you'll make.
                        Whether you're moving to a new city or looking for your first apartment, understanding how much you can truly afford
                        will help you maintain financial stability while enjoying your living space.
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Our rent calculator uses industry-standard formulas to help you determine a realistic budget. But beyond just
                        the numbers, it's important to understand the principles behind rent affordability and how they apply to your
                        unique situation.
                    </p>
                </section>

                {/* The 30% Rule Section */}
                <section className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        The 30% Rule: Your Starting Point
                    </h3>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Financial experts and the U.S. Department of Housing and Urban Development (HUD) recommend spending no more than
                        30% of your gross monthly income on housing costs. This guideline has stood the test of time because it leaves
                        enough room in your budget for other essential expenses, savings, and unexpected costs.
                    </p>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 my-6">
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                            Quick Example
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            If you earn <strong className="text-blue-600 dark:text-blue-400">$60,000 per year</strong>, that's
                            $5,000 per month. Following the 30% rule, your maximum rent should be around{' '}
                            <strong className="text-blue-600 dark:text-blue-400">$1,500 per month</strong>.
                        </p>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Keep in mind that this is a guideline, not a hard rule. Your personal circumstances, debt obligations,
                        and financial goals may mean you need to adjust this percentage up or down.
                    </p>
                </section>

                {/* Budget Framework Section */}
                <section className="prose dark:prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        The 50/30/20 Budget Framework
                    </h3>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        Many financial advisors recommend dividing your after-tax income into three main categories.
                        This simple framework helps ensure you're covering all your bases while still enjoying life and planning for the future.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 my-8">
                        <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-6 border border-green-200 dark:border-green-800">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">50%</div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Needs</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Rent, utilities, groceries, insurance, minimum debt payments, and other essentials
                            </p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">30%</div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Wants</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Entertainment, dining out, hobbies, subscriptions, and lifestyle choices
                            </p>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">20%</div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Savings</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Emergency fund, retirement contributions, investments, and extra debt payments
                            </p>
                        </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Since rent falls under "needs," keeping it at 30% of your gross income ensures it fits comfortably
                        within the 50% allocation for all necessities.
                    </p>
                </section>

                {/* Money-Saving Tips Section */}
                <section className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-8 border border-green-100 dark:border-green-800">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Smart Ways to Save on Rent
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Get a Roommate</h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Sharing a two-bedroom apartment typically costs 30-40% less per person than renting a one-bedroom alone.
                                Use roommate-matching services or ask friends and family for referrals to find compatible housemates.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Negotiate Everything</h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Many renters don't realize that rent is negotiable. Try offering to sign a longer lease for a lower monthly rate,
                                ask for move-in specials, or negotiate during off-peak seasons like winter when demand is lower.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Expand Your Search</h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Living just 10-15 minutes further from downtown or trendy neighborhoods can save you $200-500 per month.
                                Factor in transportation costs, but you'll often still come out ahead.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Time It Right</h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Rental prices fluctuate with the seasons. You'll find the best deals during winter months (December-February)
                                and with mid-month move-in dates when landlords are more motivated to fill vacancies.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="prose dark:prose-invert max-w-none">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        Common Questions About Rent Affordability
                    </h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                What if I can't afford 30% of my income for rent?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                If rent exceeds 30% of your income, you're considered "rent burdened." This is common in expensive cities,
                                but it means you'll need to be extra careful with your budget. Consider getting a roommate, moving to a less
                                expensive neighborhood, picking up a side job, or looking into housing assistance programs in your area.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Should I use gross or net income for the 30% rule?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                The traditional 30% rule uses gross income (before taxes), which is also what landlords typically look at.
                                However, budgeting with your net income (after taxes) gives you a more conservative and realistic picture.
                                If you want to be extra safe with your budget, use net income instead.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                How much should I save for emergencies as a renter?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Aim for 3-6 months of expenses in an emergency fund. This cushion protects you from unexpected job loss,
                                medical bills, or major expenses like car repairs. As a renter, you have less to worry about than homeowners
                                (no roof repairs!), but you still need that safety net.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                What credit score do I need to rent an apartment?
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Most landlords prefer a credit score of 620 or higher. If your score is below 600, you might need a co-signer,
                                a larger security deposit, or several months of rent paid upfront. Some smaller landlords don't check credit at all,
                                so don't give up if your score isn't perfect.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Related Tools Section */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                    <RelatedCalculators
                        links={[
                            {
                                href: "/calculators/house-affordability",
                                title: "House Affordability",
                                description: "Calculate how much house you can buy",
                                icon: DollarSign,
                                iconColorClass: "text-blue-600",
                                iconBgClass: "bg-blue-100",
                                hoverBgClass: "group-hover:bg-blue-600"
                            },
                            {
                                href: "/calculators/mortgage",
                                title: "Mortgage Calculator",
                                description: "Estimate your monthly mortgage payments",
                                icon: Home,
                                iconColorClass: "text-green-600",
                                iconBgClass: "bg-green-100",
                                hoverBgClass: "group-hover:bg-green-600"
                            },
                            {
                                href: "/calculators/loan",
                                title: "Loan Calculator",
                                description: "Calculate payments for any type of loan",
                                icon: Calculator,
                                iconColorClass: "text-purple-600",
                                iconBgClass: "bg-purple-100",
                                hoverBgClass: "group-hover:bg-purple-600"
                            }
                        ]}
                        title="Explore More Financial Tools"
                    />
                </div>
            </div>
        </div>
    );
}
