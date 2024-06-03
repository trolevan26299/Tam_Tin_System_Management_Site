import { Stack } from '@mui/material';
import SearchInputDebounce from 'src/components/search-input-debounce';
import { IQueryCustomer } from 'src/types/customer';

export default function CustomerTableToolbar({
  onSearch,
}: {
  onSearch: (query: IQueryCustomer) => void;
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
            onSearch({ keyword: value });
          }}
          placeholder="Search customer or phone number..."
          width={400}
        />
      </Stack>
    </Stack>
  );
}
