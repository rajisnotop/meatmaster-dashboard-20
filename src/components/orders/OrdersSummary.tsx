import { Card } from "@/components/ui/card";
import { ArrowUpRight, Wallet, CreditCard, AlertCircle, Receipt } from "lucide-react";

interface OrdersSummaryProps {
  totalUnpaidAmount: number;
  totalPaidAmount: number;
  totalUnpaidToPaidAmount: number;
  totalUnpaidToPaidQRAmount: number;
  totalOrders: number;
}

const OrdersSummary = ({
  totalUnpaidAmount,
  totalPaidAmount,
  totalUnpaidToPaidAmount,
  totalUnpaidToPaidQRAmount,
  totalOrders,
}: OrdersSummaryProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="p-6 bg-gradient-to-br from-red-900/30 to-red-800/30 border-red-700/50 hover:scale-[1.02] transition-transform">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">Unpaid Amount</p>
            <p className="text-2xl font-bold text-red-400">
              NPR {totalUnpaidAmount.toLocaleString()}
            </p>
          </div>
          <AlertCircle className="h-8 w-8 text-red-400 opacity-75" />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-700/50 hover:scale-[1.02] transition-transform">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">Paid Amount</p>
            <p className="text-2xl font-bold text-green-400">
              NPR {totalPaidAmount.toLocaleString()}
            </p>
          </div>
          <Wallet className="h-8 w-8 text-green-400 opacity-75" />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/50 hover:scale-[1.02] transition-transform">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">Unpaid to Paid</p>
            <p className="text-2xl font-bold text-blue-400">
              NPR {totalUnpaidToPaidAmount.toLocaleString()}
            </p>
          </div>
          <ArrowUpRight className="h-8 w-8 text-blue-400 opacity-75" />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-700/50 hover:scale-[1.02] transition-transform">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">Unpaid to QR</p>
            <p className="text-2xl font-bold text-purple-400">
              NPR {totalUnpaidToPaidQRAmount.toLocaleString()}
            </p>
          </div>
          <CreditCard className="h-8 w-8 text-purple-400 opacity-75" />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-orange-900/30 to-orange-800/30 border-orange-700/50 hover:scale-[1.02] transition-transform">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">Total Orders</p>
            <p className="text-2xl font-bold text-orange-400">
              {totalOrders}
            </p>
          </div>
          <Receipt className="h-8 w-8 text-orange-400 opacity-75" />
        </div>
      </Card>
    </div>
  );
};

export default OrdersSummary;