import React from "react";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpenseOverview from "@/components/expenses/ExpenseOverview";
import ExpenseFormCard from "@/components/expenses/ExpenseFormCard";
import ExpenseListView from "@/components/expenses/ExpenseListView";

const Expenditure = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4 space-y-8">
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Expenditure
            </h1>
            <p className="text-muted-foreground">
              Track and manage your business expenses
            </p>
          </div>

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