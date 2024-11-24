import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/store";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

interface ResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ResetDialog = ({ open, onOpenChange }: ResetDialogProps) => {
  const [timeFilter, setTimeFilter] = React.useState("custom");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [showConfirm, setShowConfirm] = React.useState(false);
  
  const { orders, expenses, setOrders, setExpenses } = useStore();

  const handleReset = () => {
    let start: Date;
    let end: Date;

    switch (timeFilter) {
      case "today":
        start = startOfDay(new Date());
        end = endOfDay(new Date());
        break;
      case "week":
        start = startOfWeek(new Date());
        end = endOfWeek(new Date());
        break;
      case "month":
        start = startOfMonth(new Date());
        end = endOfMonth(new Date());
        break;
      default:
        start = startOfDay(new Date(startDate));
        end = endOfDay(new Date(endDate));
    }

    // Filter out data within the selected date range
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
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Data</DialogTitle>
          <DialogDescription>
            Select a time period to reset all data within that range. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        {!showConfirm ? (
          <div className="space-y-4 py-4">
            <Select
              value={timeFilter}
              onValueChange={(value) => {
                setTimeFilter(value);
                setStartDate("");
                setEndDate("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Range</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            {timeFilter === "custom" && (
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setShowConfirm(true)}
                disabled={timeFilter === "custom" && (!startDate || !endDate)}
              >
                Reset
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <p className="text-destructive font-semibold">
              Are you absolutely sure you want to reset all data within the selected time period?
            </p>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. All orders, expenses, and related data within this period will be permanently deleted.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReset}>
                Confirm Reset
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResetDialog;