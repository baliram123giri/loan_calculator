import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://calcbz.com'; // Update with actual domain
    const currentDate = new Date();

    const calculators = [
        'mortgage',
        'loan', // Personal Loan
        'auto-loan-calculator',
        'auto-lease-calculator',
        'interest-calculator',
        'simple-interest',
        'compound-interest',
        'finance-calculator',
        'investment-calculator',
        'roi-calculator',
        'irr-calculator',
        'average-return-calculator',
        'cagr-calculator',
        'sales-tax',
        'property-tax',
        'vat-calculator',
        'house-affordability',
        'down-payment-calculator',
        'rent-calculator',
        'rental-property-calculator',
        'refinance-calculator',
        'fha-loan-calculator',
        'va-mortgage-calculator',
        'compare', // Loan Comparison
        'dti-calculator',
        'apr',
        'bond-calculator',
        'cash-back-vs-low-interest',
        'cd-calculator',
        'payment', // Payment Calculator
        'real-estate-calculator',
        'savings-calculator',
        'inflation-calculator'
    ];

    const routes = calculators.map(calc => ({
        url: `${baseUrl}/calculators/${calc}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Add core pages with higher priority
    routes.push({
        url: baseUrl,
        lastModified: currentDate,
        //@ts-ignore
        changeFrequency: 'monthly' as const,
        priority: 1.0,
    });

    // Add info pages
    ['about', 'privacy', 'contact', 'terms', 'disclaimer', 'faq'].forEach(page => {
        routes.push({
            url: `${baseUrl}/info/${page}`,
            lastModified: currentDate,
            //@ts-ignore
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        });
    });

    return routes;
}
