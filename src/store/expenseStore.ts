import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Expense } from '@/types/types';
import { supabase } from '@/lib/supabase';

interface ExpenseStore {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  setExpenses: (expenses: Expense[]) => void;
  getCashExpenses: () => number;
  getOnlineExpenses: () => number;
}

export const useExpenseStore = create<ExpenseStore>()(
  devtools(
    persist(
      (set, get) => ({
        expenses: [],
        
        addExpense: async (expense) => {
          const { data, error } = await supabase
            .from('expenses')
            .insert([{
              category: expense.category,
              amount: expense.amount,
              description: expense.description,
              date: expense.date.toISOString(),
              payment_method: expense.paymentMethod
            }])
            .select()
            .single();

          if (error) throw error;
          
          const newExpense: Expense = {
            id: data.id,
            category: data.category,
            amount: data.amount,
            description: data.description,
            date: new Date(data.date),
            paymentMethod: data.payment_method
          };
          
          set(state => ({
            expenses: [...state.expenses, newExpense]
          }));
        },

        deleteExpense: async (id) => {
          const { error } = await supabase
            .from('expenses')
            .delete()
            .eq('id', id);

          if (error) throw error;
          set(state => ({
            expenses: state.expenses.filter(expense => expense.id !== id)
          }));
        },

        setExpenses: (expenses) => set({ expenses }),

        getCashExpenses: () => {
          const expenses = get().expenses;
          return expenses
            .filter(expense => expense.paymentMethod === "cash")
            .reduce((sum, expense) => sum + expense.amount, 0);
        },

        getOnlineExpenses: () => {
          const expenses = get().expenses;
          return expenses
            .filter(expense => expense.paymentMethod === "online")
            .reduce((sum, expense) => sum + expense.amount, 0);
        },
      }),
      {
        name: 'expense-storage',
      }
    )
  )
);