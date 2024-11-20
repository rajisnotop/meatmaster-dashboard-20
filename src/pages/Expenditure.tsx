import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import ExpenseTable from "@/components/expenses/ExpenseTable";
import ExpenseSummary from "@/components/expenses/ExpenseSummary";

const Expenditure = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8 space-y-8 animate-fade-in">
        <h1 className="text-3xl font-bold">Expenditure Management</h1>
        
        <div className="space-y-8">
          <Card className="w-full p-8">
            <h2 className="text-2xl font-semibold mb-6">Add New Expense</h2>
            <ExpenseForm />
          </Card>
          
          <Card className="w-full p-8">
            <ExpenseSummary />
          </Card>

          <Card className="w-full p-8">
            <ExpenseTable />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Expenditure;