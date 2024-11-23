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
          
          @page {
            size: A4;
            margin: 20px;
          }
          
          body {
            font-family: 'Inter', sans-serif;
            padding: 20px;
            color: #1a1a1a;
            line-height: 1.4;
            background: #ffffff;
            max-width: 100%;
            margin: 0;
          }
          
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding: 20px;
            background: linear-gradient(to right, #4f46e5, #7c3aed);
            margin: -20px -20px 20px -20px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
          }
          
          .logo-container {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: contain;
            background: white;
            padding: 5px;
          }
          
          .title-container {
            text-align: left;
          }
          
          .company-name {
            font-size: 24px;
            font-weight: 700;
            margin: 0;
          }
          
          .report-type {
            font-size: 16px;
            opacity: 0.9;
            margin: 5px 0;
          }
          
          .date {
            font-size: 14px;
            opacity: 0.8;
          }
          
          .section {
            margin-bottom: 20px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }
          
          .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
          }
          
          .metric-card {
            background: white;
            padding: 12px;
            border-radius: 6px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }
          
          .metric-title {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 5px;
          }
          
          .metric-value {
            font-size: 16px;
            font-weight: 600;
            color: #0f172a;
          }
          
          table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 12px;
            background: white;
            border-radius: 6px;
            overflow: hidden;
          }
          
          th, td {
            padding: 8px;
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
          
          .summary-section {
            margin-top: 20px;
            padding: 15px;
            background: #f1f5f9;
            border-radius: 8px;
          }
          
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
          }
          
          .summary-item {
            background: white;
            padding: 12px;
            border-radius: 6px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .section {
              break-inside: avoid;
              page-break-inside: avoid;
            }
            
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-container">
            <img src="https://i.imgur.com/F4KFQkf.png" alt="Logo" class="logo">
            <div class="title-container">
              <h1 class="company-name">Neelkantha Meat Shop</h1>
              <p class="report-type">Billing Report</p>
              <p class="date">${format(new Date(), "MMMM dd, yyyy")}</p>
            </div>
          </div>
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
