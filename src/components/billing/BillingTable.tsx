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
import { Card } from "@/components/ui/card";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Label htmlFor="openingBalance" className="text-sm font-medium">
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
      
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
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
                <TableCell>
                  {(product.unpaidToPaidQR || 0).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Summary Card */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">Sales Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Quantity</span>
              <span className="font-medium">
                {(overallTotals.quantity || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Sales</span>
              <span className="font-medium">
                NPR {(overallTotals.sales || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total QR Payments</span>
              <span className="font-medium">
                NPR {(overallTotals.paidWithQR || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Financial Summary Card */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">Financial Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Opening Balance</span>
              <span className="font-medium text-blue-500">
                NPR {(openingBalance || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Expenses</span>
              <span className="font-medium text-destructive">
                NPR {(totalExpenses || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cash in Counter</span>
              <span
                className={`font-medium ${
                  cashInCounter >= 0 ? "text-green-500" : "text-destructive"
                }`}
              >
                NPR {cashInCounter.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-3">
              <span className="text-muted-foreground">Net Amount</span>
              <span
                className={`font-medium ${
                  netProfit >= 0 ? "text-green-500" : "text-destructive"
                }`}
              >
                NPR {(netProfit || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BillingTable;
