import { format } from "date-fns";
import PrintHeader from "./print/PrintHeader";
import PrintProductsTable from "./print/PrintProductsTable";
import PrintSummary from "./print/PrintSummary";

interface BillingPrintTemplateProps {
  productTotals: any[];
  type: "all" | "selected";
  overallTotals: {
    sales: number;
    paidWithQR: number;
    unpaid: number;
    unpaidToPaidQR: number;
  };
  totalExpenses: number;
  openingBalance: number;
  netProfit: number;
}

const BillingPrintTemplate = ({
  productTotals,
  type,
  overallTotals,
  totalExpenses,
  openingBalance,
  netProfit
}: BillingPrintTemplateProps) => {
  const cashInCounter = (overallTotals.sales || 0) - (totalExpenses || 0) + (openingBalance || 0);
  const currentDate = new Date();
  
  return `
    <html>
      <head>
        <title>Billing Report - ${format(currentDate, "MM/dd/yyyy")}</title>
        <style>
          @page {
            size: A4;
            margin: 20px;
          }
          
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: #fff;
            color: #333;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #eee;
          }
          
          .logo-section {
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          
          .logo {
            width: 80px;
            height: 80px;
            object-fit: contain;
          }
          
          .company-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          
          .company-title {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 0;
            color: #1a1a1a;
          }
          
          .company-subtitle {
            font-size: 0.875rem;
            color: #666;
            margin: 0;
          }
          
          .date-section {
            text-align: right;
          }
          
          .date-label {
            font-size: 1.25rem;
            font-weight: bold;
            margin: 0;
            color: #1a1a1a;
          }
          
          .date-value, .time-value {
            font-size: 0.875rem;
            color: #666;
            margin: 0.25rem 0 0;
          }
          
          .table-container {
            margin: 2rem 0;
            overflow-x: auto;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2rem;
            background: #fff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          th {
            background: #f8f9fa;
            color: #1a1a1a;
            font-weight: 600;
            padding: 12px;
            text-align: left;
            border-bottom: 2px solid #dee2e6;
          }
          
          td {
            padding: 12px;
            border-bottom: 1px solid #dee2e6;
            color: #333;
          }
          
          .totals-row td {
            background: #f8f9fa;
            font-weight: 600;
          }
          
          .summary-section {
            margin-top: 2rem;
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 8px;
          }
          
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          
          .summary-item {
            padding: 1rem;
            background: white;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          .summary-label {
            font-size: 0.875rem;
            color: #666;
            margin-bottom: 0.5rem;
          }
          
          .summary-value {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1a1a1a;
          }
          
          .highlight {
            background: #e8f4ff;
          }
          
          .profit .summary-value {
            color: #10b981;
          }
          
          .loss .summary-value {
            color: #ef4444;
          }
          
          .footer {
            margin-top: 3rem;
            text-align: center;
            font-size: 0.875rem;
            color: #666;
          }
          
          .website {
            color: #666;
            text-decoration: none;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .summary-section {
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        ${PrintHeader({ date: currentDate })}
        ${PrintProductsTable({ productTotals })}
        ${PrintSummary({ totalExpenses, openingBalance, cashInCounter, netProfit })}
        
        <div class="footer">
          <p>Generated on ${format(currentDate, "MMMM dd, yyyy 'at' hh:mm a")}</p>
          <p>Neelkantha Meat Shop | <a href="https://neelkanthameat.netlify.com" class="website">www.neelkanthameat.netlify.com</a></p>
        </div>
      </body>
    </html>
  `;
};

export default BillingPrintTemplate;