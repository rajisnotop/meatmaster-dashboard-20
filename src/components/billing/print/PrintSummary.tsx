interface PrintSummaryProps {
  totalExpenses: number;
  openingBalance: number;
  cashInCounter: number;
  netProfit: number;
}

const PrintSummary = ({ totalExpenses, openingBalance, cashInCounter, netProfit }: PrintSummaryProps) => `
  <div class="summary-section">
    <div class="summary-grid">
      <div class="summary-item">
        <div class="summary-label">Opening Balance</div>
        <div class="summary-value">${openingBalance.toLocaleString()}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">Total Expenses</div>
        <div class="summary-value">${totalExpenses.toLocaleString()}</div>
      </div>
      <div class="summary-item highlight">
        <div class="summary-label">Cash in Counter</div>
        <div class="summary-value">${cashInCounter.toLocaleString()}</div>
      </div>
      <div class="summary-item ${netProfit >= 0 ? 'profit' : 'loss'}">
        <div class="summary-label">Net Profit/Loss</div>
        <div class="summary-value">${netProfit.toLocaleString()}</div>
      </div>
    </div>
  </div>
`;

export default PrintSummary;