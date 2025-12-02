import { NextResponse } from 'next/server';
import { AmortizationRow } from '@/lib/calc/emi';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amortization, principal, rate, tenure, emi, totalInterest, totalPayment } = body;

        if (!amortization || !Array.isArray(amortization)) {
            return NextResponse.json(
                { error: 'Invalid amortization data' },
                { status: 400 }
            );
        }

        // Build CSV content
        let csv = 'EMI Calculator Report\n\n';
        csv += 'Loan Summary\n';
        csv += `Principal Amount,₹${principal?.toLocaleString() || 'N/A'}\n`;
        csv += `Interest Rate,${rate}% p.a.\n`;
        csv += `Tenure,${tenure} months\n`;
        csv += `Monthly EMI,₹${emi?.toLocaleString() || 'N/A'}\n`;
        csv += `Total Interest,₹${totalInterest?.toLocaleString() || 'N/A'}\n`;
        csv += `Total Payment,₹${totalPayment?.toLocaleString() || 'N/A'}\n\n`;

        csv += 'Amortization Schedule\n';
        csv += 'Month,Payment,Principal,Interest,Balance\n';

        amortization.forEach((row: AmortizationRow) => {
            csv += `${row.month},${row.payment},${row.principal},${row.interest},${row.balance}\n`;
        });

        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="emi-schedule.csv"',
            },
        });
    } catch (error) {
        console.error('CSV export error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
