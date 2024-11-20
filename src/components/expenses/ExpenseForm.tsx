import { useState } from "react";
import { useStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const ExpenseForm = () => {
  const { addExpense } = useStore();
  const { toast } = useToast();
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    description: "",
    date: new Date(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!expense.category || !expense.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(expense.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid positive amount",
        variant: "destructive",
      });
      return;
    }

    addExpense({
      category: expense.category,
      amount,
      description: expense.description,
      date: expense.date,
    });

    setExpense({
      category: "",
      amount: "",
      description: "",
      date: new Date(),
    });

    toast({
      title: "Success",
      description: "Expense added successfully",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={expense.category} onValueChange={(value) => setExpense({ ...expense, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rent">Rent</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="salaries">Salaries</SelectItem>
            <SelectItem value="supplies">Supplies</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="miscellaneous">Miscellaneous</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (NPR)</Label>
        <Input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          value={expense.amount}
          onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
          placeholder="Enter amount"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={expense.description}
          onChange={(e) => setExpense({ ...expense, description: e.target.value })}
          placeholder="Enter description"
        />
      </div>

      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(expense.date, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={expense.date}
              onSelect={(date) => date && setExpense({ ...expense, date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" className="w-full">Add Expense</Button>
    </form>
  );
};

export default ExpenseForm;