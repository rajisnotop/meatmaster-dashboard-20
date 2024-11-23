import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ProfitTrendsChartProps {
  data: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
}

const ProfitTrendsChart = ({ data }: ProfitTrendsChartProps) => {
  return (
    <Card className="p-6 bg-background/80 border border-border/50 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-4">Profit Trends</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.1} />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `NPR ${value.toLocaleString()}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <p className="text-sm font-medium">{label}</p>
                      {payload.map((entry: any) => (
                        <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
                          {entry.name}: NPR {entry.value.toLocaleString()}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--success))" 
              name="Revenue"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="hsl(var(--destructive))" 
              name="Expenses"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="profit" 
              stroke="hsl(var(--primary))" 
              name="Profit"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ProfitTrendsChart;