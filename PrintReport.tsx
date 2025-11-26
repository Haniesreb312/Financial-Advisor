import { useRef } from "react";
import { Button } from "./ui/button";
import { Printer } from "lucide-react";
import { toast } from "./ui/sonner";

interface PrintReportProps {
  title: string;
  data: any;
  reportType: "retirement" | "investment" | "savings" | "budget" | "dashboard" | "combined";
  userName?: string;
}

export function PrintReport({ title, data, reportType, userName }: PrintReportProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow pop-ups to print reports");
      return;
    }

    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - WealthWise Report</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #1f2937;
              padding: 40px;
              background: white;
            }
            
            .report-header {
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            
            .report-header h1 {
              color: #1f2937;
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 8px;
            }
            
            .report-header .subtitle {
              color: #6b7280;
              font-size: 14px;
            }
            
            .report-meta {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              padding: 15px;
              background: #f3f4f6;
              border-radius: 8px;
            }
            
            .report-meta-item {
              display: flex;
              flex-direction: column;
            }
            
            .report-meta-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 4px;
            }
            
            .report-meta-value {
              font-size: 14px;
              color: #1f2937;
              font-weight: 500;
            }
            
            .report-section {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            
            .report-section h2 {
              font-size: 20px;
              color: #1f2937;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 2px solid #e5e7eb;
            }
            
            .report-section h3 {
              font-size: 16px;
              color: #374151;
              margin-bottom: 12px;
              margin-top: 20px;
            }
            
            .data-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin-bottom: 20px;
            }
            
            .data-card {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 16px;
              background: #f9fafb;
            }
            
            .data-card-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 6px;
            }
            
            .data-card-value {
              font-size: 24px;
              color: #1f2937;
              font-weight: 700;
            }
            
            .data-card-value.success {
              color: #059669;
            }
            
            .data-card-value.warning {
              color: #d97706;
            }
            
            .data-card-value.danger {
              color: #dc2626;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            
            th {
              background: #f3f4f6;
              padding: 12px;
              text-align: left;
              font-weight: 600;
              font-size: 13px;
              color: #374151;
              border-bottom: 2px solid #e5e7eb;
            }
            
            td {
              padding: 12px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 14px;
            }
            
            tr:last-child td {
              border-bottom: none;
            }
            
            tr:hover {
              background: #f9fafb;
            }
            
            .summary-box {
              background: #eff6ff;
              border: 2px solid #3b82f6;
              border-radius: 8px;
              padding: 20px;
              margin-top: 20px;
            }
            
            .summary-box h3 {
              color: #1e40af;
              margin-bottom: 12px;
              margin-top: 0;
            }
            
            .summary-box p {
              color: #1f2937;
              margin-bottom: 8px;
            }
            
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
            }
            
            .logo {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 10px;
            }
            
            .logo-icon {
              width: 40px;
              height: 40px;
              background: #2563eb;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 20px;
            }
            
            .logo-text {
              font-size: 20px;
              font-weight: 700;
              color: #1f2937;
            }
            
            @media print {
              body {
                padding: 20px;
              }
              
              .no-print {
                display: none !important;
              }
              
              .page-break {
                page-break-after: always;
              }
            }
            
            .input-summary {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 20px;
            }
            
            .input-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .input-row:last-child {
              border-bottom: none;
            }
            
            .input-label {
              font-weight: 500;
              color: #6b7280;
            }
            
            .input-value {
              font-weight: 600;
              color: #1f2937;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <div class="footer">
            <p>This report was generated by WealthWise Advisors</p>
            <p>For informational purposes only. Not financial advice. Consult with a qualified financial advisor.</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    toast.success("Opening print preview...");
  };

  const renderRetirementReport = () => (
    <div ref={printRef}>
      <div className="report-header">
        <div className="logo">
          <div className="logo-icon">W</div>
          <div className="logo-text">WealthWise Advisors</div>
        </div>
        <h1>{title}</h1>
        <div className="subtitle">Comprehensive Retirement Planning Analysis</div>
      </div>

      <div className="report-meta">
        <div className="report-meta-item">
          <div className="report-meta-label">Generated For</div>
          <div className="report-meta-value">{userName || "User"}</div>
        </div>
        <div className="report-meta-item">
          <div className="report-meta-label">Report Date</div>
          <div className="report-meta-value">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
        </div>
        <div className="report-meta-item">
          <div className="report-meta-label">Report Time</div>
          <div className="report-meta-value">{new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
      </div>

      <div className="report-section">
        <h2>Input Parameters</h2>
        <div className="input-summary">
          <div className="input-row">
            <span className="input-label">Current Age</span>
            <span className="input-value">{data.currentAge} years</span>
          </div>
          <div className="input-row">
            <span className="input-label">Retirement Age</span>
            <span className="input-value">{data.retirementAge} years</span>
          </div>
          <div className="input-row">
            <span className="input-label">Current Savings</span>
            <span className="input-value">${data.currentSavings?.toLocaleString()}</span>
          </div>
          <div className="input-row">
            <span className="input-label">Monthly Contribution</span>
            <span className="input-value">${data.monthlyContribution?.toLocaleString()}</span>
          </div>
          <div className="input-row">
            <span className="input-label">Expected Return</span>
            <span className="input-value">{data.expectedReturn}%</span>
          </div>
          <div className="input-row">
            <span className="input-label">Retirement Goal</span>
            <span className="input-value">${data.retirementGoal?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="report-section">
        <h2>Retirement Projection Summary</h2>
        <div className="data-grid">
          <div className="data-card">
            <div className="data-card-label">Projected Total Value</div>
            <div className="data-card-value success">${data.results?.totalValue?.toLocaleString()}</div>
          </div>
          <div className="data-card">
            <div className="data-card-label">Total Contributions</div>
            <div className="data-card-value">${data.results?.totalContributions?.toLocaleString()}</div>
          </div>
          <div className="data-card">
            <div className="data-card-label">Investment Returns</div>
            <div className="data-card-value success">${data.results?.totalReturns?.toLocaleString()}</div>
          </div>
          <div className="data-card">
            <div className="data-card-label">Years to Retirement</div>
            <div className="data-card-value">{data.results?.yearsToRetirement} years</div>
          </div>
        </div>
      </div>

      {data.results?.milestones && data.results.milestones.length > 0 && (
        <div className="report-section">
          <h2>Retirement Milestones</h2>
          <table>
            <thead>
              <tr>
                <th>Milestone</th>
                <th>Your Age</th>
                <th>Projected Balance</th>
              </tr>
            </thead>
            <tbody>
              {data.results.milestones.map((milestone: any, index: number) => (
                <tr key={index}>
                  <td>{milestone.year}</td>
                  <td>{milestone.age} years</td>
                  <td>${milestone.value?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="summary-box">
        <h3>Retirement Goal Status</h3>
        {data.results?.onTrack ? (
          <p><strong>✓ On Track:</strong> You are projected to meet or exceed your retirement goal of ${data.retirementGoal?.toLocaleString()}.</p>
        ) : (
          <p><strong>⚠ Attention Needed:</strong> You are projected to have a shortfall of ${data.results?.shortfall?.toLocaleString()} from your retirement goal. Consider increasing your contributions or adjusting your retirement age.</p>
        )}
      </div>
    </div>
  );

  const renderInvestmentReport = () => (
    <div ref={printRef}>
      <div className="report-header">
        <div className="logo">
          <div className="logo-icon">W</div>
          <div className="logo-text">WealthWise Advisors</div>
        </div>
        <h1>{title}</h1>
        <div className="subtitle">Investment Portfolio Analysis & Projections</div>
      </div>

      <div className="report-meta">
        <div className="report-meta-item">
          <div className="report-meta-label">Generated For</div>
          <div className="report-meta-value">{userName || "User"}</div>
        </div>
        <div className="report-meta-item">
          <div className="report-meta-label">Report Date</div>
          <div className="report-meta-value">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
        </div>
        <div className="report-meta-item">
          <div className="report-meta-label">Report Time</div>
          <div className="report-meta-value">{new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
      </div>

      <div className="report-section">
        <h2>Investment Parameters</h2>
        <div className="input-summary">
          <div className="input-row">
            <span className="input-label">Initial Investment</span>
            <span className="input-value">${data.investmentAmount?.toLocaleString()}</span>
          </div>
          <div className="input-row">
            <span className="input-label">Monthly Investment</span>
            <span className="input-value">${data.monthlyInvestment?.toLocaleString()}</span>
          </div>
          <div className="input-row">
            <span className="input-label">Investment Period</span>
            <span className="input-value">{data.investmentYears} years</span>
          </div>
          <div className="input-row">
            <span className="input-label">Expected Annual Return</span>
            <span className="input-value">{data.expectedReturn}%</span>
          </div>
        </div>
      </div>

      {data.allocation && (
        <div className="report-section">
          <h2>Portfolio Allocation</h2>
          <table>
            <thead>
              <tr>
                <th>Asset Class</th>
                <th>Allocation</th>
              </tr>
            </thead>
            <tbody>
              {data.allocation.map((asset: any, index: number) => (
                <tr key={index}>
                  <td>{asset.name}</td>
                  <td>{asset.value}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.milestones && data.milestones.length > 0 && (
        <div className="report-section">
          <h2>Investment Growth Projections</h2>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Total Invested</th>
                <th>Investment Returns</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {data.milestones.map((milestone: any, index: number) => (
                <tr key={index}>
                  <td>Year {milestone.year}</td>
                  <td>${milestone.totalInvested?.toLocaleString()}</td>
                  <td>${milestone.totalReturns?.toLocaleString()}</td>
                  <td>${milestone.totalValue?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="summary-box">
        <h3>Investment Summary</h3>
        <p>Based on your investment plan, your portfolio is projected to grow significantly through compound returns and consistent contributions.</p>
        <p><strong>Key Insight:</strong> Regular monthly contributions and long-term holding can significantly impact your wealth accumulation.</p>
      </div>
    </div>
  );

  const renderSavingsReport = () => (
    <div ref={printRef}>
      <div className="report-header">
        <div className="logo">
          <div className="logo-icon">W</div>
          <div className="logo-text">WealthWise Advisors</div>
        </div>
        <h1>{title}</h1>
        <div className="subtitle">Savings Goal Planning Analysis</div>
      </div>

      <div className="report-meta">
        <div className="report-meta-item">
          <div className="report-meta-label">Generated For</div>
          <div className="report-meta-value">{userName || "User"}</div>
        </div>
        <div className="report-meta-item">
          <div className="report-meta-label">Report Date</div>
          <div className="report-meta-value">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
        </div>
        <div className="report-meta-item">
          <div className="report-meta-label">Report Time</div>
          <div className="report-meta-value">{new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
      </div>

      <div className="report-section">
        <h2>Savings Goal</h2>
        <div className="input-summary">
          <div className="input-row">
            <span className="input-label">Savings Goal</span>
            <span className="input-value">${data.savingsGoal?.toLocaleString()}</span>
          </div>
          <div className="input-row">
            <span className="input-label">Monthly Savings</span>
            <span className="input-value">${data.monthlySavings?.toLocaleString()}</span>
          </div>
          <div className="input-row">
            <span className="input-label">Current Savings</span>
            <span className="input-value">${data.currentSavings?.toLocaleString()}</span>
          </div>
          <div className="input-row">
            <span className="input-label">Interest Rate</span>
            <span className="input-value">{data.interestRate}%</span>
          </div>
        </div>
      </div>

      <div className="report-section">
        <h2>Projection Results</h2>
        <div className="data-grid">
          <div className="data-card">
            <div className="data-card-label">Months to Goal</div>
            <div className="data-card-value">{data.results?.monthsToGoal} months</div>
          </div>
          <div className="data-card">
            <div className="data-card-label">Years to Goal</div>
            <div className="data-card-value">{data.results?.yearsToGoal?.toFixed(1)} years</div>
          </div>
          <div className="data-card">
            <div className="data-card-label">Total Interest Earned</div>
            <div className="data-card-value success">${data.results?.totalInterest?.toLocaleString()}</div>
          </div>
          <div className="data-card">
            <div className="data-card-label">Target Date</div>
            <div className="data-card-value">{data.results?.targetDate}</div>
          </div>
        </div>
      </div>

      {data.results?.milestones && data.results.milestones.length > 0 && (
        <div className="report-section">
          <h2>Savings Milestones</h2>
          <table>
            <thead>
              <tr>
                <th>Milestone</th>
                <th>Months</th>
                <th>Projected Balance</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {data.results.milestones.map((milestone: any, index: number) => (
                <tr key={index}>
                  <td>{milestone.percentage}%</td>
                  <td>{milestone.months}</td>
                  <td>${milestone.balance?.toLocaleString()}</td>
                  <td>{milestone.percentage}% Complete</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="summary-box">
        <h3>Savings Plan Summary</h3>
        <p>By saving ${data.monthlySavings?.toLocaleString()} per month, you will reach your goal of ${data.savingsGoal?.toLocaleString()} in approximately {data.results?.yearsToGoal?.toFixed(1)} years.</p>
        <p><strong>Tip:</strong> Consider automating your savings to ensure consistent progress toward your goal.</p>
      </div>
    </div>
  );

  const renderBudgetReport = () => (
    <div ref={printRef}>
      <div className="report-header">
        <div className="logo">
          <div className="logo-icon">W</div>
          <div className="logo-text">WealthWise Advisors</div>
        </div>
        <h1>{title}</h1>
        <div className="subtitle">Monthly Budget Analysis</div>
      </div>

      <div className="report-meta">
        <div className="report-meta-item">
          <div className="report-meta-label">Generated For</div>
          <div className="report-meta-value">{userName || "User"}</div>
        </div>
        <div className="report-meta-item">
          <div className="report-meta-label">Report Date</div>
          <div className="report-meta-value">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
        </div>
        <div className="report-meta-item">
          <div className="report-meta-label">Report Time</div>
          <div className="report-meta-value">{new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
      </div>

      <div className="report-section">
        <h2>Income & Expenses Summary</h2>
        <div className="data-grid">
          <div className="data-card">
            <div className="data-card-label">Monthly Income</div>
            <div className="data-card-value success">${data.income?.toLocaleString()}</div>
          </div>
          <div className="data-card">
            <div className="data-card-label">Total Expenses</div>
            <div className="data-card-value danger">${data.totalExpenses?.toLocaleString()}</div>
          </div>
          <div className="data-card">
            <div className="data-card-label">Net Savings</div>
            <div className={`data-card-value ${data.balance >= 0 ? 'success' : 'danger'}`}>
              ${data.balance?.toLocaleString()}
            </div>
          </div>
          <div className="data-card">
            <div className="data-card-label">Savings Rate</div>
            <div className="data-card-value">{data.savingsRate?.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {data.expenses && (
        <div className="report-section">
          <h2>Expense Breakdown</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>% of Income</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.expenses).map(([key, value]: [string, any]) => (
                <tr key={key}>
                  <td style={{ textTransform: 'capitalize' }}>{key}</td>
                  <td>${value?.toLocaleString()}</td>
                  <td>{((value / data.income) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="summary-box">
        <h3>Budget Health Assessment</h3>
        {data.balance >= 0 ? (
          <p><strong>✓ Healthy Budget:</strong> You have a positive cash flow of ${data.balance?.toLocaleString()} per month, which represents a {data.savingsRate?.toFixed(1)}% savings rate.</p>
        ) : (
          <p><strong>⚠ Budget Deficit:</strong> Your expenses exceed your income by ${Math.abs(data.balance)?.toLocaleString()}. Consider reviewing your expenses to improve your financial health.</p>
        )}
        <p><strong>Recommendation:</strong> Aim for a savings rate of at least 20% of your income for long-term financial security.</p>
      </div>
    </div>
  );

  const renderDashboardReport = () => (
    <div ref={printRef}>
      <div className="report-header">
        <div className="logo">
          <div className="logo-icon">W</div>
          <div className="logo-text">WealthWise Advisors</div>
        </div>
        <h1>{title}</h1>
        <div className="subtitle">Comprehensive Financial Dashboard</div>
      </div>

      <div className="report-meta">
        <div className="report-meta-item">
          <div className="report-meta-label">Generated For</div>
          <div className="report-meta-value">{userName || "User"}</div>
        </div>
        <div className="report-meta-item">
          <div className="report-meta-label">Report Date</div>
          <div className="report-meta-value">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
        </div>
        <div className="report-meta-item">
          <div className="report-meta-label">Report Time</div>
          <div className="report-meta-value">{new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
      </div>

      <div className="report-section">
        <h2>Financial Overview</h2>
        <div className="data-grid">
          <div className="data-card">
            <div className="data-card-label">Total Assets</div>
            <div className="data-card-value success">${data.totalAssets?.toLocaleString()}</div>
          </div>
          <div className="data-card">
            <div className="data-card-label">Monthly Income</div>
            <div className="data-card-value success">${data.monthlyIncome?.toLocaleString()}</div>
          </div>
          <div className="data-card">
            <div className="data-card-label">Monthly Savings</div>
            <div className="data-card-value">${data.monthlySavings?.toLocaleString()}</div>
          </div>
          <div className="data-card">
            <div className="data-card-label">Investment Growth</div>
            <div className="data-card-value success">{data.investmentGrowth}%</div>
          </div>
        </div>
      </div>

      <div className="summary-box">
        <h3>Financial Health Summary</h3>
        <p>Your financial profile shows consistent growth and responsible money management practices.</p>
        <p><strong>Next Steps:</strong> Continue monitoring your budget and consider consulting with a financial advisor for personalized investment strategies.</p>
      </div>
    </div>
  );

  const renderCombinedReport = () => (
    <div ref={printRef}>
      <div className="report-header">
        <div className="logo">
          <div className="logo-icon">W</div>
          <div className="logo-text">WealthWise Advisors</div>
        </div>
        <h1>{title}</h1>
        <div className="subtitle">Complete Financial Analysis Report</div>
      </div>

      <div className="report-meta">
        <div className="report-meta-item">
          <div className="report-meta-label">Generated For</div>
          <div className="report-meta-value">{userName || "User"}</div>
        </div>
        <div className="report-meta-item">
          <div className="report-meta-label">Report Date</div>
          <div className="report-meta-value">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
        </div>
        <div className="report-meta-item">
          <div className="report-meta-label">Report Time</div>
          <div className="report-meta-value">{new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
      </div>

      {/* Dashboard Section */}
      {data.dashboard && (
        <div className="report-section">
          <h2>Financial Dashboard Overview</h2>
          <div className="data-grid">
            <div className="data-card">
              <div className="data-card-label">Total Portfolio Value</div>
              <div className="data-card-value success">${data.dashboard.totalAssets?.toLocaleString()}</div>
            </div>
            <div className="data-card">
              <div className="data-card-label">Monthly Income</div>
              <div className="data-card-value success">${data.dashboard.monthlyIncome?.toLocaleString()}</div>
            </div>
            <div className="data-card">
              <div className="data-card-label">Monthly Savings</div>
              <div className="data-card-value">${data.dashboard.monthlySavings?.toLocaleString()}</div>
            </div>
            <div className="data-card">
              <div className="data-card-label">Investment Growth</div>
              <div className="data-card-value success">{data.dashboard.investmentGrowth}%</div>
            </div>
          </div>
        </div>
      )}

      <div className="page-break"></div>

      {/* Retirement Planning Section */}
      {data.retirement && (
        <div className="report-section">
          <h2>Retirement Planning Analysis</h2>
          <div className="input-summary">
            <div className="input-row">
              <span className="input-label">Current Age</span>
              <span className="input-value">{data.retirement.currentAge} years</span>
            </div>
            <div className="input-row">
              <span className="input-label">Retirement Age</span>
              <span className="input-value">{data.retirement.retirementAge} years</span>
            </div>
            <div className="input-row">
              <span className="input-label">Current Savings</span>
              <span className="input-value">${data.retirement.currentSavings?.toLocaleString()}</span>
            </div>
            <div className="input-row">
              <span className="input-label">Monthly Contribution</span>
              <span className="input-value">${data.retirement.monthlyContribution?.toLocaleString()}</span>
            </div>
            <div className="input-row">
              <span className="input-label">Expected Return</span>
              <span className="input-value">{data.retirement.expectedReturn}%</span>
            </div>
            <div className="input-row">
              <span className="input-label">Retirement Goal</span>
              <span className="input-value">${data.retirement.retirementGoal?.toLocaleString()}</span>
            </div>
          </div>

          <div className="data-grid">
            <div className="data-card">
              <div className="data-card-label">Projected Total Value</div>
              <div className="data-card-value success">${data.retirement.results?.totalValue?.toLocaleString()}</div>
            </div>
            <div className="data-card">
              <div className="data-card-label">Total Contributions</div>
              <div className="data-card-value">${data.retirement.results?.totalContributions?.toLocaleString()}</div>
            </div>
            <div className="data-card">
              <div className="data-card-label">Investment Returns</div>
              <div className="data-card-value success">${data.retirement.results?.totalReturns?.toLocaleString()}</div>
            </div>
            <div className="data-card">
              <div className="data-card-label">Years to Retirement</div>
              <div className="data-card-value">{data.retirement.results?.yearsToRetirement} years</div>
            </div>
          </div>
        </div>
      )}

      <div className="page-break"></div>

      {/* Investment Planning Section */}
      {data.investment && (
        <div className="report-section">
          <h2>Investment Analysis</h2>
          <div className="input-summary">
            <div className="input-row">
              <span className="input-label">Initial Investment</span>
              <span className="input-value">${data.investment.initialInvestment?.toLocaleString()}</span>
            </div>
            <div className="input-row">
              <span className="input-label">Monthly Contribution</span>
              <span className="input-value">${data.investment.monthlyContribution?.toLocaleString()}</span>
            </div>
            <div className="input-row">
              <span className="input-label">Investment Period</span>
              <span className="input-value">{data.investment.years} years</span>
            </div>
            <div className="input-row">
              <span className="input-label">Expected Return</span>
              <span className="input-value">{data.investment.returnRate}%</span>
            </div>
          </div>

          <div className="data-grid">
            <div className="data-card">
              <div className="data-card-label">Future Value</div>
              <div className="data-card-value success">${data.investment.results?.futureValue?.toLocaleString()}</div>
            </div>
            <div className="data-card">
              <div className="data-card-label">Total Invested</div>
              <div className="data-card-value">${data.investment.results?.totalInvested?.toLocaleString()}</div>
            </div>
            <div className="data-card">
              <div className="data-card-label">Investment Gains</div>
              <div className="data-card-value success">${data.investment.results?.totalGains?.toLocaleString()}</div>
            </div>
            <div className="data-card">
              <div className="data-card-label">ROI</div>
              <div className="data-card-value success">{data.investment.results?.roi?.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      )}

      <div className="page-break"></div>

      {/* Savings Planning Section */}
      {data.savings && (
        <div className="report-section">
          <h2>Savings Growth Analysis</h2>
          <div className="input-summary">
            <div className="input-row">
              <span className="input-label">Savings Goal</span>
              <span className="input-value">${data.savings.savingsGoal?.toLocaleString()}</span>
            </div>
            <div className="input-row">
              <span className="input-label">Initial Amount</span>
              <span className="input-value">${data.savings.initialAmount?.toLocaleString()}</span>
            </div>
            <div className="input-row">
              <span className="input-label">Monthly Savings</span>
              <span className="input-value">${data.savings.monthlySavings?.toLocaleString()}</span>
            </div>
            <div className="input-row">
              <span className="input-label">Time Period</span>
              <span className="input-value">{data.savings.years} years</span>
            </div>
            <div className="input-row">
              <span className="input-label">Interest Rate</span>
              <span className="input-value">{data.savings.interestRate}%</span>
            </div>
          </div>

          <div className="data-grid">
            <div className="data-card">
              <div className="data-card-label">Final Amount</div>
              <div className="data-card-value success">${data.savings.results?.finalAmount?.toLocaleString()}</div>
            </div>
            <div className="data-card">
              <div className="data-card-label">Total Saved</div>
              <div className="data-card-value">${data.savings.results?.totalSaved?.toLocaleString()}</div>
            </div>
            <div className="data-card">
              <div className="data-card-label">Interest Earned</div>
              <div className="data-card-value success">${data.savings.results?.interestEarned?.toLocaleString()}</div>
            </div>
            <div className="data-card">
              <div className="data-card-label">Goal Achievement</div>
              <div className="data-card-value">{data.savings.results?.goalAchievement?.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      )}

      <div className="page-break"></div>

      {/* Budget Section */}
      {data.budget && (
        <div className="report-section">
          <h2>Monthly Budget Analysis</h2>
          <div className="input-summary">
            <div className="input-row">
              <span className="input-label">Monthly Income</span>
              <span className="input-value">${data.budget.monthlyIncome?.toLocaleString()}</span>
            </div>
            <div className="input-row">
              <span className="input-label">Total Expenses</span>
              <span className="input-value">${data.budget.totalExpenses?.toLocaleString()}</span>
            </div>
            <div className="input-row">
              <span className="input-label">Net Savings</span>
              <span className="input-value">${data.budget.netSavings?.toLocaleString()}</span>
            </div>
            <div className="input-row">
              <span className="input-label">Savings Rate</span>
              <span className="input-value">{data.budget.savingsRate}%</span>
            </div>
          </div>

          {data.budget.expenses && data.budget.expenses.length > 0 && (
            <div>
              <h3 style={{ marginTop: "20px", marginBottom: "10px", color: "#1e40af" }}>Expense Breakdown</h3>
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>% of Income</th>
                  </tr>
                </thead>
                <tbody>
                  {data.budget.expenses.map((expense: any, index: number) => (
                    <tr key={index}>
                      <td>{expense.category}</td>
                      <td>${expense.amount?.toLocaleString()}</td>
                      <td>{expense.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="summary-box">
        <h3>Comprehensive Financial Summary</h3>
        <p>This complete financial report provides an overview of your retirement planning, investment strategy, savings goals, and monthly budget.</p>
        <p><strong>Next Steps:</strong> Review each section carefully and consider consulting with a financial advisor to optimize your financial strategy and achieve your goals.</p>
      </div>
    </div>
  );

  const renderReport = () => {
    switch (reportType) {
      case "retirement":
        return renderRetirementReport();
      case "investment":
        return renderInvestmentReport();
      case "savings":
        return renderSavingsReport();
      case "budget":
        return renderBudgetReport();
      case "dashboard":
        return renderDashboardReport();
      case "combined":
        return renderCombinedReport();
      default:
        return null;
    }
  };

  return (
    <>
      <Button
        onClick={handlePrint}
        className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Printer className="h-4 w-4" />
        Print Report
      </Button>
      <div style={{ display: "none" }}>{renderReport()}</div>
    </>
  );
}
