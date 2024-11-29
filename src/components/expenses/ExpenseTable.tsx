import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Expense } from "@/types/types";

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete?: (id: string) => void;
}

const ExpenseTable = ({ expenses, onDelete }: ExpenseTableProps) => {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-moss/20">
            <TableHead className="text-forest font-semibold">Date</TableHead>
            <TableHead className="text-forest font-semibold">Description</TableHead>
            <TableHead className="text-forest font-semibold">Category</TableHead>
            <TableHead className="text-forest font-semibold text-right">Amount (NPR)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id} className="hover:bg-moss/10">
              <TableCell className="text-forest">
                {format(new Date(expense.date), "PPP")}
              </TableCell>
              <TableCell className="text-forest">
                {expense.description}
              </TableCell>
              <TableCell className="text-forest">
                {expense.category}
              </TableCell>
              <TableCell className="text-forest text-right">
                {expense.amount.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpenseTable;