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
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Weekly Revenue</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              tickFormatter={(value) => `NPR ${value.toLocaleString()}`}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip 
              formatter={(value: number) => [`NPR ${value.toLocaleString()}`, "Revenue"]}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#revenueGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueChart;