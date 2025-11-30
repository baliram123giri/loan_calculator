export interface RealEstateInput {
    purchasePrice: number;
    downPayment: number; // Amount, not percentage
    interestRate: number; // Annual percentage
    loanTermYears: number;
    closingCosts: number;
    rehabCosts: number;

    // Income
    grossRent: number; // Monthly
    otherIncome: number; // Monthly
    vacancyRate: number; // Percentage

    // Expenses (Monthly)
    propertyTax: number;
    insurance: number;
    hoaFees: number;
    maintenance: number; // Percentage of rent
    managementFee: number; // Percentage of rent
    otherExpenses: number;

    // Assumptions
    appreciationRate: number; // Annual percentage
    rentIncreaseRate: number; // Annual percentage
    expenseIncreaseRate: number; // Annual percentage
    sellingCosts: number; // Percentage of sale price
    holdingPeriod: number; // Years
}

export interface YearlyProjection {
    year: number;
    propertyValue: number;
    equity: number;
    loanBalance: number;
    grossIncome: number;
    totalExpenses: number;
    cashFlow: number;
    cashOnCashReturn: number;
    roi: number;
}

export interface RealEstateResult {
    monthly: {
        income: {
            gross: number;
            vacancyLoss: number;
            effective: number;
        };
        expenses: {
            mortgage: number; // Principal + Interest
            propertyTax: number;
            insurance: number;
            hoa: number;
            maintenance: number;
            management: number;
            other: number;
            totalOperating: number; // Excluding mortgage
            total: number; // Including mortgage
        };
        cashFlow: number;
        noi: number; // Net Operating Income
    };
    metrics: {
        capRate: number;
        cashOnCash: number;
        grossRentMultiplier: number;
        debtServiceCoverageRatio: number; // DSCR
        breakEvenOccupancy: number;
        operatingExpenseRatio: number;
    };
    tax: {
        annualDepreciation: number; // US Residential: 27.5 years
    };
    projections: YearlyProjection[];
    totalRoi: {
        totalProfit: number;
        annualizedRoi: number;
        totalRoiPercent: number;
    };
}

export function calculateRealEstateMetrics(input: RealEstateInput): RealEstateResult {
    // 1. Loan Calculations
    const loanAmount = input.purchasePrice - input.downPayment;
    const monthlyRate = input.interestRate / 100 / 12;
    const numberOfPayments = input.loanTermYears * 12;

    let monthlyMortgage = 0;
    if (loanAmount > 0 && monthlyRate > 0) {
        monthlyMortgage = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else if (loanAmount > 0) {
        monthlyMortgage = loanAmount / numberOfPayments;
    }

    // 2. Monthly Income
    const monthlyGrossRent = input.grossRent;
    const monthlyOtherIncome = input.otherIncome;
    const potentialGrossIncome = monthlyGrossRent + monthlyOtherIncome;
    const vacancyLoss = potentialGrossIncome * (input.vacancyRate / 100);
    const effectiveGrossIncome = potentialGrossIncome - vacancyLoss;

    // 3. Monthly Expenses
    const maintenanceCost = monthlyGrossRent * (input.maintenance / 100);
    const managementCost = monthlyGrossRent * (input.managementFee / 100);

    const totalOperatingExpenses =
        input.propertyTax +
        input.insurance +
        input.hoaFees +
        maintenanceCost +
        managementCost +
        input.otherExpenses;

    const totalMonthlyExpenses = totalOperatingExpenses + monthlyMortgage;

    // 4. Cash Flow & NOI
    const monthlyCashFlow = effectiveGrossIncome - totalMonthlyExpenses;
    const monthlyNOI = effectiveGrossIncome - totalOperatingExpenses;
    const annualNOI = monthlyNOI * 12;

    // 5. Investment Basis
    const totalInitialInvestment = input.downPayment + input.closingCosts + input.rehabCosts;

    // 6. Metrics
    const capRate = (annualNOI / (input.purchasePrice + input.rehabCosts)) * 100;
    const annualCashFlow = monthlyCashFlow * 12;
    const cashOnCash = (annualCashFlow / totalInitialInvestment) * 100;
    const grossRentMultiplier = (input.purchasePrice) / (monthlyGrossRent * 12);
    const dscr = monthlyMortgage > 0 ? monthlyNOI / monthlyMortgage : 0;
    const operatingExpenseRatio = (totalOperatingExpenses / effectiveGrossIncome) * 100;

    // Break-even Occupancy: (Operating Expenses + Debt Service) / Potential Gross Income
    const breakEvenOccupancy = (totalMonthlyExpenses / potentialGrossIncome) * 100;

    // 7. Tax (US Specific - 27.5 years depreciation for residential)
    // Assuming land value is ~20% of purchase price, so depreciable basis is 80% + rehab costs
    // This is a simplified estimation.
    const landValueRatio = 0.20;
    const depreciableBasis = (input.purchasePrice * (1 - landValueRatio)) + input.rehabCosts;
    const annualDepreciation = depreciableBasis / 27.5;

    // 8. Projections
    const projections: YearlyProjection[] = [];
    let currentPropertyValue = input.purchasePrice + input.rehabCosts;
    let currentLoanBalance = loanAmount;
    let currentRent = monthlyGrossRent;
    let currentOtherIncome = monthlyOtherIncome;
    let currentOperatingExpenses = totalOperatingExpenses;

    let totalCashFlow = 0;

    for (let year = 1; year <= input.holdingPeriod; year++) {
        // Update values for the year
        const yearAppreciation = currentPropertyValue * (input.appreciationRate / 100);
        currentPropertyValue += yearAppreciation;

        const yearRentIncrease = currentRent * (input.rentIncreaseRate / 100);
        currentRent += yearRentIncrease;

        const yearOtherIncomeIncrease = currentOtherIncome * (input.rentIncreaseRate / 100); // Assume same rate
        currentOtherIncome += yearOtherIncomeIncrease;

        const yearExpenseIncrease = currentOperatingExpenses * (input.expenseIncreaseRate / 100);
        currentOperatingExpenses += yearExpenseIncrease;

        // Annual calculations
        const annualPotentialIncome = (currentRent + currentOtherIncome) * 12;
        const annualVacancy = annualPotentialIncome * (input.vacancyRate / 100);
        const annualEffectiveIncome = annualPotentialIncome - annualVacancy;

        const annualOperatingExpenses = currentOperatingExpenses * 12;
        const annualMortgagePayment = monthlyMortgage * 12;
        const annualTotalExpenses = annualOperatingExpenses + annualMortgagePayment;

        const annualCashFlowYear = annualEffectiveIncome - annualTotalExpenses;
        totalCashFlow += annualCashFlowYear;

        // Loan Amortization for the year
        let interestPaymentYear = 0;
        let principalPaymentYear = 0;

        // Simple loop for monthly amortization within the year
        for (let m = 0; m < 12; m++) {
            if (currentLoanBalance <= 0) break;
            const interest = currentLoanBalance * monthlyRate;
            const principal = monthlyMortgage - interest;

            // Handle last payment edge case
            if (currentLoanBalance < principal) {
                principalPaymentYear += currentLoanBalance;
                currentLoanBalance = 0;
            } else {
                principalPaymentYear += principal;
                currentLoanBalance -= principal;
            }
            interestPaymentYear += interest;
        }

        const equity = currentPropertyValue - currentLoanBalance;
        const cocYear = (annualCashFlowYear / totalInitialInvestment) * 100;

        // Simple ROI for the year (Cash Flow + Principal Paydown + Appreciation) / Total Investment
        const totalReturnYear = annualCashFlowYear + principalPaymentYear + yearAppreciation;
        const roiYear = (totalReturnYear / totalInitialInvestment) * 100;

        projections.push({
            year,
            propertyValue: currentPropertyValue,
            equity,
            loanBalance: currentLoanBalance,
            grossIncome: annualEffectiveIncome,
            totalExpenses: annualTotalExpenses,
            cashFlow: annualCashFlowYear,
            cashOnCashReturn: cocYear,
            roi: roiYear
        });
    }

    // Total ROI at end of holding period
    const finalProjection = projections[projections.length - 1];
    const salePrice = finalProjection.propertyValue;
    const sellingCostsAmount = salePrice * (input.sellingCosts / 100);
    const netSaleProceeds = salePrice - sellingCostsAmount - finalProjection.loanBalance;

    const totalProfit = totalCashFlow + netSaleProceeds - totalInitialInvestment;
    const totalRoiPercent = (totalProfit / totalInitialInvestment) * 100;
    const annualizedRoi = (Math.pow(1 + totalRoiPercent / 100, 1 / input.holdingPeriod) - 1) * 100;

    return {
        monthly: {
            income: {
                gross: potentialGrossIncome,
                vacancyLoss,
                effective: effectiveGrossIncome
            },
            expenses: {
                mortgage: monthlyMortgage,
                propertyTax: input.propertyTax,
                insurance: input.insurance,
                hoa: input.hoaFees,
                maintenance: maintenanceCost,
                management: managementCost,
                other: input.otherExpenses,
                totalOperating: totalOperatingExpenses,
                total: totalMonthlyExpenses
            },
            cashFlow: monthlyCashFlow,
            noi: monthlyNOI
        },
        metrics: {
            capRate,
            cashOnCash,
            grossRentMultiplier,
            debtServiceCoverageRatio: dscr,
            breakEvenOccupancy,
            operatingExpenseRatio
        },
        tax: {
            annualDepreciation
        },
        projections,
        totalRoi: {
            totalProfit,
            annualizedRoi,
            totalRoiPercent
        }
    };
}
