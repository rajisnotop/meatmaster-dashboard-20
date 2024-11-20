import Header from "@/components/Header";
import { useStore } from "@/store/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";

const Credit = () => {
  const { orders, products, updateOrderStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter orders based on payment status
  const unpaidOrders = orders.filter(order => !order.isPaid);
  const paidOrders = orders.filter(order => order.isPaid);

  // Calculate totals correctly based on payment status
  const totalUnpaidAmount = unpaidOrders.reduce((sum, order) => sum + order.total, 0);
  const totalPaidAmount = paidOrders.reduce((sum, order) => sum + order.total, 0);
  
  const handleMarkAsPaid = (orderId: string) => {
    updateOrderStatus(orderId, true);
  };

  // Filter orders based on search term
  const filteredUnpaidOrders = unpaidOrders.filter(order => {
    const product = products.find(p => p.id === order.productId);
    const searchString = `${order.customerName} ${product?.name}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const filteredPaidOrders = paidOrders.filter(order => {
    const product = products.find(p => p.id === order.productId);
    const searchString = `${order.customerName} ${product?.name}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 space-y-8">
        <div className="grid gap-6">
          <Card className="p-8">
            <h2 className="text-xl font-bold mb-6">Credit Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Unpaid Amount</p>
                <p className="text-2xl font-bold text-red-600">NPR {totalUnpaidAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid Amount</p>
                <p className="text-2xl font-bold text-green-600">NPR {totalPaidAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Unpaid Orders</h2>
              <div className="relative w-64">
                <Input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUnpaidOrders.map((order) => {
                    const product = products.find(p => p.id === order.productId);
                    return (
                      <TableRow key={order.id}>
                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                        <TableCell>{order.customerName || "Anonymous"}</TableCell>
                        <TableCell>{product?.name}</TableCell>
                        <TableCell>{order.quantity} kg</TableCell>
                        <TableCell>NPR {order.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">Mark as Paid</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Mark Order as Paid?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will move the order to the paid section and update the financial reports.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleMarkAsPaid(order.id)}>
                                  Confirm
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

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
      </main>
    </div>
  );
};

export default Credit;