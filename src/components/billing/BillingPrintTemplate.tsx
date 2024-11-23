import { format } from "date-fns";

interface BillingPrintTemplateProps {
  productTotals: any[];
  type: "all" | "selected";
  overallTotals: {
    sales: number;
    paidWithQR: number;
    unpaid: number;
    unpaidToPaidQR: number;
  };
  totalExpenses: number;
  openingBalance: number;
  netProfit: number;
}

const BillingPrintTemplate = ({
  productTotals,
  type,
  overallTotals,
  totalExpenses,
  openingBalance,
  netProfit
}: BillingPrintTemplateProps) => {
  const cashInCounter = (overallTotals.sales || 0) - (totalExpenses || 0) + (openingBalance || 0);
  
  return `
    <html>
      <head>
        <title>Billing Report</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            padding: 40px;
            color: #1a1a1a;
            line-height: 1.6;
            background: #ffffff;
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
            background: linear-gradient(to right, #4f46e5, #7c3aed);
            margin: -40px -40px 40px -40px;
            padding: 40px;
            color: white;
          }
          
          .logo {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          
          .date {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
          }
          
          .section {
            margin-bottom: 30px;
            padding: 24px;
            background: #f8fafc;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
          }
          
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          
          .metric-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          
          .metric-title {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 8px;
          }
          
          .metric-value {
            font-size: 24px;
            font-weight: 600;
            color: #0f172a;
          }
          
          .metric-trend {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 13px;
            margin-top: 8px;
          }
          
          .trend-up { color: #22c55e; }
          .trend-down { color: #ef4444; }
          
          table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-top: 20px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          th, td {
            padding: 16px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
          }
          
          th {
            background: #f1f5f9;
            font-weight: 600;
            color: #334155;
            white-space: nowrap;
          }
          
          tr:last-child td {
            border-bottom: none;
          }
          
          tr:nth-child(even) {
            background: #f8fafc;
          }
          
          .summary-section {
            margin-top: 30px;
            padding: 24px;
            background: linear-gradient(to right, #f1f5f9, #e2e8f0);
            border-radius: 12px;
          }
          
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          }
          
          .summary-item {
            background: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          
          @media print {
            body {
              padding: 20px;
            }
            
            .header {
              margin: -20px -20px 30px -20px;
              padding: 30px;
            }
            
            .section {
              break-inside: avoid;
            }
            
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Billing Report</div>
          <div class="date">${format(new Date(), "MMMM dd, yyyy")}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Financial Overview</div>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-title">Total Sales</div>
              <div class="metric-value">NPR ${overallTotals.sales.toLocaleString()}</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Total Expenses</div>
              <div class="metric-value">NPR ${totalExpenses.toLocaleString()}</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Net Profit</div>
              <div class="metric-value ${netProfit >= 0 ? 'trend-up' : 'trend-down'}">
                NPR ${netProfit.toLocaleString()}
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Opening Balance</div>
              <div class="metric-value">NPR ${openingBalance.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Product Sales Analysis</div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Total Sales</th>
                ${type === "all" ? "<th>Digital Payments</th>" : ""}
                ${type === "all" ? "<th>Cash Payments</th>" : ""}
              </tr>
            </thead>
            <tbody>
              ${productTotals.map((product) => `
                <tr>
                  <td>${product.name}</td>
                  <td>${product.quantity.toFixed(2)}</td>
                  <td>NPR ${product.amount.toLocaleString()}</td>
                  ${type === "all" ? `<td>NPR ${(product.paidWithQR || 0).toLocaleString()}</td>` : ""}
                  ${type === "all" ? `<td>NPR ${(product.amount - (product.paidWithQR || 0)).toLocaleString()}</td>` : ""}
                </tr>
              `).join("")}
              <tr style="font-weight: 600; background: #f1f5f9;">
                <td>Total</td>
                <td>${productTotals.reduce((sum, p) => sum + p.quantity, 0).toFixed(2)}</td>
                <td>NPR ${productTotals.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</td>
                ${type === "all" ? `
                  <td>NPR ${productTotals.reduce((sum, p) => sum + (p.paidWithQR || 0), 0).toLocaleString()}</td>
                  <td>NPR ${productTotals.reduce((sum, p) => sum + (p.amount - (p.paidWithQR || 0)), 0).toLocaleString()}</td>
                ` : ""}
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="summary-section">
          <div class="section-title">Payment Summary</div>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="metric-title">Cash in Counter</div>
              <div class="metric-value ${cashInCounter >= 0 ? 'trend-up' : 'trend-down'}">
                NPR ${cashInCounter.toLocaleString()}
              </div>
            </div>
            <div class="summary-item">
              <div class="metric-title">Digital Payments</div>
              <div class="metric-value">
                NPR ${overallTotals.paidWithQR.toLocaleString()}
              </div>
            </div>
            <div class="summary-item">
              <div class="metric-title">Previously Unpaid</div>
              <div class="metric-value">
                NPR ${(overallTotals.unpaid + overallTotals.unpaidToPaidQR).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 40px; color: #64748b; font-size: 12px;">
          Generated on ${format(new Date(), "PPP")} at ${format(new Date(), "pp")}
        </div>
        
        <button onclick="window.print()" style="
          position: fixed;
          bottom: 20px;
          right: 20px;
          padding: 12px 24px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
        ">
          Print Report
        </button>
      </body>
    </html>
  `;
};

export default BillingPrintTemplate;