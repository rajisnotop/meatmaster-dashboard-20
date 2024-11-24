import React, { useState } from "react";
import { useStore } from "@/store/store";
import { toast } from "sonner";
import { ResetFilters } from "@/components/reset/ResetFilters";
import { ResetConfirmDialog } from "@/components/reset/ResetConfirmDialog";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const Reset = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [filters, setFilters] = useState({
    timeFilter: "custom",
    startDate: "",
    endDate: "",
  });
  
  const { orders, expenses, setOrders, setExpenses } = useStore();

  const handleReset = () => {
    const { timeFilter, startDate, endDate } = filters;
    let start: Date;
    let end: Date;

    switch (timeFilter) {
      case "today":
        start = new Date();
        start.setHours(0, 0, 0, 0);
        end = new Date();
        end.setHours(23, 59, 59, 999);
        break;
      case "week":
        start = new Date();
        start.setDate(start.getDate() - start.getDay());
        start.setHours(0, 0, 0, 0);
        end = new Date();
        end.setDate(end.getDate() + (6 - end.getDay()));
        end.setHours(23, 59, 59, 999);
        break;
      case "month":
        start = new Date();
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end = new Date();
        end.setMonth(end.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
    }

    const filteredOrders = orders.filter(
      (order) => !isWithinInterval(new Date(order.date), { start, end })
    );
    const filteredExpenses = expenses.filter(
      (expense) => !isWithinInterval(new Date(expense.date), { start, end })
    );

    setOrders(filteredOrders);
    setExpenses(filteredExpenses);
    toast.success("Data reset successful");
    setShowConfirm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto glass-effect p-8 rounded-xl shadow-lg border border-border/50 backdrop-blur-sm space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold">Reset Data</h2>
            </div>
            <p className="text-muted-foreground">
              Select a time period to reset all data within that range. This action cannot be undone.
            </p>
          </div>

          <ResetFilters
            filters={filters}
            setFilters={setFilters}
            onResetClick={() => setShowConfirm(true)}
          />

          <ResetConfirmDialog
            open={showConfirm}
            onOpenChange={setShowConfirm}
            onConfirm={handleReset}
          />
        </Card>
      </main>
    </div>
  );
};

export default Reset;