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
import OverviewCard from "./cards/OverviewCard";
import ExpensesCard from "./cards/ExpensesCard";
import FinancialSummaryCard from "./cards/FinancialSummaryCard";
import { useStore } from "@/store/store";

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
  const { getSuppliesExpenses, getCashExpenses, getOnlineExpenses } = useStore();
  const suppliesExpenses = getSuppliesExpenses();
  const cashExpenses = getCashExpenses();
  const onlineExpenses = getOnlineExpenses();

  const cashInCounter = (overallTotals.sales || 0) + (overallTotals.unpaid || 0) - cashExpenses;
  const cashInBank = (overallTotals.paidWithQR || 0) - onlineExpenses;

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-card text-card-foreground">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 text-foreground font-semibold">Select</TableHead>
              <TableHead className="text-foreground font-semibold">Product</TableHead>
              <TableHead className="text-foreground font-semibold">Quantity Sold</TableHead>
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
                <TableCell className="text-foreground">{(product.quantity || 0).toFixed(2)}</TableCell>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OverviewCard
          sales={overallTotals.sales}
          openingBalance={openingBalance}
          setOpeningBalance={setOpeningBalance}
        />
        <ExpensesCard
          totalExpenses={totalExpenses}
          suppliesExpenses={suppliesExpenses}
        />
      </div>

      <FinancialSummaryCard
        cashInCounter={cashInCounter}
        cashInBank={cashInBank}
        netAmount={netProfit}
      />
    </div>
  );
};

export default BillingTable;