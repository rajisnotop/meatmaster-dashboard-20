import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export const exportToExcel = async (
  productTotals: any[],
  timeFilter: string,
  startDate: string | null,
  endDate: string | null,
  netAmount: number,
  totalExpenses: number,
  openingBalance: number
) => {
  try {
    // Load the template file from public folder
    const response = await fetch('/billing-template.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    
    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Update date in the template
    const currentDate = format(new Date(), 'MM/dd/yyyy');
    worksheet['E2'] = { v: `Date: ${currentDate}`, t: 's' };

    // Start populating data from row 8 (adjust based on your template)
    productTotals.forEach((product, index) => {
      const rowNumber = index + 8; // Starting from row 8
      
      // Update each cell in the row
      worksheet[`A${rowNumber}`] = { v: product.name, t: 's' };
      worksheet[`B${rowNumber}`] = { v: Number(product.quantity.toFixed(2)), t: 'n' };
      worksheet[`C${rowNumber}`] = { v: product.amount, t: 'n' };
      worksheet[`D${rowNumber}`] = { v: product.paidWithQR || 0, t: 'n' };
      worksheet[`E${rowNumber}`] = { v: product.unpaid || 0, t: 'n' };
      worksheet[`F${rowNumber}`] = { v: product.unpaidToPaidQR || 0, t: 'n' };
    });

    // Calculate and update totals row
    const totalRowNumber = productTotals.length + 8;
    worksheet[`A${totalRowNumber}`] = { v: 'Total', t: 's', s: { font: { bold: true } } };
    worksheet[`B${totalRowNumber}`] = { 
      v: productTotals.reduce((sum, p) => sum + p.quantity, 0),
      t: 'n',
      s: { font: { bold: true } }
    };
    worksheet[`C${totalRowNumber}`] = { 
      v: productTotals.reduce((sum, p) => sum + p.amount, 0),
      t: 'n',
      s: { font: { bold: true } }
    };
    worksheet[`D${totalRowNumber}`] = { 
      v: productTotals.reduce((sum, p) => sum + (p.paidWithQR || 0), 0),
      t: 'n',
      s: { font: { bold: true } }
    };
    worksheet[`E${totalRowNumber}`] = { 
      v: productTotals.reduce((sum, p) => sum + (p.unpaid || 0), 0),
      t: 'n',
      s: { font: { bold: true } }
    };
    worksheet[`F${totalRowNumber}`] = { 
      v: productTotals.reduce((sum, p) => sum + (p.unpaidToPaidQR || 0), 0),
      t: 'n',
      s: { font: { bold: true } }
    };

    // Update summary section
    const summaryStartRow = totalRowNumber + 2;
    worksheet[`E${summaryStartRow}`] = { v: 'Expenses', t: 's' };
    worksheet[`F${summaryStartRow}`] = { v: totalExpenses, t: 'n' };
    
    worksheet[`E${summaryStartRow + 1}`] = { v: 'Opening Balance', t: 's' };
    worksheet[`F${summaryStartRow + 1}`] = { v: openingBalance, t: 'n' };
    
    const cashInCounter = productTotals.reduce((sum, p) => sum + p.amount, 0) - totalExpenses + openingBalance;
    worksheet[`E${summaryStartRow + 2}`] = { v: 'Cash in counter', t: 's' };
    worksheet[`F${summaryStartRow + 2}`] = { v: cashInCounter, t: 'n' };
    
    worksheet[`E${summaryStartRow + 3}`] = { v: 'Net amount', t: 's' };
    worksheet[`F${summaryStartRow + 3}`] = { v: netAmount, t: 'n' };

    // Generate filename based on date range
    let fileName = `neelkantha-meat-shop-billing`;
    if (timeFilter === "date-range" && startDate && endDate) {
      fileName += `-${format(new Date(startDate), 'yyyy-MM-dd')}-to-${format(new Date(endDate), 'yyyy-MM-dd')}`;
    } else {
      fileName += `-${timeFilter}-${format(new Date(), 'yyyy-MM-dd')}`;
    }
    fileName += '.xlsx';

    // Write the workbook
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};