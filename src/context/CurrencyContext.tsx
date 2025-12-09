'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Currency {
    code: string;
    symbol: string;
    country: string;
    // removing flag as we will use dynamic lookup based on countryCode
    countryCode: string;
    locale: string;
}

export const currencies: Currency[] = [
    // Major Currencies
    { code: 'USD', symbol: '$', country: 'United States', countryCode: 'US', locale: 'en-US' },
    { code: 'EUR', symbol: '€', country: 'European Union', countryCode: 'EU', locale: 'de-DE' },
    { code: 'GBP', symbol: '£', country: 'United Kingdom', countryCode: 'GB', locale: 'en-GB' },
    { code: 'INR', symbol: '₹', country: 'India', countryCode: 'IN', locale: 'en-IN' },
    { code: 'JPY', symbol: '¥', country: 'Japan', countryCode: 'JP', locale: 'ja-JP' },
    { code: 'AUD', symbol: 'A$', country: 'Australia', countryCode: 'AU', locale: 'en-AU' },
    { code: 'CAD', symbol: 'C$', country: 'Canada', countryCode: 'CA', locale: 'en-CA' },

    // All Currencies (A-Z by Country)
    { code: 'ARS', symbol: 'Ar$', country: 'Argentina', countryCode: 'AR', locale: 'es-AR' },
    { code: 'BDT', symbol: '৳', country: 'Bangladesh', countryCode: 'BD', locale: 'bn-BD' },
    { code: 'BRL', symbol: 'R$', country: 'Brazil', countryCode: 'BR', locale: 'pt-BR' },
    { code: 'BGN', symbol: 'лв', country: 'Bulgaria', countryCode: 'BG', locale: 'bg-BG' },
    { code: 'CLP', symbol: 'CLP$', country: 'Chile', countryCode: 'CL', locale: 'es-CL' },
    { code: 'CNY', symbol: '¥', country: 'China', countryCode: 'CN', locale: 'zh-CN' },
    { code: 'COP', symbol: 'COL$', country: 'Colombia', countryCode: 'CO', locale: 'es-CO' },
    { code: 'CRC', symbol: '₡', country: 'Costa Rica', countryCode: 'CR', locale: 'es-CR' },
    { code: 'CZK', symbol: 'Kč', country: 'Czech Republic', countryCode: 'CZ', locale: 'cs-CZ' },
    { code: 'DKK', symbol: 'kr', country: 'Denmark', countryCode: 'DK', locale: 'da-DK' },
    { code: 'EGP', symbol: 'E£', country: 'Egypt', countryCode: 'EG', locale: 'ar-EG' },
    { code: 'GHS', symbol: 'GH₵', country: 'Ghana', countryCode: 'GH', locale: 'en-GH' },
    { code: 'HKD', symbol: 'HK$', country: 'Hong Kong', countryCode: 'HK', locale: 'zh-HK' },
    { code: 'HUF', symbol: 'Ft', country: 'Hungary', countryCode: 'HU', locale: 'hu-HU' },
    { code: 'ISK', symbol: 'kr', country: 'Iceland', countryCode: 'IS', locale: 'is-IS' },
    { code: 'IDR', symbol: 'Rp', country: 'Indonesia', countryCode: 'ID', locale: 'id-ID' },
    { code: 'ILS', symbol: '₪', country: 'Israel', countryCode: 'IL', locale: 'he-IL' },
    { code: 'KES', symbol: 'KSh', country: 'Kenya', countryCode: 'KE', locale: 'en-KE' },
    { code: 'KWD', symbol: 'KD', country: 'Kuwait', countryCode: 'KW', locale: 'ar-KW' },
    { code: 'MYR', symbol: 'RM', country: 'Malaysia', countryCode: 'MY', locale: 'en-MY' },
    { code: 'MXN', symbol: 'Mex$', country: 'Mexico', countryCode: 'MX', locale: 'es-MX' },
    { code: 'MAD', symbol: 'DH', country: 'Morocco', countryCode: 'MA', locale: 'ar-MA' },
    { code: 'NZD', symbol: 'NZ$', country: 'New Zealand', countryCode: 'NZ', locale: 'en-NZ' },
    { code: 'NGN', symbol: '₦', country: 'Nigeria', countryCode: 'NG', locale: 'en-NG' },
    { code: 'NOK', symbol: 'kr', country: 'Norway', countryCode: 'NO', locale: 'nb-NO' },
    { code: 'PKR', symbol: '₨', country: 'Pakistan', countryCode: 'PK', locale: 'en-PK' },
    { code: 'PEN', symbol: 'S/', country: 'Peru', countryCode: 'PE', locale: 'es-PE' },
    { code: 'PHP', symbol: '₱', country: 'Philippines', countryCode: 'PH', locale: 'en-PH' },
    { code: 'PLN', symbol: 'zł', country: 'Poland', countryCode: 'PL', locale: 'pl-PL' },
    { code: 'QAR', symbol: 'QR', country: 'Qatar', countryCode: 'QA', locale: 'ar-QA' },
    { code: 'RON', symbol: 'lei', country: 'Romania', countryCode: 'RO', locale: 'ro-RO' },
    { code: 'SAR', symbol: 'SR', country: 'Saudi Arabia', countryCode: 'SA', locale: 'ar-SA' },
    { code: 'SGD', symbol: 'S$', country: 'Singapore', countryCode: 'SG', locale: 'en-SG' },
    { code: 'ZAR', symbol: 'R', country: 'South Africa', countryCode: 'ZA', locale: 'en-ZA' },
    { code: 'KRW', symbol: '₩', country: 'South Korea', countryCode: 'KR', locale: 'ko-KR' },
    { code: 'LKR', symbol: 'Rs', country: 'Sri Lanka', countryCode: 'LK', locale: 'en-LK' },
    { code: 'SEK', symbol: 'kr', country: 'Sweden', countryCode: 'SE', locale: 'sv-SE' },
    { code: 'CHF', symbol: 'Fr.', country: 'Switzerland', countryCode: 'CH', locale: 'de-CH' },
    { code: 'TWD', symbol: 'NT$', country: 'Taiwan', countryCode: 'TW', locale: 'zh-TW' },
    { code: 'THB', symbol: '฿', country: 'Thailand', countryCode: 'TH', locale: 'th-TH' },
    { code: 'TRY', symbol: '₺', country: 'Turkey', countryCode: 'TR', locale: 'tr-TR' },
    { code: 'UAH', symbol: '₴', country: 'Ukraine', countryCode: 'UA', locale: 'uk-UA' },
    { code: 'AED', symbol: 'dh', country: 'United Arab Emirates', countryCode: 'AE', locale: 'ar-AE' },
    { code: 'UYU', symbol: '$U', country: 'Uruguay', countryCode: 'UY', locale: 'es-UY' },
    { code: 'VND', symbol: '₫', country: 'Vietnam', countryCode: 'VN', locale: 'vi-VN' },
];

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrencyState] = useState<Currency>(currencies[0]);

    useEffect(() => {
        const savedCurrencyCode = localStorage.getItem('loanly_currency');
        if (savedCurrencyCode) {
            const foundCurrency = currencies.find(c => c.code === savedCurrencyCode);
            if (foundCurrency) {
                setCurrencyState(foundCurrency);
            }
        }
    }, []);

    const setCurrency = (newCurrency: Currency) => {
        setCurrencyState(newCurrency);
        localStorage.setItem('loanly_currency', newCurrency.code);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
