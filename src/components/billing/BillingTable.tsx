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

interface BillingTableProps {
  productTotals: any[];
  selectedProducts: string[];
  setSelectedProducts: (products: string[]) => void;
  overallTotals: {
    quantity: number;
    sales: number;
    unpaid: number;
  };
  totalExpenses: number;
  netProfit: number;
}

const BillingTable = ({
  productTotals,
  selectedProducts,
  setSelectedProducts,
  overallTotals,
  totalExpenses,
  netProfit,
}: BillingTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">Select</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Quantity Sold</TableHead>
          <TableHead>Total Sales (NPR)</TableHead>
          <TableHead>Unpaid Amount (NPR)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productTotals.map((product) => (
          <TableRow key={product.id}>
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
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.quantity}</TableCell>
            <TableCell>{product.amount.toLocaleString()}</TableCell>
            <TableCell>{product.unpaid.toLocaleString()}</TableCell>
          </TableRow>
        ))}
        <TableRow className="bg-muted/50 font-bold">
          <TableCell></TableCell>
          <TableCell>Total</TableCell>
          <TableCell>{overallTotals.quantity}</TableCell>
          <TableCell>NPR {overallTotals.sales.toLocaleString()}</TableCell>
          <TableCell>NPR {overallTotals.unpaid.toLocaleString()}</TableCell>
        </TableRow>
        <TableRow className="bg-muted/50">
          <TableCell></TableCell>
          <TableCell className="font-bold">Total Expenses</TableCell>
          <TableCell></TableCell>
          <TableCell colSpan={2} className="font-bold text-destructive">
            NPR {totalExpenses.toLocaleString()}
          </TableCell>
        </TableRow>
        <TableRow className="bg-muted/50">
          <TableCell></TableCell>
          <TableCell className="font-bold">Net Profit</TableCell>
          <TableCell></TableCell>
          <TableCell
            colSpan={2}
            className={`font-bold ${
              netProfit >= 0 ? "text-green-500" : "text-destructive"
            }`}
          >
            NPR {netProfit.toLocaleString()}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default BillingTable;