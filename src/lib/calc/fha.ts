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

    // 4. Calculate Base EMI (Principal + Interest) using the total loan amount
    const emiResult = calculateEMI(
        totalLoanAmount,
        interestRate,
        tenureMonths,
        [],
        startDate
    );

    // 5. Calculate Annual MIP Schedule
    // FHA Annual MIP is calculated annually based on the average outstanding balance
    // and divided by 12 for the monthly payment.
    // For simplicity and standard display, we often show the initial year's MIP.
    // However, to be "better than competitors", we should calculate it accurately per month/year
    // in the amortization schedule.

    let totalMIPPaid = 0;
    const enhancedAmortization: (AmortizationRow & { mip: number; totalPayment: number })[] = [];

    // We need to iterate through the amortization schedule from calculateEMI
    // and add the MIP component.

    // Annual MIP logic: 
    // Usually calculated as (Average Balance of Year * Rate) / 12.
    // Or simply (Current Balance * Rate) / 12 updated annually.
    // Most servicers update it once a year.

    let currentMIPMonthly = 0;

    // Helper to get MIP for a year based on balance
    const getAnnualMIP = (balance: number) => (balance * (annualMIPRate / 100));

    // Initial MIP based on total loan amount? No, usually base loan amount or total?
    // FHA rules: Annual MIP is based on the "average outstanding principal balance"
    // For the first year, it's often based on the original loan amount or average of first 12 months.
    // Let's use the standard approximation: (Balance * Rate) / 12, updated annually.

    // Actually, strictly speaking for FHA:
    // "The MIP is calculated on the average outstanding principal balance for the 12-month period."

    let currentYear = 0;

    // We'll use the balance from the START of the year to estimate for the year, 
    // or more accurately, sum the scheduled balances and divide.
    // For a calculator, updating it annually based on the balance at the start of the year is standard high-fidelity.

    // However, `calculateEMI` returns the schedule. We will map over it.

    // We need to track the balance to calculate MIP.
    // The `emiResult.amortization` has the balance at the END of the month.
    // We need balance at start.

    let balanceAtStartOfYear = totalLoanAmount;

    emiResult.amortization.forEach((row, index) => {
        const monthIndex = index + 1;
        const yearIndex = Math.ceil(monthIndex / 12);

        if (monthIndex === 1 || (monthIndex - 1) % 12 === 0) {
            // Start of a new year (or first month)
            // Update MIP for the year
            // For FHA, if LTV > 90%, MIP is for loan life (or 11 years if < 90%).
            // We'll assume life of loan for simplicity unless we want to add that logic.
            // Let's stick to the rate provided. If rate is 0, MIP is 0.

            // If loan term > 15 years, MIP is usually for 11 years or life.
            // We will just apply the rate. If the user wants it to stop, they can see it in the table 
            // or we can add "MIP Duration" later. For now, assume it runs as long as there is a balance 
            // or until the term ends, based on the rate provided.

            const annualMIPAmount = getAnnualMIP(balanceAtStartOfYear);
            currentMIPMonthly = annualMIPAmount / 12;

            // Update balance for next year's calculation
            // We can't know the exact balance at start of next year without looking ahead or tracking.
            // But we have the row.balance which is end of month.
        }

        // Check if we need to stop MIP (e.g. 11 years rule). 
        // For now, we apply it if rate > 0.

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
