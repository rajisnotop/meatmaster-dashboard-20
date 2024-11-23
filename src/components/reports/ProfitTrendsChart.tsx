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
    <Card className="p-6 bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/50 backdrop-blur-sm">
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
                    <div className="rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur-sm">
                      <p className="text-sm font-medium mb-2">{label}</p>
                      {payload.map((entry: any) => (
                        <p key={entry.name} className="text-sm flex items-center justify-between gap-4" style={{ color: entry.color }}>
                          <span>{entry.name}:</span>
                          <span className="font-medium">NPR {entry.value.toLocaleString()}</span>
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
              stroke="#22c55e"
              strokeWidth={2}
              name="Revenue"
              dot={{ strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444"
              strokeWidth={2}
              name="Expenses"
              dot={{ strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="profit" 
              stroke="#6366f1"
              strokeWidth={2}
              name="Profit"
              dot={{ strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ProfitTrendsChart;