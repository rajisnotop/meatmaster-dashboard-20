import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface RecentCustomer {
  customerName: string;
  date: Date;
  total: number;
}

interface RecentCustomersProps {
  customers: RecentCustomer[];
}

const RecentCustomers = ({ customers }: RecentCustomersProps) => {
  return (
    <Card className="p-6 bg-background/80 border border-border/50 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-4">Recent Customers</h3>
      <ScrollArea className="h-[300px] w-full">
        <div className="space-y-4">
          {customers.map((customer, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div>
                <p className="font-medium">{customer.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(customer.date), { addSuffix: true })}
                </p>
              </div>
              <p className="font-mono">NPR {customer.total.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default RecentCustomers;