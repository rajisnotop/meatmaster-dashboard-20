import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  lowStockThreshold: number;
  navStyle: 'top' | 'side';
  setLowStockThreshold: (threshold: number) => void;
  setNavStyle: (style: 'top' | 'side') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      lowStockThreshold: 10,
      navStyle: 'top',
      setLowStockThreshold: (threshold) => set({ lowStockThreshold: threshold }),
      setNavStyle: (style) => set({ navStyle: style }),
    }),
    {
      name: 'settings-storage',
    }
  )
);