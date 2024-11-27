import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSettingsStore } from "@/store/settingsStore";
import Index from "./pages/Index";
import Reports from "./pages/Reports";
import Expenditure from "./pages/Expenditure";
import Orders from "./pages/Orders";
import Billing from "./pages/Billing";
import Reset from "./pages/Reset";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const AppContent = () => {
  const { navStyle } = useSettingsStore();
  
  return (
    <div className={`${navStyle === 'side' ? 'pl-64' : ''}`}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/expenditure" element={<Expenditure />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </TooltipProvider>
    </div>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;