import { MenuItem, Stack, TextField } from '@mui/material';
import SearchInputDebounce from 'src/components/search-input-debounce/search-input-debounce';
import { ISubCategory } from 'src/types/category';
import { IQueryDevice } from 'src/types/product';

export default function ProductTableToolbar({
  onSearch,
  query,
  listSubCategory,
}: {
  onSearch: (query: IQueryDevice) => void;
  query: IQueryDevice;
  listSubCategory: ISubCategory[];
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
      <Stack direction="row" alignItems="center" spacing={2} sx={{ width: 500 }}>
        <TextField
          select
          label="Loại giao dịch"
          value={query.subCategoryId}
          onChange={(event) => {
            const { value } = event.target;
            onSearch({ ...query, subCategoryId: value, page: 0 });
          }}
          sx={{ width: '200px' }}
        >
          <MenuItem value="_all_">Tất cả</MenuItem>
          {listSubCategory.map((item, index) => (
            <MenuItem key={index} value={item._id}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>

        <SearchInputDebounce
          onSearch={(value: string) => {
            onSearch({ ...query, keyword: value, page: 0 });
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
