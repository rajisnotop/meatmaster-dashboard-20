import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from "@/store/store";

const RevenueChart = () => {
  const { orders } = useStore();

  // Process orders to get daily revenue and forecast
  const dailyRevenue = orders.reduce((acc: { [key: string]: number }, order) => {
    const date = new Date(order.date).toLocaleDateString('en-US', { month: 'short' });
    acc[date] = (acc[date] || 0) + order.total;
    return acc;
  }, {});

  // Generate forecast data (simple example - you can replace with actual forecast logic)
  const generateForecast = (value: number) => value * (0.8 + Math.random() * 0.4);

  const data = Object.entries(dailyRevenue).map(([name, revenue]) => ({
    name,
    earned: revenue,
    forecasted: generateForecast(revenue),
  }));

  return (
    <Card className="p-6 bg-background/80 border border-border/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground">
            NPR {orders.reduce((total, order) => total + order.total, 0).toLocaleString()}
          </h3>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary/80"></div>
            <span className="text-sm text-muted-foreground">Earned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#22c55e]/80"></div>
            <span className="text-sm text-muted-foreground">Forecasted</span>
          </div>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--muted-foreground))" 
              opacity={0.1} 
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              tickFormatter={(value) => `NPR ${(value/1000).toFixed(0)}K`}
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <p className="text-sm font-medium">{payload[0].payload.name}</p>
                      <p className="text-sm text-primary">
                        Earned: NPR {payload[0].value?.toLocaleString()}
                      </p>
                      <p className="text-sm text-[#22c55e]">
                        Forecasted: NPR {payload[1].value?.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="earned" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="forecasted" 
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueChart;