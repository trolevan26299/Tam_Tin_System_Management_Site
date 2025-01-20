'use client';

import { Button, Card, Container, Table, TableBody, TableContainer } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { deleteStaffById, getStaffById, getStaffs } from 'src/api/staff';
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
import { IDataStaff, IQueryStaff, IStaff } from 'src/types/staff';
import StaffTableRow from '../staff-table-row';
import StaffTableToolbar from '../staff-table-toolbar';
import StaffInfo from '../staff-info';

const TABLE_HEAD = [
  { id: 'name', label: 'Tên' },
  { id: 'address', label: 'Địa chỉ' },
  { id: 'age', label: 'Tuổi' },
  { id: 'salary', label: 'Lương' },
  { id: 'position', label: 'Vị trí' },
  { id: 'exp', label: 'Kinh nghiệm' },
  { id: 'phone', label: 'Phone' },
  { id: 'username_telegram', label: 'Username Telegram' },
  { id: 'user_id_telegram', label: 'UserId Telegram' },
  { id: 'note', label: 'Note' },
  { id: 'action', label: 'Hành động', width: 120 },
];

function StaffListView() {
  const table = useTable({ defaultDense: true, defaultRowsPerPage: 10 });
  const settings = useSettingsContext();
  const denseHeight = table.dense ? 52 : 72;

  const [tableData, setTableData] = useState<IDataStaff | undefined>(undefined);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<IStaff | undefined>(undefined);
  const [queryStaff, setQueryStaff] = useState<IQueryStaff>({
    page: 0,
    items_per_page: 10,
  });

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(undefined);
  };

  const handleEditRow = async (id: string) => {
    const detail = await getStaffById(id);
    setSelectedItem(detail?.data);
    setOpenDialog(true);
  };

  const handleDeleteById = async (id: string) => {
    await deleteStaffById(id);
  };

  const handleDeleteRow = useCallback(
    (id: string) => {
      handleDeleteById(id);
      const deleteRow = tableData?.data?.filter((row) => row._id !== id) as IStaff[];
      setTableData({ ...tableData, data: deleteRow });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, tableData]
  );

  const getStaffList = async (query: IQueryStaff) => {
    try {
      const staffList = await getStaffs(query);
      setQueryStaff(query);
      setTableData(staffList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStaffList(queryStaff);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Danh sách"
          links={[
            { name: 'Trang chủ', href: paths.dashboard.root },
            { name: 'Quản lý nhân viên', href: paths.dashboard.customer.root },
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
              Tạo nhân viên
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <StaffTableToolbar
            onSearch={(query) => {
              const newQuery = { ...query, page: 0 };
              getStaffList(newQuery);
            }}
            query={queryStaff}
          />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {tableData?.data?.map((row) => (
                    <StaffTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row?._id as string)}
                      onSelectRow={() => table.onSelectRow(row?._id as string)}
                      onEditRow={() => handleEditRow(row?._id as string)}
                      onDeleteRow={() => handleDeleteRow(row?._id as string)}
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      tableData?.data?.length || 0
                    )}
                  />

                  <TableNoData notFound={tableData?.data?.length === 0} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={tableData?.totalCount || 0}
            page={Number(queryStaff?.page)}
            rowsPerPage={Number(queryStaff?.items_per_page)}
            onPageChange={(event, page) => {
              const newQuery = { ...queryStaff, page };
              getStaffList(newQuery);
            }}
            onRowsPerPageChange={(event) => {
              const newQuery = {
                ...queryStaff,
                page: 0,
                items_per_page: Number(event.target.value),
              };
              getStaffList(newQuery);
            }}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <StaffInfo
        currentStaff={selectedItem}
        open={openDialog}
        onClose={handleCloseDialog}
        getStaffList={() => {
          getStaffList(queryStaff);
        }}
      />
    </>
  );
}

export default StaffListView;
