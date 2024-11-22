import React from "react";
import { useStore } from "@/store/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PaidOrdersListProps {
  searchTerm: string;
  searchDate: string;
}

const PaidOrdersList = ({ searchTerm, searchDate }: PaidOrdersListProps) => {
  const { orders, products } = useStore();

  // Group paid orders by date
  const groupedPaidOrders = orders
    .filter((order) => order.isPaid)
    .reduce((acc, order) => {
      const orderDate = new Date(order.date);
      const dateKey = orderDate.toDateString();
      const searchDateObj = searchDate ? new Date(searchDate) : null;
      const product = products.find((p) => p.id === order.productId);
      const searchString = `${order.customerName} ${product?.name} ${order.total}`.toLowerCase();
      
      const dateMatch = searchDate
        ? orderDate.toDateString() === searchDateObj?.toDateString()
        : true;

      if (searchString.includes(searchTerm.toLowerCase()) && dateMatch) {
        if (!acc[dateKey]) {
          acc[dateKey] = {
            orders: [],
            totalAmount: 0,
            totalQRAmount: 0,
          };
        }
        acc[dateKey].orders.push(order);
        acc[dateKey].totalAmount += order.total;
        if (order.paidWithQR) {
          acc[dateKey].totalQRAmount += order.total;
        }
      }
      return acc;
    }, {} as Record<string, { orders: any[]; totalAmount: number; totalQRAmount: number }>);

  if (Object.keys(groupedPaidOrders).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-card/50 rounded-lg border border-border/50 backdrop-blur-sm">
        <p className="text-lg text-muted-foreground">No paid orders found</p>
        <p className="text-sm text-muted-foreground">
          No paid orders match your search criteria
        </p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {Object.entries(groupedPaidOrders)
        .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
        .map(([date, { orders: dateOrders, totalAmount, totalQRAmount }]) => (
          <AccordionItem 
            key={date} 
            value={date}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-6"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex justify-between items-center w-full">
                <span className="font-semibold">{new Date(date).toLocaleDateString()}</span>
                <div className="flex gap-4">
                  <span className="text-green-400">
                    Cash: NPR {(totalAmount - totalQRAmount).toLocaleString()}
                  </span>
                  <span className="text-blue-400">
                    QR: NPR {totalQRAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="rounded-md border animate-fade-in">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dateOrders.map((order) => {
                      const product = products.find((p) => p.id === order.productId);
                      return (
                        <TableRow key={order.id}>
                          <TableCell>{order.customerName || "Anonymous"}</TableCell>
                          <TableCell>{product?.name}</TableCell>
                          <TableCell>{order.quantity} kg</TableCell>
                          <TableCell>NPR {order.total.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={order.paidWithQR ? "text-blue-400" : "text-green-400"}>
                              {order.paidWithQR ? "QR" : "Cash"}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
};

export default PaidOrdersList;