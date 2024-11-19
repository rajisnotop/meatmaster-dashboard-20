import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from "@/store/store";

const RevenueChart = () => {
  const { orders } = useStore();

  // Process orders to get weekly revenue
  const weeklyRevenue = orders.reduce((acc: { [key: string]: number }, order) => {
    const date = new Date(order.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Get Sunday of the week
    const weekKey = weekStart.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
    acc[weekKey] = (acc[weekKey] || 0) + order.total;
    return acc;
  }, {});

  const data = Object.entries(weeklyRevenue).map(([name, revenue]) => ({
    name,
    earned: revenue,
  }));

  return (
    <Card className="p-6 bg-background/80 border border-border/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">
            NPR {orders.reduce((total, order) => total + order.total, 0).toLocaleString()}
          </h3>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary/80"></div>
            <span className="text-sm text-muted-foreground">Revenue</span>
          </div>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barSize={20}>
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
              tickFormatter={(value) => `NPR ${value.toLocaleString()}`}
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
                      <p className="text-sm font-medium">Week of {payload[0].payload.name}</p>
                      <p className="text-sm text-primary">
                        Revenue: NPR {payload[0].value?.toLocaleString()}
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
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueChart;