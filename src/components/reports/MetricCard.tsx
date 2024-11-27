import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const MetricCard = ({ icon: Icon, title, value, trend }: MetricCardProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-accent/30 to-background border-border/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="w-8 h-8 text-forest" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-forest">{title}</p>
          <h3 className="text-2xl font-bold text-forest">{value}</h3>
          {trend && (
            <div className={`text-sm flex items-center gap-1 ${trend.isPositive ? 'text-green-700' : 'text-red-700'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              <span className="text-xs text-forest ml-1">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;