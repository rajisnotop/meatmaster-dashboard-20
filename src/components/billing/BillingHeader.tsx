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
  startDate: string | null;
  endDate: string | null;
  setStartDate: (date: string | null) => void;
  setEndDate: (date: string | null) => void;
}

const BillingHeader = ({
  timeFilter,
  setTimeFilter,
  selectedProducts,
  onPrint,
  dateFilter,
  setDateFilter,
  onExportExcel,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: BillingHeaderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Billing Summary</h1>
        <div className="flex gap-3">
          <Button onClick={onExportExcel} variant="outline" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Export Excel
          </Button>
          <Button onClick={() => onPrint("all")} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Print All
          </Button>
          <Button
            onClick={() => onPrint("selected")}
            variant="outline"
            disabled={selectedProducts.length === 0}
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            Print Selected
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Select 
          value={timeFilter} 
          onValueChange={(value) => {
            setTimeFilter(value);
            if (value !== "date-range") {
              setStartDate(null);
              setEndDate(null);
            }
          }}
        >
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
            <SelectItem value="date-range">Date Range</SelectItem>
          </SelectContent>
        </Select>
        
        {timeFilter === "date-range" ? (
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <Input
                type="date"
                value={startDate || ""}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-[180px]"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[42px] px-2",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate ? new Date(startDate) : undefined}
                    onSelect={(date) =>
                      setStartDate(date ? format(date, "yyyy-MM-dd") : null)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <span className="text-muted-foreground">to</span>
            <div className="flex gap-2">
              <Input
                type="date"
                value={endDate || ""}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-[180px]"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[42px] px-2",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate ? new Date(endDate) : undefined}
                    onSelect={(date) =>
                      setEndDate(date ? format(date, "yyyy-MM-dd") : null)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ) : (
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
                  onSelect={(date) =>
                    setDateFilter(date ? format(date, "yyyy-MM-dd") : "")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingHeader;