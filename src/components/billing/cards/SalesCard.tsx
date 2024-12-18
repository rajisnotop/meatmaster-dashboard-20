import { Card } from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface SalesCardProps {
  sales: number;
  openingBalance: number;
  quantity: number;
}

const SalesCard = ({ sales, openingBalance, quantity }: SalesCardProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-white">Sales Overview</h3>
        <Wallet className="h-5 w-5 text-blue-400" />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Total Sales</span>
          <span className="font-semibold text-lg text-white">
            NPR {sales.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Opening Balance</span>
          <span className="font-medium text-white">
            NPR {openingBalance.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Quantity Sold</span>
          <span className="font-medium text-white">
            {quantity.toLocaleString()} kg
          </span>
        </div>
      </div>
    </Card>
  );
};

export default SalesCard;