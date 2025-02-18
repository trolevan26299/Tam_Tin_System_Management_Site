import {
  Button,
  IconButton,
  ListItemText,
  MenuItem,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { ILinhKienTransaction } from 'src/types/linh-kien';

type Props = {
  row: ILinhKienTransaction;
  selected: boolean;
  onDeleteRow: (pass?: number) => void;
  onEditRow: VoidFunction;
};

function LinhkienTransactionTableRow({ row, selected, onDeleteRow, onEditRow }: Props) {
  const { name_linh_kien, data_update, type, nhan_vien, nguoi_tao, noi_dung, total, create_date } =
    row;
  const confirm = useBoolean();
  const popover = usePopover();
  const [passCode, setPassCode] = useState<number | undefined>();

  return (
    <TableRow hover selected={selected}>
      <TableCell>
        <ListItemText primary={name_linh_kien} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      <TableCell>
        <ListItemText primary={type} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      <TableCell>
        <ListItemText primary={total} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      {nhan_vien && (
        <TableCell>
          <ListItemText
            primary={nhan_vien?.name}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>
      )}
      <TableCell>
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
          {noi_dung || ''}
        </div>
      </TableCell>
      <TableCell>
        <ListItemText primary={nguoi_tao} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      <TableCell>
        <ListItemText primary={create_date} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>

      <TableCell align="left">
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
          Sửa
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
        title="Xóa"
        content={
          <TextField
            placeholder="Nhập pass code"
            type="number"
            onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
            onChange={(e) => setPassCode(Number(e.target.value))}
            value={passCode}
            fullWidth
          />
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow(passCode);
              confirm.onFalse();
              setPassCode(undefined);
            }}
            disabled={passCode === undefined || passCode === 0}
          >
            Xóa
          </Button>
        }
      />
    </TableRow>
  );
}

export default LinhkienTransactionTableRow;
