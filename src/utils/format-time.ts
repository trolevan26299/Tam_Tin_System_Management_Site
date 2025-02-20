import {
  startOfToday,
  endOfToday,
  startOfYesterday,
  endOfYesterday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  format,
  getTime,
  formatDistanceToNow,
} from 'date-fns';

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined;
type DateRange = { start: string; end: string };

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

export function getDateRange(value: string): DateRange {
  const today = new Date();
  const dateFormat = 'yyyy-MM-dd';
  const weekOptions: any = { weekStartsOn: 1 };

  switch (value) {
    case '0-days':
      return { start: format(startOfToday(), dateFormat), end: format(endOfToday(), dateFormat) };
    case '1-days':
      return {
        start: format(startOfYesterday(), dateFormat),
        end: format(endOfToday(), dateFormat),
      };
    case '0-weeks':
      return {
        start: format(startOfWeek(today, weekOptions), dateFormat),
        end: format(endOfWeek(today, weekOptions), dateFormat),
      };
    case '1-weeks': {
      const lastWeekStart = startOfWeek(subWeeks(today, 1), weekOptions);
      const lastWeekEnd = endOfWeek(subWeeks(today, 1), weekOptions);
      return { start: format(lastWeekStart, dateFormat), end: format(lastWeekEnd, dateFormat) };
    }
    case '0-months':
      return {
        start: format(startOfMonth(today), dateFormat),
        end: format(endOfMonth(today), dateFormat),
      };
    case '1-months': {
      const lastMonthStart = startOfMonth(subMonths(today, 1));
      const lastMonthEnd = endOfMonth(subMonths(today, 1));
      return { start: format(lastMonthStart, dateFormat), end: format(lastMonthEnd, dateFormat) };
    }
    case '0-years':
      return {
        start: format(startOfYear(today), dateFormat),
        end: format(endOfYear(today), dateFormat),
      };
    case '1-years': {
      const lastYearStart = startOfYear(subYears(today, 1));
      const lastYearEnd = endOfYear(subYears(today, 1));
      return { start: format(lastYearStart, dateFormat), end: format(lastYearEnd, dateFormat) };
    }
    default:
      throw new Error('Invalid period option');
  }
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
