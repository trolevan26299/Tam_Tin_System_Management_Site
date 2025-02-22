import {
  isSameDay,
  isSameMonth,
  getYear,
  endOfDay,
  startOfDay,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from 'date-fns';
// utils
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function shortDateLabel(startDate: Date | null, endDate: Date | null) {
  const getCurrentYear = new Date().getFullYear();

  const startDateYear = startDate ? getYear(startDate) : null;

  const endDateYear = endDate ? getYear(endDate) : null;

  const currentYear = getCurrentYear === startDateYear && getCurrentYear === endDateYear;

  const sameDay = startDate && endDate ? isSameDay(new Date(startDate), new Date(endDate)) : false;

  const sameMonth =
    startDate && endDate ? isSameMonth(new Date(startDate), new Date(endDate)) : false;

  if (currentYear) {
    if (sameMonth) {
      if (sameDay) {
        return fDate(endDate, 'dd MMM yy');
      }
      return `${fDate(startDate, 'dd')} - ${fDate(endDate, 'dd MMM yy')}`;
    }
    return `${fDate(startDate, 'dd MMM')} - ${fDate(endDate, 'dd MMM yy')}`;
  }

  return `${fDate(startDate, 'dd MMM yy')} - ${fDate(endDate, 'dd MMM yy')}`;
}

export const subDate = (
  date: Date,
  type: 'days' | 'weeks' | 'months' | 'years',
  amount: number
): Date => {
  if (type === 'days') {
    return subDays(date, amount);
  }
  if (type === 'weeks') {
    return subWeeks(date, amount);
  }
  if (type === 'months') {
    return subMonths(date, amount);
  }
  if (type === 'years') {
    return subYears(date, amount);
  }
  return date;
};

export const parsedDate = (value: string) => {
  const [amount, type] = value.split('-') as [string, 'days' | 'weeks' | 'months' | 'years'];
  const now = new Date();

  switch (value) {
    case '0-days':
      return {
        startDate: startOfDay(now),
        endDate: endOfDay(now),
      };

    case '1-days':
      return {
        startDate: startOfDay(subDays(now, 1)),
        endDate: endOfDay(subDays(now, 1)),
      };

    case '0-weeks':
      return {
        startDate: startOfWeek(now, { weekStartsOn: 1 }),
        endDate: endOfDay(now),
      };

    case '1-weeks':
      return {
        startDate: startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
        endDate: endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
      };

    case '0-months':
      return {
        startDate: startOfMonth(now),
        endDate: endOfDay(now),
      };

    case '1-months':
      return {
        startDate: startOfMonth(subMonths(now, 1)),
        endDate: endOfMonth(subMonths(now, 1)),
      };

    case '0-years':
      return {
        startDate: startOfYear(now),
        endDate: endOfDay(now),
      };

    case '1-years':
      return {
        startDate: startOfYear(subYears(now, 1)),
        endDate: endOfYear(subYears(now, 1)),
      };

    default:
      return {
        startDate: null,
        endDate: null,
      };
  }
};
