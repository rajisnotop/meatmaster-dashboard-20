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
import { ArrowUpIcon, ArrowDownIcon, Wallet, CreditCard, Calculator } from "lucide-react";

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
    <div className="space-y-8">
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sales Overview Card */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">Sales Overview</h3>
            <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700 dark:text-blue-300">Total Sales</span>
              <span className="font-semibold text-lg">
                NPR {(overallTotals.sales || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700 dark:text-blue-300">Quantity Sold</span>
              <span className="font-medium">
                {(overallTotals.quantity || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {/* Digital Payments Card */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-purple-900 dark:text-purple-100">Digital Payments</h3>
            <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-purple-700 dark:text-purple-300">QR Payments</span>
              <span className="font-medium">
                NPR {(overallTotals.paidWithQR || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-purple-700 dark:text-purple-300">Unpaid to QR</span>
              <span className="font-medium">
                NPR {(overallTotals.unpaidToPaidQR || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Financial Summary Card */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-green-900 dark:text-green-100">Financial Summary</h3>
            <Calculator className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-700 dark:text-green-300">Cash in Counter</span>
              <div className="flex items-center gap-2">
                {cashInCounter >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-600" />
                )}
                <span className={`font-semibold ${
                  cashInCounter >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  NPR {cashInCounter.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-green-200 dark:border-green-700">
              <span className="text-sm text-green-700 dark:text-green-300">Net Profit</span>
              <div className="flex items-center gap-2">
                {netProfit >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-600" />
                )}
                <span className={`font-semibold ${
                  netProfit >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  NPR {netProfit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BillingTable;