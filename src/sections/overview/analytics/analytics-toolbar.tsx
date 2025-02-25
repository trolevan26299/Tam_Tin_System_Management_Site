import { MenuItem, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { ChangeEvent } from 'react';
import { PERIOD_OPTIONS } from 'src/_mock';
import { parsedDate } from 'src/components/custom-date-range-picker';
import { IQueryAnalytics } from 'src/types/analytics';

function AnalyticsToolbar({
  query,
  changeQuery,
}: {
  query: IQueryAnalytics;
  changeQuery: (value: IQueryAnalytics) => void;
}) {
  const handleFilterFromDate = (value: any) => {
    const date = new Date(value);
    const formattedDate = format(date, 'yyyy-MM-dd');
    changeQuery({ ...query, from_date: formattedDate, period: '_all_' });
  };
  const handleFilterToDate = (value: any) => {
    const date = new Date(value);
    const formattedDate = format(date, 'yyyy-MM-dd');
    changeQuery({ ...query, to_date: formattedDate, period: '_all_' });
  };
  const handleChangePeriod = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;
    const { startDate, endDate } = parsedDate(value);
    const from_date = format(new Date(startDate as Date), 'yyyy-MM-dd');
    const to_date = format(new Date(endDate as Date), 'yyyy-MM-dd');
    changeQuery({ ...query, to_date, from_date, period: value });
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
        py: 2.5,
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
      <TextField
        select
        label="Khung thời gian"
        value={query?.period || ''}
        onChange={(event) => {
          handleChangePeriod(event);
        }}
        variant="outlined"
        sx={{ width: '200px' }}
      >
        {PERIOD_OPTIONS.map((item, index) => (
          <MenuItem key={index} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}

export default AnalyticsToolbar;
