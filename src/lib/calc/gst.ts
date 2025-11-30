export interface GSTCalculation {
    baseAmount: number;
    gstRate: number;
    cgst: number;
    sgst: number;
    igst: number;
    totalGST: number;
    finalAmount: number;
    isInterState: boolean;
}

export function calculateGST(
    amount: number,
    gstRate: number,
    isInterState: boolean = false,
    isReverse: boolean = false
): GSTCalculation {
    let baseAmount: number;
    let totalGST: number;

    if (isReverse) {
        // Reverse calculation: amount includes GST
        baseAmount = amount / (1 + gstRate / 100);
        totalGST = amount - baseAmount;
    } else {
        // Forward calculation: amount is base
        baseAmount = amount;
        totalGST = (amount * gstRate) / 100;
    }

    const finalAmount = baseAmount + totalGST;

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isInterState) {
        // Inter-state: IGST only
        igst = totalGST;
    } else {
        // Intra-state: CGST + SGST (split equally)
        cgst = totalGST / 2;
        sgst = totalGST / 2;
    }

    return {
        baseAmount: Number(baseAmount.toFixed(2)),
        gstRate,
        cgst: Number(cgst.toFixed(2)),
        sgst: Number(sgst.toFixed(2)),
        igst: Number(igst.toFixed(2)),
        totalGST: Number(totalGST.toFixed(2)),
        finalAmount: Number(finalAmount.toFixed(2)),
        isInterState
    };
}
