import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { TrendingUp, TrendingDown, DollarSign, Wallet, PieChart, Edit, Save, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "./ui/sonner";
import { PrintReport } from "./PrintReport";
import { PrintAllReports } from "./PrintAllReports";

interface DashboardProps {
  userName?: string;
}

export function Dashboard({ userName }: DashboardProps = {}) {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("wealthwise_welcome_shown");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      localStorage.setItem("wealthwise_welcome_shown", "true");
      setTimeout(() => setShowWelcome(false), 5000);
    }
  }, []);
  const [isEditing, setIsEditing] = useState(false);
  
  // Editable asset allocation with dollar amounts
  const [assets, setAssets] = useState({
    stocks: 28125,    // 45% of 62,500
    bonds: 15625,     // 25% of 62,500
    realEstate: 12500, // 20% of 62,500
    cash: 6250,       // 10% of 62,500
  });

  const totalPortfolio = assets.stocks + assets.bonds + assets.realEstate + assets.cash;
  const totalInvested = 55000;
  const totalReturns = totalPortfolio - totalInvested;
  const monthlyReturns = 2300;
  const returnPercentage = ((totalReturns / totalInvested) * 100).toFixed(1);

  const assetAllocation = [
    { name: "Stocks", value: assets.stocks, color: "#3b82f6", percentage: ((assets.stocks / totalPortfolio) * 100).toFixed(1) },
    { name: "Bonds", value: assets.bonds, color: "#10b981", percentage: ((assets.bonds / totalPortfolio) * 100).toFixed(1) },
    { name: "Real Estate", value: assets.realEstate, color: "#f59e0b", percentage: ((assets.realEstate / totalPortfolio) * 100).toFixed(1) },
    { name: "Cash", value: assets.cash, color: "#6366f1", percentage: ((assets.cash / totalPortfolio) * 100).toFixed(1) },
  ];

  const handleAssetChange = (asset: string, value: number) => {
    setAssets({ ...assets, [asset]: Math.max(0, value) });
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Portfolio updated successfully!");
  };

  const stats = [
    {
      title: "Total Portfolio Value",
      value: `$${totalPortfolio.toLocaleString()}`,
      change: `+${returnPercentage}%`,
      isPositive: totalReturns >= 0,
      icon: Wallet,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Monthly Returns",
      value: `$${monthlyReturns.toLocaleString()}`,
      change: "+3.8%",
      isPositive: true,
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Invested",
      value: `$${totalInvested.toLocaleString()}`,
      change: "Base amount",
      isPositive: true,
      icon: DollarSign,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Total Returns",
      value: `$${totalReturns.toLocaleString()}`,
      change: `+${returnPercentage}%`,
      isPositive: totalReturns >= 0,
      icon: PieChart,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-gray-900 dark:text-white mb-2">Financial Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400">Track your investments and monitor your financial health</p>
          </div>
          <div className="flex gap-3">
            <PrintReport
              title="Financial Dashboard Report"
              data={{
                totalAssets: totalPortfolio,
                monthlyIncome: 8000,
                monthlySavings: monthlyReturns,
                investmentGrowth: parseFloat(returnPercentage),
              }}
              reportType="dashboard"
              userName={userName}
            />
            <PrintAllReports
              userName={userName}
              dashboardData={{
                totalAssets: totalPortfolio,
                monthlyIncome: 8000,
                monthlySavings: monthlyReturns,
                investmentGrowth: parseFloat(returnPercentage),
              }}
            />
          </div>
        </div>

        {/* Welcome Banner */}
        {showWelcome && (
          <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8" />
              <div>
                <h3 className="text-white mb-1">Welcome to Your Financial Dashboard!</h3>
                <p className="text-blue-100 text-sm">
                  Start by editing your portfolio allocation and tracking your investments.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 mb-2">Investment Dashboard</h2>
            <p className="text-gray-600">Track and manage your portfolio</p>
          </div>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="gap-2"
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            {isEditing ? "Save Changes" : "Edit Portfolio"}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group border-2 hover:border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                </div>
                <div className={`flex items-center gap-1 ${stat.isPositive ? "text-green-600" : "text-red-600"} group-hover:scale-110 transition-transform`}>
                  {stat.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm">{stat.change}</span>
                </div>
              </div>
              <div className="text-gray-600 text-sm mb-1">{stat.title}</div>
              <div className="text-gray-900 group-hover:text-blue-600 transition-colors">{stat.value}</div>
            </Card>
          ))}
        </div>

        {/* Asset Allocation */}
        <Card className="p-6 mb-8 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900">Asset Allocation</h3>
            <div className="text-sm text-gray-600">
              Total: <span className="text-gray-900">${totalPortfolio.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-4">
            {assetAllocation.map((asset, index) => (
              <div key={index} className="space-y-2 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded shadow-sm group-hover:scale-125 transition-transform" 
                      style={{ backgroundColor: asset.color }}
                    ></div>
                    <span className="text-gray-900 group-hover:text-blue-600 transition-colors">{asset.name}</span>
                  </div>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">$</span>
                      <Input
                        type="number"
                        value={asset.value}
                        onChange={(e) => handleAssetChange(asset.name.toLowerCase().replace(" ", ""), Number(e.target.value))}
                        className="w-32 text-right"
                      />
                    </div>
                  ) : (
                    <div className="text-right">
                      <div className="text-gray-900 group-hover:scale-110 transition-transform inline-block">
                        ${asset.value.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">{asset.percentage}%</div>
                    </div>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-3 rounded-full transition-all duration-700 hover:shadow-lg" 
                    style={{ 
                      width: `${asset.percentage}%`,
                      backgroundColor: asset.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">
              {isEditing 
                ? "Edit your asset allocation by entering dollar amounts for each category."
                : "Your portfolio is diversified across multiple asset classes for optimal risk management."
              }
            </p>
          </div>
        </Card>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Year-to-Date Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">January</span>
                <span className="text-green-600">+5.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">February</span>
                <span className="text-green-600">+3.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">March</span>
                <span className="text-red-600">-1.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">April</span>
                <span className="text-green-600">+4.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">May</span>
                <span className="text-green-600">+3.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">June</span>
                <span className="text-green-600">+2.9%</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Recent Contributions</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">January 2024</span>
                <span className="text-gray-900">$1,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">February 2024</span>
                <span className="text-gray-900">$1,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">March 2024</span>
                <span className="text-gray-900">$2,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">April 2024</span>
                <span className="text-gray-900">$1,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">May 2024</span>
                <span className="text-gray-900">$1,800</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">June 2024</span>
                <span className="text-gray-900">$1,500</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
