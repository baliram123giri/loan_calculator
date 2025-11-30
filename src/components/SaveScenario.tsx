'use client';

import React, { useState } from 'react';
import { Save, FolderOpen } from 'lucide-react';
import { EMIResult } from '@/lib/calc/emi';
import { LoanType } from '@/types/loanTypes';

interface SavedScenario {
    id: string;
    title: string;
    loanType: LoanType;
    principal: number;
    rate: number;
    tenureMonths: number;
    result: EMIResult;
    createdAt: string;
}

interface SaveScenarioProps {
    loanType: LoanType;
    principal: number;
    rate: number;
    tenureMonths: number;
    result: EMIResult;
    onLoad?: (scenario: SavedScenario) => void;
}

export default function SaveScenario({ loanType, principal, rate, tenureMonths, result, onLoad }: SaveScenarioProps) {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showLoadModal, setShowLoadModal] = useState(false);
    const [scenarioTitle, setScenarioTitle] = useState('');
    const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);

    const loadScenarios = () => {
        try {
            const stored = localStorage.getItem('loanly_scenarios');
            if (stored) {
                setSavedScenarios(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading scenarios:', error);
        }
    };

    const handleSave = () => {
        if (!scenarioTitle.trim()) {
            alert('Please enter a title for this scenario');
            return;
        }

        const scenario: SavedScenario = {
            id: Date.now().toString(),
            title: scenarioTitle,
            loanType,
            principal,
            rate,
            tenureMonths,
            result,
            createdAt: new Date().toISOString()
        };

        try {
            const stored = localStorage.getItem('loanly_scenarios');
            const scenarios: SavedScenario[] = stored ? JSON.parse(stored) : [];
            scenarios.unshift(scenario);
            localStorage.setItem('loanly_scenarios', JSON.stringify(scenarios));

            setScenarioTitle('');
            setShowSaveModal(false);
            alert('Scenario saved successfully!');
        } catch (error) {
            console.error('Error saving scenario:', error);
            alert('Failed to save scenario');
        }
    };

    const handleLoad = (scenario: SavedScenario) => {
        if (onLoad) {
            onLoad(scenario);
        }
        setShowLoadModal(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this scenario?')) {
            try {
                const stored = localStorage.getItem('loanly_scenarios');
                if (stored) {
                    const scenarios: SavedScenario[] = JSON.parse(stored);
                    const filtered = scenarios.filter(s => s.id !== id);
                    localStorage.setItem('loanly_scenarios', JSON.stringify(filtered));
                    setSavedScenarios(filtered);
                }
            } catch (error) {
                console.error('Error deleting scenario:', error);
            }
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={() => setShowSaveModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
                <Save size={16} />
                Save
            </button>

            <button
                onClick={() => {
                    loadScenarios();
                    setShowLoadModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
            >
                <FolderOpen size={16} />
                Load
            </button>

            {/* Save Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSaveModal(false)}>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Save Scenario</h3>
                        <input
                            type="text"
                            value={scenarioTitle}
                            onChange={(e) => setScenarioTitle(e.target.value)}
                            placeholder="Enter scenario title..."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 dark:bg-gray-950 dark:text-white"
                            autoFocus
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg py-2 font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Load Modal */}
            {showLoadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLoadModal(false)}>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Saved Scenarios</h3>

                        {savedScenarios.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No saved scenarios yet</p>
                        ) : (
                            <div className="space-y-3">
                                {savedScenarios.map((scenario) => (
                                    <div key={scenario.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">{scenario.title}</h4>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(scenario.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleLoad(scenario)}
                                                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                                >
                                                    Load
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(scenario.id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            <span>₹{scenario.principal.toLocaleString()}</span>
                                            <span className="mx-2">•</span>
                                            <span>{scenario.rate}% p.a.</span>
                                            <span className="mx-2">•</span>
                                            <span>{scenario.tenureMonths} months</span>
                                            <span className="mx-2">•</span>
                                            <span>EMI: ₹{scenario.result.emi.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => setShowLoadModal(false)}
                            className="w-full mt-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg py-2 font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
