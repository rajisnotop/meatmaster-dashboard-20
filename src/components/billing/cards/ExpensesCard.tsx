import { Card } from "@/components/ui/card";
import { Receipt } from "lucide-react";
import { useExpenseStore } from "@/store/expenseStore";

interface ExpensesCardProps {
  totalExpenses: number;
}

const ExpensesCard = ({ totalExpenses }: ExpensesCardProps) => {
  const expenses = useExpenseStore((state) => state.expenses);
  
  const getCashExpenses = () => {
    return expenses
      .filter(expense => expense.paymentMethod === 'cash')
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getOnlineExpenses = () => {
    return expenses
      .filter(expense => expense.paymentMethod === 'online')
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-red-900/30 to-red-800/30 border-red-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-white">Expenses</h3>
        <Receipt className="h-5 w-5 text-red-400" />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Total Expenses</span>
          <span className="font-medium text-white">
            NPR {totalExpenses.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Cash Expenses</span>
          <span className="font-medium text-white">
            NPR {getCashExpenses().toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Online Expenses</span>
          <span className="font-medium text-white">
            NPR {getOnlineExpenses().toLocaleString()}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ExpensesCard;