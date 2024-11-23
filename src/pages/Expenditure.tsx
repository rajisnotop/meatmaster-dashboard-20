import React from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpenseOverview from "@/components/expenses/ExpenseOverview";
import ExpenseFormCard from "@/components/expenses/ExpenseFormCard";
import ExpenseListView from "@/components/expenses/ExpenseListView";

const Expenditure = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <main className="flex-1 p-8 space-y-8 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold gradient-text">Expenditure Management</h1>
          </div>

          <ExpenseOverview />
          
          <Card className="dashboard-card">
            <Tabs defaultValue="add" className="w-full">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-6">
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
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Expenditure;