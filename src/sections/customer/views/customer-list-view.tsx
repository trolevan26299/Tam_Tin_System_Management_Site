'use client';

import { Button, Card, Container, Table, TableBody, TableContainer } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { deleteCustomerById, getCustomerById, getListCustomer } from 'src/api/customer';
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
import { ICustomer, IDataCustomer, IQueryCustomer } from 'src/types/customer';
import CustomerInfo, { optionStatus } from '../customer-info';
import CustomerTableRow from '../customer-table-row';
import CustomerTableToolbar from '../customer-table-toolbar';

const TABLE_HEAD = [
  { id: 'name', label: 'Tên' },
  { id: 'address', label: 'Địa chỉ' },
  { id: 'phone', label: 'Phone' },
  { id: 'type', label: 'Kiểu' },
  { id: 'email', label: 'Email' },
  { id: 'note', label: 'Ghi chú' },
  { id: 'action', label: 'Hành động', width: 120 },
];

export default function CustomerListView() {
  const table = useTable();
  const settings = useSettingsContext();
  const denseHeight = table.dense ? 52 : 72;

  const [tableData, setTableData] = useState<IDataCustomer | undefined>(undefined);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ICustomer | undefined>(undefined);
  const [queryList, setQueryList] = useState<IQueryCustomer>({ page: 0, items_per_page: 5 });

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(undefined);
  };

  const handleDeleteById = async (id: string) => {
    await deleteCustomerById(id);
  };

  const handleDeleteRow = useCallback(
    (id: string) => {
      handleDeleteById(id);
      const deleteRow = tableData?.data?.filter((row) => row._id !== id) as ICustomer[];
      setTableData({ ...tableData, data: deleteRow });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, tableData]
  );

  const handleEditRow = async (id: string) => {
    try {
      const currentCustomer = await getCustomerById(id);
      setSelectedItem(currentCustomer);
      setOpenDialog(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getList = async (query?: IQueryCustomer) => {
    const customerList = await getListCustomer(query);
    setTableData(customerList);
    if (query) setQueryList(query);
  };

  useEffect(() => {
    getList(queryList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Trang chủ', href: paths.dashboard.root },
            {
              name: 'Khách hàng',
              href: paths.dashboard.customer.root,
            },
            { name: 'Danh sách' },
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
              Tạo khách hàng
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <CustomerTableToolbar onSearch={getList} query={queryList} />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {tableData?.data?.map((row) => (
                    <CustomerTableRow
                      key={row._id}
                      row={{
                        ...row,
                        type: optionStatus?.find((x) => x.value === row.type)?.label as string,
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
            page={Number(queryList?.page)}
            rowsPerPage={Number(queryList?.items_per_page)}
            onPageChange={(event, page) => {
              const newQuery = { ...queryList, page };
              getList(newQuery);
            }}
            onRowsPerPageChange={(event) => {
              const newQuery = {
                ...queryList,
                page: 0,
                items_per_page: Number(event.target.value),
              };
              getList(newQuery);
            }}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>
      <CustomerInfo
        open={openDialog}
        onClose={handleCloseDialog}
        currentCustomer={selectedItem}
        getCustomerList={getList}
      />
    </>
  );
}
