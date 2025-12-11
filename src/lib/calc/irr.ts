/**
 * Internal Rate of Return (IRR) Calculation Library
 * 
 * Implements Newton-Raphson method for calculating IRR, NPV, MIRR,
 * and related financial metrics for various investment scenarios.
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface IRRInput {
    cashFlows: number[];
    initialGuess?: number;
    tolerance?: number;
    maxIterations?: number;
}

export interface IRRResult {
    irr: number; // in percentage
    npvAtIRR: number; // Should be ~0
    iterations: number;
    converged: boolean;
    mirr?: number;
    paybackPeriod?: number;
}

export interface CashFlowItem {
    period: number;
    cashFlow: number;
    cumulative: number;
    discountedCF: number;
    npv: number;
    date?: string;
}

export interface NPVInput {
    cashFlows: number[];
    discountRate: number;
}

export interface MIRRInput {
    cashFlows: number[];
    financeRate: number;
    reinvestmentRate: number;
}

export interface InvestmentProjectInput {
    initialInvestment: number;
    periodicReturns: number[];
    inflationRate?: number;
    taxRate?: number;
}

export interface RealEstateInput {
    purchasePrice: number;
    downPayment: number;
    annualRent: number;
    annualExpenses: number;
    appreciationRate: number;
    years: number;
    inflationRate?: number;
    taxRate?: number;
}

export interface BusinessProjectInput {
    initialInvestment: number;
    yearlyRevenues: number[];
    yearlyCosts: number[];
    terminalValue?: number;
    taxRate?: number;
}

// ============================================================================
// Core IRR Calculation (Newton-Raphson Method)
// ============================================================================

/**
 * Calculate IRR using Newton-Raphson iterative method
 * 
 * The IRR is the discount rate where NPV = 0:
 * NPV = Σ [CFt / (1 + r)^t] = 0
 * 
 * @param input - Cash flows and calculation parameters
 * @returns IRR result with convergence information
 */
export function calculateIRR(input: IRRInput): IRRResult {
    const {
        cashFlows,
        initialGuess = 0.1,
        tolerance = 0.00001,
        maxIterations = 100
    } = input;

    // Validate cash flows
    if (!cashFlows || cashFlows.length < 2) {
        throw new Error('At least 2 cash flows are required');
    }

    // Check for at least one positive and one negative cash flow
    const hasPositive = cashFlows.some(cf => cf > 0);
    const hasNegative = cashFlows.some(cf => cf < 0);

    if (!hasPositive || !hasNegative) {
        return {
            irr: 0,
            npvAtIRR: 0,
            iterations: 0,
            converged: false,
            paybackPeriod: calculatePaybackPeriod(cashFlows)
        };
    }

    let rate = initialGuess;
    let iterations = 0;

    for (iterations = 0; iterations < maxIterations; iterations++) {
        let npv = 0;
        let dnpv = 0; // Derivative of NPV

        // Calculate NPV and its derivative at current rate
        for (let t = 0; t < cashFlows.length; t++) {
            const discountFactor = Math.pow(1 + rate, t);
            npv += cashFlows[t] / discountFactor;

            // Derivative: -t * CFt / (1 + r)^(t+1)
            if (t > 0) {
                dnpv -= t * cashFlows[t] / Math.pow(1 + rate, t + 1);
            }
        }

        // Check for convergence
        if (Math.abs(npv) < tolerance) {
            const mirr = calculateMIRR({
                cashFlows,
                financeRate: 0.1,
                reinvestmentRate: rate
            });

            return {
                irr: rate * 100,
                npvAtIRR: npv,
                iterations: iterations + 1,
                converged: true,
                mirr: mirr * 100,
                paybackPeriod: calculatePaybackPeriod(cashFlows)
            };
        }

        // Newton-Raphson update
        if (Math.abs(dnpv) < 0.0000001) {
            // Derivative too small, try different starting point
            rate = initialGuess + Math.random() * 0.1;
            continue;
        }

        const newRate = rate - npv / dnpv;

        // Prevent wild oscillations
        if (Math.abs(newRate - rate) < tolerance) {
            const mirr = calculateMIRR({
                cashFlows,
                financeRate: 0.1,
                reinvestmentRate: newRate
            });

            return {
                irr: newRate * 100,
                npvAtIRR: npv,
                iterations: iterations + 1,
                converged: true,
                mirr: mirr * 100,
                paybackPeriod: calculatePaybackPeriod(cashFlows)
            };
        }

        rate = newRate;

        // Keep rate within reasonable bounds
        if (rate < -0.99) rate = -0.99;
        if (rate > 10) rate = 10;
    }

    // Failed to converge
    return {
        irr: rate * 100,
        npvAtIRR: calculateNPV({ cashFlows, discountRate: rate * 100 }),
        iterations,
        converged: false,
        paybackPeriod: calculatePaybackPeriod(cashFlows)
    };
}

// ============================================================================
// NPV Calculation
// ============================================================================

/**
 * Calculate Net Present Value at a given discount rate
 * 
 * NPV = Σ [CFt / (1 + r)^t]
 * 
 * @param input - Cash flows and discount rate
 * @returns Net Present Value
 */
export function calculateNPV(input: NPVInput): number {
    const { cashFlows, discountRate } = input;
    const rate = discountRate / 100;

    return cashFlows.reduce((npv, cf, t) => {
        return npv + cf / Math.pow(1 + rate, t);
    }, 0);
}

// ============================================================================
// MIRR Calculation
// ============================================================================

/**
 * Calculate Modified Internal Rate of Return
 * 
 * MIRR addresses the reinvestment rate assumption issue of traditional IRR
 * by using different rates for financing and reinvestment.
 * 
 * @param input - Cash flows, finance rate, and reinvestment rate
 * @returns MIRR as decimal (not percentage)
 */
export function calculateMIRR(input: MIRRInput): number {
    const { cashFlows, financeRate, reinvestmentRate } = input;
    const n = cashFlows.length - 1;

    // Present value of negative cash flows (financing)
    let pvNegative = 0;
    // Future value of positive cash flows (reinvestment)
    let fvPositive = 0;

    for (let t = 0; t < cashFlows.length; t++) {
        if (cashFlows[t] < 0) {
            pvNegative += cashFlows[t] / Math.pow(1 + financeRate, t);
        } else {
            fvPositive += cashFlows[t] * Math.pow(1 + reinvestmentRate, n - t);
        }
    }

    if (pvNegative === 0 || fvPositive === 0) return 0;

    // MIRR = (FV_positive / |PV_negative|)^(1/n) - 1
    const mirr = Math.pow(fvPositive / Math.abs(pvNegative), 1 / n) - 1;
    return mirr;
}

// ============================================================================
// Payback Period
// ============================================================================

/**
 * Calculate the payback period (time to recover initial investment)
 * 
 * @param cashFlows - Array of cash flows
 * @returns Payback period in years (fractional), or undefined if not recovered
 */
export function calculatePaybackPeriod(cashFlows: number[]): number | undefined {
    let cumulative = 0;

    for (let t = 0; t < cashFlows.length; t++) {
        cumulative += cashFlows[t];

        if (cumulative >= 0) {
            // Interpolate to find exact payback point
            if (t === 0) return 0;

            const previousCumulative = cumulative - cashFlows[t];
            const fraction = Math.abs(previousCumulative) / cashFlows[t];
            return t - 1 + fraction;
        }
    }

    return undefined; // Investment not recovered within period
}

// ============================================================================
// Cash Flow Schedule Generation
// ============================================================================

/**
 * Generate detailed cash flow schedule with cumulative and discounted values
 * 
 * @param cashFlows - Array of cash flows
 * @param discountRate - Rate for discounting (in percentage)
 * @param startDate - Optional start date for labeling
 * @returns Array of cash flow items
 */
export function generateCashFlowSchedule(
    cashFlows: number[],
    discountRate: number,
    startDate?: Date
): CashFlowItem[] {
    const rate = discountRate / 100;
    let cumulative = 0;
    let npvRunning = 0;

    return cashFlows.map((cf, period) => {
        cumulative += cf;
        const discountedCF = cf / Math.pow(1 + rate, period);
        npvRunning += discountedCF;

        let dateLabel: string | undefined;
        if (startDate) {
            const date = new Date(startDate);
            date.setFullYear(date.getFullYear() + period);
            dateLabel = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        }

        return {
            period,
            cashFlow: cf,
            cumulative,
            discountedCF,
            npv: npvRunning,
            date: dateLabel
        };
    });
}

// ============================================================================
// Mode-Specific Calculations
// ============================================================================

/**
 * Calculate IRR for a simple investment project
 */
export function calculateSimpleIRR(cashFlows: number[]): IRRResult {
    return calculateIRR({ cashFlows });
}

/**
 * Calculate IRR for an investment project with periodic returns
 */
export function calculateInvestmentIRR(input: InvestmentProjectInput): {
    result: IRRResult;
    schedule: CashFlowItem[];
    realIRR?: number;
    afterTaxIRR?: number;
} {
    const { initialInvestment, periodicReturns, inflationRate = 0, taxRate = 0 } = input;

    // Build cash flow array: initial investment (negative) + periodic returns
    const cashFlows = [-initialInvestment, ...periodicReturns];

    const result = calculateIRR({ cashFlows });
    const schedule = generateCashFlowSchedule(cashFlows, result.irr);

    // Calculate real IRR (inflation-adjusted)
    let realIRR: number | undefined;
    if (inflationRate > 0) {
        // Real Rate ≈ (1 + nominal) / (1 + inflation) - 1
        realIRR = ((1 + result.irr / 100) / (1 + inflationRate / 100) - 1) * 100;
    }

    // Calculate after-tax IRR
    let afterTaxIRR: number | undefined;
    if (taxRate > 0) {
        const afterTaxReturns = periodicReturns.map(ret => {
            const gain = ret;
            const tax = Math.max(0, gain) * (taxRate / 100);
            return ret - tax;
        });
        const afterTaxCF = [-initialInvestment, ...afterTaxReturns];
        const afterTaxResult = calculateIRR({ cashFlows: afterTaxCF });
        afterTaxIRR = afterTaxResult.irr;
    }

    return { result, schedule, realIRR, afterTaxIRR };
}

/**
 * Calculate IRR for real estate investment
 */
export function calculateRealEstateIRR(input: RealEstateInput): {
    result: IRRResult;
    schedule: CashFlowItem[];
    totalReturn: number;
} {
    const {
        purchasePrice,
        downPayment,
        annualRent,
        annualExpenses,
        appreciationRate,
        years,
        inflationRate = 0,
        taxRate = 0
    } = input;

    const cashFlows: number[] = [-downPayment];

    // Calculate annual net operating income with appreciation
    for (let year = 1; year <= years; year++) {
        const adjustedRent = annualRent * Math.pow(1 + inflationRate / 100, year - 1);
        const adjustedExpenses = annualExpenses * Math.pow(1 + inflationRate / 100, year - 1);
        let netIncome = adjustedRent - adjustedExpenses;

        // Apply tax on net income
        if (taxRate > 0 && netIncome > 0) {
            netIncome *= (1 - taxRate / 100);
        }

        cashFlows.push(netIncome);
    }

    // Add property appreciation to final year
    const finalValue = purchasePrice * Math.pow(1 + appreciationRate / 100, years);
    const loanAmount = purchasePrice - downPayment;
    const equity = finalValue - loanAmount; // Simplified: assumes loan not paid down
    cashFlows[cashFlows.length - 1] += equity;

    const result = calculateIRR({ cashFlows });
    const schedule = generateCashFlowSchedule(cashFlows, result.irr);
    const totalReturn = cashFlows.reduce((sum, cf) => sum + cf, 0);

    return { result, schedule, totalReturn };
}

/**
 * Calculate IRR for business project
 */
export function calculateBusinessProjectIRR(input: BusinessProjectInput): {
    result: IRRResult;
    schedule: CashFlowItem[];
    totalProfit: number;
} {
    const { initialInvestment, yearlyRevenues, yearlyCosts, terminalValue = 0, taxRate = 0 } = input;

    const cashFlows: number[] = [-initialInvestment];

    // Calculate net cash flows
    for (let i = 0; i < Math.max(yearlyRevenues.length, yearlyCosts.length); i++) {
        const revenue = yearlyRevenues[i] || 0;
        const cost = yearlyCosts[i] || 0;
        let netCF = revenue - cost;

        // Apply tax on profit
        if (taxRate > 0 && netCF > 0) {
            netCF *= (1 - taxRate / 100);
        }

        cashFlows.push(netCF);
    }

    // Add terminal value to final year
    if (terminalValue > 0) {
        cashFlows[cashFlows.length - 1] += terminalValue;
    }

    const result = calculateIRR({ cashFlows });
    const schedule = generateCashFlowSchedule(cashFlows, result.irr);
    const totalProfit = cashFlows.reduce((sum, cf) => sum + cf, 0);

    return { result, schedule, totalProfit };
}

// ============================================================================
// NPV Sensitivity Analysis
// ============================================================================

/**
 * Generate NPV values at different discount rates for sensitivity analysis
 * 
 * @param cashFlows - Cash flow array
 * @param rateRange - Range of rates to test (e.g., [0, 50] for 0% to 50%)
 * @param steps - Number of data points to generate
 * @returns Array of { rate, npv } objects
 */
export function generateNPVSensitivity(
    cashFlows: number[],
    rateRange: [number, number] = [0, 50],
    steps: number = 20
): Array<{ rate: number; npv: number }> {
    const [minRate, maxRate] = rateRange;
    const stepSize = (maxRate - minRate) / (steps - 1);

    const results: Array<{ rate: number; npv: number }> = [];

    for (let i = 0; i < steps; i++) {
        const rate = minRate + i * stepSize;
        const npv = calculateNPV({ cashFlows, discountRate: rate });
        results.push({ rate, npv });
    }

    return results;
}
