import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CalculatorLink {
    href: string;
    title: string;
    description: string;
    icon: LucideIcon;
    iconColorClass?: string; // e.g., "text-blue-600"
    iconBgClass?: string;    // e.g., "bg-blue-100"
    hoverBgClass?: string;   // e.g., "group-hover:bg-blue-600"
}

interface RelatedCalculatorsProps {
    links: CalculatorLink[];
    title?: string;
}

export default function RelatedCalculators({
    links,
    title = "Popular Calculators"
}: RelatedCalculatorsProps) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {links.map((link, index) => (
                    <a
                        key={index}
                        href={link.href}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group border border-gray-100 dark:border-gray-800"
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-colors group-hover:text-white ${link.iconBgClass || 'bg-blue-100'} ${link.iconColorClass || 'text-blue-600'} ${link.hoverBgClass || 'group-hover:bg-blue-600'}`}>
                            <link.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{link.title}</p>
                            <p className="text-xs text-gray-500">{link.description}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
