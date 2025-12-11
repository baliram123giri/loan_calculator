/**
 * Currency and number formatting utilities
 */

export interface Currency {
    symbol: string;
    code: string;
    locale: string;
}

/**
 * Format a number as currency with symbol
 * @param value - The number to format
 * @param currency - Currency object containing symbol, code, and locale
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string with symbol
 */
export const formatCurrency = (
    value: number,
    currency: Currency,
    decimals: number = 2
): string => {
    return `${currency.symbol}${value.toLocaleString(currency.locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    })}`;
};


/**
 * Format a number as currency for PDF export (uses currency code instead of symbol)
 * @param value - The number to format
 * @param currency - Currency object containing symbol, code, and locale
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string with code
 */
export const formatCurrencyForPDF = (
    value: number,
    currency: Currency,
    decimals: number = 2
): string => {
    return `${currency.symbol} ${value.toLocaleString(currency.locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    })}`;
};

/**
 * Format a number as currency without symbol (just formatted number)
 * @param value - The number to format
 * @param locale - Locale string (e.g., 'en-US', 'en-IN')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export const formatNumber = (
    value: number,
    locale: string = 'en-US',
    decimals: number = 2
): string => {
    return value.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
};

/**
 * Format a percentage value
 * @param value - The percentage value to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export const formatPercentage = (
    value: number,
    decimals: number = 2
): string => {
    return `${value.toFixed(decimals)}%`;
};
