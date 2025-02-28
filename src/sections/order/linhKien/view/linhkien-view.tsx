'use client';

import { Button, Container, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getListOrderLinhKien } from 'src/api/order-linh-kien';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { useBoolean } from 'src/hooks/use-boolean';
import { IOrderLinhKien, IOrderLinhKienListResponse, IQueryOrderLinhKienDto } from 'src/types/order-linh-kien';
import { LoadingScreen } from 'src/components/loading-screen';
import OrderLinhKienFilter from '../order-linh-kien-filter';
import OrderLinhKienTable from '../order-linh-kien-table';
import OrderLinhKienForm from '../order-linh-kien-form';

const defaultFilters: IQueryOrderLinhKienDto = {
  keyword: '',
  from_date: '',
  to_date: '',
  id_khach_hang: '',
  page: 0,
  items_per_page: 10,
};

export default function OrderLinhKienListView() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const loading = useBoolean(true);
  const formDialog = useBoolean(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<IOrderLinhKien | undefined>(undefined);

  const [shouldFetch, setShouldFetch] = useState(true);
  const [filters, setFilters] = useState<IQueryOrderLinhKienDto>(defaultFilters);
  const [orderData, setOrderData] = useState<IOrderLinhKienListResponse>({
    data: [],
    totalCount: 0,
    currentPage: 1,
    lastPage: 1,
    nextPage: null,
    prevPage: null,
  })
  const filtersRef = useRef(filters);
  const loadingRef = useRef({
    onTrue: loading.onTrue,
    onFalse: loading.onFalse
  });

  const handleFilters = (name: string, value: any) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    // Khi reset filters, cũng cần cập nhật filtersRef và trigger fetch
    filtersRef.current = defaultFilters;
    setShouldFetch(true);
  };

  const handleSearchFilters = () => {
    // Cập nhật filtersRef.current với giá trị filters hiện tại
    filtersRef.current = filters;
    setShouldFetch(true);
  };

  const handlePageChange = (page: number) => {
    setFilters((prevState) => ({
      ...prevState,
      page,
    }));
    // Cập nhật page trong filtersRef
    filtersRef.current = {
      ...filtersRef.current,
      page,
    };
    setShouldFetch(true);
  };

  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setFilters((prevState) => ({
      ...prevState,
      items_per_page: rowsPerPage,
      page: 0,
    }));
    // Cập nhật items_per_page và page trong filtersRef
    filtersRef.current = {
      ...filtersRef.current,
      items_per_page: rowsPerPage,
      page: 0,
    };
    setShouldFetch(true);
  };

  const handleOpenCreateForm = () => {
    setIsEdit(false);
    setCurrentOrder(undefined);
    formDialog.onTrue();
  };

  const handleOpenEditForm = (order: IOrderLinhKien) => {
    setIsEdit(true);
    setCurrentOrder(order);
    formDialog.onTrue();
  };

  const fetchData = useCallback(async () => {
    try {
      loadingRef.current.onTrue();
      console.log('Fetching with filters:', filtersRef.current); // Log để debug
      const response = await getListOrderLinhKien({
        ...filtersRef.current,
        page: filtersRef.current.page,
      });
      setOrderData(response);
    } catch (error) {
      console.error('Failed to fetch order data:', error);
      enqueueSnackbar('Có lỗi xảy ra khi tải dữ liệu', { variant: 'error' });
    } finally {
      loadingRef.current.onFalse();
    }
  }, [enqueueSnackbar]);

  const fetchDataRef = useRef(fetchData);

  // Cập nhật filtersRef khi filters thay đổi
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    if (shouldFetch) {
      fetchDataRef.current();
      setShouldFetch(false);
    }
  }, [shouldFetch]);

  useEffect(() => {
    fetchDataRef.current = fetchData;
  }, [fetchData]);

  if (loading.value && orderData.data.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Quản lý đơn hàng linh kiện"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Đơn hàng linh kiện' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenCreateForm}
          >
            Tạo đơn hàng mới
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={3}>
        <OrderLinhKienFilter
          filters={filters}
          onFilters={handleFilters}
          onResetFilters={handleResetFilters}
          onSearchFilters={handleSearchFilters}
        />

        <OrderLinhKienTable
          data={orderData.data}
          totalCount={orderData.totalCount}
          currentPage={orderData.currentPage}
          lastPage={orderData.lastPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPage={filters.items_per_page || 10}
          onRefresh={fetchData}
          onEdit={handleOpenEditForm}
        />
      </Stack>

      {/* Form Dialog */}
      <OrderLinhKienForm
        open={formDialog.value}
        onClose={formDialog.onFalse}
        isEdit={isEdit}
        currentOrder={currentOrder}
        onSuccess={fetchData}
      />
    </Container>
  );
}
