'use client';

import { Button, Card, Container, Table, TableBody, TableContainer } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { getListCustomer } from 'src/api/customer';
import { getListOrder } from 'src/api/order';
import { getListDevice } from 'src/api/product';
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
  getComparator,
  useTable,
} from 'src/components/table';
import { paths } from 'src/routes/paths';
import { ICustomer } from 'src/types/customer';
import { IOrder, IOrderCreateOrUpdate, IOrderTableFilters, IQueryOrder } from 'src/types/order';
import { IDevice } from 'src/types/product';
import OrderDetailsInfo from '../order-details-info';
import OrderTableRow from '../order-table-row';
import OrderTableToolbar from '../order-table-toolbar';

const TABLE_HEAD = [
  { id: 'delivery', label: 'Order' },
  { id: 'customer', label: 'Customer' },
  { id: 'delivery_date', label: 'Date' },
  { id: 'items', label: 'Items' },
  { id: 'price', label: 'Price' },
  { id: 'note', label: 'Note' },
  { id: 'action', label: 'Action' },
];

const filtersData: IOrderTableFilters = {
  name: '',
};

function OrderListView() {
  const table = useTable();
  const settings = useSettingsContext();

  const [tableData, setTableData] = useState<IOrder[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<IOrder | undefined>(undefined);
  const [queryList, setQueryList] = useState<IQueryOrder>({});
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [devices, setDevices] = useState<IDevice[]>([]);

  const denseHeight = table.dense ? 52 : 72;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filtersData,
  });

  const dataInPage = dataFiltered?.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(undefined);
  };

  const handleDeleteRow = useCallback(
    (id: string) => {
      // handleDeleteById(id);
      const deleteRow = tableData?.filter((row) => row._id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage?.length || 0);
    },
    [dataInPage?.length, table, tableData]
  );

  const handleEditRow = async (id: string) => {
    try {
      // const currentCustomer = await getCustomerById(id);
      // setSelectedItem(currentCustomer);
      setOpenDialog(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getList = async (query?: IQueryOrder) => {
    const orderList = await getListOrder(query);
    setQueryList(query || {});
    return orderList;
  };

  const getCustomers = async () => {
    const listCustomer = await getListCustomer();
    return listCustomer;
  };

  const getDevices = async () => {
    const listDevices = await getListDevice();
    return listDevices;
  };

  const getAllData = async () => {
    try {
      const [orderList, listCustomer, listDevices] = await Promise.all([
        getList(),
        getCustomers(),
        getDevices(),
      ]);

      setTableData(orderList);
      setCustomers(listCustomer);
      setDevices(listDevices);
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
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => {
                setOpenDialog(true);
                setSelectedItem(undefined);
              }}
            >
              Tạo order
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <OrderTableToolbar
            onSearch={getList}
            query={queryList}
            onReset={() => {
              getList({});
            }}
          />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData?.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />
                <TableBody>
                  {dataFiltered
                    ?.slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, index) => (
                      <OrderTableRow
                        key={index}
                        row={row}
                        selected={table.selected.includes(row?._id as string)}
                        onSelectRow={() => table.onSelectRow(row?._id as string)}
                        onDeleteRow={() => handleDeleteRow(row?._id as string)}
                        onEditRow={() => handleEditRow(row?._id as string)}
                      />
                    ))}
                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData?.length || 0)}
                  />
                  <TableNoData notFound={tableData?.length === 0} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered?.length as number}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>
      <OrderDetailsInfo
        open={openDialog}
        onClose={handleCloseDialog}
        currentOrder={selectedItem}
        listCustomer={customers}
        listDevice={devices}
        getAllOrder={() => {
          getList(queryList);
        }}
      />
    </>
  );
}

export default OrderListView;

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData?: IOrder[];
  comparator: (a: any, b: any) => number;
  filters: IOrderTableFilters;
}) {
  const { name } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (user) => user.delivery?.trackingNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
