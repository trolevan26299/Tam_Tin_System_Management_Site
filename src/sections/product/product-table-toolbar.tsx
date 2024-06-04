import { MenuItem, Stack, TextField } from '@mui/material';
import { ChangeEvent } from 'react';
import SearchInputDebounce from 'src/components/search-input-debounce/search-input-debounce';
import { ICustomer } from 'src/types/customer';
import { IQueryDevice } from 'src/types/product';

export default function ProductTableToolbar({
  onSearch,
  listCustomer,
  query,
}: {
  onSearch: (query: IQueryDevice) => void;
  listCustomer: ICustomer[];
  query: IQueryDevice;
}) {
  const handleChangeBelongTo = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;
    onSearch({ ...query, belong_to: value });
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
      <Stack direction="row" alignItems="center" spacing={2} sx={{ width: 500 }}>
        <TextField
          select
          sx={{ width: 200 }}
          label="Belong to"
          onChange={(e) => handleChangeBelongTo(e)}
          value={query?.belong_to}
        >
          <MenuItem value="">All</MenuItem>
          {listCustomer?.map((item: ICustomer) => (
            <MenuItem value={item._id} key={item._id}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>

        <SearchInputDebounce
          onSearch={(value: string) => {
            onSearch({ ...query, keyword: value });
          }}
          placeholder="Search device..."
          width={300}
          value={query?.keyword || ''}
          useIconClear
        />
      </Stack>
    </Stack>
  );
}
