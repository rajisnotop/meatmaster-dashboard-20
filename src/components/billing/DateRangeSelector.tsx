import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DateRangeSelectorProps {
  startDate: string | null;
  endDate: string | null;
  setStartDate: (date: string | null) => void;
  setEndDate: (date: string | null) => void;
}

const DateRangeSelector = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: DateRangeSelectorProps) => {
  const handleStartDateChange = (date: string) => {
    if (endDate && new Date(date) > new Date(endDate)) {
      return;
    }
    setStartDate(date);
  };

  const handleEndDateChange = (date: string) => {
    if (startDate && new Date(date) < new Date(startDate)) {
      return;
    }
    setEndDate(date);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
      <div className="w-full sm:w-auto">
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                type="date"
                value={startDate || ""}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full bg-background pr-10"
                max={endDate || undefined}
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-background" align="start">
            <Calendar
              mode="single"
              selected={startDate ? new Date(startDate) : undefined}
              onSelect={(date) =>
                handleStartDateChange(date ? format(date, "yyyy-MM-dd") : null)
              }
              initialFocus
              disabled={(date) =>
                endDate ? date > new Date(endDate) : false
              }
            />
          </PopoverContent>
        </Popover>
      </div>
      <span className="text-muted-foreground hidden sm:block">to</span>
      <div className="w-full sm:w-auto">
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                type="date"
                value={endDate || ""}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full bg-background pr-10"
                min={startDate || undefined}
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-background" align="start">
            <Calendar
              mode="single"
              selected={endDate ? new Date(endDate) : undefined}
              onSelect={(date) =>
                handleEndDateChange(date ? format(date, "yyyy-MM-dd") : null)
              }
              initialFocus
              disabled={(date) =>
                startDate ? date < new Date(startDate) : false
              }
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateRangeSelector;