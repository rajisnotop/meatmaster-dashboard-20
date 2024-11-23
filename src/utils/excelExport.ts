import * as XLSX from 'xlsx';
import { format } from 'date-fns';

interface ProductTotal {
  id: string;
  name: string;
  quantity: number;
  amount: number;
  paidWithQR: number;
  unpaid: number;
  unpaidToPaidQR: number;
}

export const exportToExcel = (
  productTotals: ProductTotal[],
  timeFilter: string,
  startDate: string | null,
  endDate: string | null,
  netProfit: number,
  totalExpenses: number,
  openingBalance: number
) => {
  const wb = XLSX.utils.book_new();
  
  // Styles
  const headerStyle = { 
    font: { bold: true, sz: 24, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: 'center', vertical: 'center' },
    fill: { fgColor: { rgb: "000000" } },
    border: {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    }
  };

  const tableHeaderStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "2563EB" } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
  };

  const cellStyle = {
    alignment: { horizontal: 'center', vertical: 'center' },
    border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
  };

  const summaryStyle = {
    font: { bold: true, sz: 12 },
    alignment: { horizontal: 'right', vertical: 'center' },
    fill: { fgColor: { rgb: "F3F4F6" } },
    border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
  };

  const footerStyle = {
    font: { italic: true, sz: 10 },
    alignment: { horizontal: 'center', vertical: 'center' },
    fill: { fgColor: { rgb: "F9FAFB" } }
  };

  // Calculate totals for summary
  const totalQuantity = productTotals.reduce((sum, p) => sum + p.quantity, 0);
  const totalSales = productTotals.reduce((sum, p) => sum + p.amount, 0);
  const totalPaidQR = productTotals.reduce((sum, p) => sum + p.paidWithQR, 0);
  const totalUnpaid = productTotals.reduce((sum, p) => sum + p.unpaid, 0);
  const totalUnpaidToPaidQR = productTotals.reduce((sum, p) => sum + p.unpaidToPaidQR, 0);
  const cashInCounter = totalSales - totalPaidQR - totalUnpaid + totalUnpaidToPaidQR;

  // Create worksheet data
  const ws = XLSX.utils.aoa_to_sheet([
    [{ v: 'Neelkantha Meat Shop', t: 's', s: headerStyle }],
    [''], // Spacing
    [{ 
      v: timeFilter === "date-range" && startDate && endDate 
        ? `Date Range: ${format(new Date(startDate), 'MMM dd, yyyy')} to ${format(new Date(endDate), 'MMM dd, yyyy')}`
        : `Report Date: ${format(new Date(), 'MMM dd, yyyy')}`,
      t: 's',
      s: footerStyle
    }],
    [''], // Spacing
    // Table headers with style
    [
      { v: 'Products', t: 's', s: tableHeaderStyle },
      { v: 'Quantity Sold', t: 's', s: tableHeaderStyle },
      { v: 'Total Sales (NPR)', t: 's', s: tableHeaderStyle },
      { v: 'Paid with QR (NPR)', t: 's', s: tableHeaderStyle },
      { v: 'Unpaid Amount (NPR)', t: 's', s: tableHeaderStyle },
      { v: 'Unpaid to Paid with QR (NPR)', t: 's', s: tableHeaderStyle }
    ],
    // Product rows
    ...productTotals.map(product => [
      { v: product.name, t: 's', s: cellStyle },
      { v: product.quantity, t: 'n', z: '#,##0', s: cellStyle },
      { v: product.amount, t: 'n', z: '#,##0.00', s: cellStyle },
      { v: product.paidWithQR, t: 'n', z: '#,##0.00', s: cellStyle },
      { v: product.unpaid, t: 'n', z: '#,##0.00', s: cellStyle },
      { v: product.unpaidToPaidQR, t: 'n', z: '#,##0.00', s: cellStyle }
    ]),
    [''], // Spacing before summary
    // Summary section
    [
      { v: 'Summary', t: 's', s: summaryStyle },
      { v: totalQuantity, t: 'n', z: '#,##0', s: summaryStyle },
      { v: totalSales, t: 'n', z: '#,##0.00', s: summaryStyle },
      { v: totalPaidQR, t: 'n', z: '#,##0.00', s: summaryStyle },
      { v: totalUnpaid, t: 'n', z: '#,##0.00', s: summaryStyle },
      { v: totalUnpaidToPaidQR, t: 'n', z: '#,##0.00', s: summaryStyle }
    ],
    [''], // Spacing before financial summary
    // Financial summary
    [
      { v: 'Opening Balance:', t: 's', s: summaryStyle },
      { v: openingBalance, t: 'n', z: '#,##0.00', s: summaryStyle }
    ],
    [
      { v: 'Total Expenses:', t: 's', s: summaryStyle },
      { v: totalExpenses, t: 'n', z: '#,##0.00', s: { ...summaryStyle, font: { ...summaryStyle.font, color: { rgb: "FF0000" } } } }
    ],
    [
      { v: 'Cash in Counter:', t: 's', s: summaryStyle },
      { v: cashInCounter, t: 'n', z: '#,##0.00', s: summaryStyle }
    ],
    [
      { v: 'Net Profit:', t: 's', s: summaryStyle },
      { 
        v: netProfit,
        t: 'n',
        z: '#,##0.00',
        s: { 
          ...summaryStyle,
          font: { ...summaryStyle.font, color: { rgb: netProfit >= 0 ? "008000" : "FF0000" } }
        }
      }
    ],
    [''], // Spacing before footer
    // Footer
    [{ 
      v: `Generated on ${format(new Date(), 'MMMM dd, yyyy HH:mm:ss')}`,
      t: 's',
      s: footerStyle
    }],
    [{ 
      v: 'Neelkantha Meat Shop - Financial Report',
      t: 's',
      s: { ...footerStyle, font: { bold: true, sz: 11 } }
    }]
  ]);

  // Set column widths
  ws['!cols'] = [
    { wch: 30 }, // Products
    { wch: 15 }, // Quantity
    { wch: 20 }, // Sales
    { wch: 20 }, // QR
    { wch: 20 }, // Unpaid
    { wch: 25 }, // Unpaid to QR
  ];

  // Merge cells for header and footer
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // Shop name
    { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } }, // Date range
    { s: { r: ws["!ref"].split(":")[1].replace(/[A-Z]/g, "") - 2, c: 0 }, e: { r: ws["!ref"].split(":")[1].replace(/[A-Z]/g, "") - 2, c: 5 } }, // Generated on
    { s: { r: ws["!ref"].split(":")[1].replace(/[A-Z]/g, "") - 1, c: 0 }, e: { r: ws["!ref"].split(":")[1].replace(/[A-Z]/g, "") - 1, c: 5 } }  // Shop name in footer
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