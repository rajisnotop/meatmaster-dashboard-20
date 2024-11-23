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
          @page {
            size: A4;
            margin: 20px;
            background-color: #f0f8ff;
          }
          
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f0f8ff;
            line-height: 1.4;
            margin: 0;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }
          
          .logo-section {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .logo {
            width: 60px;
            height: 60px;
          }
          
          .company-title {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }
          
          .date-section {
            text-align: right;
          }
          
          .date-label {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }
          
          .date-value {
            font-size: 16px;
            margin: 5px 0 0 0;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            background-color: white;
          }
          
          th {
            background-color: black;
            color: white;
            padding: 8px;
            text-align: left;
            border: 1px solid black;
          }
          
          td {
            padding: 8px;
            border: 1px solid black;
          }
          
          .totals-section {
            width: 40%;
            margin-left: auto;
          }
          
          .totals-row {
            display: flex;
            justify-content: space-between;
            border: 1px solid black;
            margin-bottom: -1px;
            background-color: white;
          }
          
          .totals-label {
            padding: 8px;
            border-right: 1px solid black;
            width: 50%;
          }
          
          .totals-value {
            padding: 8px;
            width: 50%;
            text-align: left;
          }
          
          .footer {
            position: fixed;
            bottom: 20px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 14px;
          }
          
          .website {
            color: black;
            text-decoration: none;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              background-color: #f0f8ff !important;
            }
            
            th {
              background-color: black !important;
              color: white !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-section">
            <img src="/logo.png" alt="Logo" class="logo">
            <h1 class="company-title">Neelkantha<br>Meat Shop</h1>
          </div>
          <div class="date-section">
            <h2 class="date-label">Data</h2>
            <p class="date-value">${format(new Date(), "MM/dd/yyyy")}</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Sales</th>
              <th>Paid (QR)</th>
              <th>Unpaid to Paid</th>
              <th>Unpaid to Paid(QR)</th>
            </tr>
          </thead>
          <tbody>
            ${productTotals.map((product) => `
              <tr>
                <td>${product.name}</td>
                <td>${product.quantity.toFixed(2)}</td>
                <td>${product.amount.toLocaleString()}</td>
                <td>${(product.paidWithQR || 0).toLocaleString()}</td>
                <td>${(product.unpaid || 0).toLocaleString()}</td>
                <td>${(product.unpaidToPaidQR || 0).toLocaleString()}</td>
              </tr>
            `).join("")}
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>${productTotals.reduce((sum, p) => sum + p.quantity, 0).toFixed(2)}</strong></td>
              <td><strong>${productTotals.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</strong></td>
              <td><strong>${productTotals.reduce((sum, p) => sum + (p.paidWithQR || 0), 0).toLocaleString()}</strong></td>
              <td><strong>${productTotals.reduce((sum, p) => sum + (p.unpaid || 0), 0).toLocaleString()}</strong></td>
              <td><strong>${productTotals.reduce((sum, p) => sum + (p.unpaidToPaidQR || 0), 0).toLocaleString()}</strong></td>
            </tr>
          </tbody>
        </table>
        
        <div class="totals-section">
          <div class="totals-row">
            <div class="totals-label">Expenses</div>
            <div class="totals-value">${totalExpenses.toLocaleString()}</div>
          </div>
          <div class="totals-row">
            <div class="totals-label">Opening Balance</div>
            <div class="totals-value">${openingBalance.toLocaleString()}</div>
          </div>
          <div class="totals-row">
            <div class="totals-label">Cash in counter</div>
            <div class="totals-value">${cashInCounter.toLocaleString()}</div>
          </div>
          <div class="totals-row">
            <div class="totals-label">Net amount</div>
            <div class="totals-value">${netProfit.toLocaleString()}</div>
          </div>
        </div>
        
        <div class="footer">
          This file was generated on "${format(new Date(), "MM/dd/yyyy 'on' HH:mm")}"<br>
          Neelkantha Meat Shop | <a href="https://neelkanthameat.netlify.com" class="website">www.neelkanthameat.netlify.com</a>
        </div>
      </body>
    </html>
  `;
};

export default BillingPrintTemplate;