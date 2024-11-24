import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export const exportToExcel = (
  productTotals: any[],
  timeFilter: string,
  startDate: string | null,
  endDate: string | null,
  netAmount: number,
  totalExpenses: number,
  openingBalance: number,
  suppliesExpenses: number = 0,
  cashInCounter: number = 0,
  cashInBank: number = 0
) => {
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  
  // Prepare data for the main table
  const tableData = productTotals.map(product => ({
    'Product Name': product.name,
    'Quantity Sold': product.quantity.toFixed(2),
    'Total Sales (NPR)': product.amount,
    'Paid with QR (NPR)': product.paidWithQR || 0,
    'Unpaid to Paid (NPR)': product.unpaid || 0,
    'Unpaid to Paid QR (NPR)': product.unpaidToPaidQR || 0
  }));

  // Calculate totals
  const totals = productTotals.reduce((acc, curr) => ({
    quantity: acc.quantity + curr.quantity,
    sales: acc.sales + curr.amount,
    paidQR: acc.paidQR + (curr.paidWithQR || 0),
    unpaid: acc.unpaid + (curr.unpaid || 0),
    unpaidQR: acc.unpaidQR + (curr.unpaidToPaidQR || 0)
  }), { quantity: 0, sales: 0, paidQR: 0, unpaid: 0, unpaidQR: 0 });

  // Add totals row
  tableData.push({
    'Product Name': 'TOTAL',
    'Quantity Sold': totals.quantity.toFixed(2),
    'Total Sales (NPR)': totals.sales,
    'Paid with QR (NPR)': totals.paidQR,
    'Unpaid to Paid (NPR)': totals.unpaid,
    'Unpaid to Paid QR (NPR)': totals.unpaidQR
  });

  // Add summary data
  const summaryData = [
    ['Financial Summary', ''],
    ['Opening Balance', openingBalance],
    ['Total Expenses', totalExpenses],
    ['Supplies Expenses', suppliesExpenses],
    ['Cash in Counter', cashInCounter],
    ['Cash in Bank', cashInBank],
    ['Net Amount', netAmount]
  ];

  // Create worksheets
  const ws1 = XLSX.utils.json_to_sheet(tableData);
  const ws2 = XLSX.utils.aoa_to_sheet(summaryData);

  // Add worksheets to workbook
  XLSX.utils.book_append_sheet(wb, ws1, 'Sales Report');
  XLSX.utils.book_append_sheet(wb, ws2, 'Financial Summary');

  // Generate filename based on date range
  const fileName = `neelkantha-meat-shop-billing${
    timeFilter === "date-range" && startDate && endDate 
      ? `-${format(new Date(startDate), 'yyyy-MM-dd')}-to-${format(new Date(endDate), 'yyyy-MM-dd')}` 
      : `-${timeFilter}-${format(new Date(), 'yyyy-MM-dd')}`
  }.xlsx`;

  // Write and download file
  XLSX.writeFile(wb, fileName);
};