'use client';

import { useCallback, useEffect, useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// routes
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
// _mock
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
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
import { IUserList, IUserTableFilters } from 'src/types/user';
//
import { getUserById, getUsers } from 'src/api/user';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import UserTableRow from '../user-table-row';
import UserInfo, { userInfo } from '../user-info';

const TABLE_HEAD = [
  { id: 'username', label: 'Username' },
  { id: 'status', label: 'Trạng thái', width: 180 },
  { id: 'action', label: 'Sự kiện', width: 80 },
];

const filtersData: IUserTableFilters = {
  username: '',
};

// ----------------------------------------------------------------------

export default function UserListView() {
  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const theme = useTheme();

  const [tableData, setTableData] = useState<IUserList[]>();

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [selectedItem, setSelectedItem] = useState<userInfo | undefined>(undefined);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filtersData,
  });

  const dataInPage = dataFiltered?.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData?.filter((row) => row._id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage?.length || 0);
    },
    [dataInPage?.length, table, tableData]
  );

  const handleEditRow = async (id: string) => {
    const detail = await getUserById(id);
    setSelectedItem(detail?.data);
    setOpenDialog(true);
  };

  const getUserList = async () => {
    try {
      const userList = await getUsers();
      setTableData(userList as IUserList[]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserList();
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
              Create User
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
                      <UserTableRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData?.length || 0)}
                  />

                  <TableNoData notFound={false} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered?.length || 0}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openDialog}
        onClose={handleCloseDialog}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: 0,
        }}
        PaperProps={{
          sx: {
            mt: 15,
            overflow: 'unset',
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>{!selectedItem ? 'Create User' : 'Update User'}</DialogTitle>

        <DialogContent>
          <Box sx={{ p: 3, borderBottom: `solid 1px ${theme.palette.divider}` }}>
            <UserInfo currentProduct={selectedItem} />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="contained">Save</Button>
          <Button variant="outlined" color="inherit" onClick={handleCloseDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData?: IUserList[];
  comparator: (a: any, b: any) => number;
  filters: IUserTableFilters;
}) {
  const { username } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (username) {
    inputData = inputData?.filter(
      (user) => user.username.toLowerCase().indexOf(username.toLowerCase()) !== -1
    );
  }

  return inputData;
}
