import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BillingHeaderProps {
  timeFilter: string;
  setTimeFilter: (value: string) => void;
  selectedProducts: string[];
  onPrint: (type: "all" | "selected") => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
}

const BillingHeader = ({
  timeFilter,
  setTimeFilter,
  selectedProducts,
  onPrint,
  dateFilter,
  setDateFilter,
}: BillingHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Billing Summary</h1>
      <div className="flex gap-4">
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border">
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-[180px]"
        />
        <Button onClick={() => onPrint("all")} variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Print All
        </Button>
        <Button
          onClick={() => onPrint("selected")}
          variant="outline"
          disabled={selectedProducts.length === 0}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print Selected
        </Button>
      </div>
    </div>
  );
};

export default BillingHeader;