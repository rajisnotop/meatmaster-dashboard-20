import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpenseOverview from "@/components/expenses/ExpenseOverview";
import ExpenseFormCard from "@/components/expenses/ExpenseFormCard";
import ExpenseListView from "@/components/expenses/ExpenseListView";
import { useExpenseStore } from "@/store/expenseStore";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Expenditure = () => {
  const { isLoading, error } = useExpenseStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4 space-y-8">
        <div className="flex flex-col gap-6">
          <ExpenseOverview />
          
          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="add">Add Expense</TabsTrigger>
              <TabsTrigger value="list">View Expenses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="add" className="mt-6">
              <ExpenseFormCard />
            </TabsContent>
            
            <TabsContent value="list" className="mt-6">
              <ExpenseListView />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Expenditure;