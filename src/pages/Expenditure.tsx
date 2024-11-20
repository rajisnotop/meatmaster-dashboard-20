import React from "react";
import Header from "@/components/Header";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import ExpenseTable from "@/components/expenses/ExpenseTable";
import ExpenseSummary from "@/components/expenses/ExpenseSummary";
import { Card } from "@/components/ui/card";

const Expenditure = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 space-y-6">
        <Card className="p-6">
          <ExpenseSummary />
          <ExpenseForm />
          <ExpenseTable />
        </Card>
      </main>
    </div>
  );
};

export default Expenditure;