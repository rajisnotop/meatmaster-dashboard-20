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
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Orders = () => {
  const { orders } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-b from-[#fefae0] to-[#fefae0]/95">
      <Header />
      <main className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight text-[#283618]"
          >
            Orders Management
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Button
              onClick={() => setShowNewOrderForm(true)}
              className="bg-[#bc6c25] hover:bg-[#dda15e] text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Order
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-white/50 backdrop-blur-sm border border-[#606c38]/20 p-6 shadow-lg"
        >
          <OrdersSummary
            totalUnpaidAmount={totalUnpaidAmount}
            totalPaidAmount={totalPaidAmount}
            totalUnpaidToPaidAmount={totalUnpaidToPaidAmount}
            totalUnpaidToPaidQRAmount={totalUnpaidToPaidQRAmount}
            totalOrders={orders.length}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex flex-col gap-6">
            <OrdersSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchDate={searchDate}
              setSearchDate={setSearchDate}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="rounded-xl bg-white/50 backdrop-blur-sm border border-[#606c38]/20 p-6 shadow-lg">
            <Tabs defaultValue="unpaid" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger 
                  value="unpaid" 
                  className="text-lg data-[state=active]:bg-[#606c38] data-[state=active]:text-white"
                >
                  Unpaid Orders
                </TabsTrigger>
                <TabsTrigger 
                  value="paid" 
                  className="text-lg data-[state=active]:bg-[#606c38] data-[state=active]:text-white"
                >
                  Paid Orders
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="unpaid" className="mt-0">
                <GroupedOrdersList searchTerm={searchTerm} searchDate={searchDate} />
              </TabsContent>
              
              <TabsContent value="paid" className="mt-0">
                <PaidOrdersList searchTerm={searchTerm} searchDate={searchDate} />
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>

        <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <OrderForm editingOrder={editingOrder} />
          </DialogContent>
        </Dialog>

        <Dialog open={showNewOrderForm} onOpenChange={setShowNewOrderForm}>
          <DialogContent className="sm:max-w-[600px]">
            <OrderForm />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Orders;