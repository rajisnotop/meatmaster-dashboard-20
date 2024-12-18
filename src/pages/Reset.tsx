import React, { useState } from "react";
import { useStore } from "@/store/store";
import { useExpenseStore } from "@/store/expenseStore";
import { toast } from "sonner";
import { ResetFilters } from "@/components/reset/ResetFilters";
import { ResetConfirmDialog } from "@/components/reset/ResetConfirmDialog";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { isWithinInterval, startOfDay, endOfDay } from "date-fns";

const Reset = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [filters, setFilters] = useState({
    timeFilter: "specific",
    startDate: "",
    endDate: "",
    specificDate: "",
  });
  
  const { orders, setOrders } = useStore();
  const { expenses, setExpenses } = useExpenseStore();

  const handleReset = () => {
    const { timeFilter, startDate, endDate, specificDate } = filters;
    let start: Date;
    let end: Date;

    switch (timeFilter) {
      case "specific":
        start = startOfDay(new Date(specificDate));
        end = endOfDay(new Date(specificDate));
        break;
      case "today":
        start = startOfDay(new Date());
        end = endOfDay(new Date());
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
        start = startOfDay(new Date(startDate));
        end = endOfDay(new Date(endDate));
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