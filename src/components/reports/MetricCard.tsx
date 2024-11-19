import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
}

const MetricCard = ({ icon: Icon, title, value }: MetricCardProps) => {
  return (
    <Card className="p-6 bg-background/80 border border-border/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Icon className="w-8 h-8 text-primary" />
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;