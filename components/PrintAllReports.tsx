import { useState } from "react";
import { Button } from "./ui/button";
import { Printer, FileText, X } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "./ui/sonner";
import { PrintReport } from "./PrintReport";

interface PrintAllReportsProps {
  userName?: string;
  dashboardData?: any;
}

export function PrintAllReports({ userName, dashboardData }: PrintAllReportsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    // Retirement data
    retirementCurrentAge: 30,
    retirementAge: 65,
    retirementCurrentSavings: 50000,
    retirementMonthlyContribution: 500,
    retirementExpectedReturn: 7,
    retirementGoal: 1000000,
    
    // Investment data
    investmentInitial: 10000,
    investmentMonthly: 500,
    investmentYears: 20,
    investmentReturn: 8,
    
    // Savings data
    savingsGoal: 50000,
    savingsInitial: 5000,
    savingsMonthly: 300,
    savingsYears: 10,
    savingsInterest: 3,
    
    // Budget data
    budgetIncome: 5000,
    budgetHousing: 1500,
    budgetUtilities: 200,
    budgetFood: 400,
    budgetTransportation: 300,
    budgetInsurance: 200,
    budgetEntertainment: 150,
    budgetOther: 250,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: parseFloat(value) || 0 });
  };

  const calculateRetirementResults = () => {
    const yearsToRetirement = formData.retirementAge - formData.retirementCurrentAge;
    const monthlyRate = formData.retirementExpectedReturn / 100 / 12;
    const months = yearsToRetirement * 12;
    
    const futureValueOfSavings = formData.retirementCurrentSavings * Math.pow(1 + monthlyRate, months);
    const futureValueOfContributions = formData.retirementMonthlyContribution * 
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    const totalValue = futureValueOfSavings + futureValueOfContributions;
    const totalContributions = formData.retirementCurrentSavings + (formData.retirementMonthlyContribution * months);
    const totalReturns = totalValue - totalContributions;
    
    return {
      totalValue: Math.round(totalValue),
      totalContributions: Math.round(totalContributions),
      totalReturns: Math.round(totalReturns),
      yearsToRetirement,
    };
  };

  const calculateInvestmentResults = () => {
    const monthlyRate = formData.investmentReturn / 100 / 12;
    const months = formData.investmentYears * 12;
    
    const futureValueInitial = formData.investmentInitial * Math.pow(1 + monthlyRate, months);
    const futureValueContributions = formData.investmentMonthly * 
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    const futureValue = futureValueInitial + futureValueContributions;
    const totalInvested = formData.investmentInitial + (formData.investmentMonthly * months);
    const totalGains = futureValue - totalInvested;
    const roi = (totalGains / totalInvested) * 100;
    
    return {
      futureValue: Math.round(futureValue),
      totalInvested: Math.round(totalInvested),
      totalGains: Math.round(totalGains),
      roi,
    };
  };

  const calculateSavingsResults = () => {
    const monthlyRate = formData.savingsInterest / 100 / 12;
    const months = formData.savingsYears * 12;
    
    const futureValueInitial = formData.savingsInitial * Math.pow(1 + monthlyRate, months);
    const futureValueContributions = formData.savingsMonthly * 
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    const finalAmount = futureValueInitial + futureValueContributions;
    const totalSaved = formData.savingsInitial + (formData.savingsMonthly * months);
    const interestEarned = finalAmount - totalSaved;
    const goalAchievement = (finalAmount / formData.savingsGoal) * 100;
    
    return {
      finalAmount: Math.round(finalAmount),
      totalSaved: Math.round(totalSaved),
      interestEarned: Math.round(interestEarned),
      goalAchievement,
    };
  };

  const calculateBudgetResults = () => {
    const totalExpenses = 
      formData.budgetHousing +
      formData.budgetUtilities +
      formData.budgetFood +
      formData.budgetTransportation +
      formData.budgetInsurance +
      formData.budgetEntertainment +
      formData.budgetOther;
    
    const netSavings = formData.budgetIncome - totalExpenses;
    const savingsRate = ((netSavings / formData.budgetIncome) * 100).toFixed(1);
    
    const expenses = [
      { category: "Housing", amount: formData.budgetHousing, percentage: ((formData.budgetHousing / formData.budgetIncome) * 100).toFixed(1) },
      { category: "Utilities", amount: formData.budgetUtilities, percentage: ((formData.budgetUtilities / formData.budgetIncome) * 100).toFixed(1) },
      { category: "Food", amount: formData.budgetFood, percentage: ((formData.budgetFood / formData.budgetIncome) * 100).toFixed(1) },
      { category: "Transportation", amount: formData.budgetTransportation, percentage: ((formData.budgetTransportation / formData.budgetIncome) * 100).toFixed(1) },
      { category: "Insurance", amount: formData.budgetInsurance, percentage: ((formData.budgetInsurance / formData.budgetIncome) * 100).toFixed(1) },
      { category: "Entertainment", amount: formData.budgetEntertainment, percentage: ((formData.budgetEntertainment / formData.budgetIncome) * 100).toFixed(1) },
      { category: "Other", amount: formData.budgetOther, percentage: ((formData.budgetOther / formData.budgetIncome) * 100).toFixed(1) },
    ];
    
    return {
      monthlyIncome: formData.budgetIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      expenses,
    };
  };

  const generateCombinedReport = () => {
    const retirementResults = calculateRetirementResults();
    const investmentResults = calculateInvestmentResults();
    const savingsResults = calculateSavingsResults();
    const budgetResults = calculateBudgetResults();

    const combinedData = {
      dashboard: dashboardData || {
        totalAssets: 62500,
        monthlyIncome: 8000,
        monthlySavings: 2300,
        investmentGrowth: 13.6,
      },
      retirement: {
        currentAge: formData.retirementCurrentAge,
        retirementAge: formData.retirementAge,
        currentSavings: formData.retirementCurrentSavings,
        monthlyContribution: formData.retirementMonthlyContribution,
        expectedReturn: formData.retirementExpectedReturn,
        retirementGoal: formData.retirementGoal,
        results: retirementResults,
      },
      investment: {
        initialInvestment: formData.investmentInitial,
        monthlyContribution: formData.investmentMonthly,
        years: formData.investmentYears,
        returnRate: formData.investmentReturn,
        results: investmentResults,
      },
      savings: {
        savingsGoal: formData.savingsGoal,
        initialAmount: formData.savingsInitial,
        monthlySavings: formData.savingsMonthly,
        years: formData.savingsYears,
        interestRate: formData.savingsInterest,
        results: savingsResults,
      },
      budget: budgetResults,
    };

    return combinedData;
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        <FileText className="h-4 w-4" />
        Print All Reports
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setIsOpen(false)}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-gray-900 dark:text-white mb-2">Generate Combined Financial Report</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Enter your financial data to generate a comprehensive report including retirement, investment, savings, and budget analysis.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
          {/* Retirement Planning Section */}
          <div className="space-y-4">
            <h3 className="text-gray-900 dark:text-white">Retirement Planning</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Current Age</Label>
                <Input
                  type="number"
                  value={formData.retirementCurrentAge}
                  onChange={(e) => handleInputChange("retirementCurrentAge", e.target.value)}
                />
              </div>
              <div>
                <Label>Retirement Age</Label>
                <Input
                  type="number"
                  value={formData.retirementAge}
                  onChange={(e) => handleInputChange("retirementAge", e.target.value)}
                />
              </div>
              <div>
                <Label>Current Savings ($)</Label>
                <Input
                  type="number"
                  value={formData.retirementCurrentSavings}
                  onChange={(e) => handleInputChange("retirementCurrentSavings", e.target.value)}
                />
              </div>
              <div>
                <Label>Monthly Contribution ($)</Label>
                <Input
                  type="number"
                  value={formData.retirementMonthlyContribution}
                  onChange={(e) => handleInputChange("retirementMonthlyContribution", e.target.value)}
                />
              </div>
              <div>
                <Label>Expected Return (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.retirementExpectedReturn}
                  onChange={(e) => handleInputChange("retirementExpectedReturn", e.target.value)}
                />
              </div>
              <div>
                <Label>Retirement Goal ($)</Label>
                <Input
                  type="number"
                  value={formData.retirementGoal}
                  onChange={(e) => handleInputChange("retirementGoal", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Investment Planning Section */}
          <div className="space-y-4">
            <h3 className="text-gray-900 dark:text-white">Investment Planning</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Initial Investment ($)</Label>
                <Input
                  type="number"
                  value={formData.investmentInitial}
                  onChange={(e) => handleInputChange("investmentInitial", e.target.value)}
                />
              </div>
              <div>
                <Label>Monthly Contribution ($)</Label>
                <Input
                  type="number"
                  value={formData.investmentMonthly}
                  onChange={(e) => handleInputChange("investmentMonthly", e.target.value)}
                />
              </div>
              <div>
                <Label>Investment Period (years)</Label>
                <Input
                  type="number"
                  value={formData.investmentYears}
                  onChange={(e) => handleInputChange("investmentYears", e.target.value)}
                />
              </div>
              <div>
                <Label>Expected Return (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.investmentReturn}
                  onChange={(e) => handleInputChange("investmentReturn", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Savings Planning Section */}
          <div className="space-y-4">
            <h3 className="text-gray-900 dark:text-white">Savings Planning</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Savings Goal ($)</Label>
                <Input
                  type="number"
                  value={formData.savingsGoal}
                  onChange={(e) => handleInputChange("savingsGoal", e.target.value)}
                />
              </div>
              <div>
                <Label>Initial Amount ($)</Label>
                <Input
                  type="number"
                  value={formData.savingsInitial}
                  onChange={(e) => handleInputChange("savingsInitial", e.target.value)}
                />
              </div>
              <div>
                <Label>Monthly Savings ($)</Label>
                <Input
                  type="number"
                  value={formData.savingsMonthly}
                  onChange={(e) => handleInputChange("savingsMonthly", e.target.value)}
                />
              </div>
              <div>
                <Label>Time Period (years)</Label>
                <Input
                  type="number"
                  value={formData.savingsYears}
                  onChange={(e) => handleInputChange("savingsYears", e.target.value)}
                />
              </div>
              <div>
                <Label>Interest Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.savingsInterest}
                  onChange={(e) => handleInputChange("savingsInterest", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Budget Section */}
          <div className="space-y-4">
            <h3 className="text-gray-900 dark:text-white">Monthly Budget</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Monthly Income ($)</Label>
                <Input
                  type="number"
                  value={formData.budgetIncome}
                  onChange={(e) => handleInputChange("budgetIncome", e.target.value)}
                />
              </div>
              <div>
                <Label>Housing ($)</Label>
                <Input
                  type="number"
                  value={formData.budgetHousing}
                  onChange={(e) => handleInputChange("budgetHousing", e.target.value)}
                />
              </div>
              <div>
                <Label>Utilities ($)</Label>
                <Input
                  type="number"
                  value={formData.budgetUtilities}
                  onChange={(e) => handleInputChange("budgetUtilities", e.target.value)}
                />
              </div>
              <div>
                <Label>Food ($)</Label>
                <Input
                  type="number"
                  value={formData.budgetFood}
                  onChange={(e) => handleInputChange("budgetFood", e.target.value)}
                />
              </div>
              <div>
                <Label>Transportation ($)</Label>
                <Input
                  type="number"
                  value={formData.budgetTransportation}
                  onChange={(e) => handleInputChange("budgetTransportation", e.target.value)}
                />
              </div>
              <div>
                <Label>Insurance ($)</Label>
                <Input
                  type="number"
                  value={formData.budgetInsurance}
                  onChange={(e) => handleInputChange("budgetInsurance", e.target.value)}
                />
              </div>
              <div>
                <Label>Entertainment ($)</Label>
                <Input
                  type="number"
                  value={formData.budgetEntertainment}
                  onChange={(e) => handleInputChange("budgetEntertainment", e.target.value)}
                />
              </div>
              <div>
                <Label>Other ($)</Label>
                <Input
                  type="number"
                  value={formData.budgetOther}
                  onChange={(e) => handleInputChange("budgetOther", e.target.value)}
                />
              </div>
            </div>
          </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <PrintReport
                title="Complete Financial Report"
                data={generateCombinedReport()}
                reportType="combined"
                userName={userName}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
