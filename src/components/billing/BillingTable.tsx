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
import { ArrowUpIcon, ArrowDownIcon, Wallet, CreditCard, Calculator, Receipt } from "lucide-react";

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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sales Overview Card */}
        <Card className="p-6 bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-white">Sales Overview</h3>
            <Wallet className="h-5 w-5 text-blue-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Total Sales</span>
              <span className="font-semibold text-lg text-white">
                NPR {(overallTotals.sales || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Quantity Sold</span>
              <span className="font-medium text-white">
                {(overallTotals.quantity || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {/* Digital Payments Card */}
        <Card className="p-6 bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-white">Digital Payments</h3>
            <CreditCard className="h-5 w-5 text-purple-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">QR Payments</span>
              <span className="font-medium text-white">
                NPR {(overallTotals.paidWithQR || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Unpaid to QR</span>
              <span className="font-medium text-white">
                NPR {(overallTotals.unpaidToPaidQR || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Expenses Card */}
        <Card className="p-6 bg-gradient-to-br from-red-900/30 to-red-800/30 border-red-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-white">Expenses</h3>
            <Receipt className="h-5 w-5 text-red-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Total Expenses</span>
              <span className="font-medium text-white">
                NPR {(totalExpenses || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Opening Balance</span>
              <span className="font-medium text-white">
                NPR {(openingBalance || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Financial Summary Card */}
        <Card className="p-6 bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-white">Financial Summary</h3>
            <Calculator className="h-5 w-5 text-green-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Cash in Counter</span>
              <div className="flex items-center gap-2">
                {cashInCounter >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-400" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-400" />
                )}
                <span className="font-semibold text-white">
                  NPR {cashInCounter.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-green-700">
              <span className="text-sm text-gray-300">Net Amount</span>
              <div className="flex items-center gap-2">
                {netProfit >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-400" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-400" />
                )}
                <span className="font-semibold text-white">
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