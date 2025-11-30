import { AffordabilityInput, AffordabilityResult } from './schema';

export function calculateAffordability(input: AffordabilityInput): AffordabilityResult {
    const {
        annualIncome,
        monthlyDebts,
        downPayment,
        interestRate,
        loanTermYears,
        hoaFees,
        propertyTaxRate,
        homeownersInsurance,
        mortgageType
    } = input;

    const monthlyIncome = annualIncome / 12;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTermYears * 12;

    // Determine Max Allowable DTI based on Mortgage Type
    let maxDTI = 0.36; // Default Conventional Conservative
    if (mortgageType === 'FHA') maxDTI = 0.43;
    if (mortgageType === 'VA') maxDTI = 0.41;

    // Stretch DTI limits (for "Max Affordability" scenarios - simplified here to use standard limits first)
    // In a real scenario, we might return two results (Conservative vs Stretch).
    // For this implementation, let's stick to a reasonable standard.
    // Conventional can go up to 43-45% sometimes. Let's use 43% as a hard cap for "High Risk".

    // Max Monthly Payment allowed for Housing + Debts
    const maxTotalMonthlyPayment = monthlyIncome * maxDTI;

    // Max Monthly Payment allowed for Housing only
    const maxHousingPayment = maxTotalMonthlyPayment - monthlyDebts;

    if (maxHousingPayment <= 0) {
        return {
            maxHomePrice: 0,
            monthlyPayment: 0,
            loanAmount: 0,
            downPaymentPercent: 0,
            dti: (monthlyDebts / monthlyIncome) * 100,
            breakdown: {
                principalAndInterest: 0,
                propertyTax: 0,
                homeownersInsurance: 0,
                pmi: 0,
                hoaFees: 0
            },
            riskLevel: 'High',
            insights: ["Your current debts exceed the allowable amount for a mortgage."]
        };
    }

    // We need to solve for Loan Amount (P) where:
    // MonthlyPayment = P*r*(1+r)^n / ((1+r)^n - 1) + PropertyTax + Insurance + PMI + HOA
    // PropertyTax = (HomePrice * TaxRate) / 12
    // HomePrice = LoanAmount + DownPayment
    // PMI = (LoanAmount * PMI_Rate) / 12 (if LTV > 80%)

    // This is a bit circular because PMI and Tax depend on Price/Loan.
    // Let's iterate or solve algebraically. 
    // Simplified Algebra:
    // MaxHousing = PI + Tax + Ins + PMI + HOA
    // PI = Loan * Factor
    // Tax = (Loan + Down) * TaxRate / 12
    // PMI = Loan * PMI_Rate / 12 (approx 0.5% - 1% annually for conventional)

    // Let's assume PMI rate of 0.5% if LTV > 80% (Conventional) or 0.85% (FHA)
    let pmiRate = 0;
    if (mortgageType === 'FHA') pmiRate = 0.0085;
    else if (mortgageType === 'Conventional') pmiRate = 0.005; // Estimate

    // Iterative approach to find Max Price
    // Start with a guess: MaxHousing / Factor (ignoring tax/insurance)
    // Then adjust down.

    const mortgageFactor = (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);

    let low = 0;
    let high = annualIncome * 10; // Upper bound guess
    let maxHomePrice = 0;
    let finalLoanAmount = 0;
    let finalPMI = 0;
    let finalTax = 0;

    // Binary search for Max Price
    for (let i = 0; i < 20; i++) {
        const price = (low + high) / 2;
        const loan = Math.max(0, price - downPayment);
        const ltv = (loan / price) * 100;

        const pi = loan * mortgageFactor;
        const tax = (price * (propertyTaxRate / 100)) / 12;

        let pmi = 0;
        if (mortgageType === 'FHA' || (mortgageType === 'Conventional' && ltv > 80)) {
            pmi = (loan * pmiRate) / 12;
        }

        const totalMonthly = pi + tax + homeownersInsurance + hoaFees + pmi;

        if (totalMonthly > maxHousingPayment) {
            high = price;
        } else {
            low = price;
            maxHomePrice = price;
            finalLoanAmount = loan;
            finalPMI = pmi;
            finalTax = tax;
        }
    }

    // Final Calculation based on found Max Price
    const principalAndInterest = finalLoanAmount * mortgageFactor;
    const totalMonthlyPayment = principalAndInterest + finalTax + homeownersInsurance + hoaFees + finalPMI;
    const dti = ((monthlyDebts + totalMonthlyPayment) / monthlyIncome) * 100;

    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    if (dti > 36) riskLevel = 'Medium';
    if (dti > 43) riskLevel = 'High';

    const insights: string[] = [];
    if (dti > 36) insights.push("Your DTI is higher than 36%; lenders may offer higher rates.");
    if (downPayment < maxHomePrice * 0.2) insights.push("Putting less than 20% down requires PMI, increasing your monthly cost.");

    return {
        maxHomePrice: Math.floor(maxHomePrice),
        monthlyPayment: Math.round(totalMonthlyPayment),
        loanAmount: Math.floor(finalLoanAmount),
        downPaymentPercent: (downPayment / maxHomePrice) * 100,
        dti: Number(dti.toFixed(2)),
        breakdown: {
            principalAndInterest: Number(principalAndInterest.toFixed(2)),
            propertyTax: Number(finalTax.toFixed(2)),
            homeownersInsurance: Number(homeownersInsurance.toFixed(2)),
            pmi: Number(finalPMI.toFixed(2)),
            hoaFees: Number(hoaFees.toFixed(2))
        },
        riskLevel,
        insights
    };
}
