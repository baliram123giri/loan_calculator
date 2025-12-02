import { Prepayment, RateChange } from './paymentCalc';

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

export function calculateAdvancedSimpleInterest(
    principal: number,
    initialRate: number,
    timeYears: number,
    startDate: Date = new Date(),
    prepayments: Prepayment[] = [],
    rateChanges: RateChange[] = []
): InterestCalculation {
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + timeYears);

    // Create a list of all events
    interface Event {
        date: Date;
        type: 'prepayment' | 'rateChange' | 'yearEnd';
        data?: any;
    }

    const events: Event[] = [];

    // Add Prepayments
    prepayments.forEach(p => {
        if (p.date > startDate && p.date <= endDate) {
            events.push({ date: p.date, type: 'prepayment', data: p });
        }
    });

    // Add Rate Changes
    rateChanges.forEach(rc => {
        if (rc.date > startDate && rc.date <= endDate) {
            events.push({ date: rc.date, type: 'rateChange', data: rc });
        }
    });

    // Add Year Ends
    for (let i = 1; i <= timeYears; i++) {
        const d = new Date(startDate);
        d.setFullYear(d.getFullYear() + i);
        events.push({ date: d, type: 'yearEnd', data: { year: i } });
    }

    // Sort events
    // Order on same day: YearEnd (Snapshot) -> Prepayment/RateChange (Apply for next)
    events.sort((a, b) => {
        const timeDiff = a.date.getTime() - b.date.getTime();
        if (timeDiff !== 0) return timeDiff;
        if (a.type === 'yearEnd') return -1;
        if (b.type === 'yearEnd') return 1;
        return 0;
    });

    let currentPrincipal = principal;
    let currentRate = initialRate;
    let currentDate = new Date(startDate);
    let totalInterest = 0;
    let accumulatedInterestForYear = 0;
    const breakdown: YearlyBreakdown[] = [];

    // Track opening balance for the current year
    let yearOpeningBalance = principal;

    events.forEach(event => {
        // Calculate interest for the segment
        const timeDiff = event.date.getTime() - currentDate.getTime();
        const days = timeDiff / (1000 * 3600 * 24);

        if (days > 0) {
            const segmentInterest = currentPrincipal * (currentRate / 100) * (days / 365);
            totalInterest += segmentInterest;
            accumulatedInterestForYear += segmentInterest;
        }

        // Handle Event
        if (event.type === 'yearEnd') {
            breakdown.push({
                year: event.data.year,
                openingBalance: Number(yearOpeningBalance.toFixed(2)),
                interest: Number(accumulatedInterestForYear.toFixed(2)),
                closingBalance: Number((currentPrincipal + totalInterest).toFixed(2))
            });

            // Reset for next year
            accumulatedInterestForYear = 0;
            yearOpeningBalance = currentPrincipal;
        } else if (event.type === 'prepayment') {
            const p = event.data as Prepayment;
            currentPrincipal -= p.amount;
            if (currentPrincipal < 0) currentPrincipal = 0;
        } else if (event.type === 'rateChange') {
            const rc = event.data as RateChange;
            currentRate = rc.newRate;
        }

        currentDate = event.date;
    });

    return {
        principal,
        rate: initialRate,
        time: timeYears,
        interest: Number(totalInterest.toFixed(2)),
        totalAmount: Number((currentPrincipal + totalInterest).toFixed(2)),
        breakdown
    };
}
