import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import TopSellingProducts from "@/components/reports/TopSellingProducts";

interface BillingCardProps {
  children: React.ReactNode;
  className?: string;
  showTopSelling?: boolean;
}

const BillingCard = ({ children, className, showTopSelling = false }: BillingCardProps) => {
  return (
    <Card className={cn("p-6 shadow-lg backdrop-blur-sm bg-background/95", className)}>
      {children}
      {showTopSelling && (
        <div className="mt-8">
          <TopSellingProducts />
        </div>
      )}
    </Card>
  );
};

export default BillingCard;