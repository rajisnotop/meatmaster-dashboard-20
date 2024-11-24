import * as XLSX from 'xlsx';
import { format } from 'date-fns';

const createStyledWorksheet = () => {
  // Create base styles
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "4F46E5" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" }
    }
  };

  const cellStyle = {
    border: {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" }
    },
    alignment: { horizontal: "right" }
  };

  const titleStyle = {
    font: { bold: true, size: 16 },
    alignment: { horizontal: "center" }
  };

  return { headerStyle, cellStyle, titleStyle };
};

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
    console.log('Starting Excel export with:', { productTotals, timeFilter, startDate, endDate });
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([[]]);
    const { headerStyle, cellStyle, titleStyle } = createStyledWorksheet();

    // Set column widths
    const colWidths = [
      { wch: 30 }, // Product Name
      { wch: 15 }, // Quantity
      { wch: 15 }, // Sales
      { wch: 15 }, // Paid QR
      { wch: 15 }, // Unpaid
      { wch: 15 }  // Unpaid QR
    ];
    worksheet['!cols'] = colWidths;

    // Add company logo and title
    worksheet['A1'] = { 
      v: 'Neelkantha Meat Shop',
      t: 's',
      s: titleStyle
    };
    
    // Add report date
    worksheet['A2'] = {
      v: `Report Generated: ${format(new Date(), 'MMMM dd, yyyy')}`,
      t: 's'
    };

    if (timeFilter === 'date-range' && startDate && endDate) {
      worksheet['A3'] = {
        v: `Period: ${format(new Date(startDate), 'MMM dd, yyyy')} to ${format(new Date(endDate), 'MMM dd, yyyy')}`,
        t: 's'
      };
    }

    // Add headers at row 5
    const headers = [
      'Product Name',
      'Quantity Sold',
      'Total Sales (NPR)',
      'Paid with QR (NPR)',
      'Unpaid to Paid (NPR)',
      'Unpaid to Paid QR (NPR)'
    ];

    headers.forEach((header, idx) => {
      worksheet[XLSX.utils.encode_cell({ r: 4, c: idx })] = {
        v: header,
        t: 's',
        s: headerStyle
      };
    });

    // Add data starting from row 6
    productTotals.forEach((product, idx) => {
      const row = idx + 5;
      
      // Product name
      worksheet[XLSX.utils.encode_cell({ r: row, c: 0 })] = {
        v: product.name,
        t: 's',
        s: cellStyle
      };
      
      // Quantity
      worksheet[XLSX.utils.encode_cell({ r: row, c: 1 })] = {
        v: Number(product.quantity.toFixed(2)),
        t: 'n',
        s: cellStyle
      };
      
      // Sales
      worksheet[XLSX.utils.encode_cell({ r: row, c: 2 })] = {
        v: product.amount,
        t: 'n',
        s: cellStyle
      };
      
      // Paid with QR
      worksheet[XLSX.utils.encode_cell({ r: row, c: 3 })] = {
        v: product.paidWithQR || 0,
        t: 'n',
        s: cellStyle
      };
      
      // Unpaid
      worksheet[XLSX.utils.encode_cell({ r: row, c: 4 })] = {
        v: product.unpaid || 0,
        t: 'n',
        s: cellStyle
      };
      
      // Unpaid to Paid QR
      worksheet[XLSX.utils.encode_cell({ r: row, c: 5 })] = {
        v: product.unpaidToPaidQR || 0,
        t: 'n',
        s: cellStyle
      };
    });

    // Add totals row
    const totalRow = productTotals.length + 5;
    worksheet[XLSX.utils.encode_cell({ r: totalRow, c: 0 })] = {
      v: 'Total',
      t: 's',
      s: { ...cellStyle, font: { bold: true } }
    };

    // Calculate and add totals
    const totals = productTotals.reduce(
      (acc, curr) => ({
        quantity: acc.quantity + curr.quantity,
        sales: acc.sales + curr.amount,
        paidQR: acc.paidQR + (curr.paidWithQR || 0),
        unpaid: acc.unpaid + (curr.unpaid || 0),
        unpaidQR: acc.unpaidQR + (curr.unpaidToPaidQR || 0)
      }),
      { quantity: 0, sales: 0, paidQR: 0, unpaid: 0, unpaidQR: 0 }
    );

    // Add totals to the worksheet
    worksheet[XLSX.utils.encode_cell({ r: totalRow, c: 1 })] = {
      v: Number(totals.quantity.toFixed(2)),
      t: 'n',
      s: { ...cellStyle, font: { bold: true } }
    };
    worksheet[XLSX.utils.encode_cell({ r: totalRow, c: 2 })] = {
      v: totals.sales,
      t: 'n',
      s: { ...cellStyle, font: { bold: true } }
    };
    worksheet[XLSX.utils.encode_cell({ r: totalRow, c: 3 })] = {
      v: totals.paidQR,
      t: 'n',
      s: { ...cellStyle, font: { bold: true } }
    };
    worksheet[XLSX.utils.encode_cell({ r: totalRow, c: 4 })] = {
      v: totals.unpaid,
      t: 'n',
      s: { ...cellStyle, font: { bold: true } }
    };
    worksheet[XLSX.utils.encode_cell({ r: totalRow, c: 5 })] = {
      v: totals.unpaidQR,
      t: 'n',
      s: { ...cellStyle, font: { bold: true } }
    };

    // Add summary section
    const summaryStartRow = totalRow + 2;
    
    // Summary headers
    worksheet[XLSX.utils.encode_cell({ r: summaryStartRow, c: 0 })] = {
      v: 'Financial Summary',
      t: 's',
      s: { ...headerStyle, fill: { fgColor: { rgb: "6B7280" } } }
    };
    worksheet[XLSX.utils.encode_cell({ r: summaryStartRow, c: 1 })] = {
      v: 'Amount (NPR)',
      t: 's',
      s: { ...headerStyle, fill: { fgColor: { rgb: "6B7280" } } }
    };

    // Summary data
    const summaryItems = [
      { label: 'Opening Balance', value: openingBalance },
      { label: 'Total Expenses', value: totalExpenses },
      { label: 'Net Amount', value: netAmount }
    ];

    summaryItems.forEach((item, idx) => {
      worksheet[XLSX.utils.encode_cell({ r: summaryStartRow + idx + 1, c: 0 })] = {
        v: item.label,
        t: 's',
        s: cellStyle
      };
      worksheet[XLSX.utils.encode_cell({ r: summaryStartRow + idx + 1, c: 1 })] = {
        v: item.value,
        t: 'n',
        s: cellStyle
      };
    });

    // Set print area
    worksheet['!ref'] = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: summaryStartRow + summaryItems.length + 1, c: 5 }
    });

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Billing Report');

    // Generate filename
    let fileName = `neelkantha-meat-shop-billing`;
    if (timeFilter === "date-range" && startDate && endDate) {
      fileName += `-${format(new Date(startDate), 'yyyy-MM-dd')}-to-${format(new Date(endDate), 'yyyy-MM-dd')}`;
    } else {
      fileName += `-${timeFilter}-${format(new Date(), 'yyyy-MM-dd')}`;
    }
    fileName += '.xlsx';

    // Write the workbook
    XLSX.writeFile(workbook, fileName);
    console.log('Excel export completed successfully');
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};