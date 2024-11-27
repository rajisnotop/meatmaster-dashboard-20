import { useState } from "react";
import { useStore } from "@/store/store";
import BillingHeader from "@/components/billing/BillingHeader";
import BillingCard from "@/components/billing/BillingCard";
import BillingTable from "@/components/billing/BillingTable";
import BillingPrintTemplate from "@/components/billing/BillingPrintTemplate";

const Billing = () => {
  const { expenses, totalExpenses, openingBalance, cashInCounter, netProfit } = useStore();
  const [isPrintTemplateOpen, setIsPrintTemplateOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handlePrint = (type: "all" | "selected") => {
    if (type === "selected" && selectedProducts.length === 0) {
      alert("Please select at least one product to print.");
      return;
    }
    setIsPrintTemplateOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <BillingHeader
        selectedProducts={selectedProducts}
        onPrint={handlePrint}
        totalExpenses={totalExpenses}
        openingBalance={openingBalance}
        cashInCounter={cashInCounter}
        netProfit={netProfit}
      />
      <BillingCard 
        totalExpenses={totalExpenses} 
        openingBalance={openingBalance} 
        cashInCounter={cashInCounter} 
        netProfit={netProfit} 
      />
      <BillingTable 
        expenses={expenses} 
        selectedProducts={selectedProducts} 
        setSelectedProducts={setSelectedProducts} 
      />
      {isPrintTemplateOpen && (
        <BillingPrintTemplate 
          onClose={() => setIsPrintTemplateOpen(false)} 
          selectedProducts={selectedProducts} 
        />
      )}
    </div>
  );
};

export default Billing;
