import { Card } from "@/components/ui/card";
import ExpenseForm from "./ExpenseForm";

const ExpenseFormCard = () => {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Add New Expense</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Record a new expense with amount, description, and date.
        </p>
      </div>
      <ExpenseForm />
    </Card>
  );
};

export default ExpenseFormCard;