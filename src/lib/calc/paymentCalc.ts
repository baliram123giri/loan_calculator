import { EMIResult, AmortizationRow } from './emi';

export interface PaymentResult extends EMIResult {
    calculatedTermMonths?: number;
    calculatedMonthlyPayment?: number;
}

/**
 * Calculates the monthly payment (EMI) for a fixed term loan.
 * This is essentially the same as the standard EMI calculation.
 */
export function calculateMonthlyPayment(
    principal: number,
    annualRate: number,
    tenureMonths: number
): number {
    if (annualRate === 0) return principal / tenureMonths;

    const monthlyRate = annualRate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    return emi;
}

/**
 * Calculates the number of months required to pay off a loan with a fixed monthly payment.
 */
export function calculateLoanTerm(
    principal: number,
    annualRate: number,
    monthlyPayment: number
): number {
    if (annualRate === 0) return principal / monthlyPayment;

    const monthlyRate = annualRate / 12 / 100;

    // Formula: n = -log(1 - (r * P) / A) / log(1 + r)
    // Where n = months, r = monthly rate, P = principal, A = monthly payment

    // Check if payment is sufficient to cover interest
    const monthlyInterest = principal * monthlyRate;
    if (monthlyPayment <= monthlyInterest) {
        throw new Error("Monthly payment is too low to cover interest. Loan will never be paid off.");
    }

    const numerator = -Math.log(1 - (monthlyRate * principal) / monthlyPayment);
    const denominator = Math.log(1 + monthlyRate);

    return Math.ceil(numerator / denominator);
}

/**
 * Generates amortization schedule for payment calculator.
 * Handles both fixed term and fixed payment scenarios.
 */
export interface Prepayment {
    date: Date;
    amount: number;
    type: 'reduce-tenure' | 'reduce-emi'; // Default to reduce-tenure
}

export interface RateChange {
    date: Date;
    newRate: number;
}

/**
 * Generates amortization schedule for payment calculator.
 * Handles both fixed term and fixed payment scenarios.
 * Now supports prepayments and dynamic rate changes.
 */
export function generatePaymentAmortization(
    principal: number,
    annualRate: number,
    tenureMonths: number, // If fixed payment, this is the calculated term
    monthlyPayment: number,
    startDate: Date = new Date(),
    prepayments: Prepayment[] = [],
    rateChanges: RateChange[] = []
): PaymentResult {
    const amortization: AmortizationRow[] = [];
    let balance = principal;
    let totalInterest = 0;
    let totalPayment = 0;
    let currentAnnualRate = annualRate;
    let currentMonthlyPayment = monthlyPayment;

    // Sort events by date to process them in order
    const sortedPrepayments = [...prepayments].sort((a, b) => a.date.getTime() - b.date.getTime());
    const sortedRateChanges = [...rateChanges].sort((a, b) => a.date.getTime() - b.date.getTime());

    let currentDate = new Date(startDate);

    // We need a dynamic loop because tenure might change
    let monthIndex = 1;
    // Safety break to prevent infinite loops
    const MAX_MONTHS = 1200; // 100 years

    while (balance > 0.01 && monthIndex <= MAX_MONTHS) {
        // 1. Check for Rate Changes applicable for this month (or before)
        // We check if any rate change happened strictly before or on the current billing date
        // For simplicity, we apply rate changes from the current month onwards if they happened in the last month window
        // A better approach for monthly steps: Check if a rate change occurred since the last payment date.

        // Let's assume rate changes apply from the month they fall in.
        // Find the latest rate change that is <= currentDate
        const activeRateChange = sortedRateChanges
            .filter(rc => rc.date <= currentDate)
            .pop(); // Get the last one

        if (activeRateChange && activeRateChange.newRate !== currentAnnualRate) {
            currentAnnualRate = activeRateChange.newRate;
            // If rate changes, we usually recalculate EMI if it's a fixed tenure loan, 
            // OR we keep EMI same and tenure adjusts.
            // For "Fixed Term" mode originally, we might want to keep the original target date? 
            // But standard behavior for many is: Rate increases -> Tenure increases (EMI same) OR EMI increases (Tenure same).
            // Let's assume we keep the EMI constant unless explicitly recalculated?
            // Actually, usually banks increase tenure. If tenure hits max, they increase EMI.
            // For this calculator, let's keep EMI constant for simplicity unless we want to add a toggle.
            // BUT, if we are in 'fixed-term' mode, the user expects to finish in N years.
            // Let's stick to: Keep EMI constant, let tenure adjust. This is the 'fixed-payment' behavior essentially.
            // If the user wants to recalculate EMI, they can just change the rate in the main input? 
            // No, this is for "future" rate changes.

            // Let's Recalculate EMI to keep remaining tenure same? 
            // That's complex because we don't track "remaining original tenure".

            // DECISION: Keep EMI constant, let tenure vary.
        }

        const monthlyRate = currentAnnualRate / 12 / 100;

        // 2. Check for Prepayments in this month
        // We apply prepayments BEFORE interest calculation for the month? Or AFTER?
        // Usually prepayments are made on the due date. 
        // If made on due date, they reduce principal immediately after payment? Or before?
        // Let's apply them WITH the payment.

        // Find prepayments that fall in this month (simple check: same month and year)
        const monthsPrepayments = sortedPrepayments.filter(p =>
            p.date.getMonth() === currentDate.getMonth() &&
            p.date.getFullYear() === currentDate.getFullYear()
        );

        let extraPayment = 0;
        let recalculateEMI = false;

        for (const p of monthsPrepayments) {
            extraPayment += p.amount;
            if (p.type === 'reduce-emi') {
                recalculateEMI = true;
            }
        }

        // Calculate interest for the month
        const interestForMonth = balance * monthlyRate;

        // Calculate principal component from regular EMI
        let principalForMonth = currentMonthlyPayment - interestForMonth;

        // Handle last month adjustment
        if (balance < principalForMonth) {
            principalForMonth = balance;
            currentMonthlyPayment = principalForMonth + interestForMonth;
        }

        // Apply regular payment
        let endingBalance = balance - principalForMonth;

        // Apply prepayments
        if (extraPayment > 0) {
            // Prepayment goes fully towards principal
            if (extraPayment > endingBalance) {
                extraPayment = endingBalance; // Cap at remaining balance
            }
            endingBalance -= extraPayment;

            // If user chose to reduce EMI, we recalculate EMI for the REMAINING tenure
            // But what is the "remaining tenure"? 
            // If we are in fixed-term mode, we want to finish by the original end date.
            if (recalculateEMI && endingBalance > 0) {
                // Remaining months = Original Tenure - Current Month
                const remainingMonths = Math.max(1, tenureMonths - monthIndex);
                currentMonthlyPayment = calculateMonthlyPayment(endingBalance, currentAnnualRate, remainingMonths);
            }
        }

        const totalPaymentForMonth = currentMonthlyPayment + extraPayment;

        // Update accumulators
        totalInterest += interestForMonth;
        totalPayment += totalPaymentForMonth;

        amortization.push({
            month: monthIndex,
            date: new Date(currentDate),
            principal: principalForMonth + extraPayment, // Total principal paid this month
            interest: interestForMonth,
            balance: endingBalance,
            payment: totalPaymentForMonth
        });

        balance = endingBalance;

        // Advance date
        currentDate.setMonth(currentDate.getMonth() + 1);
        monthIndex++;
    }

    return {
        emi: monthlyPayment, // Original EMI
        totalInterest,
        totalPayment,
        amortization,
        calculatedTermMonths: monthIndex - 1,
        calculatedMonthlyPayment: currentMonthlyPayment // Last EMI (might have changed)
    };
}
