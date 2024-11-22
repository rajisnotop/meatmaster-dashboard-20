import NepaliDate from 'nepali-date-converter';

export const toNepaliDate = (date: Date) => {
  return new NepaliDate(date);
};

export const formatNepaliDate = (date: Date) => {
  const nepaliDate = new NepaliDate(date);
  return nepaliDate.format('YYYY/MM/DD');
};

export const formatNepaliDateFull = (date: Date) => {
  const nepaliDate = new NepaliDate(date);
  return nepaliDate.format('ddd, DD MMMM YYYY');
};

export const parseNepaliDate = (dateString: string) => {
  return NepaliDate.parse(dateString);
};

export const getCurrentNepaliDate = () => {
  return NepaliDate.now();
};

// Set default language to Nepali
NepaliDate.language = 'np';