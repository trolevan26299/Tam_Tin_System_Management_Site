'use client';

import { Button, Card, Container, Stack, Table, TableBody, TableContainer } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import {
  deleteTransactionLinhKien,
  getLinhKienTransactionBy,
  getLinhKienTransactionById,
} from 'src/api/linhkien';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import SearchInputDebounce from 'src/components/search-input-debounce';
import { useSettingsContext } from 'src/components/settings';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
import { paths } from 'src/routes/paths';
import {
  IDataLinhKienTransaction,
  ILinhKienTransaction,
  IQueryLinhKien,
} from 'src/types/linh-kien';
import LinhKienTransactionInfo from '../linh-kien-transaction-info';
import LinhkienTransactionTableRow from '../linh-kien-transaction-table-row';

const TABLE_HEAD = [
  { id: 'name_linh_kien', label: 'Tên' },
  { id: 'type', label: 'Loại' },
  { id: 'total', label: 'Tổng' },
  { id: 'nhan_vien', label: 'Nhân viên' },
  { id: 'noi_dung', label: 'Nội dung' },
  { id: 'nguoi_tao', label: 'Người tạo' },
  { id: 'create_date', label: 'Ngày tạo' },
  { id: 'action', label: 'Hành động' },
];

const LinhKienTransactionView = () => {
  const table = useTable({ defaultDense: true, defaultRowsPerPage: 10 });
  const settings = useSettingsContext();
  const denseHeight = table.dense ? 52 : 72;
  const { enqueueSnackbar } = useSnackbar();

  const [queryTransaction, setQueryTransaction] = useState<IQueryLinhKien>({
    page: 0,
    items_per_page: 10,
  });
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [linhKienList, setLinhKien] = useState<IDataLinhKienTransaction | null>(null);
  const [currentItem, setCurrentItem] = useState<ILinhKienTransaction | undefined>(undefined);

  const handleSearch = async (query: IQueryLinhKien) => {
    const res = await getLinhKienTransactionBy(query);
    setLinhKien(res);
  };

  const handleGetLinhKienTransactionById = async (id: string) => {
    const res = await getLinhKienTransactionById(id);
    setCurrentItem(res);
    setOpenDialog(true);
  };

  useEffect(() => {
    handleSearch(queryTransaction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Danh sách linh kiện giao dịch"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Quản lý linh kiện giao dịch', href: paths.dashboard.linhKien.transaction },
          { name: 'Danh sách' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => {
              setOpenDialog(true);
              setCurrentItem(undefined);
            }}
          >
            Thêm mới linh kiện giao dịch
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card>
        <Stack
          spacing={2}
          alignItems={{ xs: 'flex-end', md: 'center' }}
          direction={{
            xs: 'column',
            md: 'row',
          }}
          sx={{
            p: 2.5,
            pr: { xs: 2.5, md: 1 },
          }}
        >
          <SearchInputDebounce
            onSearch={(value: string) => {
              handleSearch({ ...queryTransaction, keyword: value, page: 0 });
            }}
            placeholder="Tìm kiếm tên nhân viên hoặc tên linh kiện..."
            width={400}
            value={queryTransaction.keyword || ''}
            useIconClear
          />
        </Stack>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom headLabel={TABLE_HEAD} />

              <TableBody>
                {linhKienList?.data?.map((row: ILinhKienTransaction) => (
                  <LinhkienTransactionTableRow
                    key={row._id}
                    row={row}
                    selected={table.selected.includes(row?._id as string)}
                    onDeleteRow={(passCode?: number) => {
                      if (passCode) {
                        deleteTransactionLinhKien(String(row?._id), passCode, enqueueSnackbar);
                        handleSearch(queryTransaction);
                      }
                    }}
                    onEditRow={() => {
                      handleGetLinhKienTransactionById(row._id as string);
                    }}
                  />
                ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    linhKienList?.totalCount || 0
                  )}
                />

                <TableNoData notFound={linhKienList?.totalCount === 0} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={linhKienList?.totalCount || 0}
          page={Number(queryTransaction?.page)}
          rowsPerPage={Number(queryTransaction?.items_per_page)}
          onPageChange={(event, page) => {
            const newQuery = { ...queryTransaction, page };
            setQueryTransaction(newQuery);
          }}
          onRowsPerPageChange={(event) => {
            const newQuery = {
              ...queryTransaction,
              page: 0,
              items_per_page: Number(event.target.value),
            };
            setQueryTransaction(newQuery);
          }}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>

      <LinhKienTransactionInfo
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        currentItem={currentItem || undefined}
        onSearch={() => {
          handleSearch(queryTransaction);
        }}
      />
    </Container>
  );
};

export default LinhKienTransactionView;
