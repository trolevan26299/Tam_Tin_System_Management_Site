/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import {
  Card,
  Table,
  TableBody,
  TableContainer,
  TablePagination
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { deleteOrderLinhKien } from 'src/api/order-linh-kien';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom, TableNoData } from 'src/components/table';
import { IOrderLinhKien } from 'src/types/order-linh-kien';
import OrderLinhKienTableRow from './order-linh-kien-table-row';

const TABLE_HEAD = [
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'linh_kien', label: 'Linh Kiện', align: 'left' },
  { id: 'so_luong', label: 'Số Lượng', align: 'center' },
  { id: 'khach_hang', label: 'Khách Hàng', align: 'left' },
  { id: 'tong_tien', label: 'Tổng Tiền', align: 'left' },
  { id: 'ngay_tao', label: 'Ngày Tạo', align: 'left' },
  { id: 'ghi_chu', label: 'Ghi Chú', align: 'left' },
  { id: '', label: '', align: 'right' },
];

type Props = {
  data: IOrderLinhKien[];
  totalCount: number;
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  rowsPerPage: number;
  onRefresh: VoidFunction;
  onEdit: (order: IOrderLinhKien) => void;
};

export default function OrderLinhKienTable({
  data,
  totalCount,
  currentPage,
  lastPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
  onRefresh,
  onEdit,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteRow = async (id: string) => {
    const success = await deleteOrderLinhKien(id, enqueueSnackbar);
    if (success) {
      enqueueSnackbar('Xóa đơn hàng thành công', { variant: 'success' });
      onRefresh();
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <Card>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size="small" sx={{ minWidth: 960 }}>
            <TableHeadCustom
              headLabel={TABLE_HEAD}
              sx={{
                '& .MuiTableCell-head': {
                  whiteSpace: 'nowrap',
                },
              }}
            />

            <TableBody>
              {data.map((row) => (
                <OrderLinhKienTableRow
                  key={row._id}
                  row={row}
                  onDeleteRow={() => handleDeleteRow(row._id)}
                  onEditRow={() => onEdit(row)}
                />
              ))}

              <TableNoData notFound={data.length === 0} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePagination
        page={currentPage - 1}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}
