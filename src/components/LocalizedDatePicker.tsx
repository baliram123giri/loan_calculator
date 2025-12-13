import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useCurrency } from '@/context/CurrencyContext';
import { Calendar as CalendarIcon } from 'lucide-react';

interface LocalizedDatePickerProps {
    label?: string;
    value: string; // YYYY-MM-DD
    onChange: (value: string) => void;
}

export default function LocalizedDatePicker({ label, value, onChange }: LocalizedDatePickerProps) {
    const { currency } = useCurrency();

    // Parse YYYY-MM-DD into a local Date object safely
    const dateValue = React.useMemo(() => {
        if (!value) return null;
        const parts = value.split('-');
        if (parts.length !== 3) return null;
        const [y, m, d] = parts.map(Number);
        return new Date(y, m - 1, d);
    }, [value]);

    const getDateFormat = (locale: string) => {
        // Map locale to date-fns format tokens
        // US uses MM/dd/yyyy
        if (locale === 'en-US') return 'MM/dd/yyyy';

        // Asian formats often YYYY/MM/DD
        if (['ja-JP', 'zh-CN', 'ko-KR', 'zh-TW', 'hu-HU'].includes(locale)) return 'yyyy/MM/dd';

        // Most of the world (including IN, GB, EU, SA, etc) uses dd/MM/yyyy
        return 'dd/MM/yyyy';
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            // Get YYYY-MM-DD in local time
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            onChange(`${y}-${m}-${d}`);
        } else {
            onChange('');
        }
    };

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
            <div className="relative">
                <DatePicker
                    selected={dateValue}
                    onChange={handleDateChange}
                    dateFormat={getDateFormat(currency.locale)}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white cursor-pointer"
                    wrapperClassName="w-full"
                    placeholderText={getDateFormat(currency.locale).toLowerCase()}
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
            </div>
            {/* Styles for dark mode support in DatePicker popup */}
            <style jsx global>{`
                .react-datepicker-wrapper {
                    width: 100%;
                }
                .react-datepicker {
                    font-family: inherit;
                    border-color: #e5e7eb;
                    font-size: 0.875rem;
                }
                .dark .react-datepicker {
                    background-color: #1f2937;
                    border-color: #374151;
                    color: #e5e7eb;
                }
                .dark .react-datepicker__header {
                    background-color: #111827;
                    border-bottom-color: #374151;
                }
                .dark .react-datepicker__current-month,
                .dark .react-datepicker__day-name,
                .dark .react-datepicker__day {
                    color: #e5e7eb;
                }
                .dark .react-datepicker__day:hover {
                    background-color: #374151;
                }
                .dark .react-datepicker__day--selected {
                    background-color: #2563eb;
                    color: white;
                }
                .dark .react-datepicker__day--keyboard-selected {
                    background-color: #1d4ed8;
                }
            `}</style>
        </div>
    );
}
