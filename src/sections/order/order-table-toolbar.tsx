// @mui
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// types
import { IQueryOrder } from 'src/types/order';
// components
import { Button } from '@mui/material';
import { format } from 'date-fns';
import SearchInputDebounce from 'src/components/search-input-debounce/search-input-debounce';

// ----------------------------------------------------------------------

export default function OrderTableToolbar({
  onSearch,
  query,
  onReset,
}: {
  onSearch: (query: IQueryOrder) => void;
  query: IQueryOrder;
  onReset: VoidFunction;
}) {
  const handleFilterFromDate = (value: any) => {
    const date = new Date(value);
    const formattedDate = format(date, 'yyyy/MM/dd');
    onSearch({ ...query, from_date: formattedDate, page: 0 });
  };

  const handleFilterToDate = (value: any) => {
    const date = new Date(value);
    const formattedDate = format(date, 'yyyy/MM/dd');
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
        format="yyyy/MM/dd"
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
        format="yyyy/MM/dd"
      />

      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <SearchInputDebounce
          onSearch={(value: string) => {
            onSearch({ ...query, keyword: value, page: 0 });
          }}
          placeholder="Tìm kiếm theo khách hàng hoặc số đơn hàng..."
          fullWidth
          value={query.keyword || ''}
        />
      </Stack>
      <Button variant="outlined" color="inherit" sx={{ height: '53px' }} onClick={onReset}>
        Xóa
      </Button>
    </Stack>
  );
}
