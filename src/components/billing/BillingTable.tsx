import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SalesCard from "./cards/SalesCard";
import PaymentsCard from "./cards/PaymentsCard";
import ExpensesCard from "./cards/ExpensesCard";
import FinancialSummaryCard from "./cards/FinancialSummaryCard";

interface BillingTableProps {
  productTotals: any[];
  selectedProducts: string[];
  setSelectedProducts: (products: string[]) => void;
  overallTotals: {
    quantity: number;
    sales: number;
    unpaid: number;
    unpaidToPaidQR: number;
    paidWithQR: number;
  };
  totalExpenses: number;
  netProfit: number;
  openingBalance: number;
  setOpeningBalance: (balance: number) => void;
}

const BillingTable = ({
  productTotals,
  selectedProducts,
  setSelectedProducts,
  overallTotals,
  totalExpenses,
  netProfit,
  openingBalance,
  setOpeningBalance,
}: BillingTableProps) => {
  const cashInCounter = (overallTotals.sales || 0) - (totalExpenses || 0) + (openingBalance || 0);
  const cashInBank = (overallTotals.paidWithQR || 0) + (overallTotals.unpaidToPaidQR || 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Label htmlFor="openingBalance" className="text-sm font-medium text-foreground">
          Opening Balance (NPR)
        </Label>
        <Input
          id="openingBalance"
          type="number"
          value={openingBalance}
          onChange={(e) => setOpeningBalance(Number(e.target.value))}
          className="w-[200px]"
          placeholder="Enter opening balance"
        />
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 text-foreground font-semibold">Select</TableHead>
              <TableHead className="text-foreground font-semibold">Product</TableHead>
              <TableHead className="text-foreground font-semibold">Total Sales (NPR)</TableHead>
              <TableHead className="text-foreground font-semibold">Paid with QR (NPR)</TableHead>
              <TableHead className="text-foreground font-semibold">Unpaid to Paid Amount (NPR)</TableHead>
              <TableHead className="text-foreground font-semibold">Unpaid to Paid with QR (NPR)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productTotals.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={(checked) => {
                      setSelectedProducts(
                        checked
                          ? [...selectedProducts, product.id]
                          : selectedProducts.filter((id) => id !== product.id)
                      );
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                <TableCell className="text-foreground">{(product.amount || 0).toLocaleString()}</TableCell>
                <TableCell className="text-foreground">{(product.paidWithQR || 0).toLocaleString()}</TableCell>
                <TableCell className="text-foreground">{(product.unpaid || 0).toLocaleString()}</TableCell>
                <TableCell className="text-foreground">
                  {(product.unpaidToPaidQR || 0).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SalesCard 
          sales={overallTotals.sales} 
          openingBalance={openingBalance}
          quantity={overallTotals.quantity}
        />
        <PaymentsCard 
          paidWithQR={overallTotals.paidWithQR}
          unpaidToPaidQR={overallTotals.unpaidToPaidQR}
        />
        <ExpensesCard totalExpenses={totalExpenses} />
        <FinancialSummaryCard 
          cashInCounter={cashInCounter}
          netProfit={netProfit}
          cashInBank={cashInBank}
        />
      </div>
    </div>
  );
};

export default BillingTable;