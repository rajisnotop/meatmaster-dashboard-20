import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Printer, FileSpreadsheet } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface BillingHeaderProps {
  timeFilter: string;
  setTimeFilter: (value: string) => void;
  selectedProducts: string[];
  onPrint: (type: "all" | "selected") => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  onExportExcel: () => void;
}

const BillingHeader = ({
  timeFilter,
  setTimeFilter,
  selectedProducts,
  onPrint,
  dateFilter,
  setDateFilter,
  onExportExcel,
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
        
        <div className="flex gap-2">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-[180px]"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[42px] px-2",
                  !dateFilter && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFilter ? new Date(dateFilter) : undefined}
                onSelect={(date) => setDateFilter(date ? format(date, "yyyy-MM-dd") : "")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button onClick={onExportExcel} variant="outline">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export Excel
        </Button>

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