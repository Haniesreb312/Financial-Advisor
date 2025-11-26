import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { useState } from "react";
import { TrendingUp, Target, DollarSign, Briefcase, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "./ui/sonner";
import { PrintReport } from "./PrintReport";

interface InvestmentPlannerProps {
  userName?: string;
}

export function InvestmentPlanner({ userName }: InvestmentPlannerProps = {}) {
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [monthlyInvestment, setMonthlyInvestment] = useState(500);
  const [investmentYears, setInvestmentYears] = useState(20);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [customAllocation, setCustomAllocation] = useState(false);
  const [customAssets, setCustomAssets] = useState({
    stocks: 50,
    bonds: 35,
    realEstate: 10,
    cash: 5,
  });

  // Calculate investment projections for specific years
  const calculateInvestmentForYear = (years: number) => {
    const monthlyRate = expectedReturn / 100 / 12;
    const months = years * 12;
    
    const futureValueContributions = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    const futureValueInitial = investmentAmount * Math.pow(1 + monthlyRate, months);
    const totalValue = futureValueInitial + futureValueContributions;
    const totalInvested = investmentAmount + (monthlyInvestment * months);
    const totalReturns = totalValue - totalInvested;

    return {
      totalValue: Math.round(totalValue),
      totalInvested: Math.round(totalInvested),
      totalReturns: Math.round(totalReturns),
    };
  };

  // Key milestone years
  const milestoneYears = [2, 5, 10, 15, 20];
  const milestones = milestoneYears.map(year => ({
    year,
    ...calculateInvestmentForYear(year)
  }));

  // Get current allocation
  const getCurrentAllocation = () => {
    if (customAllocation) {
      return [
        { name: "Stocks", value: customAssets.stocks, color: "#3b82f6" },
        { name: "Bonds", value: customAssets.bonds, color: "#10b981" },
        { name: "Real Estate", value: customAssets.realEstate, color: "#f59e0b" },
        { name: "Cash", value: customAssets.cash, color: "#6366f1" },
      ].filter(asset => asset.value > 0);
    }
    return [
      { name: "Stocks", value: 50, color: "#3b82f6" },
      { name: "Bonds", value: 35, color: "#10b981" },
      { name: "Real Estate", value: 10, color: "#f59e0b" },
      { name: "Cash", value: 5, color: "#6366f1" },
    ];
  };

  const currentAllocation = getCurrentAllocation();

  // Calculate total allocation percentage
  const totalAllocation = customAssets.stocks + customAssets.bonds + customAssets.realEstate + customAssets.cash;
  const isValidAllocation = totalAllocation === 100;

  // Handle asset allocation changes
  const handleAssetChange = (asset: string, value: number) => {
    const newAssets = { ...customAssets, [asset]: value };
    setCustomAssets(newAssets);
    
    const total = Object.values(newAssets).reduce((sum, val) => sum + val, 0);
    if (total > 100) {
      toast.error("Total allocation cannot exceed 100%");
    } else if (total === 100) {
      toast.success("Perfect! Allocation totals 100%");
    }
  };

  // Reset to recommended allocation
  const resetAllocation = () => {
    setCustomAssets({
      stocks: 50,
      bonds: 35,
      realEstate: 10,
      cash: 5,
    });
    toast.success("Reset to recommended allocation");
  };

  // Investment scenarios
  const scenarios = [
    { name: "Conservative (5%)", rate: 5 },
    { name: "Moderate (8%)", rate: 8 },
    { name: "Aggressive (12%)", rate: 12 },
  ];

  const scenarioData = scenarios.map(scenario => {
    const monthlyRate = scenario.rate / 100 / 12;
    const months = investmentYears * 12;
    const futureContrib = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    const futureInitial = investmentAmount * Math.pow(1 + monthlyRate, months);
    const totalVal = futureInitial + futureContrib;
    
    return {
      scenario: scenario.name,
      value: Math.round(totalVal),
    };
  });

  return (
    <div className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase className="h-10 w-10 text-blue-600" />
            <h2 className="text-gray-900 dark:text-white">Investment Planning Calculator</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Plan your investment strategy and visualize your wealth growth</p>
          <div className="mt-4">
            <PrintReport
              title="Investment Planning Report"
              data={{
                investmentAmount,
                monthlyInvestment,
                investmentYears,
                expectedReturn,
                allocation: getCurrentAllocation(),
                milestones,
              }}
              reportType="investment"
              userName={userName}
            />
          </div>
        </div>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Input Section */}
              <Card className="p-8 hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
                <h3 className="text-gray-900 mb-6">Investment Parameters</h3>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
                    <Input
                      id="initialInvestment"
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="monthlyInvest">Monthly Investment ($)</Label>
                    <Input
                      id="monthlyInvest"
                      type="number"
                      value={monthlyInvestment}
                      onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="investYears">Investment Period (Years)</Label>
                    <Input
                      id="investYears"
                      type="number"
                      value={investmentYears}
                      onChange={(e) => setInvestmentYears(Number(e.target.value))}
                      className="mt-2"
                      min="1"
                      max="50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="returnRate">Expected Annual Return (%)</Label>
                    <Input
                      id="returnRate"
                      type="number"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(Number(e.target.value))}
                      className="mt-2"
                      step="0.1"
                    />
                  </div>
                </div>
              </Card>

              {/* Results Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Milestone Year Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {milestones.map((milestone, index) => (
                    <Card key={index} className={`p-4 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group border-2 ${
                      milestone.year === investmentYears ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-blue-600 text-white' : 'hover:border-blue-200'
                    }`}>
                      <div className={`text-sm mb-2 ${milestone.year === investmentYears ? 'text-blue-100' : 'text-gray-600'}`}>
                        Year {milestone.year}
                      </div>
                      <div className={`transition-all group-hover:scale-110 ${milestone.year === investmentYears ? 'text-white' : 'text-gray-900'}`}>
                        ${(milestone.totalValue / 1000).toFixed(0)}k
                      </div>
                      <div className={`text-xs mt-1 ${milestone.year === investmentYears ? 'text-blue-100' : 'text-gray-500'}`}>
                        +${(milestone.totalReturns / 1000).toFixed(0)}k
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Detailed Milestone Breakdown */}
                <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-gray-900 mb-6">Investment Milestones</h3>
                  <div className="space-y-4">
                    {milestones.map((milestone, index) => {
                      const maxValue = Math.max(...milestones.map(m => m.totalValue));
                      const percentage = (milestone.totalValue / maxValue) * 100;
                      const returnRate = milestone.totalInvested > 0 ? ((milestone.totalReturns / milestone.totalInvested) * 100).toFixed(1) : 0;
                      
                      return (
                        <div key={index} className="space-y-2 group">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className={`px-3 py-1 rounded-full text-sm ${
                                milestone.year === investmentYears 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                Year {milestone.year}
                              </div>
                              <span className="text-gray-600 text-sm">+{returnRate}%</span>
                            </div>
                            <div className="flex gap-4 text-sm">
                              <span className="text-blue-600">${milestone.totalValue.toLocaleString()}</span>
                              <span className="text-gray-400">|</span>
                              <span className="text-green-600">${milestone.totalInvested.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className="absolute h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-700 hover:from-blue-500 hover:to-blue-700"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-gray-600">Total Value</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-gray-600">Invested</span>
                    </div>
                  </div>
                </Card>

                {/* Summary Card */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                      <div className="text-blue-100 text-sm">Total Value</div>
                    </div>
                    <div className="text-white transition-all group-hover:scale-110">${milestones[milestones.length - 1].totalValue.toLocaleString()}</div>
                    <div className="text-blue-100 text-sm mt-2">After {investmentYears} years</div>
                  </Card>
                  <Card className="p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group border-2 hover:border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                      <div className="text-gray-600 text-sm">Total Invested</div>
                    </div>
                    <div className="text-gray-900 transition-all group-hover:scale-110">${milestones[milestones.length - 1].totalInvested.toLocaleString()}</div>
                    <div className="text-gray-500 text-sm mt-2">Your contributions</div>
                  </Card>
                  <Card className="p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group border-2 hover:border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600 group-hover:translate-y-[-4px] transition-transform" />
                      <div className="text-gray-600 text-sm">Returns</div>
                    </div>
                    <div className="text-green-600 transition-all group-hover:scale-110">${milestones[milestones.length - 1].totalReturns.toLocaleString()}</div>
                    <div className="text-gray-500 text-sm mt-2">Investment growth</div>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Allocation Tab */}
          <TabsContent value="allocation">
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-900">Portfolio Allocation</h3>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="custom-mode" className="text-sm cursor-pointer">Custom</Label>
                    <Switch 
                      id="custom-mode"
                      checked={customAllocation}
                      onCheckedChange={(checked) => {
                        setCustomAllocation(checked);
                        if (checked) {
                          toast.info("Custom allocation mode enabled");
                        } else {
                          toast.info("Using recommended allocation");
                        }
                      }}
                    />
                  </div>
                </div>
                
                {/* Pie Chart Visualization */}
                <div className="flex items-center justify-center mb-8">
                  <div className="relative w-64 h-64 group">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90 transition-transform duration-500 group-hover:scale-105">
                      {(() => {
                        let cumulativePercent = 0;
                        return currentAllocation.map((asset, index) => {
                          const percent = asset.value;
                          const startAngle = (cumulativePercent / 100) * 360;
                          const endAngle = ((cumulativePercent + percent) / 100) * 360;
                          cumulativePercent += percent;
                          
                          const startX = 50 + 40 * Math.cos((Math.PI * startAngle) / 180);
                          const startY = 50 + 40 * Math.sin((Math.PI * startAngle) / 180);
                          const endX = 50 + 40 * Math.cos((Math.PI * endAngle) / 180);
                          const endY = 50 + 40 * Math.sin((Math.PI * endAngle) / 180);
                          
                          const largeArcFlag = percent > 50 ? 1 : 0;
                          
                          const pathData = [
                            `M 50 50`,
                            `L ${startX} ${startY}`,
                            `A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                            `Z`
                          ].join(' ');
                          
                          return (
                            <path
                              key={index}
                              d={pathData}
                              fill={asset.color}
                              stroke="white"
                              strokeWidth="0.5"
                              className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                            />
                          );
                        });
                      })()}
                    </svg>
                    {!isValidAllocation && customAllocation && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {totalAllocation}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 justify-center">
                  {currentAllocation.map((asset, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                      <div 
                        className="w-4 h-4 rounded-full shadow-sm" 
                        style={{ backgroundColor: asset.color }}
                      ></div>
                      <span className="text-sm text-gray-700">{asset.name}: {asset.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-900">Asset Allocation {customAllocation ? "Editor" : "Details"}</h3>
                  {customAllocation && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={resetAllocation}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reset
                    </Button>
                  )}
                </div>

                {customAllocation ? (
                  <div className="space-y-6">
                    {/* Editable Sliders */}
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-700">Total Allocation</span>
                          <span className={`${isValidAllocation ? 'text-green-600' : totalAllocation > 100 ? 'text-red-600' : 'text-orange-600'}`}>
                            {totalAllocation}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${isValidAllocation ? 'bg-green-500' : totalAllocation > 100 ? 'bg-red-500' : 'bg-orange-500'}`}
                            style={{ width: `${Math.min(totalAllocation, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Stocks */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            Stocks
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={customAssets.stocks}
                              onChange={(e) => handleAssetChange('stocks', Math.max(0, Math.min(100, Number(e.target.value))))}
                              className="w-20 text-center"
                              min="0"
                              max="100"
                            />
                            <span className="text-sm text-gray-600">%</span>
                          </div>
                        </div>
                        <Slider
                          value={[customAssets.stocks]}
                          onValueChange={([value]) => handleAssetChange('stocks', value)}
                          max={100}
                          step={1}
                          className="cursor-pointer"
                        />
                      </div>

                      {/* Bonds */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            Bonds
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={customAssets.bonds}
                              onChange={(e) => handleAssetChange('bonds', Math.max(0, Math.min(100, Number(e.target.value))))}
                              className="w-20 text-center"
                              min="0"
                              max="100"
                            />
                            <span className="text-sm text-gray-600">%</span>
                          </div>
                        </div>
                        <Slider
                          value={[customAssets.bonds]}
                          onValueChange={([value]) => handleAssetChange('bonds', value)}
                          max={100}
                          step={1}
                          className="cursor-pointer"
                        />
                      </div>

                      {/* Real Estate */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            Real Estate
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={customAssets.realEstate}
                              onChange={(e) => handleAssetChange('realEstate', Math.max(0, Math.min(100, Number(e.target.value))))}
                              className="w-20 text-center"
                              min="0"
                              max="100"
                            />
                            <span className="text-sm text-gray-600">%</span>
                          </div>
                        </div>
                        <Slider
                          value={[customAssets.realEstate]}
                          onValueChange={([value]) => handleAssetChange('realEstate', value)}
                          max={100}
                          step={1}
                          className="cursor-pointer"
                        />
                      </div>

                      {/* Cash */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                            Cash
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={customAssets.cash}
                              onChange={(e) => handleAssetChange('cash', Math.max(0, Math.min(100, Number(e.target.value))))}
                              className="w-20 text-center"
                              min="0"
                              max="100"
                            />
                            <span className="text-sm text-gray-600">%</span>
                          </div>
                        </div>
                        <Slider
                          value={[customAssets.cash]}
                          onValueChange={([value]) => handleAssetChange('cash', value)}
                          max={100}
                          step={1}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentAllocation.map((asset, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0 hover:bg-gray-50 p-2 rounded transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded`} style={{ backgroundColor: asset.color }}></div>
                            <span className="text-gray-900">{asset.name}</span>
                          </div>
                          <span className="text-gray-900">{asset.value}%</span>
                        </div>
                        <div className="ml-7">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-500" 
                              style={{ 
                                width: `${asset.value}%`,
                                backgroundColor: asset.color
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-gray-900 mb-2 text-sm flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Portfolio Strategy
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {customAllocation 
                      ? "You're using a custom allocation. Ensure it aligns with your investment goals."
                      : "A balanced approach combining growth potential with moderate risk management."
                    }
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Scenarios Tab */}
          <TabsContent value="scenarios">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 mb-8 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-gray-900 mb-6">Investment Scenarios Comparison</h3>
                <p className="text-gray-600 mb-6">
                  See how different return rates impact your final investment value after {investmentYears} years
                </p>
                <div className="space-y-4">
                  {scenarioData.map((scenario, index) => {
                    const maxValue = Math.max(...scenarioData.map(s => s.value));
                    const percentage = (scenario.value / maxValue) * 100;
                    const colors = ['#10b981', '#3b82f6', '#8b5cf6'];
                    
                    return (
                      <div key={index} className="space-y-2 group">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{scenario.scenario}</span>
                          <span className="text-gray-900 group-hover:scale-105 transition-transform inline-block">${scenario.value.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div 
                            className="h-4 rounded-full transition-all duration-700 hover:shadow-lg"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: colors[index]
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}</div>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                {scenarios.map((scenario, index) => {
                  const monthlyRate = scenario.rate / 100 / 12;
                  const months = investmentYears * 12;
                  const futureContrib = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
                  const futureInitial = investmentAmount * Math.pow(1 + monthlyRate, months);
                  const totalVal = futureInitial + futureContrib;
                  const totalInv = investmentAmount + (monthlyInvestment * months);
                  const returns = totalVal - totalInv;
                  const bgColors = ['from-green-50 to-green-100', 'from-blue-50 to-blue-100', 'from-purple-50 to-purple-100'];
                  const borderColors = ['hover:border-green-300', 'hover:border-blue-300', 'hover:border-purple-300'];
                  
                  return (
                    <Card key={index} className={`p-6 bg-gradient-to-br ${bgColors[index]} hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group border-2 ${borderColors[index]}`}>
                      <div className={`text-sm mb-2 ${index === 0 ? 'text-green-600' : index === 1 ? 'text-blue-600' : 'text-purple-600'} group-hover:scale-105 transition-transform inline-block`}>
                        {scenario.name}
                      </div>
                      <div className="text-gray-900 mb-2 group-hover:scale-105 transition-transform">${Math.round(totalVal).toLocaleString()}</div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>Invested: ${totalInv.toLocaleString()}</div>
                        <div className="text-green-600">Returns: ${Math.round(returns).toLocaleString()}</div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
