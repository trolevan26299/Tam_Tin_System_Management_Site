import { Autocomplete, Stack, TextField } from '@mui/material';
import { debounce } from 'lodash';
import { useState } from 'react';
import { getListCustomer } from 'src/api/customer';
import SearchInputDebounce from 'src/components/search-input-debounce/search-input-debounce';
import { ICustomer } from 'src/types/customer';
import { IQueryLinhKien } from 'src/types/linh-kien';

export default function LinhKienTableToolbar({
  onSearch,
  query,
}: {
  onSearch: (query: IQueryLinhKien) => void;
  query: IQueryLinhKien;
}) {
  const [linhKiens, setLinhKiens] = useState<ILinhKien[]>([]);

  const handleInputChangeCustomer = debounce(async (searchQuery: string) => {
    try {
      const response = await getListCustomer({ keyword: searchQuery });
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to search devices:', error);
    }
  }, 300);

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
        <Autocomplete
          sx={{ width: 200 }}
          options={customers.map((item: ICustomer) => item?._id)}
          onInputChange={(_e: React.SyntheticEvent, value: string, reason: string) => {
            if (reason === 'input') {
              handleInputChangeCustomer(value);
            }
            if (reason === 'clear') {
              onSearch({ ...query, belong_to: undefined });
            }
          }}
          getOptionLabel={(option) =>
            (customers?.find((x: ICustomer) => x._id === option)?.name || '') as any
          }
          onChange={(event, newValue) => {
            if (newValue) onSearch({ ...query, belong_to: String(newValue) });
          }}
          renderInput={(params) => <TextField label="Thuộc danh mục" {...params} />}
          value={query?.belong_to}
        />

        <SearchInputDebounce
          onSearch={(value: string) => {
            onSearch({ ...query, keyword: value });
          }}
          placeholder="Tìm kiếm thiết bị..."
          width={300}
          value={query?.keyword || ''}
          useIconClear
        />
      </Stack>
    </Stack>
  );
}
