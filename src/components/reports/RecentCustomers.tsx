import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { TrendingUp, TrendingDown, User } from "lucide-react";

interface RecentCustomer {
  customerName: string;
  date: Date;
  total: number;
  previousTotal?: number;
}

interface RecentCustomersProps {
  customers: RecentCustomer[];
}

const RecentCustomers = ({ customers }: RecentCustomersProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-700/50 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-4">Recent Customers</h3>
      <ScrollArea className="h-[300px] w-full">
        <div className="space-y-4">
          {customers.map((customer, index) => {
            const percentageChange = customer.previousTotal
              ? ((customer.total - customer.previousTotal) / customer.previousTotal) * 100
              : 0;

            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-background/40 hover:bg-background/60 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{customer.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(customer.date), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-mono font-medium">NPR {customer.total.toLocaleString()}</p>
                  {customer.previousTotal && (
                    <div className={`text-sm flex items-center justify-end gap-1 ${
                      percentageChange >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {percentageChange >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {Math.abs(percentageChange).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default RecentCustomers;