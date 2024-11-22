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
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    // Logo and title row with merged cells and styling
    [{ 
      v: 'Neelkantha Meat Shop', 
      t: 's',
      s: { 
        font: { bold: true, sz: 24 },
        alignment: { horizontal: 'center', vertical: 'center' },
        fill: { fgColor: { rgb: "E6F3F7" } }  // Light blue background
      } 
    }],
    [''], // Spacing
    [{ 
      v: timeFilter === "date-range" && startDate && endDate 
        ? `Date Range: ${format(new Date(startDate), 'MMM dd, yyyy')} to ${format(new Date(endDate), 'MMM dd, yyyy')}`
        : `Report Date: ${format(new Date(), 'MMM dd, yyyy')}`,
      t: 's',
      s: { 
        font: { sz: 12 },
        alignment: { horizontal: 'right' }
      }
    }],
    [''], // Spacing
    // Table headers with styling
    [
      { v: 'Products', t: 's', s: { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "000000" } }, alignment: { horizontal: 'center' } } },
      { v: 'Quantity Sold', t: 's', s: { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "000000" } }, alignment: { horizontal: 'center' } } },
      { v: 'Total Sales', t: 's', s: { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "000000" } }, alignment: { horizontal: 'center' } } },
      { v: 'Paid (QR)', t: 's', s: { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "000000" } }, alignment: { horizontal: 'center' } } },
      { v: 'Unpaid to Paid', t: 's', s: { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "000000" } }, alignment: { horizontal: 'center' } } },
      { v: 'Unpaid to Paid (QR)', t: 's', s: { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "000000" } }, alignment: { horizontal: 'center' } } }
    ],
    // Product rows
    ...productTotals.map(product => [
      { v: product.name, t: 's', s: { alignment: { horizontal: 'left' } } },
      { v: product.quantity, t: 'n', z: '#,##0.00', s: { alignment: { horizontal: 'right' } } },
      { v: product.amount, t: 'n', z: '#,##0.00', s: { alignment: { horizontal: 'right' } } },
      { v: product.paidWithQR, t: 'n', z: '#,##0.00', s: { alignment: { horizontal: 'right' } } },
      { v: product.unpaid, t: 'n', z: '#,##0.00', s: { alignment: { horizontal: 'right' } } },
      { v: product.unpaidToPaidQR, t: 'n', z: '#,##0.00', s: { alignment: { horizontal: 'right' } } }
    ]),
    [''], // Spacing
    // Summary section
    [
      { v: 'Opening Balance:', t: 's', s: { font: { bold: true } } },
      { v: openingBalance, t: 'n', z: '#,##0.00', s: { font: { bold: true } } }
    ],
    [
      { v: 'Total Expenses:', t: 's', s: { font: { bold: true } } },
      { v: totalExpenses, t: 'n', z: '#,##0.00', s: { font: { bold: true, color: { rgb: "FF0000" } } } }
    ],
    [
      { v: 'Net Profit:', t: 's', s: { font: { bold: true } } },
      { 
        v: netProfit,
        t: 'n',
        s: { 
          font: { 
            bold: true,
            color: { rgb: netProfit >= 0 ? "008000" : "FF0000" }
          }
        },
        z: '#,##0.00'
      }
    ]
  ]);

  // Set column widths
  ws['!cols'] = [
    { wch: 30 }, // Products
    { wch: 15 }, // Quantity
    { wch: 15 }, // Sales
    { wch: 15 }, // QR
    { wch: 15 }, // Unpaid
    { wch: 20 }, // Unpaid to QR
  ];

  // Merge cells for header
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // Shop name
    { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } }, // Date range
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