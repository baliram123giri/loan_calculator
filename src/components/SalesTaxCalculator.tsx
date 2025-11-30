'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { InputNumber } from './Shared/InputNumber';
import { Slider } from './Shared/Slider';
import { calculateSalesTax, TaxResult } from '@/lib/calc/tax';
import ShareButton from '@/components/ShareButton';

export default function SalesTaxCalculator() {
    const searchParams = useSearchParams();
    const [amount, setAmount] = useState(100);
    const [rate, setRate] = useState(7.25); // Default to a common US rate
    const [result, setResult] = useState<TaxResult | null>(null);

    useEffect(() => {
        const p = searchParams.get('p');
        const r = searchParams.get('r');

        if (p) setAmount(Number(p));
        if (r) setRate(Number(r));
    }, [searchParams]);

    useEffect(() => {
        const res = calculateSalesTax(amount, rate);
        setResult(res);
    }, [amount, rate]);

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    const shareData = {
        p: amount,
        r: rate
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Input Details</h2>

                    <div className="space-y-4">
                        <InputNumber
                            label="Price Before Tax"
                            symbol="$"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            min={0}
                        />
                    </div>

                    <div className="space-y-4">
                        <InputNumber
                            label="Sales Tax Rate (%)"
                            symbol="%"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            min={0}
                            max={20}
                            step={0.01}
                        />
                        <Slider
                            value={rate}
                            min={0}
                            max={15}
                            step={0.05}
                            onChange={(e) => setRate(Number(e.target.value))}
                        />
                        <p className="text-xs text-gray-500">
                            Common US rates: CA (7.25%), NY (4%), TX (6.25%), FL (6%)
                        </p>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
                {result && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <p className="text-gray-500 text-sm mb-1">Sales Tax Amount</p>
                                <h3 className="text-3xl font-bold text-red-600">{formatCurrency(result.taxAmount)}</h3>
                            </div>
                            <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
                                <p className="text-blue-100 text-sm mb-1">Total Price (After Tax)</p>
                                <h3 className="text-3xl font-bold">{formatCurrency(result.totalAmount)}</h3>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <ShareButton data={shareData} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
