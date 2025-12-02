'use client';

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { AmortizationRow } from '@/lib/calc/emi';

interface ChartPaymentCompositionProps {
    data: AmortizationRow[];
    currencySymbol?: string;
}

export default function ChartPaymentComposition({ data, currencySymbol = "$" }: ChartPaymentCompositionProps) {
    // Downsample data if too large for performance
    const chartData = data.length > 100
        ? data.filter((_, i) => i % Math.ceil(data.length / 100) === 0 || i === data.length - 1)
        : data;

    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        tickFormatter={(date) => {
                            return new Date(date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                        }}
                        minTickGap={30}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        tickFormatter={(value) => `${currencySymbol}${value}`}
                    />
                    <Tooltip
                        formatter={(value: number) => [`${currencySymbol}${value.toFixed(2)}`, '']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Area
                        type="monotone"
                        dataKey="interest"
                        name="Interest"
                        stackId="1"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.6}
                    />
                    <Area
                        type="monotone"
                        dataKey="principal"
                        name="Principal"
                        stackId="1"
                        stroke="#22c55e"
                        fill="#22c55e"
                        fillOpacity={0.6}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
