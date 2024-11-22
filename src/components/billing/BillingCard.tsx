import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BillingCardProps {
  children: React.ReactNode;
  className?: string;
}

const BillingCard = ({ children, className }: BillingCardProps) => {
  return (
    <Card className={cn("p-6 shadow-lg backdrop-blur-sm bg-background/95", className)}>
      {children}
    </Card>
  );
};

export default BillingCard;