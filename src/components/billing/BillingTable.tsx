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
    unpaidToPaidQR: number;
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
          <TableHead>Unpaid to Paid Amount (NPR)</TableHead>
          <TableHead>Unpaid to Paid with QR (NPR)</TableHead>
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
            <TableCell>{product.quantity.toFixed(2)}</TableCell>
            <TableCell>{product.amount.toLocaleString()}</TableCell>
            <TableCell>{product.unpaid.toLocaleString()}</TableCell>
            <TableCell>{product.unpaidToPaidQR.toLocaleString()}</TableCell>
          </TableRow>
        ))}
        <TableRow className="bg-muted/50 font-bold">
          <TableCell></TableCell>
          <TableCell>Total</TableCell>
          <TableCell>{overallTotals.quantity.toFixed(2)}</TableCell>
          <TableCell>NPR {overallTotals.sales.toLocaleString()}</TableCell>
          <TableCell>NPR {overallTotals.unpaid.toLocaleString()}</TableCell>
          <TableCell>NPR {overallTotals.unpaidToPaidQR.toLocaleString()}</TableCell>
        </TableRow>
        <TableRow className="bg-muted/50">
          <TableCell></TableCell>
          <TableCell className="font-bold">Total Expenses</TableCell>
          <TableCell></TableCell>
          <TableCell colSpan={3} className="font-bold text-destructive">
            NPR {totalExpenses.toLocaleString()}
          </TableCell>
        </TableRow>
        <TableRow className="bg-muted/50">
          <TableCell></TableCell>
          <TableCell className="font-bold">Net Profit</TableCell>
          <TableCell></TableCell>
          <TableCell
            colSpan={3}
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