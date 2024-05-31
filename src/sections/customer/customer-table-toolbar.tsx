import { InputAdornment, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import Iconify from 'src/components/iconify';
import { IQueryCustomer } from 'src/types/customer';

export default function CustomerTableToolbar({
  onSearch,
}: {
  onSearch: (query: IQueryCustomer) => void;
}) {
  const [inputSearch, setInputSearch] = useState<string>('');

  const handleSearchBar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputSearch(value);
    // onSearch({ keyword: value });
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
      <Stack direction="row" alignItems="center" spacing={2} sx={{ width: 400 }}>
        <TextField
          fullWidth
          value={inputSearch}
          onChange={handleSearchBar}
          placeholder="Search customer or phone number..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          onKeyUp={(e: any) => {
            if (e.key.toLocaleLowerCase() === 'enter') {
              onSearch({ keyword: e.target?.value });
            }
          }}
        />
      </Stack>
    </Stack>
  );
}
