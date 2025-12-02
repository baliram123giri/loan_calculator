// Utility functions for managing session and local storage

export interface CalculatorSession {
    calculatorType: string;
    timestamp: number;
    data: any;
}

// Check if user has consented to cookies
export function hasConsentedToCookies(): boolean {
    if (typeof window === 'undefined') return false;
    const consent = localStorage.getItem('cookie-consent');
    return consent === 'accepted';
}

// Save calculator state to session storage
export function saveCalculatorSession(calculatorType: string, data: any): void {
    if (typeof window === 'undefined' || !hasConsentedToCookies()) return;

    try {
        const session: CalculatorSession = {
            calculatorType,
            timestamp: Date.now(),
            data
        };
        sessionStorage.setItem(`calculator-${calculatorType}`, JSON.stringify(session));
    } catch (error) {
        console.error('Failed to save calculator session:', error);
    }
}

// Load calculator state from session storage
export function loadCalculatorSession(calculatorType: string): any | null {
    if (typeof window === 'undefined' || !hasConsentedToCookies()) return null;

    try {
        const stored = sessionStorage.getItem(`calculator-${calculatorType}`);
        if (!stored) return null;

        const session: CalculatorSession = JSON.parse(stored);

        // Check if session is less than 24 hours old
        const hoursSinceCreation = (Date.now() - session.timestamp) / (1000 * 60 * 60);
        if (hoursSinceCreation > 24) {
            sessionStorage.removeItem(`calculator-${calculatorType}`);
            return null;
        }

        return session.data;
    } catch (error) {
        console.error('Failed to load calculator session:', error);
        return null;
    }
}

// Clear calculator session
export function clearCalculatorSession(calculatorType: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(`calculator-${calculatorType}`);
}

// Save user preferences to local storage
export function saveUserPreference(key: string, value: any): void {
    if (typeof window === 'undefined' || !hasConsentedToCookies()) return;

    try {
        localStorage.setItem(`pref-${key}`, JSON.stringify(value));
    } catch (error) {
        console.error('Failed to save user preference:', error);
    }
}

// Load user preference from local storage
export function loadUserPreference(key: string): any | null {
    if (typeof window === 'undefined' || !hasConsentedToCookies()) return null;

    try {
        const stored = localStorage.getItem(`pref-${key}`);
        if (!stored) return null;
        return JSON.parse(stored);
    } catch (error) {
        console.error('Failed to load user preference:', error);
        return null;
    }
}

// Clear all calculator sessions
export function clearAllSessions(): void {
    if (typeof window === 'undefined') return;

    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
        if (key.startsWith('calculator-')) {
            sessionStorage.removeItem(key);
        }
    });
}
