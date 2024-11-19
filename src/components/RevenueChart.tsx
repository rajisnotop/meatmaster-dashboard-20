import { Card } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => `NPR ${value.toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value: number) => [`NPR ${value.toLocaleString()}`, "Revenue"]}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#F97316" 
              strokeWidth={2}
              dot={{ fill: '#F97316' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueChart;