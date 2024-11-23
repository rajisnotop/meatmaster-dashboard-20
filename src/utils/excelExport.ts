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
  
  // Create header with logo and title
  const headerData = [
    ['Neelkantha Meat Shop', '', '', '', 'Data'],
    ['', '', '', '', `Date: ${format(new Date(), 'MM/dd/yyyy')}`],
    [''], // Empty row for spacing
  ];

  // Create the table headers
  const tableHeaders = [
    ['Product', 'Quantity', 'Sales', 'Paid (QR)', 'Unpaid to Paid', 'Unpaid to Paid(QR)']
  ];

  // Create the product rows
  const productRows = productTotals.map(product => [
    product.name,
    product.quantity,
    product.amount,
    product.paidWithQR || 0,
    product.unpaid || 0,
    product.unpaidToPaidQR || 0
  ]);

  // Calculate totals row
  const totalsRow = [
    'Total',
    productTotals.reduce((sum, p) => sum + p.quantity, 0),
    productTotals.reduce((sum, p) => sum + p.amount, 0),
    productTotals.reduce((sum, p) => sum + (p.paidWithQR || 0), 0),
    productTotals.reduce((sum, p) => sum + (p.unpaid || 0), 0),
    productTotals.reduce((sum, p) => sum + (p.unpaidToPaidQR || 0), 0)
  ];

  // Add empty rows for spacing
  const emptyRows = [[''], ['']];

  // Create summary section
  const cashInCounter = productTotals.reduce((sum, p) => sum + p.amount, 0) - totalExpenses + openingBalance;
  const summaryRows = [
    ['', '', '', '', 'Expenses', totalExpenses],
    ['', '', '', '', 'Opening Balance', openingBalance],
    ['', '', '', '', 'Cash in counter', cashInCounter],
    ['', '', '', '', 'Net amount', netAmount]
  ];

  // Combine all data
  const allData = [
    ...headerData,
    ...tableHeaders,
    ...productRows,
    ...emptyRows,
    totalsRow,
    [''],
    ...summaryRows,
    [''],
    [`This file was generated on "${format(new Date(), 'MM/dd/yyyy')} on ${format(new Date(), 'HH:mm')}"`],
    ['Neelkantha Meat Shop | www.neelkanthameat.netlify.com']
  ];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(allData);

  // Set column widths
  ws['!cols'] = [
    { wch: 30 }, // Product
    { wch: 15 }, // Quantity
    { wch: 15 }, // Sales
    { wch: 15 }, // Paid QR
    { wch: 20 }, // Unpaid to Paid
    { wch: 20 }  // Unpaid to Paid QR
  ];

  // Style the header cells
  const headerStyle = {
    font: { bold: true, sz: 14 },
    fill: { fgColor: { rgb: "F0F8FF" } }, // Light blue background
    alignment: { horizontal: "left" }
  };

  // Style the table header cells
  const tableHeaderStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "000000" } }, // Black background
    alignment: { horizontal: "left" }
  };

  // Apply styles
  for (let i = 0; i < 2; i++) {
    const headerRange = XLSX.utils.encode_range({ r: i, c: 0 }, { r: i, c: 5 });
    Object.keys(ws).forEach(cell => {
      if (cell[0] !== '!' && headerRange.includes(cell)) {
        ws[cell].s = headerStyle;
      }
    });
  }

  // Style table headers
  tableHeaders[0].forEach((_, index) => {
    const cell = XLSX.utils.encode_cell({ r: 3, c: index });
    if (ws[cell]) ws[cell].s = tableHeaderStyle;
  });

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