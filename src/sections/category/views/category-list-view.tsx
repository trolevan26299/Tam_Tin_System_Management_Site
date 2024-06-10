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
  useTable,
} from 'src/components/table';
import { paths } from 'src/routes/paths';
import { ICategory, IDataCategory, IQueryCategory } from 'src/types/category';
import CategoryInfo from '../category-info';
import CategoryTableRow from '../category-table-row';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'action', label: 'Action' },
];

export default function CategoryListView() {
  const table = useTable();
  const settings = useSettingsContext();
  const denseHeight = table.dense ? 52 : 72;

  const [tableData, setTableData] = useState<IDataCategory | undefined>(undefined);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ICategory | undefined>(undefined);
  const [queryCategory, setQueryCategory] = useState<IQueryCategory>({
    page: 0,
    items_per_page: 5,
  });

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(undefined);
  };

  const getCategoryList = async (query?: IQueryCategory) => {
    const categoryList = await getListCategory(query);
    if (query) setQueryCategory(query);
    setTableData(categoryList);
  };

  const handleEditRow = async (id: string) => {
    try {
      const currentCategory = await getCategoryById(id);
      setSelectedItem(currentCategory.data);
      setOpenDialog(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteById = async (id: string) => {
    await deleteCategoryById(id);
  };

  const handleDeleteRow = useCallback(
    (id: string) => {
      handleDeleteById(id);
      const deleteRow = tableData?.data?.filter((row) => row._id !== id) as ICategory[];
      setTableData({ ...tableData, data: deleteRow });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, tableData]
  );

  useEffect(() => {
    getCategoryList(queryCategory);
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
              Tạo Category
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {tableData?.data?.map((row) => (
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
            page={Number(queryCategory?.page)}
            rowsPerPage={Number(queryCategory?.items_per_page)}
            onPageChange={(event, page) => {
              const newQuery = { ...queryCategory, page };
              getCategoryList(newQuery);
            }}
            onRowsPerPageChange={(event) => {
              const newQuery = {
                ...queryCategory,
                page: 0,
                items_per_page: Number(event.target.value),
              };
              getCategoryList(newQuery);
            }}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <CategoryInfo
        currentCategory={selectedItem}
        open={openDialog}
        onClose={handleCloseDialog}
        getCategoryList={() => {
          getCategoryList(queryCategory);
        }}
      />
    </>
  );
}
