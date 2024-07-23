import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined;

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

// export const parsedDateAdSearch = (value: string) => {
//   const mount = value.split('-');
//   const unit = mount[1] as 'days' | 'weeks' | 'months' | 'years';
//   const amount = Number(mount[0]);

//   const toDate = endOfDay(new Date());
//   let fromDate;

//   if (value === '1-days') {
//     fromDate = startOfDay(new Date());
//   } else {
//     switch (unit) {
//       case 'days':
//         fromDate = startOfDay(subDays(toDate, amount));
//         break;
//       case 'weeks':
//         fromDate = startOfDay(subWeeks(toDate, amount));
//         break;
//       case 'months':
//         fromDate = startOfDay(subMonths(toDate, amount));
//         break;
//       case 'years':
//         fromDate = startOfDay(subYears(toDate, amount));
//         break;
//       default:
//         throw new Error('Invalid time unit');
//     }
//   }

//   return { fromDate, toDate };
// };
