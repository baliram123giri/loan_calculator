# calcbz.com - EMI/Loan Calculator

A modern, interactive EMI (Equated Monthly Installment) calculator built with Next.js, TypeScript, and Tailwind CSS. Calculate loan payments, visualize amortization schedules, and explore prepayment scenarios.

## 🚀 Features

### Core Functionality
- **EMI Calculation**: Accurate EMI calculations using standard banking formulas
- **Amortization Schedule**: Detailed month-by-month breakdown of principal and interest
- **Interactive Charts**: 
  - Payment breakup pie chart (Principal vs Interest)
  - Balance trend line chart over time
- **Prepayments Support**:
  - Add recurring monthly extra payments
  - Add one-time lump sum payments
  - See how prepayments reduce tenure and interest

### User Experience
- **Real-time Calculations**: Instant updates as you adjust loan parameters
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support**: Automatic dark mode based on system preferences
- **Export Functionality**: Download amortization schedule as CSV

### Technical Features
- **Type-Safe**: Built with TypeScript for reliability
- **Tested**: Unit tests for core calculation logic
- **Modern Stack**: Next.js 16 with App Router
- **Performance**: Optimized rendering and calculations

## 📋 Prerequisites

- Node.js 18+ or later
- npm, yarn, or pnpm

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd loanly
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library

## 🧮 How It Works

### EMI Formula

The calculator uses the standard EMI formula:

```
EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
```

Where:
- P = Principal loan amount
- r = Monthly interest rate (annual rate / 12 / 100)
- n = Tenure in months

### Amortization Logic

For each month:
1. Calculate interest on remaining balance
2. Subtract interest from EMI to get principal payment
3. Add any extra payments to principal
4. Update remaining balance
5. Repeat until balance reaches zero

## 📁 Project Structure

```
loanly/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── calc/emi/      # EMI calculation endpoint
│   │   │   └── export/csv/    # CSV export endpoint
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── Shared/           # Reusable components
│   │   │   ├── InputNumber.tsx
│   │   │   └── Slider.tsx
│   │   ├── CalculatorForm.tsx
│   │   ├── EMIResultCard.tsx
│   │   ├── AmortizationTable.tsx
│   │   ├── ChartBalance.tsx
│   │   ├── ChartBreakup.tsx
│   │   └── ExportButton.tsx
│   ├── lib/                   # Core logic
│   │   ├── calc/
│   │   │   ├── emi.ts        # EMI calculation logic
│   │   │   └── emi.test.ts   # Unit tests
│   │   └── utils.ts          # Utility functions
│   ├── models/               # Data models (future: MongoDB schemas)
│   ├── hooks/                # Custom React hooks
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
├── tests/                    # Test files
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## 🧪 Testing

Run unit tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

## 🏗️ Building for Production

```bash
npm run build
npm start
```

## 📊 API Endpoints

### POST /api/calc/emi
Calculate EMI and amortization schedule.

**Request Body:**
```json
{
  "principal": 1000000,
  "annualRate": 7.5,
  "tenureMonths": 240,
  "extraPayments": [
    {
      "type": "monthly",
      "amount": 5000,
      "startMonth": 1
    }
  ]
}
```

**Response:**
```json
{
  "emi": 8055.93,
  "totalInterest": 933422.4,
  "totalPayment": 1933422.4,
  "amortization": [...]
}
```

### POST /api/export/csv
Export amortization schedule as CSV.

**Request Body:**
```json
{
  "amortization": [...],
  "principal": 1000000,
  "rate": 7.5,
  "tenure": 240,
  "emi": 8055.93,
  "totalInterest": 933422.4,
  "totalPayment": 1933422.4
}
```

**Response:** CSV file download

## 🎨 Customization

### Styling
Modify `src/app/globals.css` for global styles or update Tailwind configuration in `tailwind.config.js`.

### Calculation Logic
Core calculation logic is in `src/lib/calc/emi.ts`. Modify this file to change EMI formulas or add new calculation types.

### Add New Loan Types
1. Create new calculator variant in `src/components/`
2. Add route in `src/app/calculators/[type]/`
3. Update navigation in header

## 🚧 Roadmap

- [x] PDF Export functionality
- [ ] User authentication (NextAuth.js)
- [x] Save and load loan scenarios
- [x] Multiple loan type calculators (Car, Personal, Credit Card)
- [x] Loan comparison tool
- [ ] Mobile app (React Native)
- [ ] Interest rate API integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Your Name - [Your GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- EMI formula reference: Standard banking calculations
- UI inspiration: Modern fintech applications
- Charts: Recharts library

---

**Note**: This is a learning project built to practice Next.js, TypeScript, and modern web development patterns. For production use, ensure proper validation, error handling, and security measures are in place.
