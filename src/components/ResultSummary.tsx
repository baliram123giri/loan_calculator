import React from 'react';

interface ResultSummaryProps {
    type: 'mortgage' | 'loan' | 'simple-interest' | 'compound-interest' | 'sales-tax' | 'property-tax';
    result?: any;
}

export default function ResultSummary({ type, result }: ResultSummaryProps) {
    if (!result) {
        return null;
    }

    const generateMortgageSummary = (result: any) => {
        const monthlyPayment = result.emi || 0;
        const totalInterest = result.totalInterest || 0;
        const totalPayment = result.totalPayment || 0;
        const principal = totalPayment - totalInterest;

        const interestPercentage = ((totalInterest / totalPayment) * 100).toFixed(1);
        const affordabilityNote = monthlyPayment > 2000 ?
            "This is a substantial monthly payment. Most financial advisors recommend that your total housing costs (including mortgage, taxes, and insurance) should not exceed 28% of your gross monthly income." :
            "This monthly payment falls within a moderate range for many households.";

        return `Based on your inputs, your estimated monthly mortgage payment is $${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Over the life of your loan, you'll pay a total of $${totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, which includes $${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in principal and $${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in interest. This means ${interestPercentage}% of your total payments will go toward interest charges. ${affordabilityNote} Consider that mortgage rates fluctuate based on central bank policy, your credit score, and market conditions. A difference of just 0.5% in your interest rate can save or cost you tens of thousands of dollars over a 30-year mortgage. If you can afford extra payments, even small additional amounts can significantly reduce your total interest and shorten your loan term. Many homeowners refinance when rates drop to lower their monthly payments or switch from an ARM to a fixed-rate mortgage for payment stability.`;
    };

    const generateLoanSummary = (result: any) => {
        const monthlyPayment = result.emi || 0;
        const totalInterest = result.totalInterest || 0;
        const totalPayment = result.totalPayment || 0;
        const principal = totalPayment - totalInterest;

        const costRatio = (totalInterest / principal * 100).toFixed(1);
        const rateAdvice = totalInterest > principal * 0.3 ?
            "Your total interest cost is significant relative to the loan amount. If possible, consider a shorter loan term or making extra payments to reduce interest charges." :
            "Your total interest cost is reasonable for this type of loan.";

        return `Your calculated monthly payment is $${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Over the full loan term, you'll repay a total of $${totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, consisting of your original $${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} principal plus $${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in interest charges. This represents a ${costRatio}% interest cost relative to the amount borrowed. ${rateAdvice} Personal loan rates typically range from 5% to 36% depending on your credit score and the lender. Auto loans generally offer lower rates (3-10%) because the vehicle serves as collateral. Student loans may have rates as low as 3-7% for government-backed loans. Before accepting any loan, compare offers from multiple lenders, as rates and terms can vary significantly. Also consider the total cost of the loan, not just the monthly payment - a longer term means lower monthly payments but much higher total interest paid.`;
    };

    const generateSimpleInterestSummary = (result: any) => {
        const interest = result.interest || 0;
        const totalAmount = result.totalAmount || 0;
        const principal = result.principal || 0;
        const years = result.breakdown?.length || 0;

        const annualReturn = years > 0 ? (interest / years).toFixed(2) : '0.00';
        const returnPercentage = ((interest / principal) * 100).toFixed(2);

        return `Your investment will earn $${interest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in simple interest over ${years} years, growing your initial $${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} to a total of $${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. This represents a ${returnPercentage}% total return on your investment, with an average of $${annualReturn} earned per year. Simple interest is predictable and easy to calculate, making it ideal for short-term savings goals and certain fixed-income investments. However, it's important to note that simple interest doesn't compound, meaning you won't earn interest on your interest. For long-term savings and retirement accounts, compound interest typically provides better returns. Simple interest rates vary widely - Treasury bills might offer 4-5%, while corporate bonds could range from 3-8% depending on the issuer's credit rating. Certificates of Deposit at banks currently offer rates between 3-5% for terms ranging from 3 months to 5 years. When comparing investment options, always consider the interest calculation method, term length, and any penalties for early withdrawal.`;
    };

    const generateCompoundInterestSummary = (result: any) => {
        const interest = result.interest || 0;
        const totalAmount = result.totalAmount || 0;
        const principal = result.principal || 0;
        const years = result.breakdown?.length || 0;

        const totalReturn = ((totalAmount / principal - 1) * 100).toFixed(2);
        const avgAnnualGrowth = years > 0 ? (Math.pow(totalAmount / principal, 1 / years) - 1) * 100 : 0;

        return `Through the power of compound interest, your $${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} investment will grow to $${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} over ${years} years, earning $${interest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in compound interest. This represents a ${totalReturn}% total return, with an average annual growth rate of ${avgAnnualGrowth.toFixed(2)}%. The magic of compound interest is that you earn interest on your interest, creating exponential growth over time. This is why Albert Einstein allegedly called compound interest "the eighth wonder of the world." The earlier you start investing and the longer you let your money compound, the more dramatic the growth becomes. Most savings accounts, money market accounts, and investment accounts use compound interest. High-yield savings accounts currently offer APYs around 4-5%, while stock market investments have historically averaged 10% annual returns over long periods (though with more volatility). For retirement planning, the difference between starting to save at age 25 versus 35 can mean hundreds of thousands of dollars by age 65, purely due to the extra years of compounding. This calculator helps you visualize that growth and plan accordingly.`;
    };

    const generateSalesTaxSummary = (result: any) => {
        const taxAmount = result.taxAmount || 0;
        const totalAmount = result.totalAmount || 0;
        const baseAmount = totalAmount - taxAmount;

        const taxPercentage = baseAmount > 0 ? ((taxAmount / baseAmount) * 100).toFixed(2) : '0.00';

        return `For your $${baseAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} purchase, you'll pay $${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in sales tax (${taxPercentage}%), bringing your total cost to $${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Sales tax can significantly impact your budget, especially for major purchases like vehicles, furniture, or electronics. Sales tax rates vary dramatically by location - from 0% in some regions to over 10% in others when combining state, county, and local taxes. This variation is why many people consider sales tax when deciding where to make large purchases. For example, buying a $30,000 car in a 10% sales tax area costs $3,000 more than in a tax-free region. Some jurisdictions offer sales tax holidays for back-to-school shopping or emergency preparedness items. When budgeting for purchases, always factor in sales tax to avoid surprises at checkout. For businesses, understanding sales tax is crucial for pricing products and managing cash flow, as you must collect and remit these taxes to government authorities.`;
    };

    const generatePropertyTaxSummary = (result: any) => {
        const annualTax = result.taxAmount || 0;
        const monthlyTax = annualTax / 12;

        const affordabilityNote = annualTax > 5000 ?
            "This is a substantial property tax bill. In high-tax regions, property taxes can rival or exceed mortgage payments for some homeowners." :
            "This property tax amount is moderate compared to national averages.";

        return `Based on your home's assessed value and local tax rate, your estimated annual property tax is $${annualTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, which breaks down to approximately $${monthlyTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per month. ${affordabilityNote} Property taxes are a significant ongoing cost of homeownership and should be carefully considered when budgeting for a home purchase. These taxes fund essential local services including public schools (typically 40-60% of property tax revenue), police and fire departments, road maintenance, libraries, and parks. The quality of these services often correlates with property values, creating a cycle where higher taxes support better services, which in turn maintain or increase home values. Property tax rates vary enormously by region. Many jurisdictions offer exemptions or reduced rates for seniors, veterans, or primary residences (homestead exemptions). Property taxes typically increase over time as home values appreciate and local budgets grow. Understanding your property tax obligation is crucial for long-term financial planning and comparing homes in different areas.`;
    };

    const summaryGenerators: Record<string, (result: any) => string> = {
        'mortgage': generateMortgageSummary,
        'loan': generateLoanSummary,
        'simple-interest': generateSimpleInterestSummary,
        'compound-interest': generateCompoundInterestSummary,
        'sales-tax': generateSalesTaxSummary,
        'property-tax': generatePropertyTaxSummary
    };

    const summary = summaryGenerators[type]?.(result);

    if (!summary) {
        return null;
    }

    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Understanding Your Results
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {summary}
            </p>
        </div>
    );
}
