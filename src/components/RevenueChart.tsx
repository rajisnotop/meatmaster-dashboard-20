import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from "@/store/store";
import { format } from "date-fns";

const RevenueChart = () => {
  const { orders } = useStore();

  // Process orders to get daily revenue
  const dailyRevenue = orders.reduce((acc: { [key: string]: number }, order) => {
    const date = new Date(order.date);
    const dayKey = format(date, 'MMM d');
    acc[dayKey] = (acc[dayKey] || 0) + order.total;
    return acc;
  }, {});

  const data = Object.entries(dailyRevenue).map(([name, revenue]) => ({
    name,
    earned: revenue,
  }));

  return (
    <div className="h-[400px] w-full">
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
            cursor={false}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-3 shadow-md">
                    <p className="text-sm font-medium">{payload[0].payload.name}</p>
                    <p className="text-sm text-primary mt-1">
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
  );
};

export default RevenueChart;