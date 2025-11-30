export interface RentalPropertyInput {
    // Purchase Details
    purchasePrice: number;
    downPaymentPercent: number;
    closingCosts: number;
    rehabCosts: number;

    // Financing
    interestRate: number;
    loanTerm: number; // years

    // Income
    monthlyRent: number;
    otherMonthlyIncome: number;
    annualRentIncrease: number; // percentage

    // Operating Expenses
    annualPropertyTax: number;
    annualInsurance: number;
    monthlyHOA: number;
    propertyManagementPercent: number;
    maintenancePercent: number;
    vacancyRatePercent: number;
    monthlyUtilities: number;
    capexReservePercent: number;

    // Tax Information
    marginalTaxRate: number;
    buildingValuePercent: number; // % of purchase price that is building (vs land)

    // Appreciation
    annualAppreciation: number; // percentage
}

export interface MonthlyBreakdown {
    month: number;
    year: number;
    rentalIncome: number;
    operatingExpenses: number;
    noi: number;
    debtService: number;
    cashFlow: number;
    principalPayment: number;
    interestPayment: number;
    loanBalance: number;
    propertyValue: number;
    equity: number;
}

export interface YearlyProjection {
    year: number;
    rentalIncome: number;
    operatingExpenses: number;
    noi: number;
    debtService: number;
    cashFlow: number;
    cashOnCashReturn: number;
    equity: number;
    propertyValue: number;
    cumulativeCashFlow: number;
    depreciation: number;
    mortgageInterest: number;
    taxSavings: number;
}

export interface RentalPropertyResults {
    // Initial Investment
    downPayment: number;
    totalCashNeeded: number;
    loanAmount: number;

    // Monthly Metrics
    monthlyPayment: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlyCashFlow: number;

    // Annual Metrics
    annualIncome: number;
    annualExpenses: number;
    noi: number;
    annualCashFlow: number;

    // Return Metrics
    cashOnCashReturn: number;
    capRate: number;
    dscr: number;
    irr: number;

    // Investment Rules
    onePercentRule: {
        passes: boolean;
        ratio: number;
    };
    fiftyPercentRule: {
        passes: boolean;
        expenseRatio: number;
    };

    // Projections
    yearlyProjections: YearlyProjection[];
    monthlyBreakdown: MonthlyBreakdown[];

    // Tax Benefits
    annualDepreciation: number;
    firstYearTaxSavings: number;
}

/**
 * Calculate monthly mortgage payment using standard amortization formula
 */
export function calculateMonthlyPayment(
    principal: number,
    annualRate: number,
    years: number
): number {
    if (principal <= 0 || years <= 0) return 0;
    if (annualRate === 0) return principal / (years * 12);

    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;

    const payment = principal *
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);

    return payment;
}

/**
 * Calculate Net Operating Income (NOI)
 */
export function calculateNOI(
    monthlyIncome: number,
    monthlyExpenses: number
): number {
    return (monthlyIncome - monthlyExpenses) * 12;
}

/**
 * Calculate monthly operating expenses
 */
export function calculateMonthlyExpenses(input: RentalPropertyInput): number {
    const grossMonthlyIncome = input.monthlyRent + input.otherMonthlyIncome;

    const propertyTax = input.annualPropertyTax / 12;
    const insurance = input.annualInsurance / 12;
    const hoa = input.monthlyHOA;
    const propertyManagement = grossMonthlyIncome * (input.propertyManagementPercent / 100);
    const maintenance = grossMonthlyIncome * (input.maintenancePercent / 100);
    const vacancy = grossMonthlyIncome * (input.vacancyRatePercent / 100);
    const utilities = input.monthlyUtilities;
    const capex = grossMonthlyIncome * (input.capexReservePercent / 100);

    return propertyTax + insurance + hoa + propertyManagement +
        maintenance + vacancy + utilities + capex;
}

/**
 * Calculate Cash-on-Cash Return
 */
export function calculateCashOnCashReturn(
    annualCashFlow: number,
    totalCashInvested: number
): number {
    if (totalCashInvested <= 0) return 0;
    return (annualCashFlow / totalCashInvested) * 100;
}

/**
 * Calculate Capitalization Rate (Cap Rate)
 */
export function calculateCapRate(
    noi: number,
    purchasePrice: number
): number {
    if (purchasePrice <= 0) return 0;
    return (noi / purchasePrice) * 100;
}

/**
 * Calculate Debt Service Coverage Ratio (DSCR)
 */
export function calculateDSCR(
    noi: number,
    annualDebtService: number
): number {
    if (annualDebtService <= 0) return 0;
    return noi / annualDebtService;
}

/**
 * Calculate annual depreciation (residential property = 27.5 years)
 */
export function calculateDepreciation(
    purchasePrice: number,
    buildingValuePercent: number
): number {
    const buildingValue = purchasePrice * (buildingValuePercent / 100);
    return buildingValue / 27.5; // IRS depreciation period for residential rental
}

/**
 * Check if property meets the 1% Rule
 */
export function calculate1PercentRule(
    monthlyRent: number,
    purchasePrice: number
): { passes: boolean; ratio: number } {
    const ratio = (monthlyRent / purchasePrice) * 100;
    return {
        passes: ratio >= 1.0,
        ratio
    };
}

/**
 * Check if property meets the 50% Rule
 */
export function calculate50PercentRule(
    monthlyExpenses: number,
    monthlyIncome: number
): { passes: boolean; expenseRatio: number } {
    if (monthlyIncome <= 0) return { passes: false, expenseRatio: 0 };

    const expenseRatio = (monthlyExpenses / monthlyIncome) * 100;
    return {
        passes: expenseRatio >= 40 && expenseRatio <= 60, // Allow 40-60% range
        expenseRatio
    };
}

/**
 * Calculate loan amortization for a specific month
 */
function calculateLoanBalance(
    principal: number,
    monthlyRate: number,
    monthlyPayment: number,
    monthsPaid: number
): { balance: number; principalPaid: number; interestPaid: number } {
    let balance = principal;
    let totalPrincipal = 0;
    let totalInterest = 0;

    for (let i = 0; i < monthsPaid; i++) {
        const interest = balance * monthlyRate;
        const principalPayment = monthlyPayment - interest;

        totalInterest += interest;
        totalPrincipal += principalPayment;
        balance -= principalPayment;
    }

    return {
        balance: Math.max(0, balance),
        principalPaid: totalPrincipal,
        interestPaid: totalInterest
    };
}

/**
 * Generate monthly breakdown for the entire loan term
 */
export function generateMonthlyBreakdown(
    input: RentalPropertyInput,
    loanAmount: number,
    monthlyPayment: number
): MonthlyBreakdown[] {
    const breakdown: MonthlyBreakdown[] = [];
    const monthlyRate = input.interestRate / 100 / 12;
    const totalMonths = input.loanTerm * 12;

    let balance = loanAmount;
    let propertyValue = input.purchasePrice;

    for (let month = 1; month <= totalMonths; month++) {
        const year = Math.ceil(month / 12);

        // Calculate rent with annual increases
        const yearsElapsed = (month - 1) / 12;
        const currentRent = input.monthlyRent * Math.pow(1 + input.annualRentIncrease / 100, yearsElapsed);
        const currentOtherIncome = input.otherMonthlyIncome * Math.pow(1 + input.annualRentIncrease / 100, yearsElapsed);
        const rentalIncome = currentRent + currentOtherIncome;

        // Calculate expenses (scale with rent)
        const expenseInput = { ...input, monthlyRent: currentRent, otherMonthlyIncome: currentOtherIncome };
        const operatingExpenses = calculateMonthlyExpenses(expenseInput);

        // Calculate NOI and cash flow
        const noi = rentalIncome - operatingExpenses;
        const cashFlow = noi - monthlyPayment;

        // Calculate loan amortization
        const interest = balance * monthlyRate;
        const principal = monthlyPayment - interest;
        balance = Math.max(0, balance - principal);

        // Calculate property value with appreciation
        propertyValue = input.purchasePrice * Math.pow(1 + input.annualAppreciation / 100, yearsElapsed);

        // Calculate equity
        const downPayment = input.purchasePrice * (input.downPaymentPercent / 100);
        const equity = propertyValue - balance;

        breakdown.push({
            month,
            year,
            rentalIncome,
            operatingExpenses,
            noi,
            debtService: monthlyPayment,
            cashFlow,
            principalPayment: principal,
            interestPayment: interest,
            loanBalance: balance,
            propertyValue,
            equity
        });
    }

    return breakdown;
}

/**
 * Generate yearly projections (30 years)
 */
export function generateYearlyProjections(
    input: RentalPropertyInput,
    monthlyBreakdown: MonthlyBreakdown[],
    annualDepreciation: number
): YearlyProjection[] {
    const projections: YearlyProjection[] = [];
    const yearsToProject = 30;

    for (let year = 1; year <= yearsToProject; year++) {
        // Get months for this year
        const yearMonths = monthlyBreakdown.filter(m => m.year === year);

        if (yearMonths.length === 0 && year <= input.loanTerm) continue;

        // Sum up annual values
        const rentalIncome = yearMonths.reduce((sum, m) => sum + m.rentalIncome, 0);
        const operatingExpenses = yearMonths.reduce((sum, m) => sum + m.operatingExpenses, 0);
        const noi = rentalIncome - operatingExpenses;
        const debtService = yearMonths.reduce((sum, m) => sum + m.debtService, 0);
        const cashFlow = noi - debtService;
        const mortgageInterest = yearMonths.reduce((sum, m) => sum + m.interestPayment, 0);

        // Get end-of-year values
        const lastMonth = yearMonths[yearMonths.length - 1] || monthlyBreakdown[monthlyBreakdown.length - 1];
        const equity = lastMonth?.equity || 0;
        const propertyValue = lastMonth?.propertyValue || input.purchasePrice;

        // Calculate total cash invested
        const downPayment = input.purchasePrice * (input.downPaymentPercent / 100);
        const totalCashInvested = downPayment + input.closingCosts + input.rehabCosts;

        // Calculate cash-on-cash return
        const cashOnCashReturn = calculateCashOnCashReturn(cashFlow, totalCashInvested);

        // Calculate cumulative cash flow
        const cumulativeCashFlow = projections.reduce((sum, p) => sum + p.cashFlow, 0) + cashFlow;

        // Calculate tax savings
        const taxableIncome = noi - mortgageInterest - annualDepreciation;
        const taxSavings = taxableIncome < 0 ? Math.abs(taxableIncome) * (input.marginalTaxRate / 100) : 0;

        projections.push({
            year,
            rentalIncome,
            operatingExpenses,
            noi,
            debtService,
            cashFlow,
            cashOnCashReturn,
            equity,
            propertyValue,
            cumulativeCashFlow,
            depreciation: annualDepreciation,
            mortgageInterest,
            taxSavings
        });
    }

    return projections;
}

/**
 * Calculate Internal Rate of Return (IRR) using Newton-Raphson method
 */
export function calculateIRR(cashFlows: number[], guess: number = 0.1): number {
    const maxIterations = 100;
    const tolerance = 0.00001;

    let rate = guess;

    for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let dnpv = 0;

        for (let j = 0; j < cashFlows.length; j++) {
            npv += cashFlows[j] / Math.pow(1 + rate, j);
            dnpv -= j * cashFlows[j] / Math.pow(1 + rate, j + 1);
        }

        const newRate = rate - npv / dnpv;

        if (Math.abs(newRate - rate) < tolerance) {
            return newRate * 100; // Return as percentage
        }

        rate = newRate;
    }

    return 0; // Failed to converge
}

/**
 * Main calculation function
 */
export function calculateRentalProperty(input: RentalPropertyInput): RentalPropertyResults {
    // Calculate initial investment
    const downPayment = input.purchasePrice * (input.downPaymentPercent / 100);
    const totalCashNeeded = downPayment + input.closingCosts + input.rehabCosts;
    const loanAmount = input.purchasePrice - downPayment;

    // Calculate monthly payment
    const monthlyPayment = calculateMonthlyPayment(loanAmount, input.interestRate, input.loanTerm);

    // Calculate monthly income and expenses
    const monthlyIncome = input.monthlyRent + input.otherMonthlyIncome;
    const monthlyExpenses = calculateMonthlyExpenses(input);
    const monthlyCashFlow = monthlyIncome - monthlyExpenses - monthlyPayment;

    // Calculate annual metrics
    const annualIncome = monthlyIncome * 12;
    const annualExpenses = monthlyExpenses * 12;
    const noi = calculateNOI(monthlyIncome, monthlyExpenses);
    const annualCashFlow = monthlyCashFlow * 12;

    // Calculate return metrics
    const cashOnCashReturn = calculateCashOnCashReturn(annualCashFlow, totalCashNeeded);
    const capRate = calculateCapRate(noi, input.purchasePrice);
    const annualDebtService = monthlyPayment * 12;
    const dscr = calculateDSCR(noi, annualDebtService);

    // Calculate investment rules
    const onePercentRule = calculate1PercentRule(input.monthlyRent, input.purchasePrice);
    const fiftyPercentRule = calculate50PercentRule(monthlyExpenses, monthlyIncome);

    // Calculate depreciation
    const annualDepreciation = calculateDepreciation(input.purchasePrice, input.buildingValuePercent);
    const firstYearTaxSavings = annualDepreciation * (input.marginalTaxRate / 100);

    // Generate projections
    const monthlyBreakdown = generateMonthlyBreakdown(input, loanAmount, monthlyPayment);
    const yearlyProjections = generateYearlyProjections(input, monthlyBreakdown, annualDepreciation);

    // Calculate IRR (10-year projection)
    const irrCashFlows = [-totalCashNeeded]; // Initial investment as negative
    for (let i = 0; i < Math.min(10, yearlyProjections.length); i++) {
        irrCashFlows.push(yearlyProjections[i].cashFlow);
    }
    // Add final year equity as exit value
    if (yearlyProjections.length >= 10) {
        irrCashFlows[10] += yearlyProjections[9].equity;
    }
    const irr = calculateIRR(irrCashFlows);

    return {
        downPayment,
        totalCashNeeded,
        loanAmount,
        monthlyPayment,
        monthlyIncome,
        monthlyExpenses,
        monthlyCashFlow,
        annualIncome,
        annualExpenses,
        noi,
        annualCashFlow,
        cashOnCashReturn,
        capRate,
        dscr,
        irr,
        onePercentRule,
        fiftyPercentRule,
        yearlyProjections,
        monthlyBreakdown,
        annualDepreciation,
        firstYearTaxSavings
    };
}
