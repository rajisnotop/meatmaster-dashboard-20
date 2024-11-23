import { useEffect } from "react";
import { useStore } from "@/store/store";
import { useSettingsStore } from "@/store/settingsStore";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";

export function LowStockAlert() {
  const { products } = useStore();
  const { lowStockThreshold } = useSettingsStore();

  useEffect(() => {
    const lowStockProducts = products.filter(
      (product) => product.stock <= lowStockThreshold
    );

    if (lowStockProducts.length > 0) {
      toast({
        title: "Low Stock Alert",
        description: `${lowStockProducts.length} products are running low on stock`,
        variant: "destructive",
      });
    }
  }, [products, lowStockThreshold]);

  return null;
}