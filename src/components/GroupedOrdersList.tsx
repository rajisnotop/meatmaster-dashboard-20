import React, { useState } from "react";
import { useStore } from "@/store/store";
import { Dialog, DialogContent } from "./ui/dialog";
import OrderForm from "./OrderForm";
import OrderCard from "./orders/OrderCard";
import OrdersTable from "./orders/OrdersTable";

interface GroupedOrders {
  [key: string]: {
    orders: any[];
    totalAmount: number;
    totalQRAmount: number;
  };
}

const GroupedOrdersList = ({ searchTerm = "", searchDate = "" }) => {
  const { orders, products, updateOrderStatus } = useStore();
  const [editingOrder, setEditingOrder] = useState(null);

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
            totalQRAmount: 0,
          };
        }
        acc[customerName].orders.push(order);
        acc[customerName].totalAmount += order.total;
        if (order.paidWithQR) {
          acc[customerName].totalQRAmount += order.total;
        }
      }
      return acc;
    }, {} as GroupedOrders);

  const handleMarkAsPaid = (orderId: string, withQR: boolean = false) => {
    updateOrderStatus(orderId, true, withQR);
  };

  const handleMarkAllAsPaid = (customerOrders: any[], withQR: boolean = false) => {
    customerOrders.forEach(order => {
      updateOrderStatus(order.id, true, withQR);
    });
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedUnpaidOrders).map(([customerName, { orders: customerOrders, totalAmount, totalQRAmount }]) => (
        <div key={customerName} className="space-y-4">
          <OrderCard
            customerName={customerName}
            totalAmount={totalAmount}
            totalQRAmount={totalQRAmount}
            onMarkAllAsPaid={(withQR) => handleMarkAllAsPaid(customerOrders, withQR)}
          />
          <OrdersTable
            orders={customerOrders}
            products={products}
            onEdit={setEditingOrder}
            onMarkAsPaid={handleMarkAsPaid}
          />
        </div>
      ))}

      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent>
          <OrderForm editingOrder={editingOrder} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupedOrdersList;