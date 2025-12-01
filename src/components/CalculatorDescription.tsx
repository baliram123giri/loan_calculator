import React from 'react';

interface CalculatorDescriptionProps {
    type: 'mortgage' | 'loan' | 'simple-interest' | 'compound-interest' | 'sales-tax' | 'property-tax' | 'fha-loan';
}

const descriptions = {
    mortgage: {
        title: 'About This Mortgage Calculator',
        content: `Planning to buy a home? Our mortgage calculator takes the guesswork out of budgeting for your dream house. Just enter your loan amount, interest rate, and loan term to see what your monthly payment will look like.

What makes this calculator special is that it doesn't just show you the basic payment. It breaks down exactly where your money goes each month—how much pays down your loan balance versus how much goes to interest. Plus, you can factor in property taxes and homeowners insurance to get the complete picture of your monthly housing costs.

If you're considering an adjustable-rate mortgage (ARM), you can model how rate changes will affect your payments over time. Thinking about making extra payments to pay off your mortgage faster? The calculator shows you exactly how much you'll save in interest and how many years you'll shave off your loan.

Whether you're comparing 15-year versus 30-year mortgages or trying to decide how much house you can afford, this tool gives you the clarity you need to make confident decisions about one of the biggest financial commitments you'll ever make.`
    },
    loan: {
        title: 'About This Loan Calculator',
        content: `Need to borrow money for a car, personal expenses, or education? This loan calculator helps you understand exactly what you're signing up for before you commit.

Here's how it works: tell us how much you want to borrow, what interest rate you're being offered, and how long you want to take to pay it back. We'll instantly show you your monthly payment and break down how much of that goes toward paying off what you borrowed versus paying interest charges.

The real eye-opener is seeing the total cost over the life of the loan. Sometimes a lower monthly payment sounds great until you realize you'll pay thousands more in interest over a longer term. This calculator helps you find that sweet spot between an affordable monthly payment and minimizing your total interest cost.

You'll also get a complete payment schedule showing how your loan balance decreases month by month. It's incredibly helpful for planning your budget and understanding how loans actually work. Whether you're financing a $15,000 car or consolidating $30,000 in credit card debt, knowing your numbers upfront helps you borrow smarter.`
    },
    'simple-interest': {
        title: 'About This Simple Interest Calculator',
        content: `Simple interest is exactly what it sounds like—simple. Unlike compound interest where things get complicated, simple interest is straightforward: you earn the same amount of interest every year based on your initial deposit.

This calculator is perfect if you're looking at certificates of deposit (CDs), certain types of bonds, or other savings products that use simple interest. Just plug in how much you're investing, the interest rate, and how long you plan to keep your money invested.

What you'll see is a year-by-year breakdown showing exactly how your money grows. There are no surprises—if you invest $10,000 at 5% simple interest, you'll earn $500 every single year. After five years, you'll have earned $2,500 in interest for a total of $12,500.

The calculator also lets you export your results to PDF, which is handy for keeping records or comparing different investment options side by side. While simple interest won't make you rich as fast as compound interest, it's predictable and easy to understand—perfect for short-term savings goals or conservative investors who value certainty.`
    },
    'compound-interest': {
        title: 'About This Compound Interest Calculator',
        content: `Albert Einstein supposedly called compound interest "the eighth wonder of the world," and once you see it in action, you'll understand why. This is where your money doesn't just grow—it multiplies.

Here's the magic: with compound interest, you earn interest not just on your initial investment, but also on all the interest you've already earned. It's like a snowball rolling downhill, getting bigger and bigger as it picks up more snow.

Our calculator lets you see exactly how this works with your money. Choose how often your interest compounds—daily, monthly, quarterly, or yearly—and watch how it affects your returns. You'll be amazed at the difference compounding frequency makes over time.

The calculator shows you the Annual Percentage Yield (APY), which is the real rate of return you're getting when you account for compounding. This is the number that matters when comparing savings accounts or investment options.

Whether you're planning for retirement, saving for your kid's college, or just trying to grow your wealth, this calculator shows you the incredible power of starting early and letting time work its magic. Even small amounts can grow into substantial sums if you give them enough time to compound.`
    },
    'sales-tax': {
        title: 'About This Sales Tax Calculator',
        content: `Ever get to the checkout and wonder why your total is so much higher than the price tag? That's sales tax at work, and it varies wildly depending on where you live in the United States.

This calculator helps you figure out exactly what you'll pay before you get to the register. Just enter the price of what you're buying and your local sales tax rate, and we'll show you the tax amount and your total cost.

Why does this matter? Because sales tax can really add up, especially on big purchases. Buying a $30,000 car in a state with 10% sales tax means you're paying an extra $3,000. That's a significant chunk of change that you need to budget for.

The calculator includes reference rates for common states to help you estimate, but keep in mind that your actual rate might be different because counties and cities often add their own taxes on top of the state rate. Some states like Oregon and New Hampshire don't have sales tax at all, while others can hit you with rates over 10%.

Whether you're budgeting for a major purchase, comparing costs between different locations, or just trying to understand where your money goes, this calculator takes the mystery out of sales tax.`
    },
    'property-tax': {
        title: 'About This Property Tax Calculator',
        content: `Property taxes are one of those ongoing costs of homeownership that can catch new buyers off guard. Unlike your mortgage payment that stays the same (with a fixed-rate loan), property taxes can vary significantly and tend to increase over time.

This calculator helps you estimate what you'll owe each year based on your home's assessed value and your local tax rate. We also break it down to a monthly amount, which is helpful because most people pay property taxes through their mortgage escrow account each month.

Here's why this matters: property taxes can make or break your housing budget. A house with a lower purchase price might actually cost you more each month if it's in a high-tax area. We're talking about differences of thousands of dollars per year depending on where you live.

Property taxes fund your local schools, police and fire departments, roads, parks, and other community services. Rates vary dramatically across the country—from less than 0.3% in Hawaii to over 2.4% in New Jersey. Even within the same state, you'll see big differences between counties.

Use this calculator when you're house hunting to get a realistic picture of your total monthly housing costs. It's also useful for budgeting if you already own a home and want to plan for potential tax increases.`
    },
    'fha-loan': {
        title: 'Everything You Need to Know About FHA Loans',
        content: `
            <h2>What is an FHA Loan?</h2>
            <p>An FHA loan is a government-backed mortgage insured by the Federal Housing Administration. It's one of the most popular loan programs for first-time homebuyers because it allows for lower credit scores and smaller down payments than conventional loans.</p>
            <p>Think of it as a safety net for lenders: because the FHA insures the loan, lenders are willing to offer better terms to borrowers who might not have a perfect financial history.</p>

            <h2>Do You Qualify for an FHA Loan?</h2>
            <p>Qualifying for an FHA loan is generally easier than qualifying for a conventional mortgage. Here are the key requirements:</p>
            <ul>
                <li><strong>Credit Score:</strong> You can qualify with a score as low as <strong>580</strong> for a 3.5% down payment. If your score is between 500 and 579, you may still qualify but will need a 10% down payment.</li>
                <li><strong>Down Payment:</strong> The minimum down payment is just <strong>3.5%</strong> of the purchase price.</li>
                <li><strong>Debt-to-Income (DTI) Ratio:</strong> Lenders typically look for a DTI ratio of <strong>43% or less</strong>, though some may approve higher ratios with compensating factors (like cash reserves).</li>
                <li><strong>Property Standards:</strong> The home must be your primary residence and meet HUD's safety and habitability standards.</li>
            </ul>

            <h2>Understanding Mortgage Insurance (MIP)</h2>
            <p>One trade-off for the flexible requirements of an FHA loan is the Mortgage Insurance Premium (MIP). Unlike private mortgage insurance (PMI) on conventional loans, FHA loans have two types of premiums:</p>
            <ol>
                <li><strong>Upfront MIP (UFMIP):</strong> This is a one-time fee of <strong>1.75%</strong> of your loan amount. Most borrowers choose to finance this into their loan rather than paying it out of pocket at closing.</li>
                <li><strong>Annual MIP:</strong> This is a recurring fee paid monthly. For most borrowers putting down 3.5%, the rate is <strong>0.55%</strong> annually. This premium typically stays for the life of the loan unless you put down 10% or more (in which case it stays for 11 years).</li>
            </ol>

            <h2>FHA Loan Limits (2024)</h2>
            <p>The FHA sets limits on how much you can borrow, which vary by county based on housing costs. For 2024:</p>
            <ul>
                <li><strong>Floor (Low-cost areas):</strong> $498,257</li>
                <li><strong>Ceiling (High-cost areas):</strong> $1,149,825</li>
            </ul>
            <p>It's important to check the specific limit for the county where you're buying.</p>

            <h2>Is an FHA Loan Right for You?</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div class="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-100 dark:border-green-800">
                    <h3 class="text-green-800 dark:text-green-300 font-bold mb-3 text-lg">Why Choose FHA?</h3>
                    <ul class="space-y-2 text-green-700 dark:text-green-400">
                        <li class="flex items-start gap-2"><span class="mt-1">✅</span> <span>Easier to qualify with lower credit scores.</span></li>
                        <li class="flex items-start gap-2"><span class="mt-1">✅</span> <span>Low 3.5% down payment requirement.</span></li>
                        <li class="flex items-start gap-2"><span class="mt-1">✅</span> <span>Rates are often competitive with conventional loans.</span></li>
                        <li class="flex items-start gap-2"><span class="mt-1">✅</span> <span>Assumable: A future buyer can take over your rate.</span></li>
                    </ul>
                </div>
                <div class="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-xl border border-orange-100 dark:border-orange-800">
                    <h3 class="text-orange-800 dark:text-orange-300 font-bold mb-3 text-lg">Things to Consider</h3>
                    <ul class="space-y-2 text-orange-700 dark:text-orange-400">
                        <li class="flex items-start gap-2"><span class="mt-1">⚠️</span> <span>MIP is required regardless of your down payment.</span></li>
                        <li class="flex items-start gap-2"><span class="mt-1">⚠️</span> <span>Upfront MIP adds to your total loan balance.</span></li>
                        <li class="flex items-start gap-2"><span class="mt-1">⚠️</span> <span>Property condition requirements are stricter.</span></li>
                    </ul>
                </div>
            </div>

            <h2>How to Use This Calculator</h2>
            <p>Our tool is designed to give you the full picture, including the hidden costs often missed by simple calculators.</p>
            <ol>
                <li><strong>Enter Home Price & Down Payment:</strong> Start with your purchase price and how much cash you have for down payment.</li>
                <li><strong>Check the Rate:</strong> Enter current market rates. FHA rates are often slightly lower than conventional rates.</li>
                <li><strong>Review Advanced Options:</strong> We've pre-filled standard MIP rates (1.75% upfront, 0.55% annual), but you can adjust these if your situation differs.</li>
                <li><strong>Analyze the Breakdown:</strong> Look at the "Payment Breakdown" chart to see exactly where your money goes each month—Principal, Interest, MIP, Taxes, and Insurance.</li>
            </ol>
        `
    }
};

export default function CalculatorDescription({ type }: CalculatorDescriptionProps) {
    const desc = descriptions[type];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {desc.title}
            </h2>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                {/* Check if content contains HTML tags */}
                {desc.content.includes('<') ? (
                    <div dangerouslySetInnerHTML={{ __html: desc.content }} className="prose dark:prose-invert max-w-none" />
                ) : (
                    desc.content.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))
                )}
            </div>
        </div>
    );
}
