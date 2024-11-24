import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface ResetFiltersProps {
  filters: {
    timeFilter: string;
    startDate: string;
    endDate: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    timeFilter: string;
    startDate: string;
    endDate: string;
  }>>;
  onResetClick: () => void;
}

export const ResetFilters = ({
  filters,
  setFilters,
  onResetClick,
}: ResetFiltersProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Time Period</Label>
        <Select
          value={filters.timeFilter}
          onValueChange={(value) => {
            setFilters({
              ...filters,
              timeFilter: value,
              startDate: "",
              endDate: "",
            });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Custom Range</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filters.timeFilter === "custom" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.startDate ? (
                    format(new Date(filters.startDate), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.startDate ? new Date(filters.startDate) : undefined}
                  onSelect={(date) =>
                    setFilters({
                      ...filters,
                      startDate: date ? format(date, "yyyy-MM-dd") : "",
                    })
                  }
                  disabled={(date) =>
                    filters.endDate ? date > new Date(filters.endDate) : false
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.endDate ? (
                    format(new Date(filters.endDate), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.endDate ? new Date(filters.endDate) : undefined}
                  onSelect={(date) =>
                    setFilters({
                      ...filters,
                      endDate: date ? format(date, "yyyy-MM-dd") : "",
                    })
                  }
                  disabled={(date) =>
                    filters.startDate ? date < new Date(filters.startDate) : false
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      <Button
        variant="destructive"
        className="w-full"
        onClick={onResetClick}
        disabled={filters.timeFilter === "custom" && (!filters.startDate || !filters.endDate)}
      >
        Reset Data
      </Button>
    </div>
  );
};