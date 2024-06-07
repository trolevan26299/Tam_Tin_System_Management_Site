'use client';

import {
  Button,
  Card,
  Container,
  Tab,
  Table,
  TableBody,
  TableContainer,
  Tabs,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { getListSubCategory } from 'src/api/allCategory';
import { getListCustomer } from 'src/api/customer';
import { deleteDeviceById, getDeviceById, getListDevice } from 'src/api/product';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
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
import { ISubCategory } from 'src/types/category';
import { ICustomer } from 'src/types/customer';
import { IInvoiceTableFilterValue } from 'src/types/invoice';
import {
  IDataDevice,
  IDevice,
  IProductTableFilters,
  IQueryDevice,
  IStatusDevice,
} from 'src/types/product';
import DeviceInfo from '../product-info';
import ProductTableRow from '../product-table-row';
import ProductTableToolbar from '../product-table-toolbar';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 160 },
  { id: 'id_device', label: 'ID Device', width: 160 },
  { id: 'category_name', label: 'Category', width: 160 },
  { id: 'warranty', label: 'Warranty', width: 140 },
  { id: 'belong_to', label: 'Belong to', width: 180 },
  { id: 'price', label: 'Price', width: 160 },
  { id: 'inventory', label: 'Inventory', width: 100 },
  { id: 'sold', label: 'Sold', width: 10 },
  { id: 'note', label: 'Note', width: 160 },
  { id: 'action', label: 'Action', width: 80 },
];

const defaultFilters: IProductTableFilters = {
  name: '',
  publish: [],
  stock: [],
  status: 'all',
};

export default function ProductListView() {
  const theme = useTheme();
  const table = useTable();
  const settings = useSettingsContext();

  const [tableData, setTableData] = useState<IDataDevice | undefined>();
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<IDevice | undefined>(undefined);
  const [queryDevice, setQueryDevice] = useState<IQueryDevice>({
    page: 0,
    items_per_page: 5,
  });
  const [filters, setFilters] = useState(defaultFilters);
  const denseHeight = table.dense ? 52 : 72;

  const getInvoiceLength = (statusType: string) => {
    let count = 0;
    tableData?.data.forEach((data) => {
      data.status.forEach((status: IStatusDevice) => {
        if (status.status === statusType && status?.quantity > 0) {
          // eslint-disable-next-line no-plusplus
          count++;
        }
      });
    });
    return count;
  };

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData?.totalCount },
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

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(undefined);
  };

  const handleSearch = async (query: IQueryDevice) => {
    const deviceList = await getDeviceList(query);
    setQueryDevice(query);
    setTableData(deviceList);
  };

  const getDeviceList = async (query?: IQueryDevice) => {
    const deviceList = await getListDevice(query);
    return deviceList;
  };

  const handleEditRow = async (id: string) => {
    try {
      const currentDevice = await getDeviceById(id);
      setSelectedItem(currentDevice.data);
      setOpenDialog(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteById = async (id: string) => {
    await deleteDeviceById(id);
  };

  const handleDeleteRow = useCallback(
    (id: string) => {
      handleDeleteById(id);
      const deleteRow = tableData?.data?.filter((row) => row._id !== id) as IDevice[];
      setTableData({ ...tableData, data: deleteRow });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, tableData]
  );

  const getSubCategoryList = async () => {
    const subCategoryList = await getListSubCategory();
    return subCategoryList;
  };

  const getAllData = async () => {
    try {
      const [deviceList, subCategoryList] = await Promise.all([
        getDeviceList(queryDevice),
        getSubCategoryList(),
      ]);
      setTableData(deviceList);
      setSubCategories(subCategoryList?.data);
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
              Tạo sản phẩm
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
                    {tab?.count}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <ProductTableToolbar
            onSearch={(query) => {
              const newQuery = { ...query, page: 0 };
              handleSearch(newQuery);
            }}
            query={queryDevice}
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
                        sub_category_id: subCategories?.find((x) => x._id === row.sub_category_id)
                          ?.name as string,
                        belong_to: (row?.belong_to as unknown as { name: string })?.name as any,
                      }}
                      selected={table.selected.includes(row?._id as string)}
                      onSelectRow={() => table.onSelectRow(row?._id as string)}
                      onDeleteRow={() => handleDeleteRow(row?._id as string)}
                      onEditRow={() => handleEditRow(row?._id as string)}
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
        currentDevice={selectedItem}
        open={openDialog}
        onClose={handleCloseDialog}
        getDeviceList={() => {
          handleSearch(queryDevice);
        }}
        listSubCategory={subCategories}
      />
    </>
  );
}
