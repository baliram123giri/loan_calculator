import React from 'react';
import { EMIResult } from '@/lib/calc/emi';

interface EMIResultCardProps {
    result: EMIResult | null;
}

export default function EMIResultCard({ result }: EMIResultCardProps) {
    if (!result) return null;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-lg dark:bg-blue-700">
            <div className="text-center space-y-2 mb-6">
                <p className="text-blue-100 font-medium">Monthly EMI</p>
                <h3 className="text-4xl font-bold">{formatCurrency(result.emi)}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-blue-500/30">
                <div>
                    <p className="text-blue-200 text-sm mb-1">Total Interest</p>
                    <p className="text-xl font-semibold">{formatCurrency(result.totalInterest)}</p>
                </div>
                <div>
                    <p className="text-blue-200 text-sm mb-1">Total Amount</p>
                    <p className="text-xl font-semibold">{formatCurrency(result.totalPayment)}</p>
                </div>
            </div>
        </div>
    );
}
