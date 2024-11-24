import { Card } from "@/components/ui/card";
import { Calculator, ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface FinancialSummaryCardProps {
  cashInCounter: number;
  cashInBank: number;
  netAmount: number;
}

const FinancialSummaryCard = ({ cashInCounter, cashInBank, netAmount }: FinancialSummaryCardProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-700/50 col-span-full mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-white">Financial Summary</h3>
        <Calculator className="h-5 w-5 text-green-400" />
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="space-y-2">
          <span className="text-sm text-gray-300">Cash in Counter</span>
          <div className="flex items-center gap-2">
            {cashInCounter >= 0 ? (
              <ArrowUpIcon className="h-4 w-4 text-green-400" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-400" />
            )}
            <span className="font-bold text-2xl text-white">
              NPR {cashInCounter.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-sm text-gray-300">Cash in Bank</span>
          <div className="flex items-center gap-2">
            {cashInBank >= 0 ? (
              <ArrowUpIcon className="h-4 w-4 text-green-400" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-400" />
            )}
            <span className="font-bold text-2xl text-white">
              NPR {cashInBank.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-sm text-gray-300">Net Amount</span>
          <div className="flex items-center gap-2">
            {netAmount >= 0 ? (
              <ArrowUpIcon className="h-4 w-4 text-green-400" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-400" />
            )}
            <span className="font-bold text-2xl text-white">
              NPR {netAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FinancialSummaryCard;