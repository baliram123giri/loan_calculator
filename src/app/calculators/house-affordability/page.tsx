import React from 'react';
import HouseAffordabilityCalculator from '@/modules/house-affordability/component';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'House Affordability Calculator – How Much House Can You Afford?',
    description: 'Calculate how much house you can afford based on your income, debts, and down payment. Get a detailed breakdown of your monthly mortgage payments.',
};

export default function HouseAffordabilityPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <HouseAffordabilityCalculator />

            <div className="max-w-4xl mx-auto mt-16 prose dark:prose-invert">
                <h2>How This Calculator Works</h2>
                <p>
                    Our House Affordability Calculator helps you estimate your purchasing power by analyzing your income, debts, and down payment.
                    It uses the standard Debt-to-Income (DTI) ratios used by lenders to determine the maximum monthly payment you can afford.
                </p>

                <h3>Key Factors</h3>
                <ul>
                    <li><strong>Income & Debts:</strong> Lenders look at your DTI ratio. Generally, your total monthly debts (including the new mortgage) shouldn't exceed 36-43% of your gross monthly income.</li>
                    <li><strong>Down Payment:</strong> A larger down payment reduces your loan amount and monthly payment, allowing you to afford a more expensive home. Putting down less than 20% typically requires Private Mortgage Insurance (PMI).</li>
                    <li><strong>Credit Score:</strong> A higher credit score qualifies you for lower interest rates, which significantly boosts your affordability.</li>
                    <li><strong>Location:</strong> Property taxes vary by state and can have a major impact on your monthly payment.</li>
                </ul>
            </div>
        </div>
    );
}
