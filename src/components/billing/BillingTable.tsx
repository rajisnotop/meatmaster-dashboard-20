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
    paidWithQR: number;
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
  // Calculate cash in counter (total sales - expenses)
  const cashInCounter = (overallTotals.sales || 0) - (totalExpenses || 0);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">Select</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Quantity Sold</TableHead>
          <TableHead>Total Sales (NPR)</TableHead>
          <TableHead>Paid with QR (NPR)</TableHead>
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
            <TableCell>{(product.quantity || 0).toFixed(2)}</TableCell>
            <TableCell>{(product.amount || 0).toLocaleString()}</TableCell>
            <TableCell>{(product.paidWithQR || 0).toLocaleString()}</TableCell>
            <TableCell>{(product.unpaid || 0).toLocaleString()}</TableCell>
            <TableCell>{(product.unpaidToPaidQR || 0).toLocaleString()}</TableCell>
          </TableRow>
        ))}
        <TableRow className="bg-muted/50 font-bold">
          <TableCell></TableCell>
          <TableCell>Total</TableCell>
          <TableCell>{(overallTotals.quantity || 0).toFixed(2)}</TableCell>
          <TableCell>NPR {(overallTotals.sales || 0).toLocaleString()}</TableCell>
          <TableCell>NPR {(overallTotals.paidWithQR || 0).toLocaleString()}</TableCell>
          <TableCell>NPR {(overallTotals.unpaid || 0).toLocaleString()}</TableCell>
          <TableCell>NPR {(overallTotals.unpaidToPaidQR || 0).toLocaleString()}</TableCell>
        </TableRow>
        <TableRow className="bg-muted/50">
          <TableCell></TableCell>
          <TableCell className="font-bold">Total Expenses</TableCell>
          <TableCell></TableCell>
          <TableCell colSpan={4} className="font-bold text-destructive">
            NPR {(totalExpenses || 0).toLocaleString()}
          </TableCell>
        </TableRow>
        <TableRow className="bg-muted/50">
          <TableCell></TableCell>
          <TableCell className="font-bold">Cash in Counter</TableCell>
          <TableCell></TableCell>
          <TableCell
            colSpan={4}
            className={`font-bold ${
              cashInCounter >= 0 ? "text-green-500" : "text-destructive"
            }`}
          >
            NPR {cashInCounter.toLocaleString()}
          </TableCell>
        </TableRow>
        <TableRow className="bg-muted/50">
          <TableCell></TableCell>
          <TableCell className="font-bold">Net Profit</TableCell>
          <TableCell></TableCell>
          <TableCell
            colSpan={4}
            className={`font-bold ${
              netProfit >= 0 ? "text-green-500" : "text-destructive"
            }`}
          >
            NPR {(netProfit || 0).toLocaleString()}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default BillingTable;