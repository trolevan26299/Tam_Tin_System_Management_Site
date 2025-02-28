import {
  Button,
  IconButton,
  ListItemText,
  MenuItem,
  TableCell,
  TableRow,
  Tooltip
} from '@mui/material';
import { format } from 'date-fns';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
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
  const { _id, id_linh_kien, so_luong, id_khach_hang, ghi_chu, tong_tien, ngay_tao } = row;

  const confirm = useBoolean();
  const popover = usePopover();

  const renderCellWithTooltip = (text: string) => (
    <Tooltip title={text} arrow>
      <div
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxHeight: '3.6em',
        }}
      >
        {text}
      </div>
    </Tooltip>
  );

  return (
    <TableRow hover>
        <TableCell sx={{ maxWidth: '100px' }}>
          <ListItemText
            primary={renderCellWithTooltip(String(_id))}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={id_linh_kien.name_linh_kien}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell align="center">{so_luong}</TableCell>

        <TableCell>
          <ListItemText
            primary={id_khach_hang.name}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell>{renderMoney(String(tong_tien))}</TableCell>

        <TableCell>
          <ListItemText
            primary={format(new Date(ngay_tao), 'dd/MM/yyyy')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell>
          {ghi_chu ? (
            <Tooltip title={ghi_chu}>
              <div
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxHeight: '3.6em',
                }}
              >
                {ghi_chu}
              </div>
            </Tooltip>
          ) : (
            '-'
          )}
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
