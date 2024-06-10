'use client';

import { Button, Card, Container, Table, TableBody, TableContainer } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { deleteUserById, getUserById, getUsers } from 'src/api/user';
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
import { IDataUser, IQueryUser, IUserList } from 'src/types/user';
import UserInfo, { userInfo } from '../user-info';
import UserTableRow from '../user-table-row';

const TABLE_HEAD = [
  { id: 'username', label: 'User name' },
  { id: 'status', label: 'Status', width: 180 },
  { id: 'action', label: 'Action', width: 80 },
];

export default function UserListView() {
  const table = useTable();
  const settings = useSettingsContext();
  const denseHeight = table.dense ? 52 : 72;

  const [tableData, setTableData] = useState<IDataUser | undefined>(undefined);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<userInfo | undefined>(undefined);
  const [queryUser, setQueryUser] = useState<IQueryUser>({
    page: 0,
    items_per_page: 5,
  });

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(undefined);
  };

  const handleDeleteById = async (id: string) => {
    await deleteUserById(id);
  };

  const handleDeleteRow = useCallback(
    (id: string) => {
      handleDeleteById(id);
      const deleteRow = tableData?.data?.filter((row) => row._id !== id) as IUserList[];
      setTableData({ ...tableData, data: deleteRow });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, tableData]
  );

  const handleEditRow = async (id: string) => {
    const detail = await getUserById(id);
    setSelectedItem(detail?.data);
    setOpenDialog(true);
  };

  const getUserList = async (query: IQueryUser) => {
    try {
      const userList = await getUsers(query);
      setQueryUser(query);
      setTableData(userList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserList(queryUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Quản lý tài khoản', href: paths.dashboard.user.root },
            { name: 'Danh sách tài khoản' },
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
              Tạo người dùng
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {tableData?.data?.map((row) => (
                    <UserTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
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
            page={Number(queryUser?.page)}
            rowsPerPage={Number(queryUser?.items_per_page)}
            onPageChange={(event, page) => {
              const newQuery = { ...queryUser, page };
              getUserList(newQuery);
            }}
            onRowsPerPageChange={(event) => {
              const newQuery = {
                ...queryUser,
                page: 0,
                items_per_page: Number(event.target.value),
              };
              getUserList(newQuery);
            }}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <UserInfo
        currentAccount={selectedItem}
        open={openDialog}
        onClose={handleCloseDialog}
        getUserList={() => {
          getUserList(queryUser);
        }}
      />
    </>
  );
}
