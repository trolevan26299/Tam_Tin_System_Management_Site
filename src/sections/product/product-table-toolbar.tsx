import { MenuItem, Stack, TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import SearchInputDebounce from 'src/components/search-input-debounce/search-input-debounce';
import { ICustomer, IQueryCustomer } from 'src/types/customer';

export default function ProductTableToolbar({
  onSearch,
  listCustomer,
}: {
  onSearch: (query: IQueryCustomer) => void;
  listCustomer: ICustomer[];
}) {
  const [selectBelongTo, setSelectBelongTo] = useState<string>('');

  const handleChangeBelongTo = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;
    setSelectBelongTo(value);
    onSearch({ belong_to: value });
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
          value={selectBelongTo}
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
            onSearch({ keyword: value });
          }}
          placeholder="Search device..."
          width={300}
        />
      </Stack>
    </Stack>
  );
}
