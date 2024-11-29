import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDown, Printer } from "lucide-react";
import { convertBillingDataToExcelData } from "@/utils/excelDataTransfer";
import * as XLSX from 'xlsx';
import { useExpenseStore } from "@/store/expenseStore";

interface BillingHeaderProps {
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
  selectedProducts: string[];
  onPrint: (type: "all" | "selected") => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
  onExportExcel: () => void;
  startDate: string | null;
  endDate: string | null;
  setStartDate: (date: string | null) => void;
  setEndDate: (date: string | null) => void;
  productTotals: any[];
  totalExpenses: number;
  openingBalance: number;
  cashInCounter: number;
  netProfit: number;
}

const BillingHeader = ({
  timeFilter,
  setTimeFilter,
  selectedProducts,
  onPrint,
  dateFilter,
  setDateFilter,
  onExportExcel,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  productTotals,
  totalExpenses,
  openingBalance,
  cashInCounter,
  netProfit
}: BillingHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const expenseStore = useExpenseStore();

  const handleExportToExcelPage = () => {
    const gridData = convertBillingDataToExcelData(productTotals, {
      totalExpenses,
      openingBalance,
      cashInCounter,
      netProfit
    });
    
    navigate('/excel', { state: { gridData } });
    
    toast({
      title: "Data Exported to Excel Page",
      description: "You can now edit the data in the Excel page",
      duration: 2000
    });
  };

  const handleDirectExcelExport = () => {
    console.log('Starting direct Excel export...');
    try {
      const workbook = XLSX.utils.book_new();
      
      // Sales Overview Section
      const salesOverviewData = [
        ['Sales Overview', ''],
        ['Total Sales', `NPR ${productTotals.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}`],
        ['Opening Balance', `NPR ${openingBalance.toLocaleString()}`],
        ['Quantity Sold', `${productTotals.reduce((sum, p) => sum + (p.quantity || 0), 0)} kg`],
        ['', ''],
      ];

      // Digital Payments Section
      const totalQRPayments = productTotals.reduce((sum, p) => sum + (p.paidWithQR || 0), 0);
      const totalUnpaidToQR = productTotals.reduce((sum, p) => sum + (p.unpaidToPaidQR || 0), 0);
      const digitalPaymentsData = [
        ['Digital Payments', ''],
        ['QR Payments', `NPR ${totalQRPayments.toLocaleString()}`],
        ['Unpaid to QR', `NPR ${totalUnpaidToQR.toLocaleString()}`],
        ['Total Digital Pay', `NPR ${(totalQRPayments + totalUnpaidToQR).toLocaleString()}`],
        ['', ''],
      ];

      // Expenses Section
      const cashExpenses = expenseStore.getCashExpenses();
      const onlineExpenses = expenseStore.getOnlineExpenses();
      const expensesData = [
        ['Expenses', ''],
        ['Total Expenses', `NPR ${totalExpenses.toLocaleString()}`],
        ['Cash Expenses', `NPR ${cashExpenses.toLocaleString()}`],
        ['Online Expenses', `NPR ${onlineExpenses.toLocaleString()}`],
        ['', ''],
      ];

      // Financial Summary Section
      const financialSummaryData = [
        ['Financial Summary', ''],
        ['Cash in Counter', `NPR ${cashInCounter.toLocaleString()}`],
        ['Cash in Bank', `NPR ${(totalQRPayments + totalUnpaidToQR - onlineExpenses).toLocaleString()}`],
        ['Net Amount', `NPR ${netProfit.toLocaleString()}`],
        ['', ''],
      ];

      // Product Details Section
      const productDetailsData = [
        ['Product Details', '', '', '', ''],
        ['Product', 'Total Sales (NPR)', 'Paid with QR (NPR)', 'Unpaid Amount (NPR)', 'Unpaid to Paid QR (NPR)'],
        ...productTotals.map(product => [
          product.name,
          (product.amount || 0).toLocaleString(),
          (product.paidWithQR || 0).toLocaleString(),
          (product.unpaid || 0).toLocaleString(),
          (product.unpaidToPaidQR || 0).toLocaleString()
        ]),
        [
          'Total',
          productTotals.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString(),
          productTotals.reduce((sum, p) => sum + (p.paidWithQR || 0), 0).toLocaleString(),
          productTotals.reduce((sum, p) => sum + (p.unpaid || 0), 0).toLocaleString(),
          productTotals.reduce((sum, p) => sum + (p.unpaidToPaidQR || 0), 0).toLocaleString()
        ]
      ];

      // Combine all sections
      const wsData = [
        ...salesOverviewData,
        ...digitalPaymentsData,
        ...expensesData,
        ...financialSummaryData,
        ['', ''],  // Add spacing
        ...productDetailsData
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      
      // Add styling
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      for (let R = range.s.r; R <= range.e.r; R++) {
        for (let C = range.s.c; C <= range.e.c; C++) {
          const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
          if (!worksheet[cell_address]) continue;
          
          // Style section headers
          if (worksheet[cell_address].v && typeof worksheet[cell_address].v === 'string' && 
              ['Sales Overview', 'Digital Payments', 'Expenses', 'Financial Summary', 'Product Details'].includes(worksheet[cell_address].v)) {
            worksheet[cell_address].s = {
              font: { bold: true, color: { rgb: "2F5233" } },
              fill: { fgColor: { rgb: "E8F5E9" } }
            };
          }
        }
      }

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');
      
      // Generate Excel file
      XLSX.writeFile(workbook, 'sales_report.xlsx');
      
      console.log('Excel export completed successfully');
      toast({
        title: "Export Successful",
        description: "The Excel file has been downloaded",
        duration: 2000
      });
    } catch (error) {
      console.error('Excel export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the Excel file",
        variant: "destructive",
        duration: 2000
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-forest">Billing Overview</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportToExcelPage}
            className="bg-green-500/20 hover:bg-green-500/30 text-green-700"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export to Excel Page
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPrint("selected")}
            disabled={selectedProducts.length === 0}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Selected
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPrint("all")}
            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDirectExcelExport}
            className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-700"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="flex items-end gap-4">
        <div className="space-y-2">
          <Label htmlFor="timeFilter">Time Period</Label>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger id="timeFilter" className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="date-range">Date Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {timeFilter === "date-range" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate || ""}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-[180px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate || ""}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-[180px]"
              />
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="dateFilter">Select Date</Label>
            <Input
              id="dateFilter"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-[180px]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingHeader;
