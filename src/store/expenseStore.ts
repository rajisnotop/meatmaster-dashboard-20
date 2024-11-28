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
            const { data, error } = await supabase
              .from('expenses')
              .select('*')
              .order('date', { ascending: false });

            if (error) {
              console.error('Error initializing expenses:', error);
              throw new Error(`Failed to initialize expenses: ${error.message}`);
            }

            const transformedExpenses = data.map(transformDatabaseExpense);
            set({ expenses: transformedExpenses });
          } catch (error) {
            console.error('Error in initializeExpenses:', error);
            set({ error: error instanceof Error ? error.message : 'Failed to initialize expenses' });
          } finally {
            set({ isLoading: false });
          }
        },
        
        setExpenses: (expenses) => set({ expenses }),

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

            if (error) {
              console.error('Error adding expense:', error);
              throw new Error(`Failed to add expense: ${error.message}`);
            }

            const newExpense = transformDatabaseExpense(data);
            set(state => ({
              expenses: [newExpense, ...state.expenses]
            }));
          } catch (error) {
            console.error('Error in addExpense:', error);
            throw new Error(`Failed to add expense: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        },

        deleteExpense: async (id) => {
          try {
            const { error } = await supabase
              .from('expenses')
              .delete()
              .eq('id', id);

            if (error) {
              console.error('Error deleting expense:', error);
              throw new Error(`Failed to delete expense: ${error.message}`);
            }
            
            set(state => ({
              expenses: state.expenses.filter(expense => expense.id !== id)
            }));
          } catch (error) {
            console.error('Error in deleteExpense:', error);
            throw new Error(`Failed to delete expense: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        },

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