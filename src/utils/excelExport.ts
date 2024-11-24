import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { generateExcelTemplate } from './excelTemplate';
import { toast } from 'sonner';

export const previewExcelTemplate = (
  productTotals: any[],
  timeFilter: string,
  startDate: string | null,
  endDate: string | null,
  netAmount: number,
  totalExpenses: number,
  openingBalance: number
) => {
  try {
    const html = generateExcelTemplate(
      productTotals,
      timeFilter,
      startDate,
      endDate,
      netAmount,
      totalExpenses,
      openingBalance
    );

    const previewWindow = window.open('', '_blank');
    if (!previewWindow) {
      toast.error('Unable to open preview window');
      return;
    }

    previewWindow.document.write(html);
    previewWindow.document.close();

    // Add the export function to the window object
    previewWindow.exportToExcel = () => {
      const fileName = `neelkantha-meat-shop-billing${timeFilter === "date-range" && startDate && endDate 
        ? `-${format(new Date(startDate), 'yyyy-MM-dd')}-to-${format(new Date(endDate), 'yyyy-MM-dd')}` 
        : `-${timeFilter}-${format(new Date(), 'yyyy-MM-dd')}`}.xlsx`;

      try {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(
          previewWindow.document.querySelector('table'),
          { raw: true }
        );
        XLSX.utils.book_append_sheet(wb, ws, 'Billing Report');
        XLSX.writeFile(wb, fileName);
        toast.success('Excel file exported successfully');
      } catch (error) {
        console.error('Error exporting to Excel:', error);
        toast.error('Failed to export Excel file');
      }
    };

    toast.success('Preview opened in new window');
  } catch (error) {
    console.error('Error generating preview:', error);
    toast.error('Failed to generate preview');
  }
};

export const exportToExcel = previewExcelTemplate;