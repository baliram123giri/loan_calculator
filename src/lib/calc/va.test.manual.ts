import { calculateVA, getVAFundingFeeRate } from './va';

const runTests = () => {
    console.log('Running VA Loan Calculator Tests...');

    // Test 1: Funding Fee Rates
    console.log('\nTest 1: Funding Fee Rates');

    // Purchase, First Use, < 5% down
    const rate1 = getVAFundingFeeRate(0, 'purchase', true, false);
    console.log(`Purchase, First Use, 0% down: Expected 2.15, Got ${rate1} - ${rate1 === 2.15 ? 'PASS' : 'FAIL'}`);

    // Purchase, Subsequent Use, < 5% down
    const rate2 = getVAFundingFeeRate(0, 'purchase', false, false);
    console.log(`Purchase, Subsequent Use, 0% down: Expected 3.3, Got ${rate2} - ${rate2 === 3.3 ? 'PASS' : 'FAIL'}`);

    // Cash-Out Refinance, First Use
    const rate3 = getVAFundingFeeRate(0, 'cash-out', true, false);
    console.log(`Cash-Out, First Use: Expected 2.15, Got ${rate3} - ${rate3 === 2.15 ? 'PASS' : 'FAIL'}`);

    // IRRRL
    const rate4 = getVAFundingFeeRate(0, 'irrrl', true, false);
    console.log(`IRRRL: Expected 0.5, Got ${rate4} - ${rate4 === 0.5 ? 'PASS' : 'FAIL'}`);

    // Disabled (Exempt)
    const rate5 = getVAFundingFeeRate(0, 'purchase', true, true);
    console.log(`Disabled: Expected 0, Got ${rate5} - ${rate5 === 0 ? 'PASS' : 'FAIL'}`);


    // Test 2: Full Calculation
    console.log('\nTest 2: Full Calculation');
    // Scenario: $300k home, 0% down, First Use, 6.5% rate, 30 years, Purchase
    // Funding Fee: 2.15% of $300k = $6,450
    // Total Loan: $306,450
    const result = calculateVA({
        homePrice: 300000,
        downPayment: 0,
        interestRate: 6.5,
        loanTermYears: 30,
        loanPurpose: 'purchase',
        isFirstUse: true,
        isDisabled: false,
        propertyTax: 0,
        homeInsurance: 0,
        hoaFees: 0,
        startDate: new Date()
    });

    console.log(`Funding Fee Amount: Expected 6450, Got ${result.fundingFeeAmount} - ${result.fundingFeeAmount === 6450 ? 'PASS' : 'FAIL'}`);
    console.log(`Total Loan Amount: Expected 306450, Got ${result.totalLoanAmount} - ${result.totalLoanAmount === 306450 ? 'PASS' : 'FAIL'}`);

    // Monthly Payment Calculation Check
    console.log(`Monthly Payment (EMI): ${result.emi.toFixed(2)}`);
};

runTests();
