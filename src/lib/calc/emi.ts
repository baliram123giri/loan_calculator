export type ExtraPayment = {
  type: "monthly" | "lump";
  amount: number;
  startMonth?: number; // 1-based index
};

export type AmortizationRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

export type EMIResult = {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  amortization: AmortizationRow[];
};

export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  extras: ExtraPayment[] = []
): EMIResult {
  // Validations
  if (principal <= 0) throw new Error("Principal must be positive");
  if (tenureMonths <= 0) throw new Error("Tenure must be positive");
  if (annualRate < 0) throw new Error("Interest rate cannot be negative");

  const r = annualRate / 12 / 100;
  let emi = 0;

  if (r === 0) {
    emi = principal / tenureMonths;
  } else {
    const pow = Math.pow(1 + r, tenureMonths);
    emi = (principal * r * pow) / (pow - 1);
  }

  // Round EMI to 2 decimal places for standard banking practice
  const emiRounded = Math.round(emi * 100) / 100;

  let balance = principal;
  let totalInterest = 0;
  let totalPayment = 0;
  const amortization: AmortizationRow[] = [];

  // Safety break to prevent infinite loops if something goes wrong, 
  // though tenureMonths is the natural limit. 
  // If prepayments are huge, it might end early.
  // If something is wrong, we don't want to hang.
  const maxMonths = tenureMonths + 1200; // ample buffer

  for (let month = 1; month <= maxMonths; month++) {
    // Calculate interest for this month
    let interest = balance * r;
    interest = Math.round(interest * 100) / 100;

    let monthlyPayment = emiRounded;
    
    // Check for extra payments
    let extraForMonth = 0;
    extras.forEach(extra => {
      if (extra.type === 'monthly') {
        if (!extra.startMonth || month >= extra.startMonth) {
          extraForMonth += extra.amount;
        }
      } else if (extra.type === 'lump') {
        if (extra.startMonth === month) {
          extraForMonth += extra.amount;
        }
      }
    });

    // If balance is small, adjust payment
    // Total needed to close = balance + interest
    let totalRequired = balance + interest;
    
    let totalMonthlyPayment = monthlyPayment + extraForMonth;
    
    // If we are paying more than required, cap it
    if (totalMonthlyPayment > totalRequired) {
      totalMonthlyPayment = totalRequired;
    }
    
    // If it's the scheduled last month (and no extra payments shortened it), 
    // we might need to adjust slightly to clear dust?
    // But the logic above handles "paying off remaining".
    
    // Principal part
    let principalPaid = totalMonthlyPayment - interest;
    
    // Update balance
    balance -= principalPaid;
    
    // Fix floating point issues
    balance = Math.round(balance * 100) / 100;
    if (balance < 0) balance = 0;

    totalInterest += interest;
    totalPayment += totalMonthlyPayment;

    amortization.push({
      month,
      payment: Number(totalMonthlyPayment.toFixed(2)),
      principal: Number(principalPaid.toFixed(2)),
      interest: Number(interest.toFixed(2)),
      balance: Number(balance.toFixed(2))
    });

    if (balance <= 0) break;
  }

  return {
    emi: emiRounded,
    totalInterest: Number(totalInterest.toFixed(2)),
    totalPayment: Number(totalPayment.toFixed(2)),
    amortization
  };
}
