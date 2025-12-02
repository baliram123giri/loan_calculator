'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { InputNumber } from './Shared/InputNumber';
import { Slider } from './Shared/Slider';
import { calculatePropertyTax, TaxResult } from '@/lib/calc/tax';
import ShareButton from '@/components/ShareButton';

export default function PropertyTaxCalculator() {
    const searchParams = useSearchParams();
    const [value, setValue] = useState(300000);
    const [rate, setRate] = useState(1.1); // National average is around 1.1%
    const [result, setResult] = useState<TaxResult | null>(null);

    useEffect(() => {
        const v = searchParams.get('v');
        const r = searchParams.get('r');

        if (v) setValue(Number(v));
        if (r) setRate(Number(r));
    }, [searchParams]);

    useEffect(() => {
        const res = calculatePropertyTax(value, rate);
        setResult(res);
    }, [value, rate]);

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    const shareData = {
        v: value,
        r: rate
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Input Details</h2>

                    <div className="space-y-4">
                        <InputNumber
                            label="Assessed Home Value"
                            symbol="$"
                            value={value}
                            onChange={(e) => setValue(Number(e.target.value))}
                            min={10000}
                            max={10000000}
                        />
                        <Slider
                            value={value}
                            min={50000}
                            max={2000000}
                            step={10000}
                            onChange={(e) => setValue(Number(e.target.value))}
                        />
                    </div>

                    <div className="space-y-4">
                        <InputNumber
                            label="Property Tax Rate (%)"
                            symbol="%"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            min={0}
                            max={10}
                            step={0.01}
                        />
                        <Slider
                            value={rate}
                            min={0}
                            max={4}
                            step={0.05}
                            onChange={(e) => setRate(Number(e.target.value))}
                        />
                        <p className="text-xs text-gray-500">
                            Avg rates: NJ (2.49%), IL (2.27%), CA (0.76%), HI (0.28%)
                        </p>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
                {result && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
                                <p className="text-blue-100 text-sm mb-1">Annual Property Tax</p>
                                <h3 className="text-3xl font-bold">{formatCurrency(result.taxAmount)}</h3>
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <p className="text-gray-500 text-sm mb-1">Monthly Tax Estimate</p>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(result.taxAmount / 12)}</h3>
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
