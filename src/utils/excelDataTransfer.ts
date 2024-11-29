import { GridData } from "@/types/types";
import * as XLSX from 'xlsx';

export const exportExcelData = (gridData: GridData) => {
  console.log('Starting Excel export with professional formatting...');
  const workbook = XLSX.utils.book_new();
  
  // Create header data
  const headerData = [
    ['Neelkantha Meat Shop'],
    ['Sales Report'],
    ['Generated on: ' + new Date().toLocaleDateString()],
    [''], // Empty row for spacing
  ];

  // Convert grid data to array format
  const data: any[][] = [];
  
  // Find the maximum row and column
  let maxRow = 0;
  let maxCol = 0;
  Object.keys(gridData).forEach(cellId => {
    const col = cellId.match(/[A-Z]+/)?.[0];
    const row = parseInt(cellId.match(/\d+/)?.[0] || '0');
    if (col && row) {
      maxRow = Math.max(maxRow, row);
      maxCol = Math.max(maxCol, col.charCodeAt(0) - 64);
    }
  });

  console.log(`Grid dimensions: ${maxRow} rows, ${maxCol} columns`);

  // Initialize the data array
  for (let i = 0; i <= maxRow; i++) {
    data[i] = new Array(maxCol).fill('');
  }

  // Fill in the data
  Object.entries(gridData).forEach(([cellId, cellData]) => {
    const col = cellId.match(/[A-Z]+/)?.[0];
    const row = parseInt(cellId.match(/\d+/)?.[0] || '0') - 1;
    if (col && row >= 0) {
      const colIndex = col.charCodeAt(0) - 65;
      data[row][colIndex] = cellData.formula || cellData.value;
    }
  });

  // Combine header and data
  const finalData = [...headerData, ...data];
  const worksheet = XLSX.utils.aoa_to_sheet(finalData);

  // Set column widths
  const cols: XLSX.ColInfo[] = [];
  for (let i = 0; i < maxCol; i++) {
    cols.push({ wch: 15 }); // Set default width to 15 characters
  }
  worksheet['!cols'] = cols;

  // Apply header styles
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "2F5233" } }, // Dark green
    alignment: { horizontal: "center", vertical: "center" }
  };

  // Apply header merge
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: maxCol - 1 } }, // Company name
    { s: { r: 1, c: 0 }, e: { r: 1, c: maxCol - 1 } }  // Report title
  ];

  // Apply styles to cells
  for (let i = 0; i < headerData.length; i++) {
    const cellRef = XLSX.utils.encode_cell({ r: i, c: 0 });
    worksheet[cellRef].s = headerStyle;
  }

  // Apply data styles
  Object.entries(gridData).forEach(([cellId, cellData]) => {
    if (cellData.style) {
      const cell = worksheet[cellId];
      if (cell) {
        cell.s = {
          font: {
            bold: cellData.style.bold,
            italic: cellData.style.italic,
            underline: cellData.style.underline,
            color: { rgb: cellData.style.color?.replace('#', '') || '000000' }
          },
          fill: cellData.style.backgroundColor ? {
            fgColor: { rgb: cellData.style.backgroundColor.replace('#', '') }
          } : undefined,
          alignment: {
            horizontal: cellData.style.align || 'left',
            vertical: 'center'
          },
          numFmt: isNaN(Number(cellData.value)) ? '@' : '#,##0.00'
        };
      }
    }
  });

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');

  // Generate the Excel file
  console.log('Exporting Excel file...');
  XLSX.writeFile(workbook, 'sales_report.xlsx');
  console.log('Excel export completed successfully');
};

export const convertBillingDataToExcelData = (productTotals: any[], overallTotals: any) => {
  const gridData: GridData = {};
  const headerStyle = {
    bold: true,
    backgroundColor: '#2F5233',
    color: '#FFFFFF',
    align: 'center'
  };

  // Headers with styling
  const headers = ['Product', 'Quantity', 'Sales (NPR)', 'Paid with QR (NPR)', 'Unpaid to Paid (NPR)', 'Unpaid to Paid QR (NPR)'];
  headers.forEach((header, index) => {
    const cellId = `${String.fromCharCode(65 + index)}1`;
    gridData[cellId] = {
      value: header,
      id: cellId,
      style: headerStyle
    };
  });

  // Add product data with formatting
  productTotals.forEach((product, rowIndex) => {
    const row = rowIndex + 2;
    
    // Product name
    gridData[`A${row}`] = {
      value: product.name,
      id: `A${row}`,
      style: { align: 'left' }
    };
    
    // Quantity
    gridData[`B${row}`] = {
      value: product.quantity.toString(),
      id: `B${row}`,
      style: { align: 'right' }
    };
    
    // Sales
    gridData[`C${row}`] = {
      value: product.amount.toString(),
      id: `C${row}`,
      style: { align: 'right', color: '#2F5233' }
    };
    
    // Paid with QR
    gridData[`D${row}`] = {
      value: (product.paidWithQR || 0).toString(),
      id: `D${row}`,
      style: { align: 'right', color: '#2F5233' }
    };
    
    // Unpaid to Paid
    gridData[`E${row}`] = {
      value: (product.unpaid || 0).toString(),
      id: `E${row}`,
      style: { align: 'right', color: '#2F5233' }
    };
    
    // Unpaid to Paid QR
    gridData[`F${row}`] = {
      value: (product.unpaidToPaidQR || 0).toString(),
      id: `F${row}`,
      style: { align: 'right', color: '#2F5233' }
    };
  });

  // Add totals row with distinct styling
  const totalRow = productTotals.length + 2;
  const totalStyle = {
    bold: true,
    backgroundColor: '#E8F5E9',
    color: '#2F5233',
    align: 'right'
  };

  gridData[`A${totalRow}`] = {
    value: 'Total',
    id: `A${totalRow}`,
    style: { ...totalStyle, align: 'left' }
  };

  // Add formulas for totals with styling
  ['B', 'C', 'D', 'E', 'F'].forEach(col => {
    gridData[`${col}${totalRow}`] = {
      value: `=SUM(${col}2:${col}${totalRow - 1})`,
      id: `${col}${totalRow}`,
      style: totalStyle
    };
  });

  return gridData;
};