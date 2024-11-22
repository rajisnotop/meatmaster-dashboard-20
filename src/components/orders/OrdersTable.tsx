import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

interface OrdersTableProps {
  orders: any[];
  products: any[];
  onEdit: (order: any) => void;
  onMarkAsPaid: (orderId: string, withQR: boolean) => void;
}

const OrdersTable = ({ orders, products, onEdit, onMarkAsPaid }: OrdersTableProps) => {
  return (
    <div className="rounded-md border bg-background/60 backdrop-blur-sm animate-fade-in">
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
          {orders.map((order) => {
            const product = products.find((p) => p.id === order.productId);
            return (
              <TableRow key={order.id} className="hover:bg-accent/5 transition-colors">
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
                    onClick={() => onEdit(order)}
                    className="hover:bg-accent/20"
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
                        <AlertDialogAction onClick={() => onMarkAsPaid(order.id, true)}>
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
                        <AlertDialogAction onClick={() => onMarkAsPaid(order.id, false)}>
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
  );
};

export default OrdersTable;