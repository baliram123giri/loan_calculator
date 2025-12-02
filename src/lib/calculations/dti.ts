// DTI (Debt-to-Income) Ratio Calculation Utilities

export interface DebtItem {
    id: string;
    name: string;
    monthlyPayment: number;
    balance?: number;
    interestRate?: number;
    type: 'housing' | 'auto' | 'student' | 'credit' | 'personal' | 'other';
}

export interface IncomeSource {
    primary: number;
    secondary: number;
    bonus: number;
    rental: number;
    other: number;
}

export interface HousingCosts {
    mortgageOrRent: number;
    propertyTax: number;
    homeInsurance: number;
    hoaFees: number;
}

export interface DTIResult {
    frontEndRatio: number;
    backEndRatio: number;
    totalMonthlyIncome: number;
    totalHousingCosts: number;
    totalMonthlyDebts: number;
    qualification: {
        conventional: boolean;
        fha: boolean;
        va: boolean;
    };
    healthStatus: 'excellent' | 'good' | 'moderate' | 'risky' | 'high-risk';
    recommendations: string[];
}

/**
 * Calculate total monthly income from all sources
 */
export function calculateTotalIncome(income: IncomeSource): number {
    return income.primary + income.secondary + income.bonus + income.rental + income.other;
}

/**
 * Calculate total housing costs
 */
export function calculateHousingCosts(housing: HousingCosts): number {
    return housing.mortgageOrRent + housing.propertyTax + housing.homeInsurance + housing.hoaFees;
}

/**
 * Calculate total monthly debt payments (excluding housing)
 */
export function calculateNonHousingDebts(debts: DebtItem[]): number {
    return debts
        .filter(debt => debt.type !== 'housing')
        .reduce((sum, debt) => sum + debt.monthlyPayment, 0);
}

/**
 * Calculate Front-End DTI Ratio (Housing costs / Gross income)
 */
export function calculateFrontEndDTI(housingCosts: number, grossIncome: number): number {
    if (grossIncome === 0) return 0;
    return (housingCosts / grossIncome) * 100;
}

/**
 * Calculate Back-End DTI Ratio (Total debts / Gross income)
 */
export function calculateBackEndDTI(totalDebts: number, grossIncome: number): number {
    if (grossIncome === 0) return 0;
    return (totalDebts / grossIncome) * 100;
}

/**
 * Check loan qualification based on DTI ratios
 */
export function checkQualification(frontEnd: number, backEnd: number) {
    return {
        conventional: frontEnd <= 28 && backEnd <= 36,
        fha: frontEnd <= 31 && backEnd <= 43,
        va: backEnd <= 41, // VA loans don't have front-end limit
    };
}

/**
 * Determine financial health status based on back-end DTI
 */
export function getHealthStatus(backEndDTI: number): DTIResult['healthStatus'] {
    if (backEndDTI <= 33) return 'excellent';
    if (backEndDTI <= 36) return 'good';
    if (backEndDTI <= 43) return 'moderate';
    if (backEndDTI <= 50) return 'risky';
    return 'high-risk';
}

/**
 * Generate personalized recommendations based on DTI
 */
export function generateRecommendations(
    backEndDTI: number,
    frontEndDTI: number,
    totalIncome: number,
    totalDebts: number
): string[] {
    const recommendations: string[] = [];

    if (backEndDTI > 50) {
        recommendations.push('🚨 Urgent: Your DTI is very high. Focus on aggressive debt reduction.');
        recommendations.push('💳 Consider debt consolidation to lower monthly payments.');
        recommendations.push('💰 Look for ways to increase income through side jobs or overtime.');
        recommendations.push('📊 Create a strict budget and cut non-essential expenses.');
    } else if (backEndDTI > 43) {
        recommendations.push('⚠️ Your DTI is above recommended levels. Work on reducing debt.');
        recommendations.push('💸 Pay more than minimum payments on high-interest debts.');
        recommendations.push('🚫 Avoid taking on new debt until DTI improves.');
        recommendations.push('🔄 Consider refinancing high-interest loans.');
    } else if (backEndDTI > 36) {
        recommendations.push('💡 Your DTI is moderate. Small improvements can help significantly.');
        recommendations.push('🎯 Focus on paying off smallest debts first for quick wins.');
        recommendations.push('📈 Look for opportunities to increase income by 10-15%.');
        recommendations.push('🔒 Maintain current debt levels and avoid new loans.');
    } else if (backEndDTI > 28) {
        recommendations.push('✅ Your DTI is good. Continue current financial habits.');
        recommendations.push('➕ Consider extra payments on loans to improve further.');
        recommendations.push('🏦 Build emergency fund to 6 months of expenses.');
        recommendations.push('🏠 You qualify for most conventional loans.');
    } else {
        recommendations.push('🌟 Excellent DTI! You have strong financial health.');
        recommendations.push('💎 Focus on wealth-building and investment opportunities.');
        recommendations.push('🏢 Consider real estate investment or business ventures.');
        recommendations.push('⚖️ Maintain this healthy debt-to-income balance.');
    }

    // Housing-specific recommendations
    if (frontEndDTI > 28) {
        recommendations.push('🏡 Your housing costs are high relative to income. Consider downsizing or refinancing.');
    }

    return recommendations;
}

/**
 * Calculate complete DTI analysis
 */
export function calculateDTI(
    income: IncomeSource,
    housing: HousingCosts,
    debts: DebtItem[]
): DTIResult {
    const totalIncome = calculateTotalIncome(income);
    const housingCosts = calculateHousingCosts(housing);
    const nonHousingDebts = calculateNonHousingDebts(debts);
    const totalDebts = housingCosts + nonHousingDebts;

    const frontEndRatio = calculateFrontEndDTI(housingCosts, totalIncome);
    const backEndRatio = calculateBackEndDTI(totalDebts, totalIncome);

    return {
        frontEndRatio,
        backEndRatio,
        totalMonthlyIncome: totalIncome,
        totalHousingCosts: housingCosts,
        totalMonthlyDebts: totalDebts,
        qualification: checkQualification(frontEndRatio, backEndRatio),
        healthStatus: getHealthStatus(backEndRatio),
        recommendations: generateRecommendations(backEndRatio, frontEndRatio, totalIncome, totalDebts),
    };
}

/**
 * Calculate what-if scenario
 */
export function calculateWhatIf(
    currentResult: DTIResult,
    changes: {
        incomeIncrease?: number;
        debtReduction?: number;
        housingReduction?: number;
    }
): DTIResult {
    const newIncome = currentResult.totalMonthlyIncome + (changes.incomeIncrease || 0);
    const newHousing = currentResult.totalHousingCosts - (changes.housingReduction || 0);
    const newDebts = currentResult.totalMonthlyDebts - (changes.debtReduction || 0);

    const frontEndRatio = calculateFrontEndDTI(newHousing, newIncome);
    const backEndRatio = calculateBackEndDTI(newDebts, newIncome);

    return {
        frontEndRatio,
        backEndRatio,
        totalMonthlyIncome: newIncome,
        totalHousingCosts: newHousing,
        totalMonthlyDebts: newDebts,
        qualification: checkQualification(frontEndRatio, backEndRatio),
        healthStatus: getHealthStatus(backEndRatio),
        recommendations: generateRecommendations(backEndRatio, frontEndRatio, newIncome, newDebts),
    };
}

/**
 * Calculate debt prioritization (Avalanche method - highest rate first)
 */
export function prioritizeDebtsAvalanche(debts: DebtItem[]): DebtItem[] {
    return [...debts]
        .filter(debt => debt.interestRate !== undefined)
        .sort((a, b) => (b.interestRate || 0) - (a.interestRate || 0));
}

/**
 * Calculate debt prioritization (Snowball method - smallest balance first)
 */
export function prioritizeDebtsSnowball(debts: DebtItem[]): DebtItem[] {
    return [...debts]
        .filter(debt => debt.balance !== undefined)
        .sort((a, b) => (a.balance || 0) - (b.balance || 0));
}
