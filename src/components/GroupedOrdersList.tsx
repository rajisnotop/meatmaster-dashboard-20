import React, { useState } from "react";
import { useStore } from "@/store/store";
import { Dialog, DialogContent } from "./ui/dialog";
import OrderForm from "./OrderForm";
import OrderCard from "./orders/OrderCard";
import OrdersTable from "./orders/OrdersTable";
import { useToast } from "./ui/use-toast";

interface GroupedOrders {
  [key: string]: {
    orders: any[];
    totalAmount: number;
    totalQRAmount: number;
  };
}

interface AdvancedFilters {
  paymentStatus: string;
  minAmount: number;
  maxAmount: number;
  startDate: string;
  endDate: string;
  productId: string;
}

const GroupedOrdersList = ({ searchTerm = "", searchDate = "" }) => {
  const { orders, products, updateOrderStatus } = useStore();
  const [editingOrder, setEditingOrder] = useState(null);
  const { toast } = useToast();
  const [filters, setFilters] = useState<AdvancedFilters>({
    paymentStatus: 'all',
    minAmount: 0,
    maxAmount: Infinity,
    startDate: '',
    endDate: '',
    productId: 'all'
  });

  // Group unpaid orders by customer with advanced filtering
  const groupedUnpaidOrders = orders
    .filter((order) => {
      // Basic filters
      const product = products.find((p) => p.id === order.productId);
      const searchString = `${order.customerName} ${product?.name} ${order.total}`.toLowerCase();
      const orderDate = new Date(order.date);
      const searchDateObj = searchDate ? new Date(searchDate) : null;
      const dateMatch = searchDate
        ? orderDate.toDateString() === searchDateObj?.toDateString()
        : true;

      // Advanced filters
      const paymentStatusMatch = filters.paymentStatus === 'all' || 
        (filters.paymentStatus === 'paid' && order.isPaid) ||
        (filters.paymentStatus === 'unpaid' && !order.isPaid) ||
        (filters.paymentStatus === 'qr' && order.paidWithQR);

      const amountMatch = order.total >= filters.minAmount && 
        (filters.maxAmount === Infinity || order.total <= filters.maxAmount);

      const dateRangeMatch = (!filters.startDate || orderDate >= new Date(filters.startDate)) &&
        (!filters.endDate || orderDate <= new Date(filters.endDate));

      const productMatch = filters.productId === 'all' || order.productId === filters.productId;

      return !order.isPaid && 
        searchString.includes(searchTerm.toLowerCase()) &&
        dateMatch &&
        paymentStatusMatch &&
        amountMatch &&
        dateRangeMatch &&
        productMatch;
    })
    .reduce((acc, order) => {
      const customerName = order.customerName || "Anonymous";
      
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
      return acc;
    }, {} as GroupedOrders);

  const handleMarkAsPaid = (orderId: string, withQR: boolean = false) => {
    updateOrderStatus(orderId, true, withQR);
    toast({
      title: "Order Updated",
      description: `Order has been marked as ${withQR ? 'paid with QR' : 'paid'}`,
      variant: "default",
    });
  };

  const handleMarkAllAsPaid = (customerOrders: any[], withQR: boolean = false) => {
    customerOrders.forEach(order => {
      updateOrderStatus(order.id, true, withQR);
    });
    toast({
      title: "Orders Updated",
      description: `All orders have been marked as ${withQR ? 'paid with QR' : 'paid'}`,
      variant: "default",
    });
  };

  if (Object.keys(groupedUnpaidOrders).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-card/50 rounded-lg border border-border/50 backdrop-blur-sm">
        <p className="text-lg text-muted-foreground">No unpaid orders found</p>
        <p className="text-sm text-muted-foreground">
          All orders have been paid or no orders match your search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedUnpaidOrders).map(([customerName, { orders: customerOrders, totalAmount, totalQRAmount }]) => (
        <div key={customerName} className="space-y-4 animate-fade-in">
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