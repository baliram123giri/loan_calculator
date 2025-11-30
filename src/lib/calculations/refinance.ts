export interface RefinanceInput {
    currentLoanBalance: number;
    currentInterestRate: number;
    currentTermYears: number; // Remaining term
    newLoanAmount: number; // Usually same as balance, unless cash-out
    newInterestRate: number;
    newTermYears: number;
    closingCosts: number;
    cashOutAmount: number; // 0 if not cash-out
}

export interface RefinanceResult {
    monthly: {
        currentPayment: number;
        newPayment: number;
        savings: number;
    };
    lifetime: {
        currentTotalInterest: number;
        newTotalInterest: number;
        interestSavings: number;
        totalCostCurrent: number;
        totalCostNew: number; // Includes closing costs
        netLifetimeSavings: number;
    };
    breakEvenMonths: number;
    projections: Array<{
        month: number;
        year: number;
        currentBalance: number;
        newBalance: number;
        cumulativeSavings: number;
    }>;
}

export function calculateRefinanceMetrics(input: RefinanceInput): RefinanceResult {
    const {
        currentLoanBalance,
        currentInterestRate,
        currentTermYears,
        newLoanAmount,
        newInterestRate,
        newTermYears,
        closingCosts
    } = input;

    // Monthly Rates
    const rCurrent = currentInterestRate / 100 / 12;
    const rNew = newInterestRate / 100 / 12;

    // Number of Payments
    const nCurrent = currentTermYears * 12;
    const nNew = newTermYears * 12;

    // Monthly Payments
    const currentPayment =
        currentLoanBalance *
        (rCurrent * Math.pow(1 + rCurrent, nCurrent)) /
        (Math.pow(1 + rCurrent, nCurrent) - 1);

    const newPayment =
        newLoanAmount *
        (rNew * Math.pow(1 + rNew, nNew)) /
        (Math.pow(1 + rNew, nNew) - 1);

    const monthlySavings = currentPayment - newPayment;

    // Lifetime Calculations
    const totalPaymentCurrent = currentPayment * nCurrent;
    const totalPaymentNew = newPayment * nNew;

    const currentTotalInterest = totalPaymentCurrent - currentLoanBalance;
    const newTotalInterest = totalPaymentNew - newLoanAmount;

    const interestSavings = currentTotalInterest - newTotalInterest;

    const totalCostNew = totalPaymentNew + closingCosts;
    const netLifetimeSavings = totalPaymentCurrent - totalCostNew;

    // Break-even Point
    // Simple Break-even = Closing Costs / Monthly Savings
    const breakEvenMonths = monthlySavings > 0 ? closingCosts / monthlySavings : -1;

    // Projections
    const projections = [];
    let balanceCurrent = currentLoanBalance;
    let balanceNew = newLoanAmount;
    let cumulativeSavings = -closingCosts; // Start in the hole by closing costs

    const maxMonths = Math.max(nCurrent, nNew);

    for (let i = 1; i <= maxMonths; i++) {
        // Current Loan Amortization
        if (i <= nCurrent) {
            const interest = balanceCurrent * rCurrent;
            const principal = currentPayment - interest;
            balanceCurrent -= principal;
            if (balanceCurrent < 0) balanceCurrent = 0;
        }

        // New Loan Amortization
        if (i <= nNew) {
            const interest = balanceNew * rNew;
            const principal = newPayment - interest;
            balanceNew -= principal;
            if (balanceNew < 0) balanceNew = 0;
        }

        // Cumulative Savings
        // Savings this month = (Payment Current or 0) - (Payment New or 0)
        const payCurrent = i <= nCurrent ? currentPayment : 0;
        const payNew = i <= nNew ? newPayment : 0;
        cumulativeSavings += (payCurrent - payNew);

        // Add to projections every year (or every month if needed, but year is usually enough for charts)
        // Let's do yearly for the chart to keep it clean, but we calculate monthly for accuracy
        if (i % 12 === 0) {
            projections.push({
                month: i,
                year: i / 12,
                currentBalance: Math.round(balanceCurrent),
                newBalance: Math.round(balanceNew),
                cumulativeSavings: Math.round(cumulativeSavings)
            });
        }
    }

    return {
        monthly: {
            currentPayment,
            newPayment,
            savings: monthlySavings
        },
        lifetime: {
            currentTotalInterest,
            newTotalInterest,
            interestSavings,
            totalCostCurrent: totalPaymentCurrent,
            totalCostNew,
            netLifetimeSavings
        },
        breakEvenMonths,
        projections
    };
}
