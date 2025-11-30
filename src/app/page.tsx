'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import CalculatorForm from '@/components/CalculatorForm';
import EMIResultCard from '@/components/EMIResultCard';
import AmortizationTable from '@/components/AmortizationTable';
import ExportButton from '@/components/ExportButton';
import LoanTypeSelector from '@/components/LoanTypeSelector';
import SaveScenario from '@/components/SaveScenario';
import LoanComparison from '@/components/LoanComparison';
import GSTCalculator from '@/components/GSTCalculator';
import InterestCalculator from '@/components/InterestCalculator';
import ChitFundCalculator from '@/components/ChitFundCalculator';
import { EMIResult } from '@/lib/calc/emi';
import { LoanType, LOAN_TYPES } from '@/types/loanTypes';
import { Calculator, Scale, Percent, Receipt, PiggyBank } from 'lucide-react';

const ChartBreakup = dynamic(() => import('@/components/ChartBreakup'), { ssr: false });
const ChartBalance = dynamic(() => import('@/components/ChartBalance'), { ssr: false });

type TabType = 'emi' | 'compare' | 'interest' | 'gst' | 'chit';

export default function Home() {
  const [result, setResult] = useState<EMIResult | null>(null);
  const [loanParams, setLoanParams] = useState({ principal: 1000000, rate: 7.5, tenureMonths: 240 });
  const [selectedLoanType, setSelectedLoanType] = useState<LoanType>('home');
  const [activeTab, setActiveTab] = useState<TabType>('emi');

  const handleResultChange = React.useCallback((newResult: EMIResult, params: { principal: number; rate: number; tenureMonths: number }) => {
    setResult(newResult);
    setLoanParams(params);
  }, []);

  const tabs = [
    { id: 'emi', label: 'EMI Calculator', icon: Calculator },
    { id: 'compare', label: 'Compare Loans', icon: Scale },
    { id: 'interest', label: 'Interest Calc', icon: Percent },
    { id: 'gst', label: 'GST Calc', icon: Receipt },
    { id: 'chit', label: 'Chit Fund', icon: PiggyBank },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              L
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Loanly
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Navigation (Scrollable) */}
        <div className="md:hidden overflow-x-auto border-t border-gray-100 dark:border-gray-800">
          <div className="flex p-2 gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'emi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Inputs */}
            <div className="lg:col-span-4 space-y-6">
              <LoanTypeSelector
                selectedType={selectedLoanType}
                onTypeChange={setSelectedLoanType}
              />
              <CalculatorForm
                onResultChange={handleResultChange}
                loanTypeConfig={LOAN_TYPES[selectedLoanType]}
              />
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-8 space-y-8">
              {result && (
                <>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <EMIResultCard result={result} />
                    </div>
                    <div className="flex items-start pt-2">
                      <SaveScenario
                        loanType={selectedLoanType}
                        principal={loanParams.principal}
                        rate={loanParams.rate}
                        tenureMonths={loanParams.tenureMonths}
                        result={result}
                      />
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 h-80">
                      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Total Payment Breakup</h3>
                      <ChartBreakup
                        principal={result.totalPayment - result.totalInterest}
                        interest={result.totalInterest}
                      />
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 h-80">
                      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Balance Over Time</h3>
                      <ChartBalance data={result.amortization} />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                      <h3 className="text-lg font-bold">Amortization Schedule</h3>
                      <ExportButton
                        result={result}
                        principal={loanParams.principal}
                        rate={loanParams.rate}
                        tenureMonths={loanParams.tenureMonths}
                      />
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <AmortizationTable schedule={result.amortization} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'compare' && <LoanComparison />}
        {activeTab === 'interest' && <InterestCalculator />}
        {activeTab === 'gst' && <GSTCalculator />}
        {activeTab === 'chit' && <ChitFundCalculator />}
      </main>
    </div>
  );
}
