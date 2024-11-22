import NepaliDate from 'nepali-date-converter';

const MIN_DATE = new Date(1943, 3, 14); // Approximate AD date for 2000/01/01 BS
const MAX_DATE = new Date(2034, 3, 13); // Approximate AD date for 2090/12/30 BS

export const isDateInValidRange = (date: Date) => {
  return date >= MIN_DATE && date <= MAX_DATE;
};

export const toNepaliDate = (date: Date) => {
  try {
    if (!isDateInValidRange(date)) {
      return new NepaliDate(); // Return current date if out of range
    }
    return new NepaliDate(date);
  } catch (error) {
    return new NepaliDate();
  }
};

export const formatNepaliDate = (date: Date) => {
  try {
    const nepaliDate = toNepaliDate(date);
    return nepaliDate.format('YYYY/MM/DD');
  } catch (error) {
    return date.toLocaleDateString();
  }
};

export const formatNepaliDateFull = (date: Date) => {
  try {
    const nepaliDate = toNepaliDate(date);
    return nepaliDate.format('ddd, DD MMMM YYYY');
  } catch (error) {
    return date.toLocaleDateString('ne-NP', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

export const parseNepaliDate = (dateString: string) => {
  try {
    return NepaliDate.parse(dateString);
  } catch (error) {
    return new Date();
  }
};

export const getCurrentNepaliDate = () => {
  return NepaliDate.now();
};

// Set default language to Nepali
NepaliDate.language = 'np';