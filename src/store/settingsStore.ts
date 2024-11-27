import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  lowStockThreshold: number;
  navStyle: 'top' | 'side';
  isDarkMode: boolean;
  setLowStockThreshold: (threshold: number) => void;
  setNavStyle: (style: 'top' | 'side') => void;
  toggleDarkMode: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      lowStockThreshold: 10,
      navStyle: 'top',
      isDarkMode: false,
      setLowStockThreshold: (threshold) => set({ lowStockThreshold: threshold }),
      setNavStyle: (style) => set({ navStyle: style }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'settings-storage',
    }
  )
);