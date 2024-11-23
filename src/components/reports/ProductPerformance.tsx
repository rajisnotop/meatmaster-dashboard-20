import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ProductPerformanceProps {
  data: Array<{
    name: string;
    sold: number;
    revenue: number;
    averagePrice: number;
  }>;
}

const ProductPerformance = ({ data }: ProductPerformanceProps) => {
  return (
    <Card className="p-6 bg-background/80 border border-border/50 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-4">Product Performance</h3>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {data.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
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
              <div className="text-right">
                <div className="font-medium">
                  NPR {product.revenue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg: NPR {product.averagePrice.toFixed(2)}
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