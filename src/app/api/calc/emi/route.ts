import { NextResponse } from 'next/server';
import { calculateEMI } from '@/lib/calc/emi';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { principal, annualRate, tenureMonths, extraPayments } = body;

        if (!principal || !annualRate || !tenureMonths) {
            return NextResponse.json(
                { error: 'Missing required fields: principal, annualRate, tenureMonths' },
                { status: 400 }
            );
        }

        const result = calculateEMI(
            Number(principal),
            Number(annualRate),
            Number(tenureMonths),
            extraPayments
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error('Calculation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
