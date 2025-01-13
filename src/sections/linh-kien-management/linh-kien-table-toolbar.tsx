import { Stack } from '@mui/material';
import SearchInputDebounce from 'src/components/search-input-debounce/search-input-debounce';
import { IQueryLinhKien } from 'src/types/linh-kien';

export default function LinhKienTableToolbar({
  onSearch,
  query,
}: {
  onSearch: (query: IQueryLinhKien) => void;
  query: IQueryLinhKien;
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
        <SearchInputDebounce
          onSearch={(value: string) => {
            onSearch({ ...query, keyword: value });
          }}
          placeholder="Tìm kiếm linh kiện..."
          width={300}
          value={query?.keyword || ''}
          useIconClear
        />
      </Stack>
    </Stack>
  );
}
