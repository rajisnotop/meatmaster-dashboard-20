import { Card } from "@/components/ui/card";
import { useStore } from "@/store/store";
import { ScrollArea } from "@/components/ui/scroll-area";

const TopSellingProducts = () => {
  const { orders, products } = useStore();

  const productSales = products.map(product => {
    const totalQuantity = orders
      .filter(order => order.productId === product.id)
      .reduce((sum, order) => sum + order.quantity, 0);

    return {
      name: product.name,
      value: totalQuantity
    };
  }).sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <Card className="p-6 bg-background/80 border border-border/50 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-3">
          {productSales.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                <span className="font-medium">{product.name}</span>
              </div>
              <span className="font-mono text-sm">{product.value} units</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default TopSellingProducts;