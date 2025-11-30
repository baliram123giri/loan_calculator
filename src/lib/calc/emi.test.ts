import { calculateEMI } from './emi';

describe('calculateEMI', () => {
    it('should calculate correct EMI for standard inputs', () => {
        // P=1,000,000, r=7.5%, n=240 (20 years)
        // r_monthly = 7.5 / 12 / 100 = 0.00625
        // EMI = 1000000 * 0.00625 * (1.00625^240) / ((1.00625^240) - 1)
        // EMI ≈ 8055.93
        const result = calculateEMI(1000000, 7.5, 240);
        expect(result.emi).toBeCloseTo(8055.93, 2);
        expect(result.totalPayment).toBeGreaterThan(1000000);
    });

    it('should handle 0% interest rate', () => {
        const result = calculateEMI(120000, 0, 12);
        expect(result.emi).toBe(10000); // 120000 / 12
        expect(result.totalInterest).toBe(0);
        expect(result.totalPayment).toBe(120000);
    });

    it('should generate correct amortization schedule', () => {
        const principal = 100000;
        const result = calculateEMI(principal, 10, 12); // 1 year

        expect(result.amortization).toHaveLength(12);

        // Check final balance is 0
        const lastRow = result.amortization[result.amortization.length - 1];
        expect(lastRow.balance).toBe(0);

        // Sum of principal payments should equal original principal
        const totalPrincipalPaid = result.amortization.reduce((sum, row) => sum + row.principal, 0);
        expect(totalPrincipalPaid).toBeCloseTo(principal, 1); // Allow small rounding diff
    });

    it('should handle extra monthly payments', () => {
        // 100k, 10%, 12 months. EMI ~8791.
        // Add 1000 extra per month.
        const result = calculateEMI(100000, 10, 12, [{ type: 'monthly', amount: 1000 }]);

        // Should finish earlier than 12 months
        expect(result.amortization.length).toBeLessThan(12);
        expect(result.totalInterest).toBeLessThan(5499); // Interest without extra is ~5499
    });
});
