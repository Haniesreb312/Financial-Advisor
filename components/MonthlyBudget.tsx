import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";
import { DollarSign, ShoppingCart, Home, Utensils, Car, Heart, Film, Plus, Trash2, PieChart } from "lucide-react";
import { toast } from "./ui/sonner";
import { PrintReport } from "./PrintReport";

interface Expense {
  id: string;
  category: string;
  amount: number;
  icon: any;
  color: string;
}

interface MonthlyBudgetProps {
  userName?: string;
}

export function MonthlyBudget({ userName }: MonthlyBudgetProps = {}) {
  const [monthlySalary, setMonthlySalary] = useState(5000);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", category: "Food & Dining", amount: 800, icon: Utensils, color: "#f59e0b" },
    { id: "2", category: "Shopping", amount: 500, icon: ShoppingCart, color: "#3b82f6" },
    { id: "3", category: "Bills & Utilities", amount: 600, icon: Home, color: "#10b981" },
    { id: "4", category: "Transportation", amount: 400, icon: Car, color: "#8b5cf6" },
    { id: "5", category: "Healthcare", amount: 200, icon: Heart, color: "#ec4899" },
    { id: "6", category: "Entertainment", amount: 300, icon: Film, color: "#06b6d4" },
  ]);
  const [newExpenseCategory, setNewExpenseCategory] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState(0);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = monthlySalary - totalExpenses;
  const savingsRate = monthlySalary > 0 ? ((remainingBudget / monthlySalary) * 100).toFixed(1) : 0;

  const handleAddExpense = () => {
    if (!newExpenseCategory || newExpenseAmount <= 0) {
      toast.error("Please enter a valid category and amount");
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      category: newExpenseCategory,
      amount: newExpenseAmount,
      icon: DollarSign,
      color: "#6366f1",
    };

    setExpenses([...expenses, newExpense]);
    setNewExpenseCategory("");
    setNewExpenseAmount(0);
    toast.success("Expense added successfully");
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    toast.success("Expense removed");
  };

  const handleUpdateExpense = (id: string, amount: number) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, amount: Math.max(0, amount) } : expense
    ));
  };

  const expensesObject = expenses.reduce((acc, expense) => {
    acc[expense.category.toLowerCase().replace(/\s+/g, '-')] = expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <PieChart className="h-8 w-8 text-blue-600" />
                <h2 className="text-gray-900 dark:text-white">Monthly Budget Tracker</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Track where your salary goes each month</p>
            </div>
            <PrintReport
              title="Monthly Budget Report"
              data={{
                income: monthlySalary,
                expenses: expensesObject,
                totalExpenses,
                balance: remainingBudget,
                savingsRate: parseFloat(savingsRate.toString()),
              }}
              reportType="budget"
              userName={userName}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Salary Input */}
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-6 w-6" />
              <h3 className="text-white">Monthly Salary</h3>
            </div>
            <div className="space-y-2">
              <Input
                type="number"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(Number(e.target.value))}
                className="text-gray-900 text-center bg-white border-white"
              />
            </div>
            <div className="mt-4 text-blue-100 text-sm">Your total monthly income</div>
          </Card>

          {/* Total Expenses */}
          <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-red-200">
            <h3 className="text-gray-900 mb-4">Total Expenses</h3>
            <div className="text-red-600">${totalExpenses.toLocaleString()}</div>
            <div className="mt-4 text-sm text-gray-600">
              {monthlySalary > 0 && `${((totalExpenses / monthlySalary) * 100).toFixed(1)}% of income`}
            </div>
          </Card>

          {/* Remaining Budget */}
          <Card className={`p-6 hover:shadow-xl transition-all duration-300 border-2 ${remainingBudget >= 0 ? 'hover:border-green-200 bg-gradient-to-br from-green-50 to-green-100' : 'hover:border-red-200 bg-gradient-to-br from-red-50 to-red-100'}`}>
            <h3 className="text-gray-900 mb-4">Remaining Budget</h3>
            <div className={remainingBudget >= 0 ? "text-green-600" : "text-red-600"}>
              ${Math.abs(remainingBudget).toLocaleString()}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              {remainingBudget >= 0 ? `Savings Rate: ${savingsRate}%` : "Over budget!"}
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Expense List */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-6">Monthly Expenses</h3>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                  <div 
                    className="p-3 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${expense.color}20`, color: expense.color }}
                  >
                    <expense.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-gray-900 mb-2">{expense.category}</Label>
                    <Input
                      type="number"
                      value={expense.amount}
                      onChange={(e) => handleUpdateExpense(expense.id, Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-gray-900 mb-2">${expense.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">
                      {monthlySalary > 0 && `${((expense.amount / monthlySalary) * 100).toFixed(1)}%`}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add New Expense */}
            <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <h4 className="text-gray-900 mb-4 text-sm">Add New Expense</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Input
                    value={newExpenseCategory}
                    onChange={(e) => setNewExpenseCategory(e.target.value)}
                    placeholder="e.g., Gym Membership"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Amount ($)</Label>
                  <Input
                    type="number"
                    value={newExpenseAmount || ""}
                    onChange={(e) => setNewExpenseAmount(Number(e.target.value))}
                    placeholder="0"
                    className="mt-2"
                  />
                </div>
              </div>
              <Button onClick={handleAddExpense} className="w-full mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            </div>
          </Card>

          {/* Budget Visualization */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-6">Budget Breakdown</h3>
            
            {/* Pie Chart */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {(() => {
                    let cumulativePercent = 0;
                    return expenses.map((expense, index) => {
                      const percent = monthlySalary > 0 ? (expense.amount / monthlySalary) * 100 : 0;
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
                          fill={expense.color}
                          stroke="white"
                          strokeWidth="0.5"
                          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        />
                      );
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <div className="text-gray-900">{savingsRate}%</div>
                  <div className="text-sm text-gray-600">Savings</div>
                </div>
              </div>
            </div>

            {/* Expense Bars */}
            <div className="space-y-3">
              {expenses.map((expense) => {
                const percentage = monthlySalary > 0 ? (expense.amount / monthlySalary) * 100 : 0;
                return (
                  <div key={expense.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: expense.color }}
                        ></div>
                        <span className="text-gray-700">{expense.category}</span>
                      </div>
                      <span className="text-gray-900">${expense.amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: expense.color 
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Budget Status */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">
                {remainingBudget >= 0 
                  ? `Great! You're saving $${remainingBudget.toLocaleString()} per month (${savingsRate}% savings rate).`
                  : `Warning: You're over budget by $${Math.abs(remainingBudget).toLocaleString()}. Consider reducing expenses.`
                }
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
