'use client';

import { Button, Card, Container, Table, TableBody, TableContainer } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import {
  deleteSubCategoryById,
  getListCategory,
  getListSubCategory,
  getSubCategoryById,
} from 'src/api/allCategory';
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
import { ICategory, IDataSubCategory, IQueryCategory, ISubCategory } from 'src/types/category';
import SubCategoryInfo from '../sub-category-info';
import SubCategoryTableRow from '../sub-category-table-row';

const TABLE_HEAD = [
  { id: 'name', label: 'Tên' },
  { id: 'category', label: 'Danh mục' },
  { id: 'number_of_device', label: 'Số lượng thiết bị' },
  { id: 'action', label: 'Hành động' },
];

export default function SubCategoryListView() {
  const table = useTable();
  const settings = useSettingsContext();

  const [tableData, setTableData] = useState<IDataSubCategory | undefined>(undefined);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ISubCategory | undefined>(undefined);
  const [querySubCategory, setQuerySubCategory] = useState<IQueryCategory>({
    page: 0,
    items_per_page: 5,
  });

  const denseHeight = table.dense ? 52 : 72;

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(undefined);
  };

  const getSubCategoryList = async (query: IQueryCategory) => {
    const subCategoryList = await getListSubCategory(query);
    setQuerySubCategory(query);
    return subCategoryList;
  };

  const onSearch = async (query: IQueryCategory) => {
    const subCategoryList = await getListSubCategory(query);
    setQuerySubCategory(query);
    setTableData(subCategoryList);
  };

  const getCategoryList = async () => {
    const categoryList = await getListCategory();
    return categoryList?.data;
  };

  const handleDeleteById = async (id: string) => {
    await deleteSubCategoryById(id);
  };

  const handleDeleteRow = useCallback(
    (id: string) => {
      handleDeleteById(id);
      const deleteRow = tableData?.data?.filter((row) => row._id !== id) as ISubCategory[];
      setTableData({ ...tableData, data: deleteRow });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, tableData]
  );

  const handleEditRow = async (id: string) => {
    try {
      const currentSubCategory = await getSubCategoryById(id);
      setSelectedItem(currentSubCategory.data);
      setOpenDialog(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllData = async () => {
    try {
      const [subCategoryList, categoryList] = await Promise.all([
        getSubCategoryList(querySubCategory),
        getCategoryList(),
      ]);
      setTableData(subCategoryList);
      setCategories(categoryList);
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
            { name: 'Trang chủ', href: paths.dashboard.root },
            {
              name: 'Danh mục phụ',
              href: paths.dashboard.subCategory.root,
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
              Tạo danh mục phụ
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
                    <SubCategoryTableRow
                      key={row._id}
                      row={{
                        ...row,
                        category_id: categories?.find((x) => x._id === row.category_id)
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
            page={Number(querySubCategory?.page)}
            rowsPerPage={Number(querySubCategory?.items_per_page)}
            onPageChange={(event, page) => {
              const newQuery = { ...querySubCategory, page };
              onSearch(newQuery);
            }}
            onRowsPerPageChange={(event) => {
              const newQuery = {
                ...querySubCategory,
                page: 0,
                items_per_page: Number(event.target.value),
              };
              onSearch(newQuery);
            }}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>
      <SubCategoryInfo
        currentSubCategory={selectedItem}
        open={openDialog}
        onClose={handleCloseDialog}
        getSubCategoryList={getAllData}
        listCategory={categories}
      />
    </>
  );
}
