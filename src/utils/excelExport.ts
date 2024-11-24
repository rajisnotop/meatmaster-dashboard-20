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
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Create header rows
  const headerRows = [
    ["Neelkantha Meat Shop"],
    ["Bill"],
    [`Date: ${format(new Date(), 'yyyy-MM-dd')}`],
    [],
    ["S.N", "Product", "Quantity", "Sales", "Paid (QR)", "Unpaid to Paid", "Unpaid to Paid(QR)"]
  ];

  // Prepare product data
  const productData = productTotals.map((product, index) => [
    index + 1,
    product.name,
    product.quantity.toFixed(2),
    product.amount,
    product.paidWithQR || 0,
    product.unpaid || 0,
    product.unpaidToPaidQR || 0
  ]);

  // Calculate totals
  const totals = productTotals.reduce((acc, curr) => ({
    quantity: acc.quantity + curr.quantity,
    sales: acc.sales + curr.amount,
    paidQR: acc.paidQR + (curr.paidWithQR || 0),
    unpaid: acc.unpaid + (curr.unpaid || 0),
    unpaidQR: acc.unpaidQR + (curr.unpaidToPaidQR || 0)
  }), { quantity: 0, sales: 0, paidQR: 0, unpaid: 0, unpaidQR: 0 });

  // Add totals row
  const totalsRow = [
    "Total",
    "",
    totals.quantity.toFixed(2),
    totals.sales,
    totals.paidQR,
    totals.unpaid,
    totals.unpaidQR
  ];

  // Add summary section
  const summaryRows = [
    ["", "", "", "", "Expenses", ""],
    ["", "", "", "", "Opening Balance", openingBalance],
    ["", "", "", "", "Cash in Counter", totals.sales - totalExpenses + openingBalance],
    ["", "", "", "", "Net Amount", netAmount]
  ];

  // Combine all rows
  const allRows = [
    ...headerRows,
    ...productData,
    totalsRow,
    [],
    ...summaryRows
  ];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(allRows);

  // Set column widths
  const colWidths = [
    { wch: 5 },  // S.N
    { wch: 20 }, // Product
    { wch: 10 }, // Quantity
    { wch: 12 }, // Sales
    { wch: 12 }, // Paid QR
    { wch: 15 }, // Unpaid to Paid
    { wch: 18 }  // Unpaid to Paid QR
  ];
  ws['!cols'] = colWidths;

  // Style the header
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Merge first row for shop name
    { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }  // Merge second row for "Bill"
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Bill');

  // Generate filename
  const fileName = `neelkantha-meat-shop-bill${
    timeFilter === "date-range" && startDate && endDate 
      ? `-${format(new Date(startDate), 'yyyy-MM-dd')}-to-${format(new Date(endDate), 'yyyy-MM-dd')}` 
      : `-${timeFilter}-${format(new Date(), 'yyyy-MM-dd')}`
  }.xlsx`;

  // Write and download file
  XLSX.writeFile(wb, fileName);
};