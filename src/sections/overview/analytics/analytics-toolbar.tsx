import { Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import React from 'react';
import { IQueryAnalytics } from 'src/types/analytics';

function AnalyticsToolbar({ query }: { query: IQueryAnalytics }) {
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
        // onChange={handleFilterFromDate}
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
        // onChange={handleFilterToDate}
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
    </Stack>
  );
}

export default AnalyticsToolbar;
