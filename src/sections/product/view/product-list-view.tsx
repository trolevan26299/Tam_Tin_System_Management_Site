/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { Button, Card, Container, Table, TableBody, TableContainer } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { deleteDeviceByDeviceId, deleteDeviceById, getListDevice } from 'src/api/product';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  emptyRows,
  useTable,
} from 'src/components/table';
import { paths } from 'src/routes/paths';
import { useGetSubCategory } from 'src/store/context/sub-category-context';
import { IDataDevice, IDevice, IQueryDevice } from 'src/types/product';
import { useSnackbar } from 'notistack';
import DeviceInfo from '../product-info';
import ProductTableRow from '../product-table-row';
import ProductTableToolbar from '../product-table-toolbar';

const TABLE_HEAD = [
  { id: 'name', label: 'Tên', width: 160 },
  { id: 'category_name', label: 'Thuộc', width: 160 },
  { id: 'price', label: 'Giá nhập', width: 160 },
  { id: 'inventory', label: 'Tồn kho', width: 120 },
  { id: 'sold', label: 'Đã bán', width: 120 },
  { id: 'note', label: 'Ghi chú', width: 160 },
  { id: 'actions', label: '', width: 80 },
];

export default function ProductListView() {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultDense: true, defaultRowsPerPage: 10 });
  const settings = useSettingsContext();
  const { subCategoryList } = useGetSubCategory();
  const [tableData, setTableData] = useState<IDataDevice | undefined>();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [queryDevice, setQueryDevice] = useState<IQueryDevice>({
    page: 0,
    items_per_page: 10,
    subCategoryId: '_all_',
  });

  const denseHeight = table.dense ? 52 : 72;

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSearch = async (query: IQueryDevice) => {
    const newQuery = {
      ...query,
      subCategoryId: query.subCategoryId === '_all_' ? undefined : query.subCategoryId,
    };
    const deviceList = await getDeviceList(newQuery);
    setQueryDevice(query);
    setTableData(deviceList);
  };

  const getDeviceList = async (query?: IQueryDevice) => {
    const deviceList = await getListDevice(query);
    return deviceList;
  };

  const handleDeleteById = async (id: string) => {
    await deleteDeviceById(id);
  };

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        const deviceToDelete = tableData?.data?.find((row) => row._id === id);

        const hasRepairHistory = deviceToDelete?.detail?.some(
          (device) =>
            device.deviceInfo.history_repair && device.deviceInfo.history_repair.length > 0
        );

        if (!hasRepairHistory) {
          await handleDeleteById(id);
          const deleteRow = tableData?.data?.filter((row) => row._id !== id) as IDevice[];
          setTableData({ ...tableData, data: deleteRow });
          enqueueSnackbar('Xóa sản phẩm thành công', { variant: 'success' });
        } else {
          enqueueSnackbar(
            'Các sản phẩm bên trong đã có lịch sử sửa chữa, không thể xóa được. Nếu muốn xóa hãy xóa sản phẩm đó trước rồi quay lại',
            {
              variant: 'error',
            }
          );
        }
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        enqueueSnackbar('Đã xảy ra lỗi khi xóa sản phẩm', { variant: 'error' });
      }
    },
    [tableData, handleDeleteById, enqueueSnackbar]
  );

  const handleDeleteDevice = async (id: string) => {
    try {
      await deleteDeviceByDeviceId(id, enqueueSnackbar);
      handleSearch(queryDevice);
    } catch (error) {
      console.error('Lỗi khi xóa thiết bị:', error);
    }
  };

  useEffect(() => {
    handleSearch(queryDevice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Danh sách sản phẩm"
          links={[
            { name: 'Trang chủ', href: paths.dashboard.root },
            { name: 'Sản phẩm', href: paths.dashboard.product.root },
            { name: 'Danh sách' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              Tạo mới sản phẩm
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <ProductTableToolbar
            onSearch={(query) => {
              handleSearch(query);
            }}
            query={queryDevice}
            listSubCategory={subCategoryList}
          />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} />

                <TableBody>
                  {tableData?.data.map((row) => (
                    <ProductTableRow
                      key={row._id}
                      row={{
                        ...row,
                        sub_category_id: subCategoryList?.find((x) => x._id === row.sub_category_id)
                          ?.name as string,
                      }}
                      selected={table.selected.includes(row?._id as string)}
                      onSelectRow={() => table.onSelectRow(row?._id as string)}
                      onDeleteRow={() => handleDeleteRow(row?._id as string)}
                      onDeleteDevice={handleDeleteDevice}
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData?.totalCount || 0)}
                  />

                  <TableNoData notFound={tableData?.totalCount === 0} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={tableData?.totalCount || 0}
            page={Number(queryDevice?.page)}
            rowsPerPage={Number(queryDevice?.items_per_page)}
            onPageChange={(event, page) => {
              const newQuery = { ...queryDevice, page };
              handleSearch(newQuery);
            }}
            onRowsPerPageChange={(event) => {
              const newQuery = {
                ...queryDevice,
                page: 0,
                items_per_page: Number(event.target.value),
              };
              handleSearch(newQuery);
            }}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>
      <DeviceInfo
        open={openDialog}
        onClose={handleCloseDialog}
        getDeviceList={() => {
          handleSearch(queryDevice);
        }}
        listSubCategory={subCategoryList}
      />
    </>
  );
}
