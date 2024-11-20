import Header from "@/components/Header";
import { useStore } from "@/store/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import GroupedOrdersList from "@/components/GroupedOrdersList";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import OrderForm from "@/components/OrderForm";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Orders = () => {
  const { orders, products, updateOrderStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);

  // Calculate totals
  const totalUnpaidAmount = orders
    .filter(order => !order.isPaid)
    .reduce((sum, order) => sum + order.total, 0);
  const totalPaidAmount = orders
    .filter(order => order.isPaid)
    .reduce((sum, order) => sum + order.total, 0);

  // Filter paid orders based on search criteria
  const filteredPaidOrders = orders.filter(order => {
    if (!order.isPaid) return false;
    const product = products.find(p => p.id === order.productId);
    const searchString = `${order.customerName} ${product?.name} ${order.total}`.toLowerCase();
    const dateMatch = searchDate ? new Date(order.date).toLocaleDateString().includes(searchDate) : true;
    return searchString.includes(searchTerm.toLowerCase()) && dateMatch;
  });

  const handleMarkAsPaid = (orderId: string) => {
    updateOrderStatus(orderId, true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 space-y-8">
        <div className="grid gap-6">
          <Card className="p-8">
            <h2 className="text-xl font-bold mb-6">Orders Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Unpaid Amount</p>
                <p className="text-2xl font-bold text-red-600">
                  NPR {totalUnpaidAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  NPR {totalPaidAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <h2 className="text-2xl font-bold">Orders</h2>
              <div className="flex gap-4 w-full md:w-auto">
                <Input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64"
                />
                <Input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full md:w-auto"
                />
              </div>
            </div>

            <GroupedOrdersList searchTerm={searchTerm} searchDate={searchDate} />

            <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
              <DialogContent className="sm:max-w-[425px]">
                <OrderForm editingOrder={editingOrder} />
              </DialogContent>
            </Dialog>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Paid Orders</h2>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPaidOrders.map((order) => {
                      const product = products.find(p => p.id === order.productId);
                      return (
                        <TableRow key={order.id}>
                          <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell>{order.customerName || "Anonymous"}</TableCell>
                          <TableCell>{product?.name}</TableCell>
                          <TableCell>{order.quantity} kg</TableCell>
                          <TableCell>NPR {order.total.toLocaleString()}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Orders;