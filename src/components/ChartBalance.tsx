'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { AmortizationRow } from '@/lib/calc/emi';

interface ChartBalanceProps {
    data: AmortizationRow[];
    currencySymbol?: string;
}

export default function ChartBalance({ data, currencySymbol = "$" }: ChartBalanceProps) {
    // Downsample data if too large for performance
    const chartData = data.length > 100
        ? data.filter((_, i) => i % Math.ceil(data.length / 100) === 0 || i === data.length - 1)
        : data;

    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="month"
                        stroke="#9ca3af"
                        label={{ value: 'Month', position: 'insideBottomRight', offset: -10 }}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        tickFormatter={(value) => `${currencySymbol}${value / 1000}k`}
                    />
                    <Tooltip
                        formatter={(value: number) => [`${currencySymbol}${value.toLocaleString()}`, '']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="balance"
                        name="Remaining Balance"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
