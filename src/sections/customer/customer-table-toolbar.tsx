import { Stack } from '@mui/material';
import SearchInputDebounce from 'src/components/search-input-debounce';
import { IQueryCustomer } from 'src/types/customer';

export default function CustomerTableToolbar({
  onSearch,
  query,
}: {
  onSearch: (query: IQueryCustomer) => void;
  query: IQueryCustomer;
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
      <Stack direction="row" alignItems="center" spacing={2} sx={{ width: 400 }}>
        <SearchInputDebounce
          onSearch={(value: string) => {
            onSearch({ ...query, keyword: value, page: 0 });
          }}
          placeholder="Search customer or phone number..."
          width={400}
          value={query.keyword || ''}
          useIconClear
        />
      </Stack>
    </Stack>
  );
}
