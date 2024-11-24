import { Card } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OverviewCardProps {
  sales: number;
  openingBalance: number;
  setOpeningBalance: (balance: number) => void;
}

const OverviewCard = ({ sales, openingBalance, setOpeningBalance }: OverviewCardProps) => {
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
        <div className="space-y-2">
          <Label htmlFor="openingBalance" className="text-sm text-gray-300">
            Opening Balance
          </Label>
          <Input
            id="openingBalance"
            type="number"
            value={openingBalance}
            onChange={(e) => setOpeningBalance(Number(e.target.value))}
            className="bg-white/10 border-white/20 text-white"
            placeholder="Enter opening balance"
          />
        </div>
      </div>
    </Card>
  );
};

export default OverviewCard;