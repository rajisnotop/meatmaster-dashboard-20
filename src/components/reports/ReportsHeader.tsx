import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { format } from "date-fns";

interface ReportsHeaderProps {
  onPrint: () => void;
}

const ReportsHeader = ({ onPrint }: ReportsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
        <p className="text-muted-foreground mt-1">
          Generated on {format(new Date(), "MMMM dd, yyyy")}
        </p>
      </div>
      <Button 
        variant="outline" 
        className="hover:bg-primary/20"
        onClick={onPrint}
      >
        <Printer className="w-4 h-4 mr-2" />
        Print Report
      </Button>
    </div>
  );
};

export default ReportsHeader;