import { Autocomplete, MenuItem, Stack, TextField } from '@mui/material';
import { debounce } from 'lodash';
import { ChangeEvent, useState } from 'react';
import { getListCustomer } from 'src/api/customer';
import { RHFAutocomplete } from 'src/components/hook-form';
import SearchInputDebounce from 'src/components/search-input-debounce/search-input-debounce';
import { ICustomer } from 'src/types/customer';
import { IQueryDevice } from 'src/types/product';

export default function ProductTableToolbar({
  onSearch,
  query,
}: {
  onSearch: (query: IQueryDevice) => void;
  query: IQueryDevice;
}) {
  const [customers, setCustomers] = useState<ICustomer[]>([]);

  const handleChangeBelongTo = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;
    onSearch({ ...query, belong_to: value });
  };

  const handleInputChangeCustomer = (value: string) => {
    getCustomer(value, (results?: ICustomer[]) => {
      if (results) {
        setCustomers(results);
      }
    });
  };

  const getCustomer = debounce(async (input: string, callback: (results?: ICustomer[]) => void) => {
    const params = {
      keyword: input,
    };
    const listCustomer = await getListCustomer(params);
    callback(listCustomer?.data);
  }, 200);

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
          renderInput={(params) => <TextField label="Belong to" {...params} />}
          value={query?.belong_to}
        />

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
