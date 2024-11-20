import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import ExpenseTable from "@/components/expenses/ExpenseTable";

const Expenditure = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8 space-y-8 animate-fade-in">
        <h1 className="text-3xl font-bold">Expenditure Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <ExpenseForm />
          </Card>
          
          <Card className="p-6">
            <ExpenseTable />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Expenditure;