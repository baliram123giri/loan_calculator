'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ChartData {
    name: string;
    value: number;
    color?: string;
    [key: string]: any;
}

interface ChartBreakupProps {
    data: ChartData[];
    centerLabel?: string;
    centerValue?: string;
    variant?: 'donut' | 'pie';
    legendType?: 'circle' | 'rect' | 'line' | 'none';
}

export default function ChartBreakup({ data, centerLabel, centerValue, variant = 'donut', legendType = 'rect' }: ChartBreakupProps) {
    const DEFAULT_COLORS = ['#16a34a', '#ea580c', '#3b82f6', '#a855f7', '#eab308'];
    const isDonut = variant === 'donut';

    return (
        <div className="w-full h-full min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        legendType={legendType}
                        innerRadius={isDonut ? 60 : 0}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={isDonut ? 5 : 0}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => `$${value.toLocaleString()}`}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
            {isDonut && (centerLabel || centerValue) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                    {centerLabel && <span className="text-sm text-gray-500 dark:text-gray-400">{centerLabel}</span>}
                    {centerValue && <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{centerValue}</span>}
                </div>
            )}
        </div>
    );
}
