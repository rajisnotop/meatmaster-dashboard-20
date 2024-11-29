import { Card } from "@/components/ui/card";
import { useExpenseStore } from "@/store/expenseStore";
import { Receipt, TrendingUp, TrendingDown, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { startOfDay, subDays } from "date-fns";

const ExpenseOverview = () => {
  const { expenses } = useExpenseStore();
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const today = startOfDay(new Date());
  const yesterday = startOfDay(subDays(today, 1));
  
  const todayExpenses = expenses
    .filter(expense => new Date(expense.date) >= today)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const yesterdayExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= yesterday && expenseDate < today;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const expenseChange = yesterdayExpenses === 0 
    ? (todayExpenses > 0 ? 100 : 0)
    : ((todayExpenses - yesterdayExpenses) / yesterdayExpenses) * 100;

  const uniqueDates = new Set(expenses.map(expense => 
    expense.date.toISOString().split('T')[0]
  ));
  const averageDailyExpense = totalExpenses / (uniqueDates.size || 1);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6 bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">Total Expenses</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              NPR {totalExpenses.toLocaleString()}
            </h3>
          </div>
          <Receipt className="h-8 w-8 text-purple-400" />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">Today's Expenses</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              NPR {todayExpenses.toLocaleString()}
            </h3>
            <div className="flex items-center mt-1">
              {expenseChange > 0 ? (
                <ArrowUp className="h-4 w-4 text-red-400" />
              ) : (
                <ArrowDown className="h-4 w-4 text-green-400" />
              )}
              <span className={`text-sm ${expenseChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {Math.abs(expenseChange).toFixed(1)}% from yesterday
              </span>
            </div>
          </div>
          <Calendar className="h-8 w-8 text-blue-400" />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">Average Daily</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              NPR {averageDailyExpense.toLocaleString()}
            </h3>
          </div>
          {averageDailyExpense > todayExpenses ? (
            <TrendingDown className="h-8 w-8 text-green-400" />
          ) : (
            <TrendingUp className="h-8 w-8 text-green-400" />
          )}
        </div>
      </Card>
    </div>
  );
};

export default ExpenseOverview;