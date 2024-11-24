interface PrintProductsTableProps {
  productTotals: any[];
}

const PrintProductsTable = ({ productTotals }: PrintProductsTableProps) => `
  <div class="table-container">
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
        <tr class="totals-row">
          <td><strong>Total</strong></td>
          <td><strong>${productTotals.reduce((sum, p) => sum + p.quantity, 0).toFixed(2)}</strong></td>
          <td><strong>${productTotals.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</strong></td>
          <td><strong>${productTotals.reduce((sum, p) => sum + (p.paidWithQR || 0), 0).toLocaleString()}</strong></td>
          <td><strong>${productTotals.reduce((sum, p) => sum + (p.unpaid || 0), 0).toLocaleString()}</strong></td>
          <td><strong>${productTotals.reduce((sum, p) => sum + (p.unpaidToPaidQR || 0), 0).toLocaleString()}</strong></td>
        </tr>
      </tbody>
    </table>
  </div>
`;

export default PrintProductsTable;