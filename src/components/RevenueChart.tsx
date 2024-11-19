import { Card } from "./ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from "@/store/store";

const RevenueChart = () => {
  const { orders } = useStore();

  // Process orders to get daily revenue
  const dailyRevenue = orders.reduce((acc: { [key: string]: number }, order) => {
    const date = new Date(order.date).toLocaleDateString('en-US', { weekday: 'short' });
    acc[date] = (acc[date] || 0) + order.total;
    return acc;
  }, {});

  const data = Object.entries(dailyRevenue).map(([name, revenue]) => ({
    name,
    revenue,
  }));

  return (
    <Card className="p-6 bg-background/80 border border-border/50 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-4">Weekly Revenue</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={(value) => `NPR ${value.toLocaleString()}`}
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              formatter={(value: number) => [`NPR ${value.toLocaleString()}`, "Revenue"]}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#revenueGradient)"
              animationDuration={1000}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueChart;