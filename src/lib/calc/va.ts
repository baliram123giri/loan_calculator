import { calculateEMI, EMIResult } from './emi';

export type VALoanPurpose = 'purchase' | 'cash-out' | 'irrrl';

export interface VAInput {
    homePrice: number;
    downPayment: number;
    interestRate: number;
    loanTermYears: number;
    loanPurpose: VALoanPurpose;
    isFirstUse: boolean;
    isDisabled: boolean; // Service-Connected Disability (Exempt from Funding Fee)
    propertyTax: number; // Monthly
    homeInsurance: number; // Monthly
    hoaFees: number; // Monthly
    startDate: Date;
}

export interface VAResult extends EMIResult {
    fundingFeeAmount: number;
    fundingFeeRate: number;
    totalLoanAmount: number;
    monthlyTax: number;
    monthlyInsurance: number;
    monthlyHOA: number;
    totalMonthlyPayment: number;
}

export const getVAFundingFeeRate = (
    downPaymentPercentage: number,
    loanPurpose: VALoanPurpose,
    isFirstUse: boolean,
    isDisabled: boolean
): number => {
    if (isDisabled) return 0;

    if (loanPurpose === 'irrrl') {
        return 0.5;
    }

    if (loanPurpose === 'cash-out') {
        return isFirstUse ? 2.15 : 3.3;
    }

    // Purchase
    // < 5% down
    if (downPaymentPercentage < 5) {
        return isFirstUse ? 2.15 : 3.3;
    }
    // 5% - 9.99% down
    else if (downPaymentPercentage < 10) {
        return 1.5;
    }
    // 10% or more down
    else {
        return 1.25;
    }
};

export const calculateVA = (input: VAInput): VAResult => {
    const {
        homePrice,
        downPayment,
        interestRate,
        loanTermYears,
        loanPurpose,
        isFirstUse,
        isDisabled,
        propertyTax,
        homeInsurance,
        hoaFees,
        startDate
    } = input;

    const principal = homePrice - downPayment;
    const downPaymentPercentage = (downPayment / homePrice) * 100;

    const fundingFeeRate = getVAFundingFeeRate(downPaymentPercentage, loanPurpose, isFirstUse, isDisabled);
    const fundingFeeAmount = (principal * fundingFeeRate) / 100;

    const totalLoanAmount = principal + fundingFeeAmount;

    if (totalLoanAmount <= 0) {
        return {
            emi: 0,
            totalInterest: 0,
            totalPayment: 0,
            amortization: [],
            fundingFeeAmount,
            fundingFeeRate,
            totalLoanAmount: 0,
            monthlyTax: propertyTax,
            monthlyInsurance: homeInsurance,
            monthlyHOA: hoaFees,
            totalMonthlyPayment: propertyTax + homeInsurance + hoaFees
        };
    }

    const emiResult = calculateEMI(
        totalLoanAmount,
        interestRate,
        loanTermYears * 12,
        [], // extras
        startDate
    );

    const totalMonthlyPayment =
        emiResult.emi + propertyTax + homeInsurance + hoaFees;

    return {
        ...emiResult,
        fundingFeeAmount,
        fundingFeeRate,
        totalLoanAmount,
        monthlyTax: propertyTax,
        monthlyInsurance: homeInsurance,
        monthlyHOA: hoaFees,
        totalMonthlyPayment
    };
};
