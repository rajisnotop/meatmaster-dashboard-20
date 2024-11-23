import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  isDarkMode: boolean;
  lowStockThreshold: number;
  toggleDarkMode: () => void;
  setLowStockThreshold: (threshold: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      lowStockThreshold: 5,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setLowStockThreshold: (threshold) => set({ lowStockThreshold: threshold }),
    }),
    {
      name: 'settings-storage',
    }
  )
);