import { format } from "date-fns";
import { createExcelStyles } from "./excelStyles";

export const generateExcelTemplate = (
  productTotals: any[],
  timeFilter: string,
  startDate: string | null,
  endDate: string | null,
  netAmount: number,
  totalExpenses: number,
  openingBalance: number,
  suppliesExpenses: number,
  cashInCounter: number,
  cashInBank: number
) => {
  const currentDate = new Date();
  const dateRange = timeFilter === "date-range" && startDate && endDate
    ? `${format(new Date(startDate), 'MMM dd, yyyy')} to ${format(new Date(endDate), 'MMM dd, yyyy')}`
    : `${format(currentDate, 'MMMM dd, yyyy')}`;

  const totals = productTotals.reduce(
    (acc, curr) => ({
      quantity: acc.quantity + curr.quantity,
      sales: acc.sales + curr.amount,
      paidQR: acc.paidQR + (curr.paidWithQR || 0),
      unpaid: acc.unpaid + (curr.unpaid || 0),
      unpaidQR: acc.unpaidQR + (curr.unpaidToPaidQR || 0)
    }),
    { quantity: 0, sales: 0, paidQR: 0, unpaid: 0, unpaidQR: 0 }
  );

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Billing Report - ${format(currentDate, "MM/dd/yyyy")}</title>
        ${createExcelStyles()}
      </head>
      <body>
        <div class="header">
          <div class="logo-section">
            <img src="https://i.imgur.com/2IkqsVA.png" alt="Logo" class="logo">
            <div class="company-info">
              <h1 class="company-title">Neelkantha Meat Shop</h1>
              <p class="company-subtitle">Quality Meat Products</p>
            </div>
          </div>
          <div class="date-section">
            <h2 class="date-label">Sales Report</h2>
            <p class="date-value">${dateRange}</p>
            <p class="time-value">${format(currentDate, "hh:mm a")}</p>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity Sold</th>
                <th>Total Sales (NPR)</th>
                <th>Paid with QR (NPR)</th>
                <th>Unpaid to Paid (NPR)</th>
                <th>Unpaid to Paid QR (NPR)</th>
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
              <tr class="totals-row">
                <td><strong>Total</strong></td>
                <td><strong>${totals.quantity.toFixed(2)}</strong></td>
                <td><strong>${totals.sales.toLocaleString()}</strong></td>
                <td><strong>${totals.paidQR.toLocaleString()}</strong></td>
                <td><strong>${totals.unpaid.toLocaleString()}</strong></td>
                <td><strong>${totals.unpaidQR.toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="summary-section">
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-label">Opening Balance</div>
              <div class="summary-value">NPR ${openingBalance.toLocaleString()}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Total Expenses</div>
              <div class="summary-value">NPR ${totalExpenses.toLocaleString()}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Supplies Expenses</div>
              <div class="summary-value">NPR ${suppliesExpenses.toLocaleString()}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Cash in Counter</div>
              <div class="summary-value">NPR ${cashInCounter.toLocaleString()}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Cash in Bank</div>
              <div class="summary-value">NPR ${cashInBank.toLocaleString()}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Net Amount</div>
              <div class="summary-value">NPR ${netAmount.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Generated on ${format(currentDate, "MMMM dd, yyyy 'at' hh:mm a")}</p>
          <p>Neelkantha Meat Shop | <a href="https://neelkanthameat.netlify.com" class="website">www.neelkanthameat.netlify.com</a></p>
        </div>
      </body>
    </html>
  `;
};
