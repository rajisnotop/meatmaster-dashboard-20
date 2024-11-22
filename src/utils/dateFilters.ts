import { 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear,
  isAfter,
  isBefore,
  parseISO
} from "date-fns";

export const isDateInRange = (date: Date, startDate: string | null, endDate: string | null) => {
  if (startDate && endDate) {
    const start = startOfDay(parseISO(startDate));
    const end = endOfDay(parseISO(endDate));
    return isAfter(date, start) && isBefore(date, end);
  }
  return true;
};

export const getDateRangeForFilter = (timeFilter: string, dateFilter: string) => {
  const now = new Date();
  
  // If specific date is selected
  if (dateFilter) {
    const filterDate = parseISO(dateFilter);
    return {
      start: startOfDay(filterDate),
      end: endOfDay(filterDate)
    };
  }

  // If time period is selected
  switch (timeFilter) {
    case "daily":
      return {
        start: startOfDay(now),
        end: endOfDay(now)
      };
    case "weekly":
      return {
        start: startOfWeek(now),
        end: endOfWeek(now)
      };
    case "monthly":
      return {
        start: startOfMonth(now),
        end: endOfMonth(now)
      };
    case "yearly":
      return {
        start: startOfYear(now),
        end: endOfYear(now)
      };
    default:
      return null;
  }
};