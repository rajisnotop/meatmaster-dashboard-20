import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useStore } from "./store/store";
import { useSettingsStore } from "./store/settingsStore";
import Index from "./pages/Index";
import Orders from "./pages/Orders";
import Credit from "./pages/Credit";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Expenditure from "./pages/Expenditure";
import Settings from "./pages/Settings";
import Reset from "./pages/Reset";
import Excel from "./pages/Excel";
import Header from "./components/Header";

function App() {
  const initializeData = useStore(state => state.initializeData);
  const { navStyle } = useSettingsStore();

  useEffect(() => {
    initializeData().catch(console.error);
  }, [initializeData]);

  return (
    <Router>
      <div className={`min-h-screen bg-cream ${navStyle === 'side' ? 'pl-64' : ''}`}>
        <Header />
        <main className={`${navStyle === 'side' ? 'pt-6' : 'pt-0'}`}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/credit" element={<Credit />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/expenditure" element={<Expenditure />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/excel" element={<Excel />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;