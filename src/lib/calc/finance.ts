/**
 * Finance Calculator - Advanced TVM (Time Value of Money) Calculations
 * Supports FV, PV, PMT, N, I/Y calculations with multiple compounding frequencies
 */

// ==================== TYPES & INTERFACES ====================

export type PaymentTiming = 'begin' | 'end';
export type CompoundingFrequency = 'annual' | 'semiannual' | 'quarterly' | 'monthly' | 'daily';
export type CalculationMode = 'FV' | 'PV' | 'PMT' | 'N' | 'IY';

export interface TVMInput {
    presentValue?: number;
    futureValue?: number;
    payment?: number;
    annualRate?: number;
    periods?: number;
    compoundingFrequency?: CompoundingFrequency;
    paymentTiming?: PaymentTiming;
}

export interface TVMResult {
    value: number;
    totalInvestment: number;
    totalInterest: number;
    effectiveRate: number;
}

export interface CashFlowPeriod {
    period: number;
    payment: number;
    interest: number;
    principal: number;
    balance: number;
    cumulativeInterest: number;
    cumulativePayment: number;
}

export interface Scenario {
    id: string;
    name: string;
    inputs: TVMInput;
    result: TVMResult;
    mode: CalculationMode;
}

export interface ComparisonData {
    scenarios: Scenario[];
    differences: {
        [key: string]: {
            absolute: number;
            percentage: number;
        };
    };
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get periods per year based on compounding frequency
 */
export function getPeriodsPerYear(frequency: CompoundingFrequency): number {
    switch (frequency) {
        case 'annual':
            return 1;
        case 'semiannual':
            return 2;
        case 'quarterly':
            return 4;
        case 'monthly':
            return 12;
        case 'daily':
            return 365;
        default:
            return 12;
    }
}

/**
 * Calculate periodic rate from annual rate
 */
export function calculatePeriodicRate(annualRate: number, frequency: CompoundingFrequency): number {
    const periodsPerYear = getPeriodsPerYear(frequency);
    return annualRate / periodsPerYear / 100;
}

/**
 * Calculate effective annual rate from nominal rate
 */
export function calculateEffectiveRate(nominalRate: number, frequency: CompoundingFrequency): number {
    const periodsPerYear = getPeriodsPerYear(frequency);
    const periodicRate = nominalRate / periodsPerYear / 100;
    return (Math.pow(1 + periodicRate, periodsPerYear) - 1) * 100;
}

/**
 * Calculate nominal rate from effective rate
 */
export function calculateNominalRate(effectiveRate: number, frequency: CompoundingFrequency): number {
    const periodsPerYear = getPeriodsPerYear(frequency);
    const nominalRate = (Math.pow(1 + effectiveRate / 100, 1 / periodsPerYear) - 1) * periodsPerYear * 100;
    return nominalRate;
}

/**
 * Format currency with abbreviations (K, M, B)
 */
export function formatCurrency(value: number, abbreviated: boolean = false): string {
    if (abbreviated) {
        if (Math.abs(value) >= 1_000_000_000) {
            return `$${(value / 1_000_000_000).toFixed(2)}B`;
        } else if (Math.abs(value) >= 1_000_000) {
            return `$${(value / 1_000_000).toFixed(2)}M`;
        } else if (Math.abs(value) >= 1_000) {
            return `$${(value / 1_000).toFixed(2)}K`;
        }
    }
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Validate TVM inputs
 */
export function validateInputs(input: TVMInput, mode: CalculationMode): { valid: boolean; error?: string } {
    const { presentValue = 0, futureValue = 0, payment = 0, annualRate, periods } = input;

    // Check required inputs based on mode
    if (mode === 'FV') {
        if (annualRate === undefined || periods === undefined) {
            return { valid: false, error: 'Annual rate and periods are required for FV calculation' };
        }
        if (presentValue === 0 && payment === 0) {
            return { valid: false, error: 'Either present value or payment must be non-zero' };
        }
    } else if (mode === 'PV') {
        if (annualRate === undefined || periods === undefined) {
            return { valid: false, error: 'Annual rate and periods are required for PV calculation' };
        }
        if (futureValue === 0 && payment === 0) {
            return { valid: false, error: 'Either future value or payment must be non-zero' };
        }
    } else if (mode === 'PMT') {
        if (annualRate === undefined || periods === undefined) {
            return { valid: false, error: 'Annual rate and periods are required for PMT calculation' };
        }
        if (presentValue === 0 && futureValue === 0) {
            return { valid: false, error: 'Either present value or future value must be non-zero' };
        }
    } else if (mode === 'N') {
        if (annualRate === undefined) {
            return { valid: false, error: 'Annual rate is required for N calculation' };
        }
    } else if (mode === 'IY') {
        if (periods === undefined) {
            return { valid: false, error: 'Periods is required for I/Y calculation' };
        }
    }

    // Validate positive values where required
    if (annualRate !== undefined && annualRate < 0) {
        return { valid: false, error: 'Annual rate must be positive' };
    }
    if (periods !== undefined && periods <= 0) {
        return { valid: false, error: 'Periods must be positive' };
    }

    return { valid: true };
}

// ==================== CORE TVM CALCULATIONS ====================

/**
 * Calculate Future Value (FV)
 * Formula: FV = PV * (1 + r)^n + PMT * [((1 + r)^n - 1) / r] * (1 + r*timing)
 */
export function calculateFutureValue(input: TVMInput): TVMResult {
    const {
        presentValue = 0,
        payment = 0,
        annualRate = 0,
        periods = 0,
        compoundingFrequency = 'monthly',
        paymentTiming = 'end'
    } = input;

    const periodicRate = calculatePeriodicRate(annualRate, compoundingFrequency);
    const timingMultiplier = paymentTiming === 'begin' ? (1 + periodicRate) : 1;

    // FV of lumpsum
    const fvLumpsum = presentValue * Math.pow(1 + periodicRate, periods);

    // FV of annuity
    let fvAnnuity = 0;
    if (payment !== 0 && periodicRate !== 0) {
        fvAnnuity = payment * (((Math.pow(1 + periodicRate, periods) - 1) / periodicRate) * timingMultiplier);
    } else if (payment !== 0 && periodicRate === 0) {
        fvAnnuity = payment * periods;
    }

    const futureValue = fvLumpsum + fvAnnuity;
    const totalInvestment = presentValue + (payment * periods);
    const totalInterest = futureValue - totalInvestment;
    const effectiveRate = calculateEffectiveRate(annualRate, compoundingFrequency);

    return {
        value: futureValue,
        totalInvestment,
        totalInterest,
        effectiveRate
    };
}

/**
 * Calculate Present Value (PV)
 * Formula: PV = FV / (1 + r)^n - PMT * [(1 - (1 + r)^-n) / r] * (1 + r*timing)
 */
export function calculatePresentValue(input: TVMInput): TVMResult {
    const {
        futureValue = 0,
        payment = 0,
        annualRate = 0,
        periods = 0,
        compoundingFrequency = 'monthly',
        paymentTiming = 'end'
    } = input;

    const periodicRate = calculatePeriodicRate(annualRate, compoundingFrequency);
    const timingMultiplier = paymentTiming === 'begin' ? (1 + periodicRate) : 1;

    // PV of lumpsum
    const pvLumpsum = futureValue / Math.pow(1 + periodicRate, periods);

    // PV of annuity
    let pvAnnuity = 0;
    if (payment !== 0 && periodicRate !== 0) {
        pvAnnuity = payment * (((1 - Math.pow(1 + periodicRate, -periods)) / periodicRate) * timingMultiplier);
    } else if (payment !== 0 && periodicRate === 0) {
        pvAnnuity = payment * periods;
    }

    const presentValue = pvLumpsum - pvAnnuity;

    // For PV calculations, the "investment" is the PV itself
    const totalInvestment = Math.abs(presentValue);
    const totalInterest = futureValue - totalInvestment - (payment * periods);
    const effectiveRate = calculateEffectiveRate(annualRate, compoundingFrequency);

    return {
        value: presentValue,
        totalInvestment,
        totalInterest,
        effectiveRate
    };
}

/**
 * Calculate Payment (PMT)
 * Formula: PMT = [PV * r * (1 + r)^n] / [(1 + r)^n - 1] / (1 + r*timing)
 */
export function calculatePayment(input: TVMInput): TVMResult {
    const {
        presentValue = 0,
        futureValue = 0,
        annualRate = 0,
        periods = 0,
        compoundingFrequency = 'monthly',
        paymentTiming = 'end'
    } = input;

    const periodicRate = calculatePeriodicRate(annualRate, compoundingFrequency);
    const timingMultiplier = paymentTiming === 'begin' ? (1 + periodicRate) : 1;

    let payment = 0;

    if (periodicRate === 0) {
        // If rate is 0, simple division
        payment = -(presentValue + futureValue) / periods;
    } else {
        // Adjust for FV
        const pvAdjusted = presentValue + (futureValue / Math.pow(1 + periodicRate, periods));

        payment = (-pvAdjusted * periodicRate * Math.pow(1 + periodicRate, periods)) /
            ((Math.pow(1 + periodicRate, periods) - 1) * timingMultiplier);
    }

    const totalPayment = payment * periods;
    const totalInvestment = Math.abs(presentValue) + Math.abs(totalPayment);
    const totalInterest = Math.abs(futureValue) - totalInvestment;
    const effectiveRate = calculateEffectiveRate(annualRate, compoundingFrequency);

    return {
        value: payment,
        totalInvestment,
        totalInterest,
        effectiveRate
    };
}

/**
 * Calculate Number of Periods (N) using iterative method
 * For lumpsum: N = ln(FV / PV) / ln(1 + r)
 * For annuities: Uses Newton-Raphson method
 */
export function calculatePeriods(input: TVMInput): TVMResult {
    const {
        presentValue = 0,
        futureValue = 0,
        payment = 0,
        annualRate = 0,
        compoundingFrequency = 'monthly',
        paymentTiming = 'end'
    } = input;

    const periodicRate = calculatePeriodicRate(annualRate, compoundingFrequency);
    const timingMultiplier = paymentTiming === 'begin' ? (1 + periodicRate) : 1;

    let periods = 0;

    if (payment === 0) {
        // Simple lumpsum case
        if (presentValue !== 0 && futureValue !== 0 && periodicRate !== 0) {
            periods = Math.log(Math.abs(futureValue / presentValue)) / Math.log(1 + periodicRate);
        }
    } else {
        // Annuity case - use Newton-Raphson method
        periods = solveForPeriods(presentValue, futureValue, payment, periodicRate, timingMultiplier);
    }

    const totalInvestment = Math.abs(presentValue) + (Math.abs(payment) * periods);
    const totalInterest = Math.abs(futureValue) - totalInvestment;
    const effectiveRate = calculateEffectiveRate(annualRate, compoundingFrequency);

    return {
        value: periods,
        totalInvestment,
        totalInterest,
        effectiveRate
    };
}

/**
 * Calculate Interest Rate (I/Y) using Newton-Raphson method
 * Iteratively solves for rate that balances the TVM equation
 */
export function calculateInterestRate(input: TVMInput): TVMResult {
    const {
        presentValue = 0,
        futureValue = 0,
        payment = 0,
        periods = 0,
        compoundingFrequency = 'monthly',
        paymentTiming = 'end'
    } = input;

    const periodsPerYear = getPeriodsPerYear(compoundingFrequency);
    const timingFactor = paymentTiming === 'begin' ? 1 : 0;

    // Use Newton-Raphson to solve for periodic rate
    const periodicRate = solveForRate(presentValue, futureValue, payment, periods, timingFactor);

    // Convert to annual rate
    const annualRate = periodicRate * periodsPerYear * 100;
    const effectiveRate = calculateEffectiveRate(annualRate, compoundingFrequency);

    const totalInvestment = Math.abs(presentValue) + (Math.abs(payment) * periods);
    const totalInterest = Math.abs(futureValue) - totalInvestment;

    return {
        value: annualRate,
        totalInvestment,
        totalInterest,
        effectiveRate
    };
}

// ==================== ITERATIVE SOLVERS ====================

/**
 * Newton-Raphson method to solve for number of periods
 */
function solveForPeriods(
    pv: number,
    fv: number,
    pmt: number,
    rate: number,
    timingMultiplier: number,
    maxIterations: number = 100,
    tolerance: number = 0.0001
): number {
    // Initial guess
    let n = 10;

    for (let i = 0; i < maxIterations; i++) {
        // Calculate f(n)
        const pvComponent = pv * Math.pow(1 + rate, n);
        const pmtComponent = pmt * (((Math.pow(1 + rate, n) - 1) / rate) * timingMultiplier);
        const f = pvComponent + pmtComponent - fv;

        // Calculate f'(n) - derivative
        const pvDerivative = pv * Math.pow(1 + rate, n) * Math.log(1 + rate);
        const pmtDerivative = pmt * (Math.pow(1 + rate, n) * Math.log(1 + rate) / rate) * timingMultiplier;
        const fPrime = pvDerivative + pmtDerivative;

        // Newton-Raphson update
        const nNew = n - f / fPrime;

        // Check convergence
        if (Math.abs(nNew - n) < tolerance) {
            return Math.max(0, nNew);
        }

        n = nNew;
    }

    return Math.max(0, n);
}

/**
 * Newton-Raphson method to solve for interest rate
 */
function solveForRate(
    pv: number,
    fv: number,
    pmt: number,
    n: number,
    timingFactor: number,
    maxIterations: number = 100,
    tolerance: number = 0.000001
): number {
    // Initial guess - simple approximation
    let rate = 0.1; // 10% initial guess

    // Special case: no interest scenario
    if (pmt !== 0) {
        const totalPayments = pmt * n;
        if (Math.abs(pv + totalPayments - fv) < 0.01) {
            return 0;
        }
    }

    for (let i = 0; i < maxIterations; i++) {
        const timingMultiplier = 1 + (rate * timingFactor);

        // Calculate f(r): PV equation
        let f: number;
        if (Math.abs(rate) < 0.0000001) {
            f = pv + (pmt * n) - fv;
        } else {
            const pvComponent = pv * Math.pow(1 + rate, n);
            const pmtComponent = pmt * (((Math.pow(1 + rate, n) - 1) / rate) * timingMultiplier);
            f = pvComponent + pmtComponent - fv;
        }

        // Calculate f'(r): derivative with respect to rate
        const pvDerivative = pv * n * Math.pow(1 + rate, n - 1);

        let pmtDerivative: number;
        if (Math.abs(rate) < 0.0000001) {
            pmtDerivative = pmt * n * (n - 1) / 2;
        } else {
            const term1 = (Math.pow(1 + rate, n) - 1) / rate;
            const term2 = (n * Math.pow(1 + rate, n - 1) * rate - Math.pow(1 + rate, n) + 1) / (rate * rate);
            pmtDerivative = pmt * (term2 * timingMultiplier + term1 * timingFactor);
        }

        const fPrime = pvDerivative + pmtDerivative;

        // Avoid division by zero
        if (Math.abs(fPrime) < 0.0000001) {
            break;
        }

        // Newton-Raphson update
        const rateNew = rate - f / fPrime;

        // Check convergence
        if (Math.abs(rateNew - rate) < tolerance) {
            return Math.max(0, rateNew);
        }

        // Prevent negative rates or extreme values
        rate = Math.max(-0.99, Math.min(10, rateNew));
    }

    return Math.max(0, rate);
}

// ==================== CASH FLOW SCHEDULE ====================

/**
 * Generate detailed cash flow schedule
 */
export function generateCashFlowSchedule(input: TVMInput, mode: CalculationMode): CashFlowPeriod[] {
    const {
        presentValue = 0,
        payment: pmtInput = 0,
        annualRate = 0,
        periods: periodsInput = 0,
        compoundingFrequency = 'monthly',
        paymentTiming = 'end'
    } = input;

    let payment = pmtInput;
    let periods = periodsInput;

    // Calculate missing values based on mode
    if (mode === 'PMT') {
        const result = calculatePayment(input);
        payment = result.value;
    } else if (mode === 'N') {
        const result = calculatePeriods(input);
        periods = Math.ceil(result.value);
        // If payment is 0 or very small, calculate it for display purposes
        if (Math.abs(payment) < 0.01 && periods > 0) {
            const pmtResult = calculatePayment({ ...input, periods });
            payment = pmtResult.value;
        }
    } else if (mode === 'PV' || mode === 'IY') {
        // For PV and IY modes, if payment is 0, calculate it for schedule display
        if (Math.abs(payment) < 0.01 && periods > 0) {
            const pmtResult = calculatePayment(input);
            payment = pmtResult.value;
        }
    }

    const periodicRate = calculatePeriodicRate(annualRate, compoundingFrequency);
    const schedule: CashFlowPeriod[] = [];

    let balance = presentValue;
    let cumulativeInterest = 0;
    let cumulativePayment = 0;

    for (let period = 1; period <= periods; period++) {
        // Interest for this period
        const interest = balance * periodicRate;

        // Principal portion
        const principal = payment - interest;

        // Update balance
        if (paymentTiming === 'begin') {
            balance = (balance - principal) * (1 + periodicRate);
        } else {
            balance = balance + interest - payment;
        }

        cumulativeInterest += interest;
        cumulativePayment += payment;

        schedule.push({
            period,
            payment,
            interest,
            principal,
            balance: Math.max(0, balance),
            cumulativeInterest,
            cumulativePayment
        });
    }

    return schedule;
}

// ==================== SCENARIO COMPARISON ====================

/**
 * Generate comparison data for multiple scenarios
 */
export function generateComparisonData(scenarios: Scenario[]): ComparisonData {
    const differences: ComparisonData['differences'] = {};

    // Compare first scenario with others
    if (scenarios.length >= 2) {
        const baseline = scenarios[0];

        for (let i = 1; i < scenarios.length; i++) {
            const current = scenarios[i];
            const key = `${baseline.id}_vs_${current.id}`;

            const absoluteDiff = current.result.value - baseline.result.value;
            const percentageDiff = (absoluteDiff / baseline.result.value) * 100;

            differences[key] = {
                absolute: absoluteDiff,
                percentage: percentageDiff
            };
        }
    }

    return {
        scenarios,
        differences
    };
}

// ==================== AI SUGGESTIONS ====================

/**
 * Generate smart financial suggestions based on inputs and results
 */
export function generateFinanceSuggestions(
    mode: CalculationMode,
    input: TVMInput,
    result: TVMResult
): string[] {
    const suggestions: string[] = [];
    const { annualRate = 0, periods = 0, presentValue = 0, futureValue = 0, payment = 0 } = input;

    // Mode-specific suggestions
    if (mode === 'FV') {
        if (result.value > 1_000_000) {
            suggestions.push("🎯 Excellent! You're on track to build substantial wealth. Consider diversifying across asset classes to protect your gains.");
        }

        if (annualRate < 5) {
            suggestions.push("📊 Your " + annualRate.toFixed(1) + "% return is conservative. Consider reviewing your investment mix - a balanced portfolio historically averages 8-10% annually.");
        }

        if (periods < 60) { // Less than 5 years
            suggestions.push("⏰ Consider a longer time horizon. Investments held for 10+ years significantly reduce risk and maximize compound growth.");
        }
    }

    if (mode === 'PV') {
        const discountedValue = (futureValue || 0) - result.value;
        if (discountedValue > 0) {
            const fvAmount = futureValue || 0;
            const pvAmount = result.value;
            suggestions.push(`💰 The time value of money works! $${fvAmount.toLocaleString()} in the future is worth $${pvAmount.toLocaleString()} today at your ${annualRate.toFixed(1)}% discount rate.`);
        }
    }

    if (mode === 'PMT') {
        const monthlyPayment = Math.abs(result.value);
        const totalPaid = monthlyPayment * periods;
        const totalInterest = result.totalInterest;

        if (totalInterest > totalPaid * 0.5) {
            suggestions.push(`⚠️ You'll pay $${formatCurrency(totalInterest, true)} in interest - that's over 50% of your total payments! Consider a shorter term or higher payments to save significantly.`);
        }

        suggestions.push(`💡 Paying an extra $${formatCurrency(monthlyPayment * 0.1, true)} monthly could save thousands in interest and shorten your payoff time.`);
    }

    if (mode === 'N') {
        const years = result.value / 12; // Assuming monthly
        if (years > 20) {
            suggestions.push(`⏳ ${years.toFixed(1)} years is a long journey. Consider increasing your contributions or seeking higher returns to reach your goal faster.`);
        } else if (years < 5) {
            suggestions.push(`🚀 Just ${years.toFixed(1)} years to your goal! Stay disciplined and you'll achieve it soon.`);
        }

        // Early start advantage
        if (presentValue === 0 && payment > 0) {
            const halfYears = years / 2;
            suggestions.push(`⚡ Starting ${halfYears.toFixed(0)} years earlier with the same contributions would dramatically boost your final amount!`);
        }
    }

    if (mode === 'IY') {
        if (result.value > 15) {
            suggestions.push(`🎊 A ${result.value.toFixed(2)}% return is outstanding! Make sure this is realistic and your investments are properly diversified.`);
        } else if (result.value < 3) {
            suggestions.push(`📉 A ${result.value.toFixed(2)}% return is below inflation. Your purchasing power is eroding. Consider reallocating to growth-oriented investments.`);
        }
    }

    // General compounding advice
    if (periods > 120) { // 10+ years
        suggestions.push("💎 Time is your greatest ally! Compound interest over " + (periods / 12).toFixed(0) + " years will work wonders. Stay invested through market ups and downs.");
    }

    // Rate-based suggestions
    if (annualRate >= 10) {
        suggestions.push("🎨 With higher returns come higher risks. Ensure you're diversified across stocks, bonds, and other asset classes.");
    }

    // Tax optimization
    suggestions.push("🧾 Don't forget taxes! Maximize tax-advantaged accounts (401k, IRA, HSA) to keep more of your returns.");

    // Inflation reminder
    suggestions.push("📉 Remember inflation! Average inflation is 2-3% annually. Your real return is what matters for purchasing power.");

    // Emergency fund
    if (mode === 'FV' && presentValue < 10000) {
        suggestions.push("🛡️ Before investing heavily, ensure you have 3-6 months of expenses in an emergency fund for financial stability.");
    }

    return suggestions.slice(0, 6); // Return max 6 suggestions
}

// ==================== EXPORT UTILITIES ====================

/**
 * Format data for PDF export (structure)
 */
export interface PDFExportData {
    title: string;
    mode: CalculationMode;
    inputs: TVMInput;
    result: TVMResult;
    schedule: CashFlowPeriod[];
    suggestions: string[];
    timestamp: Date;
}

export function formatForPDFExport(
    mode: CalculationMode,
    input: TVMInput,
    result: TVMResult,
    schedule: CashFlowPeriod[],
    suggestions: string[]
): PDFExportData {
    return {
        title: `Finance Calculator - ${mode} Calculation`,
        mode,
        inputs: input,
        result,
        schedule,
        suggestions,
        timestamp: new Date()
    };
}

/**
 * Format data for CSV export
 */
export function formatForCSVExport(schedule: CashFlowPeriod[]): string {
    const headers = ['Period', 'Payment', 'Interest', 'Principal', 'Balance', 'Cumulative Interest', 'Cumulative Payment'];
    const rows = schedule.map(p => [
        p.period,
        p.payment.toFixed(2),
        p.interest.toFixed(2),
        p.principal.toFixed(2),
        p.balance.toFixed(2),
        p.cumulativeInterest.toFixed(2),
        p.cumulativePayment.toFixed(2)
    ]);

    return [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
}
