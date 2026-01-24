import React, { useState, useEffect } from 'react';
import { Calculator, Info } from 'lucide-react';

const MortgageCalculator: React.FC = () => {
  const [propertyPrice, setPropertyPrice] = useState(15000000);
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(13.5);
  const [loanTerm, setLoanTerm] = useState(20);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    calculateMortgage();
  }, [propertyPrice, downPayment, interestRate, loanTerm]);

  const calculateMortgage = () => {
    const principal = propertyPrice * (1 - downPayment / 100);
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      const monthly = principal / numberOfPayments;
      setMonthlyPayment(monthly);
      setTotalPayment(principal);
      setTotalInterest(0);
    } else {
      const monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                     (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      const total = monthly * numberOfPayments;
      setMonthlyPayment(monthly);
      setTotalPayment(total);
      setTotalInterest(total - principal);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-3xl p-8 text-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Mortgage Calculator</h3>
          <p className="text-emerald-200 text-sm">Estimate your monthly payments</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-emerald-200 mb-2">
              Property Price
            </label>
            <input
              type="range"
              min="1000000"
              max="100000000"
              step="500000"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              className="w-full h-2 bg-emerald-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="text-right text-lg font-semibold mt-1">{formatCurrency(propertyPrice)}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-200 mb-2">
              Down Payment ({downPayment}%)
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2 bg-emerald-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="text-right text-lg font-semibold mt-1">{formatCurrency(propertyPrice * downPayment / 100)}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-200 mb-2">
              Interest Rate ({interestRate}%)
            </label>
            <input
              type="range"
              min="8"
              max="20"
              step="0.5"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-emerald-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-200 mb-2">
              Loan Term ({loanTerm} years)
            </label>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full h-2 bg-emerald-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="text-center mb-6">
            <p className="text-emerald-200 text-sm mb-1">Monthly Payment</p>
            <p className="text-4xl font-bold text-amber-400">{formatCurrency(monthlyPayment)}</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white/20">
              <span className="text-emerald-200">Loan Amount</span>
              <span className="font-semibold">{formatCurrency(propertyPrice * (1 - downPayment / 100))}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/20">
              <span className="text-emerald-200">Total Interest</span>
              <span className="font-semibold">{formatCurrency(totalInterest)}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-emerald-200">Total Payment</span>
              <span className="font-semibold text-lg">{formatCurrency(totalPayment)}</span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-amber-500/20 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-100">
              Rates based on current Kenyan bank averages. Actual rates may vary based on your credit profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
