import React from "react";
import { Card } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useStore } from "@/store/store";

interface GroupedOrders {
  [key: string]: {
    orders: any[];
    totalAmount: number;
  };
}

const GroupedOrdersList = ({ searchTerm = "", searchDate = "" }) => {
  const { orders, products } = useStore();

  // Group unpaid orders by customer
  const groupedUnpaidOrders = orders
    .filter((order) => !order.isPaid)
    .reduce((acc, order) => {
      const customerName = order.customerName || "Anonymous";
      
      // Apply search filters
      const product = products.find((p) => p.id === order.productId);
      const searchString = `${customerName} ${product?.name} ${order.total}`.toLowerCase();
      const dateMatch = searchDate
        ? new Date(order.date).toLocaleDateString().includes(searchDate)
        : true;

      if (
        searchString.includes(searchTerm.toLowerCase()) &&
        dateMatch
      ) {
        if (!acc[customerName]) {
          acc[customerName] = {
            orders: [],
            totalAmount: 0,
          };
        }
        acc[customerName].orders.push(order);
        acc[customerName].totalAmount += order.total;
      }
      return acc;
    }, {} as GroupedOrders);

  return (
    <div className="space-y-6">
      {Object.entries(groupedUnpaidOrders).map(([customerName, { orders: customerOrders, totalAmount }]) => (
        <Card key={customerName} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{customerName}</h3>
            <p className="text-red-600 font-bold">
              Total Unpaid: NPR {totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerOrders.map((order) => {
                  const product = products.find((p) => p.id === order.productId);
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        {new Date(order.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{product?.name}</TableCell>
                      <TableCell>{order.quantity} kg</TableCell>
                      <TableCell>NPR {order.total.toLocaleString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default GroupedOrdersList;