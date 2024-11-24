import { Card } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface PaymentsCardProps {
  paidWithQR: number;
  unpaidToPaidQR: number;
}

const PaymentsCard = ({ paidWithQR, unpaidToPaidQR }: PaymentsCardProps) => {
  const totalDigitalPayments = paidWithQR + unpaidToPaidQR;

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-white">Digital Payments</h3>
        <CreditCard className="h-5 w-5 text-purple-400" />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">QR Payments</span>
          <span className="font-medium text-white">
            NPR {paidWithQR.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Unpaid to QR</span>
          <span className="font-medium text-white">
            NPR {unpaidToPaidQR.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Total Digital Pay</span>
          <span className="font-medium text-white">
            NPR {totalDigitalPayments.toLocaleString()}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default PaymentsCard;