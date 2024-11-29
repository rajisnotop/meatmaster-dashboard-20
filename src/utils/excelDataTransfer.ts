import { GridData } from "@/types/types";
import * as XLSX from 'xlsx';

export const convertBillingDataToExcelData = (productTotals: any[], overallTotals: any) => {
  const gridData: GridData = {};

  // Set headers with styling
  const headers = ['Product', 'Quantity', 'Sales', 'Paid with QR', 'Unpaid to Paid', 'Unpaid to Paid QR'];
  headers.forEach((header, index) => {
    const cellId = `${String.fromCharCode(65 + index)}1`;
    gridData[cellId] = {
      value: header,
      id: cellId,
      style: {
        bold: true,
        backgroundColor: '#f8f9fa',
        align: 'center'
      }
    };
  });

  // Add product data
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
      style: { align: 'right', color: '#2563eb' }
    };
    
    // Paid with QR
    gridData[`D${row}`] = {
      value: (product.paidWithQR || 0).toString(),
      id: `D${row}`,
      style: { align: 'right', color: '#059669' }
    };
    
    // Unpaid to Paid
    gridData[`E${row}`] = {
      value: (product.unpaid || 0).toString(),
      id: `E${row}`,
      style: { align: 'right', color: '#dc2626' }
    };
    
    // Unpaid to Paid QR
    gridData[`F${row}`] = {
      value: (product.unpaidToPaidQR || 0).toString(),
      id: `F${row}`,
      style: { align: 'right', color: '#7c3aed' }
    };
  });

  // Add totals row
  const totalRow = productTotals.length + 3;
  gridData[`A${totalRow}`] = {
    value: 'Total',
    id: `A${totalRow}`,
    style: { bold: true, backgroundColor: '#f8f9fa' }
  };

  // Add formulas for totals
  const lastDataRow = totalRow - 1;
  gridData[`B${totalRow}`] = {
    value: `=SUM(B2:B${lastDataRow})`,
    id: `B${totalRow}`,
    style: { bold: true, backgroundColor: '#f8f9fa' }
  };
  
  gridData[`C${totalRow}`] = {
    value: `=SUM(C2:C${lastDataRow})`,
    id: `C${totalRow}`,
    style: { bold: true, backgroundColor: '#f8f9fa' }
  };
  
  gridData[`D${totalRow}`] = {
    value: `=SUM(D2:D${lastDataRow})`,
    id: `D${totalRow}`,
    style: { bold: true, backgroundColor: '#f8f9fa' }
  };
  
  gridData[`E${totalRow}`] = {
    value: `=SUM(E2:E${lastDataRow})`,
    id: `E${totalRow}`,
    style: { bold: true, backgroundColor: '#f8f9fa' }
  };
  
  gridData[`F${totalRow}`] = {
    value: `=SUM(F2:F${lastDataRow})`,
    id: `F${totalRow}`,
    style: { bold: true, backgroundColor: '#f8f9fa' }
  };

  return gridData;
};

export const exportExcelData = (gridData: GridData) => {
  const workbook = XLSX.utils.book_new();
  
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
      data[row][colIndex] = cellData.value;
    }
  });

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Apply styles
  Object.entries(gridData).forEach(([cellId, cellData]) => {
    if (cellData.style) {
      const cell = worksheet[cellId];
      if (cell) {
        cell.s = {
          font: {
            bold: cellData.style.bold,
            italic: cellData.style.italic,
            underline: cellData.style.underline,
            color: { rgb: cellData.style.color?.replace('#', '') }
          },
          fill: cellData.style.backgroundColor ? {
            fgColor: { rgb: cellData.style.backgroundColor.replace('#', '') }
          } : undefined,
          alignment: {
            horizontal: cellData.style.align
          }
        };
      }
    }
  });

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, 'excel_export.xlsx');
};