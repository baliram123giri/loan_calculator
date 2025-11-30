export interface AffordabilityInput {
    annualIncome: number;
    monthlyDebts: number;
    downPayment: number;
    interestRate: number;
    loanTermYears: number;
    hoaFees: number;
    propertyTaxRate: number; // Percentage
    homeownersInsurance: number; // Monthly
    creditScore: number;
    mortgageType: 'Conventional' | 'FHA' | 'VA';
}

export interface AffordabilityResult {
    maxHomePrice: number;
    monthlyPayment: number;
    loanAmount: number;
    downPaymentPercent: number;
    dti: number;
    breakdown: {
        principalAndInterest: number;
        propertyTax: number;
        homeownersInsurance: number;
        pmi: number;
        hoaFees: number;
    };
    riskLevel: 'Low' | 'Medium' | 'High';
    insights: string[];
}

export interface StateData {
    name: string;
    rate: number;
}

export interface CreditScoreData {
    min: number;
    max: number;
    rateAdjustment: number;
    label: string;
}
