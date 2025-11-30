export interface StructuredData {
    '@context': string;
    '@type': string;
    [key: string]: any;
}

const BASE_URL = 'https://loanly.com'; // Update with actual domain

export function generateWebApplicationSchema(): StructuredData {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Loanly',
        url: BASE_URL,
        description: 'Free US finance calculators for mortgages, loans, interest, and taxes',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1250'
        }
    };
}

export function generateSoftwareApplicationSchema(
    name: string,
    description: string,
    url: string
): StructuredData {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: name,
        description: description,
        url: url,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
        },
        featureList: [
            'Free to use',
            'No registration required',
            'Instant calculations',
            'Shareable results',
            'Export to PDF/CSV'
        ]
    };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): StructuredData {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
        }))
    };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): StructuredData {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };
}

export const calculatorSchemas = {
    mortgage: {
        software: generateSoftwareApplicationSchema(
            'US Mortgage Calculator',
            'Calculate monthly mortgage payments including principal, interest, taxes, and insurance. Supports ARM rate changes and prepayments.',
            `${BASE_URL}/calculators/mortgage`
        ),
        breadcrumb: generateBreadcrumbSchema([
            { name: 'Home', url: BASE_URL },
            { name: 'Calculators', url: `${BASE_URL}/calculators` },
            { name: 'Mortgage Calculator', url: `${BASE_URL}/calculators/mortgage` }
        ])
    },
    loan: {
        software: generateSoftwareApplicationSchema(
            'Personal Loan Calculator',
            'Calculate monthly payments for personal loans, car loans, and student loans. View amortization schedules and total interest.',
            `${BASE_URL}/calculators/loan`
        ),
        breadcrumb: generateBreadcrumbSchema([
            { name: 'Home', url: BASE_URL },
            { name: 'Calculators', url: `${BASE_URL}/calculators` },
            { name: 'Loan Calculator', url: `${BASE_URL}/calculators/loan` }
        ])
    },
    'simple-interest': {
        software: generateSoftwareApplicationSchema(
            'Simple Interest Calculator',
            'Calculate simple interest on savings and investments. See yearly breakdowns and total earnings.',
            `${BASE_URL}/calculators/simple-interest`
        ),
        breadcrumb: generateBreadcrumbSchema([
            { name: 'Home', url: BASE_URL },
            { name: 'Calculators', url: `${BASE_URL}/calculators` },
            { name: 'Simple Interest Calculator', url: `${BASE_URL}/calculators/simple-interest` }
        ])
    },
    'compound-interest': {
        software: generateSoftwareApplicationSchema(
            'Compound Interest Calculator',
            'Calculate compound interest with various compounding frequencies. See APY and investment growth over time.',
            `${BASE_URL}/calculators/compound-interest`
        ),
        breadcrumb: generateBreadcrumbSchema([
            { name: 'Home', url: BASE_URL },
            { name: 'Calculators', url: `${BASE_URL}/calculators` },
            { name: 'Compound Interest Calculator', url: `${BASE_URL}/calculators/compound-interest` }
        ])
    },
    'sales-tax': {
        software: generateSoftwareApplicationSchema(
            'US Sales Tax Calculator',
            'Calculate sales tax for any US state. Get accurate tax amounts and total prices instantly.',
            `${BASE_URL}/calculators/sales-tax`
        ),
        breadcrumb: generateBreadcrumbSchema([
            { name: 'Home', url: BASE_URL },
            { name: 'Calculators', url: `${BASE_URL}/calculators` },
            { name: 'Sales Tax Calculator', url: `${BASE_URL}/calculators/sales-tax` }
        ])
    },
    'property-tax': {
        software: generateSoftwareApplicationSchema(
            'Property Tax Calculator',
            'Estimate annual property tax based on home value and local tax rates. Calculate monthly and yearly taxes.',
            `${BASE_URL}/calculators/property-tax`
        ),
        breadcrumb: generateBreadcrumbSchema([
            { name: 'Home', url: BASE_URL },
            { name: 'Calculators', url: `${BASE_URL}/calculators` },
            { name: 'Property Tax Calculator', url: `${BASE_URL}/calculators/property-tax` }
        ])
    },
    'dti-calculator': {
        software: generateSoftwareApplicationSchema(
            'DTI Calculator - Debt-to-Income Ratio Calculator',
            'Calculate your debt-to-income ratio to determine loan qualification. Get personalized recommendations and see if you qualify for conventional, FHA, or VA loans.',
            `${BASE_URL}/calculators/dti-calculator`
        ),
        breadcrumb: generateBreadcrumbSchema([
            { name: 'Home', url: BASE_URL },
            { name: 'Calculators', url: `${BASE_URL}/calculators` },
            { name: 'DTI Calculator', url: `${BASE_URL}/calculators/dti-calculator` }
        ])
    }
};
