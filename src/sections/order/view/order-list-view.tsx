'use client';

import { Button, Card, Container, Table, TableBody, TableContainer } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { deleteOrderById, getListOrder, getOrderById } from 'src/api/order';
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
import { IDataOrder, IOrder, IQueryOrder } from 'src/types/order';
import OrderDetailsInfo from '../order-details-info';
import OrderTableRow from '../order-table-row';
import OrderTableToolbar from '../order-table-toolbar';
import { RouterLink } from 'src/routes/components';

const TABLE_HEAD = [
  { id: 'id', label: 'ID Order', width: 100 },
  { id: 'delivery', label: 'Ship by', width: 100 },
  { id: 'customer', label: 'Khách hàng', width: 120 },
  { id: 'delivery_date', label: 'Ngày giao', width: 100 },
  { id: 'items', label: 'Sản phẩm', width: 100 },
  { id: 'price', label: 'Giá', width: 140 },
  { id: 'note', label: 'Ghi chú', width: 140 },
  { id: 'action', label: 'Hành động', width: 120 },
];

export default function OrderListView() {
  const router = useRouter();
  const table = useTable({ defaultDense: true, defaultRowsPerPage: 10 });
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [tableData, setTableData] = useState<IDataOrder | undefined>(undefined);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<IOrder | undefined>(undefined);
  const [queryList, setQueryList] = useState<IQueryOrder>({
    page: 0,
    items_per_page: 10,
  });

  const denseHeight = table.dense ? 52 : 72;

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(undefined);
  };

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );

  const handleDeleteById = async (id: string) => {
    const deleteOrder = await deleteOrderById(id);
    if (deleteOrder) {
      enqueueSnackbar('Delete success!', {
        variant: 'success',
      });
    }
  };

  const handleDeleteRow = useCallback(
    (id: string) => {
      handleDeleteById(id);
      const deleteRow = tableData?.data?.filter((row) => row._id !== id) as IOrder[];
      setTableData({ ...tableData, data: deleteRow });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, tableData]
  );

  const handleEditRow = async (id: string) => {
    try {
      const currentOrder = await getOrderById(id);
      setSelectedItem(currentOrder);
      setOpenDialog(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (query?: IQueryOrder) => {
    const orderList = await getListOrder(query);
    if (query) setQueryList(query);
    setTableData(orderList);
  };

  const getList = async (query?: IQueryOrder) => {
    const orderList = await getListOrder(query);
    setQueryList(query || {});
    setTableData(orderList);
  };

  const getAllData = async () => {
    try {
      getList(queryList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Order',
              href: paths.dashboard.order.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.order.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Tạo order
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <OrderTableToolbar
            onSearch={handleSearch}
            query={queryList}
            onReset={() => {
              handleSearch({ page: 0, items_per_page: 5 });
            }}
          />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {tableData?.data?.map((row, index) => (
                    <OrderTableRow
                      key={index}
                      row={row}
                      selected={table.selected.includes(row?._id as string)}
                      onSelectRow={() => table.onSelectRow(row?._id as string)}
                      onDeleteRow={() => handleDeleteRow(row?._id as string)}
                      onEditRow={() => handleEditRow(row?._id as string)}
                      onViewRow={() => handleViewRow(row?._id as string)}
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
            page={Number(queryList?.page)}
            rowsPerPage={Number(queryList?.items_per_page)}
            onPageChange={(event, page) => {
              const newQuery = { ...queryList, page };
              handleSearch(newQuery);
            }}
            onRowsPerPageChange={(event) => {
              const newQuery = {
                ...queryList,
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
      {/* <OrderDetailsInfo
        open={openDialog}
        onClose={handleCloseDialog}
        currentOrder={selectedItem}
        getAllOrder={() => {
          handleSearch(queryList);
        }}
      /> */}
    </>
  );
}
