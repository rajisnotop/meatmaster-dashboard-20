import React, { useState } from "react";
import { useStore } from "@/store/store";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, AlertTriangle } from "lucide-react";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  format,
} from "date-fns";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Reset = () => {
  const [timeFilter, setTimeFilter] = useState("custom");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  
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
        <Card className="max-w-2xl mx-auto glass-effect p-8 rounded-xl shadow-lg border border-border/50 backdrop-blur-sm space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-2xl font-bold">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <h2>Reset Data</h2>
            </div>
            <p className="text-muted-foreground">
              Select a time period to reset all data within that range. This action cannot be undone.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <Select
                value={timeFilter}
                onValueChange={(value) => {
                  setTimeFilter(value);
                  setStartDate("");
                  setEndDate("");
                }}
              >
                <SelectTrigger className="w-full bg-background/80">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom Range</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {timeFilter === "custom" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-background/80"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(new Date(startDate), "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate ? new Date(startDate) : undefined}
                        onSelect={(date) => setStartDate(date ? format(date, 'yyyy-MM-dd') : '')}
                        disabled={(date) => endDate ? date > new Date(endDate) : false}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-background/80"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(new Date(endDate), "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate ? new Date(endDate) : undefined}
                        onSelect={(date) => setEndDate(date ? format(date, 'yyyy-MM-dd') : '')}
                        disabled={(date) => startDate ? date < new Date(startDate) : false}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>

          <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="w-full mt-6"
                disabled={timeFilter === "custom" && (!startDate || !endDate)}
              >
                Reset Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. All orders, expenses, and related data within the selected time period will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Reset Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
      </main>
    </div>
  );
};

export default Reset;