/* eslint-disable import/no-duplicates */
// @mui
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// types
import { IQueryOrder } from 'src/types/order';
// components
import { Autocomplete, Button, TextField } from '@mui/material';
import { format } from 'date-fns';
import SearchInputDebounce from 'src/components/search-input-debounce/search-input-debounce';
import { ICustomer } from 'src/types/customer';
import { useState } from 'react';
import { debounce } from 'lodash';
import { getListCustomer } from 'src/api/customer';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import vi from 'date-fns/locale/vi';

// ----------------------------------------------------------------------

export default function OrderTableToolbar({
  onSearch,
  query,
  onReset,
  customerList
}: {
  onSearch: (query: IQueryOrder) => void;
  query: IQueryOrder;
  onReset: VoidFunction;
  customerList: ICustomer[];
}) {

  const [customers, setCustomers] = useState<ICustomer[]>(customerList);

  const handleFilterFromDate = (value: any) => {
    const date = new Date(value);
    const formattedDate = format(date, 'dd/MM/yyyy');
    onSearch({ ...query, from_date: formattedDate, page: 0 });
  };

  const handleFilterToDate = (value: any) => {
    const date = new Date(value);
    const formattedDate = format(date, 'dd/MM/yyyy');
    onSearch({ ...query, to_date: formattedDate, page: 0 });
  };
  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
       <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>

      <DatePicker
        label="Từ ngày"
        value={new Date(String(query?.from_date) || '')}
        onChange={handleFilterFromDate}
        slotProps={{
          textField: {
            fullWidth: true,
            error: false,
          },
        }}
        sx={{
          maxWidth: { md: 200 },
        }}
        format="dd/MM/yyyy"
        dayOfWeekFormatter={(dayOfWeek: string) => {
          const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
          // dayOfWeek sẽ là 'Sunday', 'Monday', etc.
          const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            .indexOf(dayOfWeek);
          return days[dayIndex];
        }}
      />

      <DatePicker
        label="Đến ngày"
        value={new Date(String(query?.to_date) || '')}
        onChange={handleFilterToDate}
        slotProps={{
          textField: {
            fullWidth: true,
            error: false,
          },
        }}
        sx={{
          maxWidth: { md: 200 },
        }}
        format="dd/MM/yyyy"
         dayOfWeekFormatter={(dayOfWeek: string) => {
          const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
          // dayOfWeek sẽ là 'Sunday', 'Monday', etc.
          const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            .indexOf(dayOfWeek);
          return days[dayIndex];
        }}
      />
       </LocalizationProvider>
       <Autocomplete
        sx={{ width: 700 }}
        options={customerList}
        getOptionLabel={(option) => option?.name || ''}
        onChange={(event, newValue) => {
          if (newValue) {
            onSearch({ ...query, customerId: newValue._id });
          } else {
            onSearch({ ...query, customerId: undefined });
          }
        }}
        renderInput={(params) => <TextField label="Khách hàng" {...params} />}
        value={customerList.find(x => x._id === query?.customerId) || null}
        isOptionEqualToValue={(option, value) => option._id === value._id}
      />
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <SearchInputDebounce
          onSearch={(value: string) => {
            onSearch({ ...query, keyword: value, page: 0 });
          }}
          placeholder="Tìm kiếm đơn hàng theo số đơn hàng"
          fullWidth
          value={query.keyword || ''}
        />
      </Stack>
      <Button
        variant="outlined"
        color="inherit"
        sx={{ height: '53px' }}
        onClick={() => {
          onReset();
          setCustomers([]);
        }}
      >
        Xóa
      </Button>
    </Stack>
  );
}
