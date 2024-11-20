import { Card } from "@/components/ui/card";
import { useStore } from "@/store/store";

const ExpenseSummary = () => {
  const expenses = useStore((state) => state.expenses);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Total Expenses</h2>
        <p className="text-3xl font-bold">NPR {totalExpenses.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ExpenseSummary;