import Header from "@/components/Header";
import { useStore } from "@/store/store";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import OrderForm from "@/components/OrderForm";
import OrdersSummary from "@/components/orders/OrdersSummary";
import OrdersSearch from "@/components/orders/OrdersSearch";
import GroupedOrdersList from "@/components/GroupedOrdersList";

const Orders = () => {
  const { orders, products } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);

  // Calculate totals with separate QR tracking
  const totalUnpaidAmount = orders
    .filter(order => !order.isPaid)
    .reduce((sum, order) => sum + order.total, 0);

  const totalPaidAmount = orders
    .filter(order => order.isPaid && !order.wasUnpaid && !order.paidWithQR)
    .reduce((sum, order) => sum + order.total, 0);
  
  const totalUnpaidToPaidAmount = orders
    .filter(order => order.isPaid && order.wasUnpaid && !order.paidWithQR)
    .reduce((sum, order) => sum + order.total, 0);

  const totalUnpaidToPaidQRAmount = orders
    .filter(order => order.isPaid && order.wasUnpaid && order.paidWithQR)
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 space-y-8 animate-fade-in">
        <OrdersSummary
          totalUnpaidAmount={totalUnpaidAmount}
          totalPaidAmount={totalPaidAmount}
          totalUnpaidToPaidAmount={totalUnpaidToPaidAmount}
          totalUnpaidToPaidQRAmount={totalUnpaidToPaidQRAmount}
          totalOrders={orders.length}
        />

        <div className="space-y-6">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
            <OrdersSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchDate={searchDate}
              setSearchDate={setSearchDate}
            />
          </div>

          <GroupedOrdersList searchTerm={searchTerm} searchDate={searchDate} />
        </div>

        <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
          <DialogContent>
            <OrderForm editingOrder={editingOrder} />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Orders;