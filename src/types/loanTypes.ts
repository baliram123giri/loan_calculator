export type LoanType = 'home' | 'car' | 'personal' | 'education';

export interface LoanTypeConfig {
    name: string;
    icon: string;
    minAmount: number;
    maxAmount: number;
    minRate: number;
    maxRate: number;
    minTenure: number;
    maxTenure: number;
    description: string;
}

export const LOAN_TYPES: Record<LoanType, LoanTypeConfig> = {
    home: {
        name: 'Home Loan',
        icon: '🏠',
        minAmount: 100000,
        maxAmount: 50000000,
        minRate: 6.5,
        maxRate: 12,
        minTenure: 5,
        maxTenure: 30,
        description: 'Calculate EMI for your home loan or mortgage'
    },
    car: {
        name: 'Car Loan',
        icon: '🚗',
        minAmount: 50000,
        maxAmount: 5000000,
        minRate: 7,
        maxRate: 15,
        minTenure: 1,
        maxTenure: 7,
        description: 'Calculate EMI for your car or vehicle loan'
    },
    personal: {
        name: 'Personal Loan',
        icon: '💰',
        minAmount: 10000,
        maxAmount: 2000000,
        minRate: 10,
        maxRate: 24,
        minTenure: 1,
        maxTenure: 5,
        description: 'Calculate EMI for personal loans'
    },
    education: {
        name: 'Education Loan',
        icon: '🎓',
        minAmount: 50000,
        maxAmount: 10000000,
        minRate: 8,
        maxRate: 15,
        minTenure: 5,
        maxTenure: 15,
        description: 'Calculate EMI for education or student loans'
    }
};
