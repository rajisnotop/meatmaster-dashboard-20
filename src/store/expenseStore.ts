import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Expense } from '@/types/types';
import { supabase } from '@/lib/supabase';
import { transformDatabaseExpense } from '@/utils/dataTransformers';

interface ExpenseStore {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  setExpenses: (expenses: Expense[]) => void;
  getCashExpenses: () => number;
  getOnlineExpenses: () => number;
  initializeExpenses: () => Promise<void>;
}

export const useExpenseStore = create<ExpenseStore>()(
  devtools(
    persist(
      (set, get) => ({
        expenses: [],
        isLoading: false,
        error: null,
        
        initializeExpenses: async () => {
          set({ isLoading: true, error: null });
          try {
            const { data: expensesData, error } = await supabase
              .from('expenses')
              .select('*')
              .order('date', { ascending: false });

            if (error) throw error;

            const transformedExpenses = expensesData.map(transformDatabaseExpense);
            set({ expenses: transformedExpenses });
          } catch (error) {
            console.error('Error initializing expenses:', error);
            set({ error: 'Failed to load expenses' });
          } finally {
            set({ isLoading: false });
          }
        },

        addExpense: async (expense) => {
          try {
            const { data, error } = await supabase
              .from('expenses')
              .insert([{
                category: expense.category,
                amount: expense.amount,
                description: expense.description,
                date: expense.date.toISOString(),
                paymentmethod: expense.paymentMethod
              }])
              .select()
              .single();

            if (error) throw error;
            
            const newExpense = transformDatabaseExpense(data);
            set(state => ({
              expenses: [newExpense, ...state.expenses]
            }));
          } catch (error) {
            console.error('Error adding expense:', error);
            throw error;
          }
        },

        deleteExpense: async (id) => {
          try {
            const { error } = await supabase
              .from('expenses')
              .delete()
              .eq('id', id);

            if (error) throw error;
            
            set(state => ({
              expenses: state.expenses.filter(expense => expense.id !== id)
            }));
          } catch (error) {
            console.error('Error deleting expense:', error);
            throw error;
          }
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

useExpenseStore.getState().initializeExpenses();