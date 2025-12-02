import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";
import { PiggyBank, Calculator } from "lucide-react";
import { PrintReport } from "./PrintReport";

interface SavingsPlannerProps {
  userName?: string;
}

export function SavingsPlanner({ userName }: SavingsPlannerProps = {}) {
  const [savingsGoal, setSavingsGoal] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [initialAmount, setInitialAmount] = useState(5000);
  const [years, setYears] = useState(10);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [projectedSavings, setProjectedSavings] = useState<any[]>([]);
  const [savingsResults, setSavingsResults] = useState<any>(null);

  const calculateSavings = () => {
    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;
    const data = [];

    let currentValue = initialAmount;

    for (let year = 0; year <= years; year++) {
      const month = year * 12;
      
      if (year === 0) {
        data.push({
          year: year,
          total: initialAmount,
          contributions: initialAmount,
          returns: 0,
        });
      } else {
        // Calculate future value with monthly contributions
        const contributionsValue = monthlyContribution * ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate);
        const initialValue = initialAmount * Math.pow(1 + monthlyRate, month);
        const totalValue = initialValue + contributionsValue;
        const totalContributions = initialAmount + (monthlyContribution * month);
        const totalReturns = totalValue - totalContributions;

        data.push({
          year: year,
          total: Math.round(totalValue),
          contributions: Math.round(totalContributions),
          returns: Math.round(totalReturns),
        });
      }
    }

    setProjectedSavings(data);

    // Calculate results for report
    const finalYear = data[data.length - 1];
    const targetDate = new Date();
    targetDate.setFullYear(targetDate.getFullYear() + years);
    
    const milestones = [25, 50, 75, 100].map(percentage => {
      const targetAmount = (savingsGoal * percentage) / 100;
      let monthsNeeded = 0;
      
      for (let m = 1; m <= months; m++) {
        const contribValue = monthlyContribution * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate);
        const initValue = initialAmount * Math.pow(1 + monthlyRate, m);
        const totalVal = initValue + contribValue;
        
        if (totalVal >= targetAmount) {
          monthsNeeded = m;
          break;
        }
      }
      
      return {
        percentage,
        months: monthsNeeded,
        balance: Math.round((savingsGoal * percentage) / 100),
      };
    });

    setSavingsResults({
      monthsToGoal: months,
      yearsToGoal: years,
      totalInterest: finalYear.returns,
      targetDate: targetDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      milestones,
    });
  };

  const finalValue = projectedSavings.length > 0 ? projectedSavings[projectedSavings.length - 1] : null;

  return (
    <div className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <PiggyBank className="h-10 w-10 text-blue-600" />
            <h2 className="text-gray-900 dark:text-white">Monthly Savings Planner</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Calculate how your monthly savings can grow over time</p>
          {savingsResults && (
            <div className="mt-4">
              <PrintReport
                title="Savings Planning Report"
                data={{
                  savingsGoal,
                  monthlySavings: monthlyContribution,
                  currentSavings: initialAmount,
                  interestRate: annualReturn,
                  results: savingsResults,
                }}
                reportType="savings"
                userName={userName}
              />
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-8 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-gray-900 dark:text-white mb-6">Your Savings Parameters</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="savingsGoal">Savings Goal ($)</Label>
                <Input
                  id="savingsGoal"
                  type="number"
                  value={savingsGoal}
                  onChange={(e) => setSavingsGoal(Number(e.target.value))}
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="initial">Initial Amount ($)</Label>
                <Input
                  id="initial"
                  type="number"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(Number(e.target.value))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="monthly">Monthly Contribution ($)</Label>
                <Input
                  id="monthly"
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="years">Time Period (Years)</Label>
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="mt-2"
                  min="1"
                  max="50"
                />
              </div>

              <div>
                <Label htmlFor="return">Expected Annual Return (%)</Label>
                <Input
                  id="return"
                  type="number"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  className="mt-2"
                  step="0.1"
                  min="0"
                  max="30"
                />
              </div>

              <Button onClick={calculateSavings} className="w-full bg-blue-600 hover:bg-blue-700">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Savings
              </Button>
            </div>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {finalValue && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-6 bg-blue-50 border-blue-200">
                    <div className="text-gray-600 text-sm mb-2">Total Value</div>
                    <div className="text-blue-600">${finalValue.total.toLocaleString()}</div>
                  </Card>
                  <Card className="p-6 bg-green-50 border-green-200">
                    <div className="text-gray-600 text-sm mb-2">Total Contributions</div>
                    <div className="text-green-600">${finalValue.contributions.toLocaleString()}</div>
                  </Card>
                  <Card className="p-6 bg-purple-50 border-purple-200">
                    <div className="text-gray-600 text-sm mb-2">Total Returns</div>
                    <div className="text-purple-600">${finalValue.returns.toLocaleString()}</div>
                  </Card>
                </div>

                <Card className="p-6">
                  <h3 className="text-gray-900 mb-6">Savings Growth Projection</h3>
                  <div className="space-y-3">
                    {projectedSavings.slice(0, 11).map((data, index) => {
                      const maxValue = Math.max(...projectedSavings.map(d => d.total));
                      const percentage = (data.total / maxValue) * 100;
                      
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Year {data.year}</span>
                            <span className="text-gray-900">${data.total.toLocaleString()}</span>
                          </div>
                          <div className="relative w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="absolute h-2 bg-blue-500 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-gray-600">Total Value</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-600">Contributions</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-xs text-gray-600">Returns</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {!finalValue && (
              <Card className="p-12 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Calculator className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Enter your parameters and click Calculate to see your savings projection</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
