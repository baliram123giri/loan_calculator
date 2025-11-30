export interface TaxResult {
    baseAmount: number;
    taxAmount: number;
    totalAmount: number;
    effectiveRate?: number;
}

export function calculateSalesTax(amount: number, rate: number): TaxResult {
    const taxAmount = (amount * rate) / 100;
    const totalAmount = amount + taxAmount;

    return {
        baseAmount: Number(amount.toFixed(2)),
        taxAmount: Number(taxAmount.toFixed(2)),
        totalAmount: Number(totalAmount.toFixed(2))
    };
}

export function calculatePropertyTax(assessedValue: number, rate: number): TaxResult {
    const taxAmount = (assessedValue * rate) / 100;

    return {
        baseAmount: Number(assessedValue.toFixed(2)),
        taxAmount: Number(taxAmount.toFixed(2)),
        totalAmount: Number((assessedValue + taxAmount).toFixed(2)) // Usually property tax is just the tax amount, but keeping structure consistent
    };
}
