import { Card } from "@/components/ui/card";
import { useStore } from "@/store/store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={productSales}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <p className="text-sm font-medium">{payload[0].payload.name}</p>
                      <p className="text-sm text-primary">
                        Quantity: {payload[0].value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TopSellingProducts;