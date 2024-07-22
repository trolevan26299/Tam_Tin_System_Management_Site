import { Stack } from '@mui/material';
import React from 'react';
import SearchInputDebounce from 'src/components/search-input-debounce';
import { IQueryStaff } from 'src/types/staff';

function StaffTableToolbar({
  onSearch,
  query,
}: {
  onSearch: (query: IQueryStaff) => void;
  query: IQueryStaff;
}) {
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
      <SearchInputDebounce
        onSearch={(value: string) => {
          onSearch({ ...query, keyword: value });
        }}
        placeholder="Tìm kiếm tên nhân viên..."
        width={300}
        value={query?.keyword || ''}
        useIconClear
      />
    </Stack>
  );
}

export default StaffTableToolbar;
