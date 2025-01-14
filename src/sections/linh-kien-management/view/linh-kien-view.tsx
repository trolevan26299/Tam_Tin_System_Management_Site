'use client';

import {
  Button,
  Card,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TextField,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { deleteLinhKien, useGetLinhKien } from 'src/api/linhkien';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
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
import { ILinhKien } from 'src/types/linh-kien';
import LinhKienTableRow from '../linhKienTableRow';
import LinhKienInfo from '../linhkien-info';

const TABLE_HEAD = [
  { id: 'name_linh_kien', label: 'Tên' },
  { id: 'total', label: 'Tổng' },
  { id: 'create_date', label: 'Ngày tạo' },
  { id: 'user_create', label: 'Nhân viên tạo' },
  { id: 'data_ung', label: 'Nhân viên ứng' },
  { id: 'action', label: 'action' },
];

export default function LinhKienView() {
  const table = useTable({ defaultDense: true, defaultRowsPerPage: 10 });
  const settings = useSettingsContext();
  const denseHeight = table.dense ? 52 : 72;
  const { enqueueSnackbar } = useSnackbar();

  const { data: linhKienList } = useGetLinhKien();

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');


  const filteredList = useMemo(() => {
    if (!searchTerm) return linhKienList;
    return linhKienList?.filter(
      (item: ILinhKien) => item?.name_linh_kien?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, linhKienList]);

  const paginatedList = useMemo(() => {
    const startIndex = table.page * table.rowsPerPage;
    return filteredList?.slice(startIndex, startIndex + table.rowsPerPage);
  }, [filteredList, table.page, table.rowsPerPage]);

  useEffect(() => {
    table.onChangePage(null, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Danh sách linh kiện"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Quản lý linh kiện', href: paths.dashboard.linhKien.linhKien },
          { name: 'Danh sách' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            Thêm mới linh kiện
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
          <Stack direction="row" alignItems="center" spacing={2} sx={{ width: 500 }}>
            <TextField
              sx={{ width: 300 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm linh kiện..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setSearchTerm('');
                      }}
                    >
                      <Iconify icon="eva:close-fill" sx={{ color: 'text.disabled' }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Stack>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom headLabel={TABLE_HEAD} />

              <TableBody>
                {paginatedList?.map((row: ILinhKien) => (
                  <LinhKienTableRow
                    key={row._id}
                    row={row}
                    selected={table.selected.includes(row?._id as string)}
                    onDeleteRow={(passCode?: number) => {
                      if (passCode) deleteLinhKien(String(row?._id), passCode, enqueueSnackbar);
                    }}
                  />
                ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, linhKienList?.length || 0)}
                />

                <TableNoData notFound={linhKienList?.length === 0} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={filteredList?.length || 0}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>

      <LinhKienInfo
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
      />
    </Container>
  );
}
