export interface InterestCalculation {
    principal: number;
    rate: number;
    time: number; // in years
    interest: number;
    totalAmount: number;
    breakdown: YearlyBreakdown[];
}

export interface YearlyBreakdown {
    year: number;
    openingBalance: number;
    interest: number;
    closingBalance: number;
}

export function calculateSimpleInterest(
    principal: number,
    annualRate: number,
    timeYears: number
): InterestCalculation {
    const interest = (principal * annualRate * timeYears) / 100;
    const totalAmount = principal + interest;

    // Generate yearly breakdown
    const breakdown: YearlyBreakdown[] = [];
    const yearlyInterest = interest / timeYears;

    for (let year = 1; year <= timeYears; year++) {
        breakdown.push({
            year,
            openingBalance: principal,
            interest: yearlyInterest,
            closingBalance: principal + (yearlyInterest * year)
        });
    }

    return {
        principal,
        rate: annualRate,
        time: timeYears,
        interest: Number(interest.toFixed(2)),
        totalAmount: Number(totalAmount.toFixed(2)),
        breakdown
    };
}

export function calculateCompoundInterest(
    principal: number,
    annualRate: number,
    timeYears: number,
    compoundingFrequency: 'yearly' | 'half-yearly' | 'quarterly' | 'monthly' | 'daily' = 'yearly'
): InterestCalculation {
    // Determine n (number of times interest is compounded per year)
    let n: number;
    switch (compoundingFrequency) {
        case 'yearly':
            n = 1;
            break;
        case 'half-yearly':
            n = 2;
            break;
        case 'quarterly':
            n = 4;
            break;
        case 'monthly':
            n = 12;
            break;
        case 'daily':
            n = 365;
            break;
    }

    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const totalAmount = principal * Math.pow(1 + annualRate / (100 * n), n * timeYears);
    const interest = totalAmount - principal;

    // Generate yearly breakdown
    const breakdown: YearlyBreakdown[] = [];
    let currentBalance = principal;

    for (let year = 1; year <= timeYears; year++) {
        const openingBalance = currentBalance;
        const yearEndBalance = principal * Math.pow(1 + annualRate / (100 * n), n * year);
        const yearInterest = yearEndBalance - currentBalance;

        breakdown.push({
            year,
            openingBalance: Number(openingBalance.toFixed(2)),
            interest: Number(yearInterest.toFixed(2)),
            closingBalance: Number(yearEndBalance.toFixed(2))
        });

        currentBalance = yearEndBalance;
    }

    return {
        principal,
        rate: annualRate,
        time: timeYears,
        interest: Number(interest.toFixed(2)),
        totalAmount: Number(totalAmount.toFixed(2)),
        breakdown
    };
}

export function calculateAPY(
    nominalRate: number,
    compoundingFrequency: 'yearly' | 'half-yearly' | 'quarterly' | 'monthly' | 'daily'
): number {
    let n: number;
    switch (compoundingFrequency) {
        case 'yearly': n = 1; break;
        case 'half-yearly': n = 2; break;
        case 'quarterly': n = 4; break;
        case 'monthly': n = 12; break;
        case 'daily': n = 365; break;
    }

    const r = nominalRate / 100;
    const apy = Math.pow(1 + r / n, n) - 1;
    return Number((apy * 100).toFixed(2));
}
