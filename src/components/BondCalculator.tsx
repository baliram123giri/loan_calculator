"use client";

import { useState, useMemo, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import {
    Calculator,
    TrendingUp,
    DollarSign,
    Calendar,
    Percent,
    RefreshCw,
    Download,
    Info,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Heart,
    ArrowRightLeft,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import NumberInput from './NumberInput';
import { CalculateButton } from './Shared/CalculateButton';
import { ResetButton } from './Shared/ResetButton';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

interface BondResult {
    price: number;
    ytm: number;
    currentYield: number;
    totalCoupons: number;
    totalReturn: number;
    macaulayDuration: number;
    modifiedDuration: number;
    convexity: number;
    pvPar: number;
    pvCoupons: number;
}

interface ScheduleItem {
    period: number;
    date: string;
    cashFlow: number;
    type: 'Coupon' | 'Principal' | 'Total';
    pv: number;
}

export default function BondCalculator() {
    // Mode: Calculate Price or Calculate YTM
    const [calculationMode, setCalculationMode] = useState<'price' | 'yield'>('price');

    // Inputs
    const [faceValue, setFaceValue] = useState(1000);
    const [couponRate, setCouponRate] = useState(5.0);
    // Date States
    const [settlementDate, setSettlementDate] = useState(new Date().toISOString().split('T')[0]);
    const [maturityDate, setMaturityDate] = useState(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 10);
        return d.toISOString().split('T')[0];
    });

    const [marketRate, setMarketRate] = useState(4.0); // YTM input
    const [targetPrice, setTargetPrice] = useState(950); // Price input for YTM calc

    const [frequency, setFrequency] = useState(2); // Semiannual default

    // UI States
    const [couponInputType, setCouponInputType] = useState<'percent' | 'amount'>('percent');
    const [couponAmount, setCouponAmount] = useState(50); // Derived state for UI convenience

    // Advanced Inputs
    const [taxRate, setTaxRate] = useState(0);

    // AI Suggestions
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [liked, setLiked] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Snapshot state for calculation
    const [calculatedValues, setCalculatedValues] = useState({
        calculationMode: 'price' as 'price' | 'yield',
        faceValue: 1000,
        couponRate: 5.0,
        settlementDate: new Date().toISOString().split('T')[0],
        maturityDate: new Date().toISOString().split('T')[0],
        marketRate: 4.0,
        targetPrice: 950,
        frequency: 2,
        taxRate: 0
    });
    const [hasCalculated, setHasCalculated] = useState(true);

    // Initialize maturity date in calculatedValues correctly on mount
    useEffect(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 10);
        const mDate = d.toISOString().split('T')[0];
        setCalculatedValues(prev => ({ ...prev, maturityDate: mDate }));
    }, []);

    const handleCalculate = () => {
        setCalculatedValues({
            calculationMode,
            faceValue,
            couponRate,
            settlementDate,
            maturityDate,
            marketRate,
            targetPrice,
            frequency,
            taxRate
        });
        setHasCalculated(true);
        setCurrentPage(1);
    };

    // Calculation Logic
    const { result, schedule } = useMemo(() => {
        const par = calculatedValues.faceValue;
        const cRate = calculatedValues.couponRate / 100;
        const freq = calculatedValues.frequency;

        // Calculate time to maturity from dates
        const start = new Date(calculatedValues.settlementDate);
        const end = new Date(calculatedValues.maturityDate);
        const timeDiff = end.getTime() - start.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);
        const yearsToMaturity = Math.max(0, daysDiff / 365.25);

        const nPer = Math.ceil(yearsToMaturity * freq); // Total periods (approx)
        const couponPayment = (par * cRate) / freq;

        let calculatedPrice = 0;
        let calculatedYTM = 0;
        let macDuration = 0;
        let modDuration = 0;
        let convexity = 0;

        const scheduleData: ScheduleItem[] = [];

        if (calculatedValues.calculationMode === 'price') {
            const r = calculatedValues.marketRate / 100 / freq; // Periodic yield
            calculatedYTM = calculatedValues.marketRate;

            // Price Calculation: Sum of PV of Coupons + PV of Par
            let pvSum = 0;
            let weightedTimeSum = 0; // For duration
            let convexitySum = 0;

            for (let t = 1; t <= nPer; t++) {
                const isLast = t === nPer;
                const flow = couponPayment + (isLast ? par : 0);
                const df = Math.pow(1 + r, t);
                const pv = flow / df;

                pvSum += pv;

                // Duration stats
                const timeInYears = t / freq;
                weightedTimeSum += timeInYears * pv;
                convexitySum += (pv * (timeInYears * timeInYears + timeInYears / freq)) / Math.pow(1 + r, 2);

                const periodDate = new Date(start);
                periodDate.setMonth(start.getMonth() + (t * 12 / freq));

                scheduleData.push({
                    period: t,
                    date: periodDate.toISOString().split('T')[0],
                    cashFlow: flow,
                    type: isLast ? 'Total' : 'Coupon',
                    pv: pv
                });
            }
            calculatedPrice = pvSum;

            // Duration metrics
            macDuration = weightedTimeSum / calculatedPrice;
            modDuration = macDuration / (1 + r);
            convexity = convexitySum / calculatedPrice;

        } else {
            // Calculate YTM given Price (Iterative Newton-Raphson)
            calculatedPrice = calculatedValues.targetPrice;

            // Initial guess: Current Yield
            let guess = cRate;
            const maxIter = 100;
            const tolerance = 0.00001;

            for (let i = 0; i < maxIter; i++) {
                const r = guess / freq;
                let priceGuess = 0;
                let derivative = 0;

                for (let t = 1; t <= nPer; t++) {
                    const isLast = t === nPer;
                    const flow = couponPayment + (isLast ? par : 0);
                    const df = Math.pow(1 + r, t);
                    priceGuess += flow / df;
                    // Derivative with respect to r
                    derivative -= (t * flow) / (df * (1 + r));
                }

                const diff = priceGuess - calculatedValues.targetPrice;
                if (Math.abs(diff) < tolerance) break;

                // Update guess (r = r - f(r)/f'(r))
                if (derivative === 0) break;
                guess = guess - (diff / derivative) * freq;
            }
            calculatedYTM = guess * 100;

            // Re-run schedule with found YTM
            const r = calculatedYTM / 100 / freq;
            let pvSum = 0;
            let weightedTimeSum = 0;

            for (let t = 1; t <= nPer; t++) {
                const isLast = t === nPer;
                const flow = couponPayment + (isLast ? par : 0);
                const df = Math.pow(1 + r, t);
                const pv = flow / df;

                pvSum += pv;

                const timeInYears = t / freq;
                weightedTimeSum += timeInYears * pv;

                const periodDate = new Date(start);
                periodDate.setMonth(start.getMonth() + (t * 12 / freq));

                scheduleData.push({
                    period: t,
                    date: periodDate.toISOString().split('T')[0],
                    cashFlow: flow,
                    type: isLast ? 'Total' : 'Coupon',
                    pv: pv
                });
            }
            macDuration = weightedTimeSum / calculatedPrice;
            modDuration = macDuration / (1 + r);
        }

        const totalCoupons = couponPayment * nPer;
        const currentYield = (par * cRate) / calculatedPrice * 100;
        const totalReturn = (totalCoupons + (par - calculatedPrice)) / calculatedPrice * 100;

        // Calculate Breakdown
        const rFinal = calculatedYTM / 100 / freq;
        const finalPVPar = par / Math.pow(1 + rFinal, nPer);
        const finalPVCoupons = calculatedPrice - finalPVPar;

        return {
            result: {
                price: calculatedPrice,
                ytm: calculatedYTM,
                currentYield,
                totalCoupons,
                totalReturn,
                macaulayDuration: macDuration,
                modifiedDuration: modDuration,
                convexity,
                pvPar: finalPVPar,
                pvCoupons: finalPVCoupons
            },
            schedule: scheduleData
        };
    }, [calculatedValues]);

    // Pull to Par Chart Logic
    const pullToParData = useMemo(() => {
        const labels = [];
        const data = [];
        const r = result.ytm / 100 / calculatedValues.frequency;

        const start = new Date(calculatedValues.settlementDate);
        const end = new Date(calculatedValues.maturityDate);
        const yearsToMaturity = (end.getTime() - start.getTime()) / (1000 * 3600 * 24 * 365.25);
        const flooredYears = Math.floor(yearsToMaturity);

        for (let y = 0; y <= flooredYears; y++) {
            const timeRemaining = yearsToMaturity - y;
            if (timeRemaining < 0) continue;

            const periodsRemaining = timeRemaining * calculatedValues.frequency;
            let p = 0;
            const flow = (calculatedValues.faceValue * (calculatedValues.couponRate / 100)) / calculatedValues.frequency;

            if (periodsRemaining === 0) {
                p = calculatedValues.faceValue;
            } else {
                p = flow * ((1 - Math.pow(1 + r, -periodsRemaining)) / r) + calculatedValues.faceValue / Math.pow(1 + r, periodsRemaining);
            }

            labels.push(`Year ${y}`);
            data.push(p);
        }

        return {
            labels,
            datasets: [
                {
                    label: 'Bond Price Trajectory (Pull to Par)',
                    data: data,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Par Value',
                    data: new Array(labels.length).fill(calculatedValues.faceValue),
                    borderColor: 'rgb(107, 114, 128)',
                    borderDash: [5, 5],
                    fill: false
                }
            ]
        };
    }, [result.ytm, calculatedValues.settlementDate, calculatedValues.maturityDate, calculatedValues.frequency, calculatedValues.faceValue, calculatedValues.couponRate]);

    const pieData = useMemo(() => {
        return {
            labels: ['PV of Coupons', 'PV of Par Value'],
            datasets: [
                {
                    data: [result.pvCoupons, result.pvPar],
                    backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(59, 130, 246, 0.8)'], // Green, Blue
                    borderColor: ['rgba(16, 185, 129, 1)', 'rgba(59, 130, 246, 1)'],
                    borderWidth: 1,
                },
            ],
        };
    }, [result.pvCoupons, result.pvPar]);

    // AI Suggestions
    useEffect(() => {
        const newSuggestions = [];

        if (result.price < calculatedValues.faceValue) {
            newSuggestions.push(`📉 **Discount Bond**: This bond is trading below par ($${calculatedValues.faceValue}). This usually happens when market rates (${result.ytm.toFixed(2)}%) are higher than the coupon rate (${calculatedValues.couponRate}%). You earn capital gains as it approaches maturity.`);
        } else if (result.price > calculatedValues.faceValue) {
            newSuggestions.push(`📈 **Premium Bond**: This bond is trading above par ($${calculatedValues.faceValue}). This occurs when market rates (${result.ytm.toFixed(2)}%) are lower than the coupon rate (${calculatedValues.couponRate}%). Expect a capital loss at maturity, but higher income now.`);
        }

        if (result.macaulayDuration > 7) {
            newSuggestions.push(`⚠️ **High Interest Rate Risk**: A duration of ${result.macaulayDuration.toFixed(1)} years means this bond is very sensitive to interest rate changes. If rates rise 1%, the price could drop by roughly ${result.modifiedDuration.toFixed(1)}%.`);
        }

        if (result.currentYield > result.ytm) {
            newSuggestions.push("💡 **Yield Alert**: Current Yield is higher than YTM. This indicates the bond is trading at a premium and you will lose some principal value if held to maturity.");
        }

        if (calculatedValues.calculationMode === 'yield' && result.ytm < 0) {
            newSuggestions.push("🛑 **Negative Yield**: calculations indicate a negative yield. Ensure the entered price is realistic relative to the coupon and par value.");
        }

        setSuggestions(newSuggestions);
    }, [result, calculatedValues.faceValue, calculatedValues.couponRate, calculatedValues.calculationMode]);

    // Handle Pagination
    useEffect(() => {
        setCurrentPage(1);
    }, [schedule.length]);

    const totalPages = Math.ceil(schedule.length / itemsPerPage);
    const paginatedSchedule = schedule.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const resetCalculator = () => {
        const defaults = {
            faceValue: 1000,
            couponRate: 5.0,
            settlementDate: new Date().toISOString().split('T')[0],
            marketRate: 4.0,
            targetPrice: 950,
            frequency: 2,
            taxRate: 0,
            calculationMode: 'price' as 'price' | 'yield',
            couponInputType: 'percent' as 'percent' | 'amount'
        };
        const d = new Date();
        d.setFullYear(d.getFullYear() + 10);
        const defaultMaturity = d.toISOString().split('T')[0];

        setFaceValue(defaults.faceValue);
        setCouponRate(defaults.couponRate);
        setSettlementDate(defaults.settlementDate);
        setMaturityDate(defaultMaturity);
        setMarketRate(defaults.marketRate);
        setTargetPrice(defaults.targetPrice);
        setFrequency(defaults.frequency);
        setTaxRate(defaults.taxRate);
        setCalculationMode(defaults.calculationMode);
        setCouponInputType(defaults.couponInputType);

        setCalculatedValues({
            calculationMode: defaults.calculationMode,
            faceValue: defaults.faceValue,
            couponRate: defaults.couponRate,
            settlementDate: defaults.settlementDate,
            maturityDate: defaultMaturity,
            marketRate: defaults.marketRate,
            targetPrice: defaults.targetPrice,
            frequency: defaults.frequency,
            taxRate: defaults.taxRate
        });
        setHasCalculated(true);
    };

    // Sync Coupon Amount/Rate
    const handleCouponRateChange = (newRate: number) => {
        setCouponRate(newRate);
        setCouponAmount((faceValue * newRate) / 100);
    };

    const handleCouponAmountChange = (newAmount: number) => {
        setCouponAmount(newAmount);
        setCouponRate((newAmount / faceValue) * 100);
    };

    // Update derived values when Face Value changes
    useEffect(() => {
        if (couponInputType === 'percent') {
            setCouponAmount((faceValue * couponRate) / 100);
        } else {
            setCouponRate((couponAmount / faceValue) * 100);
        }
    }, [faceValue]);

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(59, 130, 246); // Blue 500
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text('Bond Valuation Report', 105, 25, { align: 'center' });

        // Summary Section
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text('Bond Summary', 14, 50);

        const summaryData = [
            ['Instrument', 'Corporate Bond Analysis'],
            ['Date', new Date().toLocaleDateString()],
            ['Face Value', formatCurrency(calculatedValues.faceValue)],
            ['Coupon Rate', `${calculatedValues.couponRate}%`],
            ['Maturity Date', calculatedValues.maturityDate],
            ['Calculated Price', formatCurrency(result.price)],
            ['Yield to Maturity (YTM)', `${result.ytm.toFixed(3)}%`],
            ['Duration', `${result.macaulayDuration.toFixed(2)} Years`]
        ];

        autoTable(doc, {
            startY: 55,
            head: [['Metric', 'Value']],
            body: summaryData,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] }
        });

        // Schedule
        if (schedule.length > 0) {
            doc.text('Cash Flow Schedule', 14, (doc as any).lastAutoTable.finalY + 15);

            // Filter for pdf readability if too long
            const tableRows = schedule.map(row => [
                row.period.toString(),
                row.date,
                row.type,
                formatCurrency(row.cashFlow),
                formatCurrency(row.pv)
            ]);

            autoTable(doc, {
                startY: (doc as any).lastAutoTable.finalY + 20,
                head: [['Period', 'Date', 'Type', 'Cash Flow', 'Present Value']],
                body: tableRows,
                headStyles: { fillColor: [59, 130, 246] },
                styles: { fontSize: 8 }
            });
        }

        const timestamp = Date.now();
        doc.save(`bond-report-${timestamp}.pdf`);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 md:p-8">
                    {/* Top Mode Toggle */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl inline-flex">
                            <button
                                onClick={() => setCalculationMode('price')}
                                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center cursor-pointer ${calculationMode === 'price'
                                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                <DollarSign className="w-4 h-4 mr-2" />
                                Calculate Price
                            </button>
                            <button
                                onClick={() => setCalculationMode('yield')}
                                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center cursor-pointer ${calculationMode === 'yield'
                                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                <Percent className="w-4 h-4 mr-2" />
                                Calculate Yield (YTM)
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Inputs Section */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                    <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                                    Bond Details
                                </h3>
                                <ResetButton onClick={resetCalculator} />
                            </div>

                            <div className="space-y-6">
                                {/* First Input: YTM or Price depending on mode */}
                                {calculationMode === 'price' ? (
                                    <NumberInput
                                        label="Market Yield (YTM)"
                                        value={marketRate}
                                        onChange={setMarketRate}
                                        min={0}
                                        max={50}
                                        step={0.1}
                                        suffix="%"
                                    />
                                ) : (
                                    <CurrencyInput
                                        label="Current Bond Price"
                                        value={targetPrice}
                                        onChange={setTargetPrice}
                                        min={0}
                                        max={10000000}
                                    />
                                )}

                                <CurrencyInput
                                    label="Face Value (Par)"
                                    value={faceValue}
                                    onChange={setFaceValue}
                                    min={100}
                                    max={10000000}
                                />

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label id="annual-coupon-label" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Annual Coupon
                                        </label>
                                        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                                            <button
                                                onClick={() => setCouponInputType('percent')}
                                                className={`px-2 py-0.5 text-xs font-medium rounded-md transition-all cursor-pointer ${couponInputType === 'percent'
                                                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                                                    }`}
                                            >
                                                %
                                            </button>
                                            <button
                                                onClick={() => setCouponInputType('amount')}
                                                className={`px-2 py-0.5 text-xs font-medium rounded-md transition-all cursor-pointer ${couponInputType === 'amount'
                                                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                                                    }`}
                                            >
                                                $
                                            </button>
                                        </div>
                                    </div>
                                    {couponInputType === 'percent' ? (
                                        <NumberInput
                                            value={couponRate}
                                            onChange={handleCouponRateChange}
                                            min={0}
                                            max={50}
                                            step={0.1}
                                            suffix="%"
                                            aria-labelledby="annual-coupon-label"
                                        />
                                    ) : (
                                        <CurrencyInput
                                            value={couponAmount}
                                            onChange={handleCouponAmountChange}
                                            min={0}
                                            max={1000000}
                                            aria-labelledby="annual-coupon-label"
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="settlement-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Settlement Date
                                        </label>
                                        <input
                                            type="date"
                                            value={settlementDate}
                                            onChange={(e) => setSettlementDate(e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                                            id="settlement-date"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="maturity-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Maturity Date
                                        </label>
                                        <input
                                            type="date"
                                            value={maturityDate}
                                            onChange={(e) => setMaturityDate(e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                                            id="maturity-date"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="coupon-frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Coupon Frequency
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={frequency}
                                            onChange={(e) => setFrequency(Number(e.target.value))}
                                            className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg dark:bg-gray-800 dark:text-white appearance-none border"
                                            id="coupon-frequency"
                                        >
                                            <option value={1}>Annual (1/yr)</option>
                                            <option value={2}>Semiannual (2/yr)</option>
                                            <option value={4}>Quarterly (4/yr)</option>
                                            <option value={12}>Monthly (12/yr)</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                                            <ChevronDown className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Advanced Options Toggle */}
                                <details className="group">
                                    <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 list-none flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <span className="flex items-center">
                                            <Info className="w-4 h-4 mr-2" />
                                            Advanced Options (Tax)
                                        </span>
                                        <span className="transition group-open:rotate-180">
                                            <ChevronDown className="w-4 h-4" />
                                        </span>
                                    </summary>
                                    <div className="mt-4 space-y-4 p-4 border border-gray-100 dark:border-gray-800 rounded-xl animate-in fade-in slide-in-from-top-2">
                                        <NumberInput
                                            label="Tax Rate on Interest (Optional)"
                                            value={taxRate}
                                            onChange={setTaxRate}
                                            min={0}
                                            max={100}
                                            suffix="%"
                                        />
                                        <p className="text-xs text-gray-500">Note: Tax is currently used for informational purposes and does not affect YTM calculation in this version.</p>
                                    </div>
                                </details>
                            </div>

                            <CalculateButton onClick={handleCalculate} label="Calculate Bond Value" />
                        </div>

                        {/* Results Section */}
                        <div className="lg:col-span-7 space-y-8">
                            {!hasCalculated ? (
                                <div className="h-full flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 min-h-[400px]">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                                        <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to Calculate</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                                        Enter your bond details and click "Calculate Bond Value" to see pricing and yield metrics.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                                                {calculatedValues.calculationMode === 'price' ? 'Estimated Bond Price' : 'Yield to Maturity (YTM)'}
                                            </p>
                                            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 tracking-tight">
                                                {calculatedValues.calculationMode === 'price'
                                                    ? formatCurrency(result.price)
                                                    : `${result.ytm.toFixed(3)}%`
                                                }
                                            </div>
                                            <p className="text-xs text-blue-500 dark:text-blue-400 mt-2">
                                                {calculatedValues.calculationMode === 'price'
                                                    ? `vs Par Value ${formatCurrency(calculatedValues.faceValue)}`
                                                    : `vs Coupon Rate ${calculatedValues.couponRate}%`
                                                }
                                            </p>
                                        </div>

                                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800">
                                            <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Current Yield</p>
                                            <div className="text-3xl font-bold text-green-900 dark:text-green-100 tracking-tight">
                                                {result.currentYield.toFixed(2)}%
                                            </div>
                                            <p className="text-xs text-green-500 dark:text-green-400 mt-2">
                                                Annual Income: {formatCurrency(calculatedValues.faceValue * (calculatedValues.couponRate / 100))}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Detailed Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Return</p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">{result.totalReturn.toFixed(2)}%</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">{result.macaulayDuration.toFixed(2)} yrs</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Mod. Duration</p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">{result.modifiedDuration.toFixed(2)}%</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Coupons</p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(result.totalCoupons)}</p>
                                        </div>
                                    </div>

                                    {/* Charts Section in Result Column */}
                                    <div className="space-y-6">
                                        {/* Line Chart */}
                                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Price Trajectory (Pull to Par)</h4>
                                            <div className="h-64 w-full">
                                                {/* @ts-ignore */}
                                                <Line
                                                    data={pullToParData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: { position: 'top', labels: { color: '#6B7280' } },
                                                            tooltip: {
                                                                callbacks: {
                                                                    label: (ctx) => {
                                                                        if (ctx.parsed.y !== null) {
                                                                            return `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}`;
                                                                        }
                                                                        return '';
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        scales: {
                                                            y: {
                                                                grid: { color: 'rgba(107, 114, 128, 0.1)' },
                                                                ticks: { color: '#6B7280' }
                                                            },
                                                            x: { grid: { display: false }, ticks: { color: '#6B7280' } }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Pie Chart */}
                                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Bond Value Composition</h4>
                                            <div className="flex flex-col sm:flex-row items-center justify-around">
                                                <div className="h-56 w-56">
                                                    <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#6B7280' } } } }} />
                                                </div>
                                                <div className="mt-6 sm:mt-0 space-y-4">
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">PV of Coupons: <strong>{formatCurrency(result.pvCoupons)}</strong> ({((result.pvCoupons / result.price) * 100).toFixed(1)}%)</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">PV of Principal: <strong>{formatCurrency(result.pvPar)}</strong> ({((result.pvPar / result.price) * 100).toFixed(1)}%)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Full Width Sections */}
                    {hasCalculated && (
                        <>
                            {/* AI Suggestions - Full Width */}
                            {suggestions.length > 0 && (
                                <div className="mt-12">
                                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-800">
                                        <div className="flex items-center mb-6">
                                            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg mr-3">
                                                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI-Powered Insights</h3>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {suggestions.map((suggestion, index) => (
                                                <div key={index} className="bg-white/80 dark:bg-gray-900/80 p-5 rounded-xl border border-white dark:border-gray-700 shadow-sm">
                                                    <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                                                        dangerouslySetInnerHTML={{
                                                            __html: suggestion.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Schedule Table - Full Width */}
                            <div className="mt-12">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">Cash Flow Schedule</h4>
                                    <button
                                        onClick={handleExportPDF}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm cursor-pointer shadow-sm"
                                    >
                                        <Download size={16} />
                                        Export PDF
                                    </button>
                                </div>
                                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 uppercase font-medium">
                                            <tr>
                                                <th className="px-6 py-4">Period</th>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4">Type</th>
                                                <th className="px-6 py-4 text-right">Cash Flow</th>
                                                <th className="px-6 py-4 text-right">Present Value (PV)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                                            {paginatedSchedule.map((row, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{row.period}</td>
                                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{row.date}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.type === 'Total'
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            }`}>
                                                            {row.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                                                        {formatCurrency(row.cashFlow)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-400">
                                                        {formatCurrency(row.pv)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between rounded-b-xl">
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handlePageChange(1)}
                                                disabled={currentPage === 1}
                                                className="p-1.5 rounded-md hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-500 dark:text-gray-400 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                                                title="First Page"
                                            >
                                                <ChevronsLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="p-1.5 rounded-md hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-500 dark:text-gray-400 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                                                title="Previous Page"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="p-1.5 rounded-md hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-500 dark:text-gray-400 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                                                title="Next Page"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(totalPages)}
                                                disabled={currentPage === totalPages}
                                                className="p-1.5 rounded-md hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-500 dark:text-gray-400 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                                                title="Last Page"
                                            >
                                                <ChevronsRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Bottom Actions */}
                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={() => setLiked(!liked)}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 cursor-pointer ${liked
                                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                                    <span>{liked ? 'Added to favorites' : 'Add to favorites'}</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
