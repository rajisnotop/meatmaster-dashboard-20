import NepaliDate from 'nepali-date-converter';

const MIN_DATE = new Date(1943, 3, 14); // Approximate AD date for 2000/01/01 BS
const MAX_DATE = new Date(2034, 3, 13); // Approximate AD date for 2090/12/30 BS

export const isDateInValidRange = (date: Date) => {
  return date >= MIN_DATE && date <= MAX_DATE;
};

export const toNepaliDate = (date: Date) => {
  if (!isDateInValidRange(date)) {
    return new NepaliDate(); // Return current date if out of range
  }
  return new NepaliDate(date);
};

export const formatNepaliDate = (date: Date) => {
  if (!isDateInValidRange(date)) {
    return date.toLocaleDateString(); // Fallback to regular date format
  }
  const nepaliDate = new NepaliDate(date);
  return nepaliDate.format('YYYY/MM/DD');
};

export const formatNepaliDateFull = (date: Date) => {
  if (!isDateInValidRange(date)) {
    return date.toLocaleDateString('ne-NP', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  const nepaliDate = new NepaliDate(date);
  return nepaliDate.format('ddd, DD MMMM YYYY');
};

export const parseNepaliDate = (dateString: string) => {
  try {
    return NepaliDate.parse(dateString);
  } catch (error) {
    return new Date(); // Return current date if parsing fails
  }
};

export const getCurrentNepaliDate = () => {
  return NepaliDate.now();
};

// Set default language to Nepali
NepaliDate.language = 'np';