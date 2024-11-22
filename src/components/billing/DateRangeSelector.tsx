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
      return; // Don't allow start date to be after end date
    }
    setStartDate(date);
  };

  const handleEndDateChange = (date: string) => {
    if (startDate && new Date(date) < new Date(startDate)) {
      return; // Don't allow end date to be before start date
    }
    setEndDate(date);
  };

  // Get tomorrow's date for min attribute
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-2">
        <Input
          type="date"
          value={startDate || ""}
          onChange={(e) => handleStartDateChange(e.target.value)}
          className="w-[180px]"
          max={endDate || undefined}
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
          <PopoverContent className="w-auto p-0 bg-background border" align="start">
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
              fromDate={new Date()} // Allow selection from today onwards
            />
          </PopoverContent>
        </Popover>
      </div>
      <span className="text-muted-foreground">to</span>
      <div className="flex gap-2">
        <Input
          type="date"
          value={endDate || ""}
          onChange={(e) => handleEndDateChange(e.target.value)}
          className="w-[180px]"
          min={startDate || undefined}
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
          <PopoverContent className="w-auto p-0 bg-background border" align="start">
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
              fromDate={startDate ? new Date(startDate) : new Date()} // Allow selection from start date or today onwards
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateRangeSelector;