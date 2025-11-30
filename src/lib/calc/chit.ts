export type ChitFundResult = {
    chitValue: number;
    months: number;
    totalInvestment: number; // Nominal (Monthly * Months)
    netPayable: number; // Actual paid after dividends
    totalDividend: number;
    returnPercentage: number; // Simple return
    monthlyBreakdown: {
        month: number;
        contribution: number;
        dividend: number;
        netPayable: number;
    }[];
};

export function calculateChitFund(
    chitValue: number,
    months: number,
    commissionPercent: number, // e.g. 5
    averageBidPercent: number // e.g. 20 (Average auction discount)
): ChitFundResult {
    const monthlyContribution = chitValue / months;
    const commissionAmount = (chitValue * commissionPercent) / 100;

    // Average auction amount (Discount)
    // In a real chit, this varies. We use an average for estimation.
    // Bid Amount = Discount given by the prize winner.
    // Dividend = (Bid Amount - Commission) / Months
    // Note: Commission is usually deducted from the Chit Value before paying the winner, 
    // OR the winner gets (ChitValue - BidAmount).
    // The BidAmount is distributed.
    // Actually:
    // Winner gets: ChitValue - BidAmount
    // Distributed Dividend = (BidAmount - Commission) / Months (or Months-1 depending on rules)
    // Let's assume distributed to all 'months' members including the winner.

    const averageBidAmount = (chitValue * averageBidPercent) / 100;
    const distributableAmount = Math.max(0, averageBidAmount - commissionAmount);
    const monthlyDividend = distributableAmount / months;

    const netMonthlyPayable = monthlyContribution - monthlyDividend;

    const breakdown = [];
    let totalNetPayable = 0;
    let totalDividend = 0;

    for (let i = 1; i <= months; i++) {
        // First month usually no auction (Foreman takes full)
        // Last month usually no auction
        let currentDividend = monthlyDividend;

        if (i === 1 || i === months) {
            currentDividend = 0;
        }

        const currentNetPayable = monthlyContribution - currentDividend;

        breakdown.push({
            month: i,
            contribution: monthlyContribution,
            dividend: currentDividend,
            netPayable: currentNetPayable
        });

        totalNetPayable += currentNetPayable;
        totalDividend += currentDividend;
    }

    const returnPercentage = ((chitValue - totalNetPayable) / totalNetPayable) * 100;

    return {
        chitValue,
        months,
        totalInvestment: chitValue,
        netPayable: totalNetPayable,
        totalDividend,
        returnPercentage,
        monthlyBreakdown: breakdown
    };
}
