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
    compoundingFrequency: 'yearly' | 'half-yearly' | 'quarterly' | 'monthly' | 'daily' = 'yearly',
    monthlyContribution: number = 0
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

    const r = annualRate / 100;
    let currentBalance = principal;
    let totalContributed = principal;
    const breakdown: YearlyBreakdown[] = [];

    // We simulate period by period for accuracy with contributions
    // Total periods = n * timeYears
    // However, contributions are monthly. If compounding is not monthly, this gets tricky.
    // Standard approximation: Contributions happen at the end of the month.
    // If compounding is less frequent than monthly (e.g. yearly), contributions sit there until compounding event?
    // Or do we assume standard "Future Value of a Series" formula which usually assumes compounding period = contribution period?
    // For simplicity and common use case, we will iterate monthly.
    // If compounding is daily, we compound daily.
    // If compounding is yearly, we compound at month 12.

    let accumulatedInterest = 0;

    for (let year = 1; year <= timeYears; year++) {
        const openingBalance = currentBalance;

        // Iterate through 12 months
        for (let month = 1; month <= 12; month++) {
            // Add contribution at the end of the month (or beginning? usually end for savings)
            // Let's do beginning of month for simplicity of interest calculation for that month? 
            // Standard is usually end of period. Let's stick to end of month contribution.

            // Calculate interest for this month
            // Rate per month = r / 12? No, depends on compounding.

            // Let's stick to the precise definition:
            // Balance grows by rate.
            // If compounding is 'yearly', interest is added only at month 12.
            // But contributions are added every month.

            // Daily simulation is best for generic handling but expensive? 50 years * 365 = 18000 iterations. Fast enough.
            // But let's do monthly simulation as it covers most cases.

            // If compounding is Daily:
            // We simulate days.

            if (compoundingFrequency === 'daily') {
                // Approximate 30.41 days per month
                const daysInMonth = 30.4375; // 365.25 / 12
                for (let d = 0; d < daysInMonth; d++) {
                    const dailyRate = r / 365;
                    accumulatedInterest += currentBalance * dailyRate;
                    currentBalance += currentBalance * dailyRate;
                }
            } else {
                // For other frequencies, we need to know if we compound this month.
                // Monthly: Every month
                // Quarterly: Month 3, 6, 9, 12
                // Half-yearly: Month 6, 12
                // Yearly: Month 12

                // Interest accrues regardless, but compounds (is added to principal) at specific times.
                // Actually, simple interest accrues if not compounded.

                // Let's use a simpler approach for "Monthly Contribution" which is typical for "SIP" or "Recurring Deposit".
                // Usually assumes Monthly Compounding for simplicity in many calculators.
                // BUT, if user selects "Yearly" compounding, we should respect that.

                // Accrue interest monthly based on simple rate, then compound at intervals.
                const monthlySimpleRate = r / 12;
                const interestForMonth = currentBalance * monthlySimpleRate;
                accumulatedInterest += interestForMonth;

                // Check if we compound this month
                let shouldCompound = false;
                if (compoundingFrequency === 'monthly') shouldCompound = true;
                if (compoundingFrequency === 'quarterly' && month % 3 === 0) shouldCompound = true;
                if (compoundingFrequency === 'half-yearly' && month % 6 === 0) shouldCompound = true;
                if (compoundingFrequency === 'yearly' && month % 12 === 0) shouldCompound = true;

                if (shouldCompound) {
                    currentBalance += accumulatedInterest;
                    accumulatedInterest = 0;
                }
            }

            // Add contribution
            currentBalance += monthlyContribution;
            totalContributed += monthlyContribution;
        }

        breakdown.push({
            year,
            openingBalance: Number(openingBalance.toFixed(2)),
            interest: Number((currentBalance - openingBalance - (monthlyContribution * 12)).toFixed(2)), // Interest earned this year
            closingBalance: Number(currentBalance.toFixed(2))
        });
    }

    // Final cleanup if any uncompounded interest remains (shouldn't happen for standard periods ending at year end)
    currentBalance += accumulatedInterest;

    const totalInterest = currentBalance - totalContributed;

    return {
        principal,
        rate: annualRate,
        time: timeYears,
        interest: Number(totalInterest.toFixed(2)),
        totalAmount: Number(currentBalance.toFixed(2)),
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
