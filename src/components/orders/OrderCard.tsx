import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

interface OrderCardProps {
  customerName: string;
  totalAmount: number;
  totalQRAmount: number;
  onMarkAllAsPaid: (withQR: boolean) => void;
}

const OrderCard = ({ customerName, totalAmount, totalQRAmount, onMarkAllAsPaid }: OrderCardProps) => {
  return (
    <Card className="p-6 bg-background/60 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-primary/80 to-accent/80 bg-clip-text text-transparent">
            {customerName}
          </h3>
          <p className="text-red-500 font-medium flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total Unpaid:</span>
            <span className="text-lg">NPR {totalAmount.toLocaleString()}</span>
          </p>
          {totalQRAmount > 0 && (
            <p className="text-blue-500 font-medium flex items-center gap-2">
              <span className="text-sm text-muted-foreground">QR Payments:</span>
              <span className="text-lg">NPR {totalQRAmount.toLocaleString()}</span>
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
                <AlertDialogAction onClick={() => onMarkAllAsPaid(true)}>
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
                <AlertDialogAction onClick={() => onMarkAllAsPaid(false)}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
};

export default OrderCard;