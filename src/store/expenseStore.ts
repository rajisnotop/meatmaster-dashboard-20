import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Expense } from '@/types/types';
import { supabase } from '@/lib/supabase';

interface ExpenseStore {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  setExpenses: (expenses: Expense[]) => void;
  initializeExpenses: () => Promise<void>;
}

export const useExpenseStore = create<ExpenseStore>()(
  devtools(
    persist(
      (set) => ({
        expenses: [],
        isLoading: false,
        error: null,

        initializeExpenses: async () => {
          set({ isLoading: true, error: null });
          try {
            console.log('Fetching expenses...');
            const { data, error } = await supabase
              .from('expenses')
              .select('*')
              .order('date', { ascending: false });

            if (error) throw error;

            const transformedExpenses = data.map((expense): Expense => ({
              id: expense.id,
              description: expense.description,
              amount: expense.amount,
              category: expense.category,
              date: new Date(expense.date),
              paymentMethod: expense.payment_method
            }));

            set({ expenses: transformedExpenses });
          } catch (error) {
            console.error('Error fetching expenses:', error);
            set({ error: error instanceof Error ? error.message : 'Failed to fetch expenses' });
          } finally {
            set({ isLoading: false });
          }
        },

        addExpense: async (expense) => {
          try {
            const { data, error } = await supabase
              .from('expenses')
              .insert([{
                description: expense.description,
                amount: expense.amount,
                category: expense.category,
                date: expense.date.toISOString(),
                payment_method: expense.paymentMethod
              }])
              .select()
              .single();

            if (error) throw error;

            const newExpense: Expense = {
              id: data.id,
              description: data.description,
              amount: data.amount,
              category: data.category,
              date: new Date(data.date),
              paymentMethod: data.payment_method
            };

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
      }),
      {
        name: 'expense-storage',
      }
    )
  )
);