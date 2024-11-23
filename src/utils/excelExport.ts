import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export const exportToExcel = (
  productTotals: any[],
  timeFilter: string,
  startDate: string | null,
  endDate: string | null,
  netAmount: number,
  totalExpenses: number,
  openingBalance: number
) => {
  const wb = XLSX.utils.book_new();
  
  // Create the main data array for products
  const data = [
    ['Products', 'Quantity Sold', 'Total Sales (NPR)', 'Paid with QR (NPR)', 'Unpaid Amount (NPR)', 'Unpaid to Paid with QR (NPR)'],
    ...productTotals.map(product => [
      product.name,
      product.quantity,
      product.amount,
      product.paidWithQR,
      product.unpaid,
      product.unpaidToPaidQR
    ])
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Add summary section
  const summaryStartRow = data.length + 2;
  
  // Helper function to create cell reference
  const cellRef = (row: number, col: number) => XLSX.utils.encode_cell({r: row, c: col});

  // Add summary rows
  ws[cellRef(summaryStartRow, 0)] = { v: 'Opening Balance', t: 's', s: { font: { bold: true } } };
  ws[cellRef(summaryStartRow, 1)] = { v: openingBalance, t: 'n', z: '#,##0' };

  ws[cellRef(summaryStartRow + 1, 0)] = { v: 'Total Expenses', t: 's', s: { font: { bold: true } } };
  ws[cellRef(summaryStartRow + 1, 1)] = { v: totalExpenses, t: 'n', z: '#,##0' };

  const cashInCounter = productTotals.reduce((sum, p) => sum + p.amount, 0) - totalExpenses + openingBalance;
  ws[cellRef(summaryStartRow + 2, 0)] = { v: 'Cash in Counter', t: 's', s: { font: { bold: true } } };
  ws[cellRef(summaryStartRow + 2, 1)] = { v: cashInCounter, t: 'n', z: '#,##0' };

  ws[cellRef(summaryStartRow + 3, 0)] = { v: 'Net Amount', t: 's', s: { font: { bold: true, color: { rgb: netAmount >= 0 ? "008000" : "FF0000" } } } };
  ws[cellRef(summaryStartRow + 3, 1)] = { v: netAmount, t: 'n', z: '#,##0' };

  // Add footer
  const footerRow = summaryStartRow + 5;
  ws[cellRef(footerRow, 0)] = { 
    v: `Generated on ${format(new Date(), 'MMMM dd, yyyy HH:mm:ss')}`,
    t: 's',
    s: { font: { italic: true } }
  };
  ws[cellRef(footerRow + 1, 0)] = { 
    v: 'Neelkantha Meat Shop - Financial Report',
    t: 's',
    s: { font: { bold: true } }
  };

  // Merge cells for footer
  ws['!merges'] = [
    { s: { r: footerRow, c: 0 }, e: { r: footerRow, c: 5 } },
    { s: { r: footerRow + 1, c: 0 }, e: { r: footerRow + 1, c: 5 } }
  ];

  // Set column widths
  ws['!cols'] = [
    { wch: 30 }, // Products
    { wch: 15 }, // Quantity
    { wch: 20 }, // Sales
    { wch: 20 }, // QR
    { wch: 20 }, // Unpaid
    { wch: 25 }, // Unpaid to QR
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Billing Summary');

  // Generate filename
  let fileName = `neelkantha-meat-shop-billing`;
  if (timeFilter === "date-range" && startDate && endDate) {
    fileName += `-${format(new Date(startDate), 'yyyy-MM-dd')}-to-${format(new Date(endDate), 'yyyy-MM-dd')}`;
  } else {
    fileName += `-${timeFilter}-${format(new Date(), 'yyyy-MM-dd')}`;
  }
  fileName += '.xlsx';

  // Write file
  XLSX.writeFile(wb, fileName);
};