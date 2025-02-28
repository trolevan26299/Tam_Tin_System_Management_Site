import { Autocomplete, Button, Card, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useCallback, useEffect, useState } from 'react';
import { getListCustomer } from 'src/api/customer';
import Iconify from 'src/components/iconify';
import { ICustomer } from 'src/types/customer';
import { IQueryOrderLinhKienDto } from 'src/types/order-linh-kien';

type Props = {
  filters: IQueryOrderLinhKienDto;
  onFilters: (name: string, value: any) => void;
  onResetFilters: VoidFunction;
  onSearchFilters: VoidFunction;
};

export default function OrderLinhKienFilter({
  filters,
  onFilters,
  onResetFilters,
  onSearchFilters,
}: Props) {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<ICustomer[]>([]);
  const [customerLoaded, setCustomerLoaded] = useState(false);

  const handleFilterKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilters('keyword', event.target.value);
  };

  const handleFilterFromDate = (date: Date | null) => {
    onFilters('from_date', date ? date.toISOString() : '');
  };

  const handleFilterToDate = (date: Date | null) => {
    onFilters('to_date', date ? date.toISOString() : '');
  };

  const handleFilterCustomer = (value: string | null) => {
    onFilters('id_khach_hang', value || '');
  };

  const handleInputChangeCustomer = (searchQuery: string) => {
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleGetAllCustomer = useCallback(async () => {
    if (customerLoaded) return;

    try {
      const customersList = await getListCustomer({ page: 0, items_per_page: 1000 });
      setCustomers(customersList.data);
      setFilteredCustomers(customersList.data);
      setCustomerLoaded(true);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  }, [customerLoaded]);
  useEffect(() => {
    handleGetAllCustomer();
  }, [handleGetAllCustomer]);
  return (
    <Card sx={{ p: 2 }}>
      <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems="center">
        <TextField
          fullWidth
          label="Tìm kiếm theo tên linh kiện"
          value={filters.keyword || ''}
          onChange={handleFilterKeyword}
          placeholder="Nhập tên linh kiện..."
        />

        <DatePicker
          label="Từ ngày"
          value={filters.from_date ? new Date(filters.from_date) : null}
          onChange={handleFilterFromDate}
          slotProps={{ textField: { fullWidth: true } }}
        />

        <DatePicker
          label="Đến ngày"
          value={filters.to_date ? new Date(filters.to_date) : null}
          onChange={handleFilterToDate}
          slotProps={{ textField: { fullWidth: true } }}
        />

        <Autocomplete
          fullWidth
          options={filteredCustomers.map((item) => item._id)}
          getOptionLabel={(option) => customers.find((x) => x._id === option)?.name || ''}
          value={filters.id_khach_hang || null}
          onChange={(_, value) => handleFilterCustomer(value || null)}
          onInputChange={(_, value, reason) => {
            if (reason === 'input') {
              handleInputChangeCustomer(value);
            }
          }}
          renderInput={(params) => <TextField {...params} label="Khách hàng" />}
        />

        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:search-fill" />}
            onClick={onSearchFilters}
          >
            Tìm kiếm
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="eva:refresh-fill" />}
            onClick={onResetFilters}
          >
            Xóa bộ lọc
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
