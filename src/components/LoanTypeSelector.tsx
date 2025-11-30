'use client';

import React from 'react';
import { LoanType, LOAN_TYPES } from '@/types/loanTypes';

interface LoanTypeSelectorProps {
    selectedType: LoanType;
    onTypeChange: (type: LoanType) => void;
}

export default function LoanTypeSelector({ selectedType, onTypeChange }: LoanTypeSelectorProps) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Loan Type</h2>
            <div className="grid grid-cols-2 gap-3">
                {(Object.keys(LOAN_TYPES) as LoanType[]).map((type) => {
                    const config = LOAN_TYPES[type];
                    const isSelected = selectedType === type;

                    return (
                        <button
                            key={type}
                            onClick={() => onTypeChange(type)}
                            className={`
                p-4 rounded-xl border-2 transition-all text-left
                ${isSelected
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                                }
              `}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{config.icon}</span>
                                <span className={`font-semibold ${isSelected ? 'text-blue-600' : 'text-gray-900 dark:text-gray-100'}`}>
                                    {config.name}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {config.description}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
