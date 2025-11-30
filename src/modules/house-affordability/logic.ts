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

    // Default DTI Limits (Front / Back)
    let defaultFrontDTI = 0.28;
    let defaultBackDTI = 0.36;
    let defaultPMIRate = 0.005; // 0.5%

    if (mortgageType === 'FHA') {
        defaultFrontDTI = 0.31;
        defaultBackDTI = 0.43;
        defaultPMIRate = 0.0085; // 0.85%
    } else if (mortgageType === 'VA') {
        defaultFrontDTI = 1.0; // VA doesn't strictly use front-end
        defaultBackDTI = 0.41;
        defaultPMIRate = 0; // No PMI for VA
    }

    // Use custom values if provided, otherwise defaults
    const frontDTI = input.frontEndDTI ? input.frontEndDTI / 100 : defaultFrontDTI;
    const backDTI = input.backEndDTI ? input.backEndDTI / 100 : defaultBackDTI;
    const pmiRate = input.pmiRate !== undefined ? input.pmiRate / 100 : defaultPMIRate;

    // Calculate Max Payment based on Back-End Ratio (Total Debt)
    const maxTotalMonthlyPaymentBack = monthlyIncome * backDTI;
    const maxHousingPaymentBack = maxTotalMonthlyPaymentBack - monthlyDebts;

    // Calculate Max Payment based on Front-End Ratio (Housing Only)
    const maxHousingPaymentFront = monthlyIncome * frontDTI;

    // The limiting factor is the lower of the two
    const maxHousingPayment = Math.min(maxHousingPaymentBack, maxHousingPaymentFront);

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
        if (mortgageType !== 'VA' && ltv > 80) {
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
