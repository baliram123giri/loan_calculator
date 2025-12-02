import { calculateEMI, EMIResult, AmortizationRow } from './emi';

export interface FHAInput {
    homePrice: number;
    downPayment: number; // Amount
    interestRate: number; // Annual %
    loanTermYears: number;
    startDate: Date;
    upfrontMIPRate: number; // % (default 1.75)
    annualMIPRate: number; // % (default 0.55)
    propertyTax: number; // Monthly amount
    homeInsurance: number; // Monthly amount
    hoaFees: number; // Monthly amount
}

export interface FHAResult extends EMIResult {
    baseLoanAmount: number;
    financedUpfrontMIP: number;
    totalLoanAmount: number;
    monthlyPrincipalAndInterest: number;
    monthlyMIP: number; // Initial monthly MIP
    monthlyTax: number;
    monthlyInsurance: number;
    monthlyHOA: number;
    totalMonthlyPayment: number; // Initial total
    totalMIPPaid: number;
    totalTaxPaid: number;
    totalInsurancePaid: number;
    totalHOAPaid: number;
}

export function calculateFHA(input: FHAInput): FHAResult {
    const {
        homePrice,
        downPayment,
        interestRate,
        loanTermYears,
        startDate,
        upfrontMIPRate,
        annualMIPRate,
        propertyTax,
        homeInsurance,
        hoaFees
    } = input;

    // 1. Calculate Base Loan Amount
    const baseLoanAmount = homePrice - downPayment;

    // 2. Calculate Upfront MIP
    const financedUpfrontMIP = baseLoanAmount * (upfrontMIPRate / 100);

    // 3. Total Loan Amount (Base + Upfront MIP)
    const totalLoanAmount = baseLoanAmount + financedUpfrontMIP;
    const tenureMonths = loanTermYears * 12;

    // Validation: If total loan amount is not positive, return zeroed result
    if (totalLoanAmount <= 0) {
        return {
            emi: 0,
            totalInterest: 0,
            totalPayment: 0,
            amortization: [],
            baseLoanAmount: 0,
            financedUpfrontMIP: 0,
            totalLoanAmount: 0,
            monthlyPrincipalAndInterest: 0,
            monthlyMIP: 0,
            monthlyTax: 0,
            monthlyInsurance: 0,
            monthlyHOA: 0,
            totalMonthlyPayment: 0,
            totalMIPPaid: 0,
            totalTaxPaid: 0,
            totalInsurancePaid: 0,
            totalHOAPaid: 0
        };
    }

    // 4. Calculate Base EMI (Principal + Interest) using the total loan amount
    const emiResult = calculateEMI(
        totalLoanAmount,
        interestRate,
        tenureMonths,
        [],
        startDate
    );

    // 5. Calculate Annual MIP Schedule
    let totalMIPPaid = 0;
    const enhancedAmortization: (AmortizationRow & { mip: number; totalPayment: number })[] = [];

    let currentMIPMonthly = 0;

    // Helper to get MIP for a year based on balance
    const getAnnualMIP = (balance: number) => (balance * (annualMIPRate / 100));

    let balanceAtStartOfYear = totalLoanAmount;

    emiResult.amortization.forEach((row, index) => {
        const monthIndex = index + 1;

        if (monthIndex === 1 || (monthIndex - 1) % 12 === 0) {
            // Start of a new year (or first month)
            // Update MIP for the year
            const annualMIPAmount = getAnnualMIP(balanceAtStartOfYear);
            currentMIPMonthly = annualMIPAmount / 12;
        }

        // Add MIP to this row
        const mip = Number(currentMIPMonthly.toFixed(2));
        totalMIPPaid += mip;

        // Total monthly payment for this row
        const totalRowPayment = row.payment + mip + propertyTax + homeInsurance + hoaFees;

        enhancedAmortization.push({
            ...row,
            mip,
            totalPayment: Number(totalRowPayment.toFixed(2))
        });

        // Update balanceAtStartOfYear if this is the last month of the year
        if (monthIndex % 12 === 0) {
            balanceAtStartOfYear = row.balance;
        }
    });

    const totalTaxPaid = propertyTax * tenureMonths;
    const totalInsurancePaid = homeInsurance * tenureMonths;
    const totalHOAPaid = hoaFees * tenureMonths;

    // Initial monthly payment (Month 1)
    const initialMIP = enhancedAmortization.length > 0 ? enhancedAmortization[0].mip : 0;
    const monthlyPrincipalAndInterest = emiResult.emi;

    const totalMonthlyPayment = monthlyPrincipalAndInterest + initialMIP + propertyTax + homeInsurance + hoaFees;

    return {
        ...emiResult,
        amortization: enhancedAmortization, // Override with enhanced version
        baseLoanAmount,
        financedUpfrontMIP,
        totalLoanAmount,
        monthlyPrincipalAndInterest,
        monthlyMIP: initialMIP,
        monthlyTax: propertyTax,
        monthlyInsurance: homeInsurance,
        monthlyHOA: hoaFees,
        totalMonthlyPayment: Number(totalMonthlyPayment.toFixed(2)),
        totalMIPPaid: Number(totalMIPPaid.toFixed(2)),
        totalTaxPaid,
        totalInsurancePaid,
        totalHOAPaid
    };
}
