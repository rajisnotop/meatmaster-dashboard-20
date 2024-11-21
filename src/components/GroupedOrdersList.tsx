import React, { useState } from "react";
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
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import OrderForm from "./OrderForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

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
    console.log(`Marking order as paid${withQR ? ' with QR' : ''}:`, orderId);
    updateOrderStatus(orderId, true, withQR);
  };

  const handleMarkAllAsPaid = (customerOrders: any[], withQR: boolean = false) => {
    console.log(`Marking all orders as paid${withQR ? ' with QR' : ''} for customer`);
    customerOrders.forEach(order => {
      updateOrderStatus(order.id, true, withQR);
    });
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedUnpaidOrders).map(([customerName, { orders: customerOrders, totalAmount, totalQRAmount }]) => (
        <Card key={customerName} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">{customerName}</h3>
              <p className="text-red-600 font-bold">
                Total Unpaid: NPR {totalAmount.toLocaleString()}
              </p>
              {totalQRAmount > 0 && (
                <p className="text-blue-600 font-bold">
                  Total QR Payments: NPR {totalQRAmount.toLocaleString()}
                </p>
              )}
            </div>
            <div className="space-x-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-500"
                  >
                    Pay All with QR
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Mark All Orders as Paid with QR?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will mark all unpaid orders for {customerName} as paid with QR, totaling NPR {totalAmount.toLocaleString()}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleMarkAllAsPaid(customerOrders, true)}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-500"
                  >
                    Pay All Orders
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Mark All Orders as Paid?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will mark all unpaid orders for {customerName} as paid, totaling NPR {totalAmount.toLocaleString()}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleMarkAllAsPaid(customerOrders)}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
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
                      <TableCell className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingOrder(order)}
                        >
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-500"
                            >
                              Mark as Paid with QR
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Mark Order as Paid with QR?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action will move the order to the paid with QR section and update the financial reports.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleMarkAsPaid(order.id, true)}>
                                Confirm
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="bg-green-500/20 hover:bg-green-500/30 text-green-500"
                            >
                              Mark as Paid
                            </Button>
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
        </Card>
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