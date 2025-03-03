import {
  Button,
  IconButton,
  ListItemText,
  MenuItem,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  Stack,
  Chip,
  Box,
} from '@mui/material';
import { format } from 'date-fns';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { useBoolean } from 'src/hooks/use-boolean';
import { IOrderLinhKien } from 'src/types/order-linh-kien';
import { renderMoney } from 'src/utils/format-number';

type Props = {
  row: IOrderLinhKien;
  onDeleteRow: VoidFunction;
  onEditRow: VoidFunction;
};

export default function OrderLinhKienTableRow({
  row,
  onDeleteRow,
  onEditRow,
}: Props) {
  const confirm = useBoolean();
  const popover = usePopover();

  const renderChiTiet = () => (
    <Stack spacing={1}>
      {row.chi_tiet_linh_kien.map((item, index) => (
       <Box key={index}>
        <Typography variant="body2">{item.id_linh_kien.name_linh_kien} (x{item.so_luong})</Typography>
      
       </Box>
      ))}
    </Stack>
  );

  return (
    <TableRow hover>
      <TableCell sx={{ maxWidth: 100 }}>
        <Tooltip title={row._id}>
          <Typography variant="body2" noWrap>
            {row._id.slice(-8)}
          </Typography>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Stack spacing={0.5}>
          <Typography variant="body2" noWrap>
            {row.id_khach_hang.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
            {row.id_khach_hang.phone}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell sx={{ minWidth: 300 }}>{renderChiTiet()}</TableCell>

      <TableCell align="right">
        <Label color="success">{renderMoney(String(row.tong_tien))} VNĐ</Label>
      </TableCell>

      <TableCell align="right">
        <Label color="info">{renderMoney(String(row.loi_nhuan))} VNĐ</Label>
      </TableCell>

      <TableCell align="center">
        <Typography variant="body2">
          {format(new Date(row.ngay_tao), 'dd/MM/yyyy HH:mm')}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {row.ghi_chu || '-'}
        </Typography>
      </TableCell>

      <TableCell align="right">
        <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Chỉnh sửa
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Xóa
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xóa đơn hàng"
        content="Bạn có chắc chắn muốn xóa đơn hàng linh kiện này không?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              confirm.onFalse();
            }}
          >
            Xóa
          </Button>
        }
      />
    </TableRow>
  );
}