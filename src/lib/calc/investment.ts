/**
 * Investment Calculator - Calculation Functions
 * Supports Lumpsum, SIP, Combined, Step-Up SIP, Goal Planning
 */

export interface LumpsumInput {
    principal: number;
    annualRate: number;
    years: number;
    inflationRate?: number;
    taxRate?: number;
}

export interface SIPInput {
    monthlyInvestment: number;
    annualRate: number;
    years: number;
    inflationRate?: number;
    taxRate?: number;
}

export interface CombinedInput {
    lumpsum: number;
    monthlyInvestment: number;
    annualRate: number;
    years: number;
    inflationRate?: number;
    taxRate?: number;
}

export interface StepUpSIPInput {
    initialMonthlyInvestment: number;
    annualRate: number;
    years: number;
    stepUpRate: number;
    inflationRate?: number;
    taxRate?: number;
}

export interface GoalPlannerInput {
    targetAmount: number;
    currentSavings: number;
    annualRate: number;
    years: number;
}

export interface InvestmentResult {
    totalInvestment: number;
    totalReturns: number;
    futureValue: number;
    realValue?: number;
    afterTaxValue?: number;
    cagr: number;
}

export interface YearlyBreakdown {
    year: number;
    yearlyInvestment: number;
    totalInvestment: number;
    interestEarned: number;
    totalInterest: number;
    balance: number;
}

/**
 * Calculate lumpsum investment returns
 */
export function calculateLumpsum(input: LumpsumInput): InvestmentResult {
    const { principal, annualRate, years, inflationRate, taxRate } = input;

    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;

    // Future Value = P * (1 + r)^n
    const futureValue = principal * Math.pow(1 + monthlyRate, months);
    const totalInvestment = principal;
    const totalReturns = futureValue - totalInvestment;

    // Real value (inflation-adjusted)
    let realValue: number | undefined;
    if (inflationRate !== undefined && inflationRate > 0) {
        realValue = futureValue / Math.pow(1 + inflationRate / 100, years);
    }

    // After-tax value
    let afterTaxValue: number | undefined;
    if (taxRate !== undefined && taxRate > 0) {
        const taxOnReturns = totalReturns * (taxRate / 100);
        afterTaxValue = futureValue - taxOnReturns;
    }

    const cagr = calculateCAGR(totalInvestment, futureValue, years);

    return {
        totalInvestment,
        totalReturns,
        futureValue,
        realValue,
        afterTaxValue,
        cagr
    };
}

/**
 * Calculate SIP (Systematic Investment Plan) returns
 */
export function calculateSIP(input: SIPInput): InvestmentResult {
    const { monthlyInvestment, annualRate, years, inflationRate, taxRate } = input;

    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;

    // Future Value of SIP = P × [(1 + r)^n - 1] / r × (1 + r)
    const futureValue = monthlyInvestment *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate);

    const totalInvestment = monthlyInvestment * months;
    const totalReturns = futureValue - totalInvestment;

    // Real value (inflation-adjusted)
    let realValue: number | undefined;
    if (inflationRate !== undefined && inflationRate > 0) {
        realValue = futureValue / Math.pow(1 + inflationRate / 100, years);
    }

    // After-tax value
    let afterTaxValue: number | undefined;
    if (taxRate !== undefined && taxRate > 0) {
        const taxOnReturns = totalReturns * (taxRate / 100);
        afterTaxValue = futureValue - taxOnReturns;
    }

    const cagr = calculateCAGR(totalInvestment, futureValue, years);

    return {
        totalInvestment,
        totalReturns,
        futureValue,
        realValue,
        afterTaxValue,
        cagr
    };
}

/**
 * Calculate combined lumpsum + SIP returns
 */
export function calculateCombined(input: CombinedInput): InvestmentResult {
    const { lumpsum, monthlyInvestment, annualRate, years, inflationRate, taxRate } = input;

    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;

    // Lumpsum component
    const lumpsumFV = lumpsum * Math.pow(1 + monthlyRate, months);

    // SIP component
    const sipFV = monthlyInvestment *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate);

    const futureValue = lumpsumFV + sipFV;
    const totalInvestment = lumpsum + (monthlyInvestment * months);
    const totalReturns = futureValue - totalInvestment;

    // Real value (inflation-adjusted)
    let realValue: number | undefined;
    if (inflationRate !== undefined && inflationRate > 0) {
        realValue = futureValue / Math.pow(1 + inflationRate / 100, years);
    }

    // After-tax value
    let afterTaxValue: number | undefined;
    if (taxRate !== undefined && taxRate > 0) {
        const taxOnReturns = totalReturns * (taxRate / 100);
        afterTaxValue = futureValue - taxOnReturns;
    }

    const cagr = calculateCAGR(totalInvestment, futureValue, years);

    return {
        totalInvestment,
        totalReturns,
        futureValue,
        realValue,
        afterTaxValue,
        cagr
    };
}

/**
 * Calculate step-up SIP returns (SIP amount increases annually)
 */
export function calculateStepUpSIP(input: StepUpSIPInput): InvestmentResult {
    const { initialMonthlyInvestment, annualRate, years, stepUpRate, inflationRate, taxRate } = input;

    const monthlyRate = annualRate / 12 / 100;
    let balance = 0;
    let totalInvestment = 0;
    let currentMonthlyInvestment = initialMonthlyInvestment;

    for (let year = 1; year <= years; year++) {
        for (let month = 1; month <= 12; month++) {
            balance = (balance + currentMonthlyInvestment) * (1 + monthlyRate);
            totalInvestment += currentMonthlyInvestment;
        }
        // Increase SIP amount at year end
        if (year < years) {
            currentMonthlyInvestment = currentMonthlyInvestment * (1 + stepUpRate / 100);
        }
    }

    const futureValue = balance;
    const totalReturns = futureValue - totalInvestment;

    // Real value (inflation-adjusted)
    let realValue: number | undefined;
    if (inflationRate !== undefined && inflationRate > 0) {
        realValue = futureValue / Math.pow(1 + inflationRate / 100, years);
    }

    // After-tax value
    let afterTaxValue: number | undefined;
    if (taxRate !== undefined && taxRate > 0) {
        const taxOnReturns = totalReturns * (taxRate / 100);
        afterTaxValue = futureValue - taxOnReturns;
    }

    const cagr = calculateCAGR(totalInvestment, futureValue, years);

    return {
        totalInvestment,
        totalReturns,
        futureValue,
        realValue,
        afterTaxValue,
        cagr
    };
}

/**
 * Calculate required SIP to reach a goal
 */
export function calculateGoalPlanning(input: GoalPlannerInput): number {
    const { targetAmount, currentSavings, annualRate, years } = input;

    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;

    // Future value of current savings
    const currentSavingsFV = currentSavings * Math.pow(1 + monthlyRate, months);

    // Remaining amount needed from SIP
    const remainingNeeded = targetAmount - currentSavingsFV;

    if (remainingNeeded <= 0) {
        return 0; // Current savings already exceed target
    }

    // Required monthly SIP = Remaining / [((1 + r)^n - 1) / r × (1 + r)]
    const requiredMonthlySIP = remainingNeeded /
        (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));

    return requiredMonthlySIP;
}

/**
 * Generate year-by-year breakdown
 */
export function generateYearlyBreakdown(
    input: LumpsumInput | SIPInput | CombinedInput | StepUpSIPInput,
    type: 'lumpsum' | 'sip' | 'combined' | 'stepup'
): YearlyBreakdown[] {
    const breakdown: YearlyBreakdown[] = [];
    const { annualRate, years } = input;
    const monthlyRate = annualRate / 12 / 100;

    let balance = 0;
    let totalInvestment = 0;
    let totalInterest = 0;

    if (type === 'lumpsum') {
        const { principal } = input as LumpsumInput;
        balance = principal;
        totalInvestment = principal;

        for (let year = 1; year <= years; year++) {
            const startBalance = balance;
            for (let month = 1; month <= 12; month++) {
                const interest = balance * monthlyRate;
                balance += interest;
                totalInterest += interest;
            }
            const yearInterest = balance - startBalance;

            breakdown.push({
                year,
                yearlyInvestment: year === 1 ? principal : 0,
                totalInvestment,
                interestEarned: yearInterest,
                totalInterest,
                balance
            });
        }
    } else if (type === 'sip') {
        const { monthlyInvestment } = input as SIPInput;

        for (let year = 1; year <= years; year++) {
            const yearStartBalance = balance;
            const yearStartInvestment = totalInvestment;

            for (let month = 1; month <= 12; month++) {
                balance += monthlyInvestment;
                totalInvestment += monthlyInvestment;
                const interest = balance * monthlyRate;
                balance += interest;
                totalInterest += interest;
            }

            const yearlyInvestment = totalInvestment - yearStartInvestment;
            const yearInterest = balance - yearStartBalance - yearlyInvestment;

            breakdown.push({
                year,
                yearlyInvestment,
                totalInvestment,
                interestEarned: yearInterest,
                totalInterest,
                balance
            });
        }
    } else if (type === 'combined') {
        const { lumpsum, monthlyInvestment } = input as CombinedInput;
        balance = lumpsum;
        totalInvestment = lumpsum;

        for (let year = 1; year <= years; year++) {
            const yearStartBalance = balance;
            const yearStartInvestment = totalInvestment;

            for (let month = 1; month <= 12; month++) {
                balance += monthlyInvestment;
                totalInvestment += monthlyInvestment;
                const interest = balance * monthlyRate;
                balance += interest;
                totalInterest += interest;
            }

            const yearlyInvestment = totalInvestment - yearStartInvestment;
            const yearInterest = balance - yearStartBalance - yearlyInvestment;

            breakdown.push({
                year,
                yearlyInvestment,
                totalInvestment,
                interestEarned: yearInterest,
                totalInterest,
                balance
            });
        }
    } else if (type === 'stepup') {
        const { initialMonthlyInvestment, stepUpRate } = input as StepUpSIPInput;
        let currentMonthlyInvestment = initialMonthlyInvestment;

        for (let year = 1; year <= years; year++) {
            const yearStartBalance = balance;
            const yearStartInvestment = totalInvestment;

            for (let month = 1; month <= 12; month++) {
                balance += currentMonthlyInvestment;
                totalInvestment += currentMonthlyInvestment;
                const interest = balance * monthlyRate;
                balance += interest;
                totalInterest += interest;
            }

            const yearlyInvestment = totalInvestment - yearStartInvestment;
            const yearInterest = balance - yearStartBalance - yearlyInvestment;

            breakdown.push({
                year,
                yearlyInvestment,
                totalInvestment,
                interestEarned: yearInterest,
                totalInterest,
                balance
            });

            // Increase SIP for next year
            if (year < years) {
                currentMonthlyInvestment = currentMonthlyInvestment * (1 + stepUpRate / 100);
            }
        }
    }

    return breakdown;
}

/**
 * Calculate CAGR (Compounded Annual Growth Rate)
 */
export function calculateCAGR(initial: number, final: number, years: number): number {
    if (initial <= 0 || years <= 0) return 0;
    return (Math.pow(final / initial, 1 / years) - 1) * 100;
}

/**
 * Generate AI-style suggestions based on input
 */
export function generateSuggestions(
    type: 'lumpsum' | 'sip' | 'combined' | 'stepup' | 'goal',
    input: any,
    result?: InvestmentResult
): string[] {
    const suggestions: string[] = [];
    const { annualRate, years } = input;

    // Time-based suggestions
    if (years < 5) {
        suggestions.push("⏱️ Consider extending your investment horizon. Investing for 10+ years significantly amplifies compound growth and reduces short-term volatility risks.");
    } else if (years >= 20) {
        suggestions.push("🎯 Excellent! Long-term investing (20+ years) is your secret weapon. You're leveraging the full power of compounding.");
    }

    // Return rate suggestions
    if (annualRate < 8) {
        suggestions.push("📊 Your expected return of " + annualRate + "% is conservative. Consider reviewing your asset allocation - a balanced equity portfolio historically averages 10-12% annually.");
    } else if (annualRate > 15) {
        suggestions.push("⚠️ A " + annualRate + "% annual return is ambitious. While achievable, ensure you're diversified and understand the associated risks. Historical equity returns average 10-12%.");
    }

    // Investment amount suggestions
    if (type === 'sip' || type === 'combined' || type === 'stepup') {
        const monthlyInvestment = input.monthlyInvestment || input.initialMonthlyInvestment;
        if (monthlyInvestment < 5000) {
            suggestions.push("💰 Starting small is great! As your income grows, try increasing your SIP by 10-15% annually. Even small increments create massive wealth over time.");
        } else if (monthlyInvestment >= 10000) {
            suggestions.push("🌟 You're investing a solid amount! Stay disciplined with these contributions, and you're on track for significant wealth creation.");
        }
    }

    if (type === 'lumpsum') {
        const principal = input.principal;
        if (principal >= 100000) {
            suggestions.push("💡 Smart move with a lumpsum investment! Consider diversifying across asset classes (equity, debt, gold) to manage risk effectively.");
        }
    }

    // Step-up specific
    if (type === 'stepup') {
        suggestions.push("🚀 Step-up SIP is a wealth multiplier! By increasing your SIP with income growth, you're combating inflation and accelerating your wealth journey.");
    }

    // Tax optimization
    if (!input.taxRate || input.taxRate === 0) {
        suggestions.push("💎 Pro tip: Invest in tax-advantaged instruments like ELSS funds (Section 80C), PPF, or 401(k)/IRA to maximize post-tax returns.");
    }

    // Inflation consideration
    if (!input.inflationRate || input.inflationRate === 0) {
        suggestions.push("📉 Don't forget inflation! Average inflation is 3-4% annually. Your real purchasing power is what matters. Consider investments that beat inflation comfortably.");
    }

    // Diversification
    suggestions.push("🎨 Diversification is key: Don't put all eggs in one basket. Spread across equity, debt, real estate, and gold for optimal risk-adjusted returns.");

    // Early start advantage
    if (years >= 15 && result) {
        const halfYears = Math.floor(years / 2);
        let halfResult: InvestmentResult;

        if (type === 'sip') {
            halfResult = calculateSIP({ ...input, years: halfYears });
        } else if (type === 'lumpsum') {
            halfResult = calculateLumpsum({ ...input, years: halfYears });
        } else {
            halfResult = calculateCombined({ ...input, years: halfYears });
        }

        const difference = result.futureValue - halfResult.futureValue;
        suggestions.push(`⚡ Time is powerful! The last ${years - halfYears} years contribute $${(difference).toLocaleString('en-US', { maximumFractionDigits: 0 })} - more than half your total wealth. Start early, stay invested!`);
    }

    return suggestions.slice(0, 5); // Return max 5 suggestions
}
