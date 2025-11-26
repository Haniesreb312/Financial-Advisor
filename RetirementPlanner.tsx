import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";
import { Palmtree, Calculator, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { PrintReport } from "./PrintReport";

interface RetirementPlannerProps {
  userName?: string;
}

export function RetirementPlanner({ userName }: RetirementPlannerProps = {}) {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [retirementGoal, setRetirementGoal] = useState(1000000);
  const [results, setResults] = useState<any>(null);

  const calculateRetirement = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const monthlyRate = expectedReturn / 100 / 12;
    const months = yearsToRetirement * 12;

    // Calculate future value with monthly contributions
    const futureValueContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    const futureValueInitial = currentSavings * Math.pow(1 + monthlyRate, months);
    const totalFutureValue = futureValueInitial + futureValueContributions;

    const totalContributions = currentSavings + (monthlyContribution * months);
    const totalReturns = totalFutureValue - totalContributions;

    const shortfall = retirementGoal - totalFutureValue;
    const onTrack = totalFutureValue >= retirementGoal;

    // Generate milestone data
    const milestones = [];
    const milestoneYears = [5, 10, 15, 20, 25, 30, 35].filter(y => y <= yearsToRetirement);
    
    milestoneYears.forEach(year => {
      const m = year * 12;
      const contribValue = monthlyContribution * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate);
      const initValue = currentSavings * Math.pow(1 + monthlyRate, m);
      milestones.push({
        year: `Year ${year}`,
        value: Math.round(initValue + contribValue),
        age: currentAge + year,
      });
    });

    setResults({
      totalValue: Math.round(totalFutureValue),
      totalContributions: Math.round(totalContributions),
      totalReturns: Math.round(totalReturns),
      shortfall: Math.round(Math.abs(shortfall)),
      onTrack,
      milestones,
      yearsToRetirement,
    });
  };

  return (
    <div className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Palmtree className="h-10 w-10 text-blue-600" />
            <h2 className="text-gray-900 dark:text-white">Retirement Planning Calculator</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Plan your retirement and see if you're on track to meet your goals</p>
          {results && (
            <div className="mt-4">
              <PrintReport
                title="Retirement Planning Report"
                data={{
                  currentAge,
                  retirementAge,
                  currentSavings,
                  monthlyContribution,
                  expectedReturn,
                  retirementGoal,
                  results,
                }}
                reportType="retirement"
                userName={userName}
              />
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Input Section */}
          <Card className="p-8 lg:col-span-1">
            <h3 className="text-gray-900 mb-6">Your Information</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="currentAge">Current Age</Label>
                <Input
                  id="currentAge"
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="mt-2"
                  min="18"
                  max="100"
                />
              </div>

              <div>
                <Label htmlFor="retirementAge">Retirement Age</Label>
                <Input
                  id="retirementAge"
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="mt-2"
                  min="40"
                  max="100"
                />
              </div>

              <div>
                <Label htmlFor="currentSavings">Current Retirement Savings ($)</Label>
                <Input
                  id="currentSavings"
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="monthlyContrib">Monthly Contribution ($)</Label>
                <Input
                  id="monthlyContrib"
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                <Input
                  id="expectedReturn"
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="mt-2"
                  step="0.1"
                />
              </div>

              <div>
                <Label htmlFor="retirementGoal">Retirement Goal ($)</Label>
                <Input
                  id="retirementGoal"
                  type="number"
                  value={retirementGoal}
                  onChange={(e) => setRetirementGoal(Number(e.target.value))}
                  className="mt-2"
                />
              </div>

              <Button onClick={calculateRetirement} className="w-full bg-blue-600 hover:bg-blue-700">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Retirement Plan
              </Button>
            </div>
          </Card>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {results && (
              <>
                <Card className={`p-8 ${results.onTrack ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className={`${results.onTrack ? 'text-green-900' : 'text-orange-900'} mb-2`}>
                        {results.onTrack ? '🎉 You\'re On Track!' : '⚠️ Action Required'}
                      </h3>
                      <p className={results.onTrack ? 'text-green-700' : 'text-orange-700'}>
                        {results.onTrack 
                          ? `Great job! You're projected to exceed your retirement goal by $${(results.totalValue - retirementGoal).toLocaleString()}.`
                          : `You're projected to fall short of your goal by $${results.shortfall.toLocaleString()}. Consider increasing contributions or adjusting your retirement age.`
                        }
                      </p>
                    </div>
                    {results.onTrack ? (
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    ) : (
                      <Calculator className="h-8 w-8 text-orange-600" />
                    )}
                  </div>
                </Card>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="text-blue-100 mb-2">Projected Retirement Value</div>
                    <div className="text-white">${results.totalValue.toLocaleString()}</div>
                    <div className="text-blue-100 text-sm mt-2">In {results.yearsToRetirement} years</div>
                  </Card>
                  <Card className="p-6 bg-white">
                    <div className="text-gray-600 mb-2">Total Contributions</div>
                    <div className="text-gray-900">${results.totalContributions.toLocaleString()}</div>
                    <div className="text-gray-500 text-sm mt-2">Your investment</div>
                  </Card>
                  <Card className="p-6 bg-white">
                    <div className="text-gray-600 mb-2">Investment Returns</div>
                    <div className="text-green-600">${results.totalReturns.toLocaleString()}</div>
                    <div className="text-gray-500 text-sm mt-2">Growth from returns</div>
                  </Card>
                </div>

                <Card className="p-6">
                  <h3 className="text-gray-900 mb-6">Retirement Savings Milestones</h3>
                  <div className="space-y-4">
                    {results.milestones.map((milestone: any, index: number) => {
                      const maxValue = Math.max(...results.milestones.map((m: any) => m.value));
                      const percentage = (milestone.value / maxValue) * 100;
                      
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{milestone.year} (Age {milestone.age})</span>
                            <span className="text-gray-900">${milestone.value.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="h-3 bg-blue-500 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </>
            )}

            {!results && (
              <div className="h-full flex items-center justify-center">
                <Card className="p-12 w-full">
                  <div className="text-center">
                    <div className="rounded-2xl overflow-hidden mb-6 max-w-md mx-auto shadow-lg">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1758686254415-9348b5b5df01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRpcmVtZW50JTIwcGxhbm5pbmclMjBjb3VwbGV8ZW58MXx8fHwxNzYzNDY3ODY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Retirement Planning"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    <p className="text-gray-600 mb-4">Enter your information and click Calculate to see your retirement projection</p>
                    <div className="flex items-center justify-center gap-2 text-blue-600">
                      <Palmtree className="h-5 w-5" />
                      <span className="text-sm">Plan your dream retirement today</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
