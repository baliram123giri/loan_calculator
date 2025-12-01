
/**
 * Calculates the Annual Percentage Rate (APR) for a loan.
 * 
 * @param principal The loan amount (P)
 * @param annualInterestRate The nominal annual interest rate (in percentage, e.g., 5.0 for 5%)
 * @param tenureMonths The loan term in months (n)
 * @param totalFees Total fees and closing costs added to the loan cost
 * @returns The APR as a percentage (e.g., 5.25)
 */
export function calculateAPR(
    principal: number,
    annualInterestRate: number,
    tenureMonths: number,
    totalFees: number
): number {
    if (principal <= 0 || tenureMonths <= 0) return 0;

    // The amount financed is the principal minus the fees (effectively what you get in hand)
    // BUT for APR calculation, we consider the periodic payment based on the FULL principal,
    // and solve for the rate that equates the present value of those payments to the (Principal - Fees).

    // Wait, standard definition:
    // APR is the rate that makes the Net Present Value (NPV) of all cash flows equal to zero.
    // Cash flows:
    // T=0: +Principal - Fees (This is the net cash received by borrower)
    // T=1 to n: -MonthlyPayment (This is the cash paid by borrower)

    // First, calculate the monthly payment based on the nominal rate and full principal
    const monthlyRate = annualInterestRate / 12 / 100;
    let monthlyPayment = 0;

    if (annualInterestRate === 0) {
        monthlyPayment = principal / tenureMonths;
    } else {
        monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
            (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    }

    const amountFinanced = principal - totalFees;

    // If fees are so high that amount financed is <= 0, APR is undefined/infinite
    if (amountFinanced <= 0) return 0; // Or handle error

    // Use Newton-Raphson method to find the internal rate of return (IRR) per month
    // Function to solve: f(r) = amountFinanced - (monthlyPayment / r) * (1 - (1+r)^-n) = 0
    // This formula is for PV of annuity. 
    // PV = PMT * (1 - (1+r)^-n) / r
    // We want PV = amountFinanced

    let r = monthlyRate; // Initial guess
    if (r === 0) r = 0.001; // Avoid division by zero start

    const maxIterations = 50;
    const tolerance = 0.0000001;

    for (let i = 0; i < maxIterations; i++) {
        // f(r) = (PMT/r) * (1 - (1+r)^-n) - amountFinanced
        // Let's use the summation form for better stability if needed, but annuity formula is fine.
        // f(r) = PMT * [ (1 - (1+r)^-n) / r ] - amountFinanced

        const rn = Math.pow(1 + r, -tenureMonths);
        const f_r = (monthlyPayment / r) * (1 - rn) - amountFinanced;

        // Derivative f'(r)
        // d/dr [ (1 - (1+r)^-n) / r ] 
        // = (r * ( -(-n)(1+r)^(-n-1) ) - (1 - (1+r)^-n) * 1) / r^2
        // = ( n*r*(1+r)^(-n-1) - 1 + (1+r)^-n ) / r^2

        const f_prime_r = monthlyPayment * ((tenureMonths * r * Math.pow(1 + r, -tenureMonths - 1) - 1 + rn) / (r * r));

        const diff = f_r / f_prime_r;
        const new_r = r - diff;

        if (Math.abs(new_r - r) < tolerance) {
            r = new_r;
            break;
        }

        r = new_r;
    }

    return r * 12 * 100; // Convert monthly rate back to annual percentage
}

/**
 * Calculates the total cost of the loan including fees and interest.
 */
export function calculateLoanSummary(
    principal: number,
    annualInterestRate: number,
    tenureMonths: number,
    totalFees: number
) {
    const monthlyRate = annualInterestRate / 12 / 100;
    let monthlyPayment = 0;

    if (annualInterestRate === 0) {
        monthlyPayment = principal / tenureMonths;
    } else {
        monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
            (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    }

    const totalPayment = monthlyPayment * tenureMonths;
    const totalInterest = totalPayment - principal;
    const totalCost = totalPayment + totalFees;
    const apr = calculateAPR(principal, annualInterestRate, tenureMonths, totalFees);

    return {
        monthlyPayment,
        totalPayment,
        totalInterest,
        totalFees,
        totalCost,
        apr
    };
}
