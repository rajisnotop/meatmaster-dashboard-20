import { Card } from "@/components/ui/card";
import { Calculator } from "lucide-react";

interface NetAmountCardProps {
  netAmount: number;
  cashInCounter: number;
  cashInBank: number;
}

const NetAmountCard = ({ netAmount, cashInCounter, cashInBank }: NetAmountCardProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 border-emerald-700/50 col-span-full mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-white">Financial Summary</h3>
        <Calculator className="h-5 w-5 text-emerald-400" />
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="space-y-2">
          <span className="text-sm text-gray-300">Net Amount</span>
          <div className="font-bold text-2xl text-white">
            NPR {netAmount.toLocaleString()}
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-sm text-gray-300">Cash in Counter</span>
          <div className="font-bold text-2xl text-white">
            NPR {cashInCounter.toLocaleString()}
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-sm text-gray-300">Cash in Bank</span>
          <div className="font-bold text-2xl text-white">
            NPR {cashInBank.toLocaleString()}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NetAmountCard;