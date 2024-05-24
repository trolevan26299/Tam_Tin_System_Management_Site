'use client';

import { Button, Card, Container, Table, TableBody, TableContainer } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { deleteCategoryById, getCategoryById, getListCategory } from 'src/api/allCategory';
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
import { ICategory, ICategoryTableFilters } from 'src/types/category';
import CategoryInfo from '../category-info';
import CategoryTableRow from '../category-table-row';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'action', label: 'Action' },
];

const filtersData: ICategoryTableFilters = {
  name: '',
};

export default function CategoryListView() {
  const table = useTable();
  const settings = useSettingsContext();

  const [tableData, setTableData] = useState<ICategory[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ICategory | undefined>(undefined);

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

  const handleDeleteById = async (id: string) => {
    await deleteCategoryById(id);
  };

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
      const currentCategory = await getCategoryById(id);
      setSelectedItem(currentCategory.data);
      setOpenDialog(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(undefined);
  };

  const getCategoryList = async () => {
    const categoryList = await getListCategory();
    setTableData(categoryList);
  };

  useEffect(() => {
    getCategoryList();
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
              name: 'Category',
              href: paths.dashboard.category.root,
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
              Create sub category
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
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
                      <CategoryTableRow
                        key={row._id}
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

      <CategoryInfo
        currentCategory={selectedItem}
        open={openDialog}
        onClose={handleCloseDialog}
        getCategoryList={getCategoryList}
      />
    </>
  );
}

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData?: ICategory[];
  comparator: (a: any, b: any) => number;
  filters: ICategoryTableFilters;
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
      (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
