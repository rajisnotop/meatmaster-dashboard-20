import Header from "@/components/Header";
import { useStore } from "@/store/store";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderForm from "@/components/OrderForm";
import OrdersSummary from "@/components/orders/OrdersSummary";
import OrdersSearch from "@/components/orders/OrdersSearch";
import GroupedOrdersList from "@/components/GroupedOrdersList";
import PaidOrdersList from "@/components/orders/PaidOrdersList";
import { Card } from "@/components/ui/card";

const Orders = () => {
  const { orders } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [filters, setFilters] = useState({
    paymentStatus: "all",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
    productId: "all",
  });

  // Calculate totals
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

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <main className="flex-1 p-8 space-y-8 animate-fade-in">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold gradient-text">Orders Management</h1>
              <OrderForm />
            </div>

            <Card className="dashboard-card">
              <OrdersSummary
                totalUnpaidAmount={totalUnpaidAmount}
                totalPaidAmount={totalPaidAmount}
                totalUnpaidToPaidAmount={totalUnpaidToPaidAmount}
                totalUnpaidToPaidQRAmount={totalUnpaidToPaidQRAmount}
                totalOrders={orders.length}
              />
            </Card>

            <Card className="dashboard-card">
              <div className="mb-6">
                <OrdersSearch
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  searchDate={searchDate}
                  setSearchDate={setSearchDate}
                  onFilterChange={handleFilterChange}
                />
              </div>

              <Tabs defaultValue="unpaid" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="unpaid" className="text-lg">Unpaid Orders</TabsTrigger>
                  <TabsTrigger value="paid" className="text-lg">Paid Orders</TabsTrigger>
                </TabsList>
                
                <TabsContent value="unpaid" className="mt-0">
                  <GroupedOrdersList searchTerm={searchTerm} searchDate={searchDate} />
                </TabsContent>
                
                <TabsContent value="paid" className="mt-0">
                  <PaidOrdersList searchTerm={searchTerm} searchDate={searchDate} />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
            <DialogContent>
              <OrderForm editingOrder={editingOrder} />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Orders;