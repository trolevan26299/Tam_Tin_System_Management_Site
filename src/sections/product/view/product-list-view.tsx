'use client';

import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// routes
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
// hooks
// _mock
// api
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
// types
import { Tab, Tabs } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { getListSubCategory } from 'src/api/allCategory';
import { getListCustomer } from 'src/api/customer';
import { deleteDeviceById, getDeviceById, getListDevice } from 'src/api/product';
import Label from 'src/components/label';
import { ISubCategory } from 'src/types/category';
import { ICustomer } from 'src/types/customer';
import { IInvoiceTableFilterValue } from 'src/types/invoice';
import { IDevice, IProductTableFilters, IQueryDevice } from 'src/types/product';
import DeviceInfo from '../product-info';
import ProductTableRow from '../product-table-row';
import ProductTableToolbar from '../product-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'id_device', label: 'ID Device', width: 120 },
  { id: 'category_name', label: 'Category name', width: 160 },
  { id: 'warranty', label: 'Warranty', width: 140 },
  { id: 'status', label: 'Status', width: 90 },
  { id: 'delivery_date', label: 'Delivery date', width: 160 },
  { id: 'belong_to', label: 'Belong to', width: 180 },
  { id: 'price', label: 'Price', width: 180 },
  { id: 'quantity', label: 'Quantity', width: 180 },
  { id: 'note', label: 'Note', width: 160 },
  { id: 'action', label: 'Action', width: 80 },
];

const defaultFilters: IProductTableFilters = {
  name: '',
  publish: [],
  stock: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function ProductListView() {
  const router = useRouter();
  const theme = useTheme();

  const table = useTable();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState<IDevice[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [selectedItem, setSelectedItem] = useState<IDevice | undefined>(undefined);
  const [queryDevice, setQueryDevice] = useState<IQueryDevice>({});

  const getInvoiceLength = (status: string) =>
    tableData.filter((item) => item.status === status).length;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData?.length },
    {
      value: 'inventory',
      label: 'Inventory',
      color: 'success',
      count: getInvoiceLength('inventory'),
    },
    {
      value: 'sold',
      label: 'Sold',
      color: 'warning',
      count: getInvoiceLength('sold'),
    },
  ] as const;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered?.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !dataFiltered?.length && canReset;

  const handleDeleteById = async (id: string) => {
    await deleteDeviceById(id);
  };

  const handleFilters = useCallback(
    (name: string, value: IInvoiceTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleDeleteRow = useCallback(
    (id: string) => {
      handleDeleteById(id);
      const deleteRow = tableData?.filter((row) => row._id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage?.length || 0);
    },
    [dataInPage?.length, table, tableData]
  );

  const handleEditRow = async (id: string) => {
    try {
      const currentDevice = await getDeviceById(id);
      setSelectedItem(currentDevice.data);
      setOpenDialog(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(undefined);
  };

  const getDeviceList = async (query?: IQueryDevice) => {
    const deviceList = await getListDevice(query);
    return deviceList;
  };

  const getSubCategoryList = async () => {
    const subCategoryList = await getListSubCategory();
    return subCategoryList;
  };

  const getCustomers = async () => {
    const customerList: ICustomer[] = await getListCustomer();
    return customerList;
  };

  const handleSearch = async (query: IQueryDevice) => {
    const deviceList = await getDeviceList(query);
    setTableData(deviceList);
  };

  const getAllData = async () => {
    try {
      const [deviceList, subCategoryList, customerList] = await Promise.all([
        getDeviceList(),
        getSubCategoryList(),
        getCustomers(),
      ]);
      setTableData(deviceList);
      setSubCategories(subCategoryList);
      setCustomers(customerList);
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
              name: 'Product',
              href: paths.dashboard.product.root,
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
              Create Device
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <ProductTableToolbar
            onSearch={(query) => handleSearch(query)}
            listCustomer={customers}
            query={queryDevice}
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
                    .map((row) => (
                      <ProductTableRow
                        key={row._id}
                        row={{
                          ...row,
                          sub_category_id: subCategories?.find((x) => x._id === row.sub_category_id)
                            ?.name as string,
                          belong_to: customers?.find((x) => x?._id === row?.belong_to)
                            ?.name as string,
                        }}
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

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
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
      <DeviceInfo
        currentDevice={selectedItem}
        open={openDialog}
        onClose={handleCloseDialog}
        getDeviceList={getAllData}
        listSubCategory={subCategories}
        listCustomer={customers}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IDevice[];
  comparator: (a: any, b: any) => number;
  filters: IProductTableFilters;
}) {
  const { name, status } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (product) => product.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((invoice) => invoice.status === status);
  }

  return inputData;
}
