import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ProductPerformanceProps {
  data: Array<{
    name: string;
    sold: number;
    revenue: number;
    averagePrice: number;
    trend: number;
  }>;
}

const ProductPerformance = ({ data }: ProductPerformanceProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-700/50 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-4">Product Performance</h3>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {data.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-background/40 hover:bg-background/60 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Sold: {product.sold} units
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="font-medium">
                  NPR {product.revenue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg: NPR {product.averagePrice.toFixed(2)}
                </div>
                <div className={`text-sm flex items-center justify-end gap-1 ${
                  product.trend > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {product.trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(product.trend)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ProductPerformance;