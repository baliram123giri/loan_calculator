import React from 'react';

interface HowItWorksProps {
    type: 'mortgage' | 'loan' | 'simple-interest' | 'compound-interest' | 'sales-tax' | 'property-tax';
}

const howItWorks = {
    mortgage: {
        title: 'How the Mortgage Calculator Works',
        content: `Behind the scenes, this calculator uses the same formula that banks and lenders use to figure out mortgage payments. It's called an amortization formula, and it ensures that if you make the same payment every month, you'll have your loan completely paid off by the end of your term.

Here's what goes into the calculation: your loan amount (how much you're borrowing), your interest rate (what the lender charges you), and your loan term (usually 15 or 30 years). The calculator also factors in property taxes and homeowners insurance if you provide those numbers.

One interesting thing about mortgages: your payment stays the same each month, but how it's divided between principal and interest changes over time. In the early years, most of your payment goes toward interest. As time goes on, more of each payment chips away at your actual loan balance. This is called amortization.

If you're looking at an adjustable-rate mortgage, the calculator can show you what happens when your rate changes. You can also play around with making extra payments to see how much interest you'll save and how much faster you'll pay off your loan. The amortization schedule breaks it all down payment by payment, so there's complete transparency about where every dollar goes.`
    },
    loan: {
        title: 'How the Loan Calculator Works',
        content: `This calculator uses the standard loan formula that banks and credit unions use across the United States. It takes three pieces of information—how much you want to borrow, the interest rate, and how long you'll take to pay it back—and calculates a fixed monthly payment.

The math ensures that each payment covers both the interest you owe and a portion of the principal (the amount you borrowed). Early on, more of your payment goes to interest. As your balance decreases, more goes toward paying down what you actually borrowed.

What's really helpful is the amortization schedule. This shows you every single payment over the life of your loan—how much goes to principal, how much to interest, and what your remaining balance is after each payment. It's eye-opening to see the numbers laid out like this.

The calculator also shows you the total amount you'll pay over the life of the loan. This is crucial because a longer loan term means lower monthly payments, but you'll pay significantly more in interest overall. For example, a 7-year loan might have a comfortable monthly payment, but you could save thousands by choosing a 3-year term if you can afford the higher payment.`
    },
    'simple-interest': {
        title: 'How Simple Interest Works',
        content: `Simple interest uses a straightforward formula: multiply your principal (initial investment) by the interest rate and the number of years. That's it. No complicated math, no compounding—just simple multiplication.

For example, let's say you invest $10,000 at 5% simple interest for 3 years. Each year, you earn $500 ($10,000 × 0.05). After three years, you've earned $1,500 total, giving you $11,500.

The key difference from compound interest is that you only earn interest on your original investment, never on the interest itself. This makes the calculation predictable and easy to understand, which is why it's used for certain short-term investments like some CDs and bonds.

Our calculator breaks down your earnings year by year, showing your starting balance, interest earned that year, and ending balance. This makes it easy to see exactly how your money grows over time. You can adjust any of the numbers to compare different scenarios—maybe you want to see how a higher interest rate or longer time period affects your returns.

The PDF export feature is handy for keeping records or presenting investment options to someone else. While simple interest won't grow your money as fast as compound interest over long periods, it's perfect for short-term goals where you value predictability.`
    },
    'compound-interest': {
        title: 'How Compound Interest Works',
        content: `Compound interest is where things get interesting. The formula is: A = P(1 + r/n)^(nt), where A is your final amount, P is your starting principal, r is your annual interest rate, n is how many times per year interest compounds, and t is the number of years.

Don't worry if that looks complicated—the calculator does all the math for you. What matters is understanding what's happening: you're earning interest on your interest. Each time interest is calculated and added to your account, your balance grows. Then the next time interest is calculated, it's based on this new, higher balance.

The compounding frequency makes a real difference. Daily compounding grows your money faster than monthly, which grows faster than yearly. Most US savings accounts compound daily or monthly, while bonds typically compound twice a year.

The calculator shows you the Annual Percentage Yield (APY), which is your true annual return accounting for compounding. This is different from the stated interest rate and is what you should use when comparing different accounts or investments.

You'll see a year-by-year breakdown showing how your balance grows, with each year's interest calculated on the previous year's ending balance. Over long periods, the difference between compound and simple interest becomes dramatic—this is why starting early with retirement savings is so powerful.`
    },
    'sales-tax': {
        title: 'How Sales Tax Works',
        content: `The math for sales tax is simple: multiply your purchase price by the tax rate (as a decimal), then add that to the original price. For a $100 item with 7% tax, you'd calculate $100 × 0.07 = $7 in tax, for a total of $107.

What makes sales tax complicated in the US isn't the math—it's the variation in rates. We don't have a federal sales tax, so every state sets its own rate. Then counties and cities can add their own taxes on top. Some states have no sales tax at all (Oregon, New Hampshire, Delaware, Montana, and Alaska), while others can hit you with combined rates over 10%.

California has a base state rate of 7.25%, but local jurisdictions can add more, pushing some areas above 10%. Texas charges 6.25% statewide, but cities can add up to 2% more. It gets even more complex because different types of items are taxed differently—most states exempt groceries and prescription drugs, for example.

Our calculator includes reference rates for common states to help you estimate, but you should verify your exact local rate for precise calculations. This is especially important for big purchases like cars or furniture, where the tax can add thousands of dollars to your total cost.

Understanding sales tax helps you budget accurately and avoid sticker shock at checkout. For businesses, it's crucial for pricing products and managing cash flow since you have to collect and send these taxes to the government.`
    },
    'property-tax': {
        title: 'How Property Tax Works',
        content: `Property taxes are calculated by multiplying your home's assessed value by your local tax rate (sometimes called the mill rate). The assessed value is determined by your local tax assessor and might be different from what you paid for the house or what it would sell for today.

For example, if your home is assessed at $300,000 and your local tax rate is 1.2%, your annual property tax would be $3,600 ($300,000 × 0.012). Divide that by 12 to get your monthly cost, which is $300.

Most homeowners don't write a check for property taxes once a year. Instead, the money is collected monthly as part of your mortgage payment and held in an escrow account. When taxes are due, your mortgage company pays them on your behalf.

Property tax rates vary wildly across the country. Hawaii has the lowest effective rate at about 0.28%, while New Jersey tops the charts at around 2.49%. Even within a state, rates can differ significantly between counties and cities based on local budgets and services.

These taxes fund essential local services—public schools typically get the biggest chunk (40-60%), with the rest going to police, fire departments, road maintenance, libraries, and parks. Better-funded services often correlate with higher property values, creating a cycle where higher taxes support better amenities that maintain home values.

Many areas offer exemptions that can reduce your tax bill—homestead exemptions for primary residences, senior citizen discounts, or veteran benefits. It's worth checking what's available in your area.`
    }
};

export default function HowItWorks({ type }: HowItWorksProps) {
    const content = howItWorks[type];

    return (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {content.title}
            </h2>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                {content.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </div>
    );
}
