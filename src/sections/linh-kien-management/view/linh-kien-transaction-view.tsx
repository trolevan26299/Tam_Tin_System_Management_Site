'use client';

import { Button, Card, Container, Stack, Table, TableBody, TableContainer } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  useTable,
} from 'src/components/table';
import { paths } from 'src/routes/paths';

const TABLE_HEAD = [
  { id: 'name_linh_kien', label: 'Tên' },
  { id: 'type', label: 'Loại' },
  { id: 'total', label: 'Tổng' },
  { id: 'nhan_vien', label: 'Nhân viên' },
  { id: 'noi_dung', label: 'Nội dung' },
  { id: 'nguoi_tao', label: 'Người tạo' },
  { id: 'create_date', label: 'Ngày tạo' },
  { id: 'action', label: 'action' },
];

const LinhKienTransactionView = () => {
  const table = useTable({ defaultDense: true, defaultRowsPerPage: 10 });
  const settings = useSettingsContext();
  const denseHeight = table.dense ? 52 : 72;
  const { enqueueSnackbar } = useSnackbar();

  const [tableData, setTableData] = useState<any | undefined>();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Danh sách linh kiện transaction"
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
              // setOpenDialog(true);
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
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} />

                <TableBody>
                  {/* {paginatedList?.map((row: ILinhKien) => (
                    <LinhKienTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row?._id as string)}
                      onDeleteRow={(passCode?: number) => {
                        if (passCode) deleteLinhKien(String(row?._id), passCode, enqueueSnackbar);
                      }}
                    />
                  ))} */}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData?.totalCount || 0)}
                  />

                  <TableNoData notFound={tableData?.totalCount === 0} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Stack>
      </Card>
    </Container>
  );
};

export default LinhKienTransactionView;
