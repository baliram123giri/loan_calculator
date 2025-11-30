import { Metadata } from 'next';

export interface CalculatorMetadata {
    title: string;
    description: string;
    keywords: string[];
    canonical: string;
}

const BASE_URL = 'https://loanly.com'; // Update with actual domain

export const calculatorMetadata: Record<string, CalculatorMetadata> = {
    mortgage: {
        title: 'Free US Mortgage Calculator | Monthly Payment Estimator - Loanly',
        description: 'Calculate your monthly mortgage payments with our free US mortgage calculator. Get accurate estimates including principal, interest, taxes, and insurance. Compare rates and see amortization schedules.',
        keywords: [
            'mortgage calculator',
            'US mortgage calculator',
            'home loan calculator',
            'monthly mortgage payment',
            'mortgage estimator',
            'home loan payment calculator',
            'mortgage amortization',
            'ARM calculator'
        ],
        canonical: `${BASE_URL}/calculators/mortgage`
    },
    loan: {
        title: 'Personal Loan Calculator | Calculate Monthly Payments - Loanly',
        description: 'Free personal loan calculator for car loans, student loans, and more. Calculate monthly payments, total interest, and compare loan options. Get instant results with our easy-to-use tool.',
        keywords: [
            'loan calculator',
            'personal loan calculator',
            'car loan calculator',
            'student loan calculator',
            'loan payment calculator',
            'monthly payment calculator',
            'loan amortization'
        ],
        canonical: `${BASE_URL}/calculators/loan`
    },
    'simple-interest': {
        title: 'Simple Interest Calculator | Calculate Interest Earnings - Loanly',
        description: 'Calculate simple interest on your savings or investments. See yearly breakdowns, total interest earned, and final amounts. Perfect for CDs, bonds, and simple interest accounts.',
        keywords: [
            'simple interest calculator',
            'interest calculator',
            'savings calculator',
            'CD calculator',
            'bond calculator',
            'interest earnings calculator'
        ],
        canonical: `${BASE_URL}/calculators/simple-interest`
    },
    'compound-interest': {
        title: 'Compound Interest Calculator with APY | Investment Growth - Loanly',
        description: 'Calculate compound interest with daily, monthly, or yearly compounding. See your investment growth over time with APY calculations. Perfect for savings accounts and investment planning.',
        keywords: [
            'compound interest calculator',
            'APY calculator',
            'investment calculator',
            'savings growth calculator',
            'compound interest formula',
            'annual percentage yield'
        ],
        canonical: `${BASE_URL}/calculators/compound-interest`
    },
    'sales-tax': {
        title: 'US Sales Tax Calculator | Calculate Tax by State - Loanly',
        description: 'Calculate sales tax for any US state. Get accurate tax amounts and total prices instantly. Includes common state tax rates for quick reference.',
        keywords: [
            'sales tax calculator',
            'US sales tax calculator',
            'state sales tax',
            'tax calculator',
            'sales tax by state',
            'purchase tax calculator'
        ],
        canonical: `${BASE_URL}/calculators/sales-tax`
    },
    'property-tax': {
        title: 'Property Tax Calculator | Estimate Annual Tax Bill - Loanly',
        description: 'Estimate your annual property tax bill based on home value and local tax rates. Calculate monthly and yearly property taxes for budgeting and home buying decisions.',
        keywords: [
            'property tax calculator',
            'real estate tax calculator',
            'home tax calculator',
            'annual property tax',
            'property tax estimator',
            'real estate tax estimator'
        ],
        canonical: `${BASE_URL}/calculators/property-tax`
    },
    'dti-calculator': {
        title: 'DTI Calculator – Debt-to-Income Ratio Calculator | Free Tool - Loanly',
        description: 'Calculate your debt-to-income (DTI) ratio to determine loan qualification and financial health. Free DTI calculator with personalized recommendations and loan qualification status for conventional, FHA, and VA loans.',
        keywords: [
            'DTI calculator',
            'debt-to-income ratio calculator',
            'debt to income calculator',
            'DTI ratio calculator',
            'mortgage qualification calculator',
            'loan qualification calculator',
            'front-end DTI',
            'back-end DTI',
            'debt ratio calculator'
        ],
        canonical: `${BASE_URL}/calculators/dti-calculator`
    },
    'real-estate-calculator': {
        title: 'Free Real Estate Investment Calculator (USA) | Rental Property Analysis - Loanly',
        description: 'Calculate Cash on Cash Return, Cap Rate, and Cash Flow for US rental properties. Best free tool for real estate investors to analyze deals.',
        keywords: [
            'Real Estate Calculator',
            'Rental Property Calculator',
            'Cash on Cash Return',
            'Cap Rate Calculator',
            'BRRRR Calculator',
            'US Real Estate Investment',
            'Investment Property Calculator'
        ],
        canonical: `${BASE_URL}/calculators/real-estate-calculator`
    }
};

export function generateCalculatorMetadata(
    calculatorType: keyof typeof calculatorMetadata
): Metadata {
    const meta = calculatorMetadata[calculatorType];

    return {
        title: meta.title,
        description: meta.description,
        keywords: meta.keywords,
        alternates: {
            canonical: meta.canonical
        },
        openGraph: {
            title: meta.title,
            description: meta.description,
            url: meta.canonical,
            siteName: 'Loanly',
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: meta.title,
            description: meta.description,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}
