import { Button, IconButton, ListItemText, TableCell, TableRow, TextField } from '@mui/material';
import { format } from 'date-fns';
import { useState } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { ILinhKien } from 'src/types/linh-kien';

type Props = {
  row: ILinhKien;
  selected: boolean;
  onDeleteRow: (pass?: number) => void;
};

function LinhKienTableRow({ row, selected, onDeleteRow }: Props) {
  const { name_linh_kien, total, create_date, data_ung, user_create } = row;
  const [passCode, setPassCode] = useState<number | undefined>();

  const confirm = useBoolean();
  const popover = usePopover();

  return (
    <TableRow hover selected={selected}>
      <TableCell>
        <ListItemText primary={name_linh_kien} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>

      <TableCell>{total}</TableCell>

      <TableCell>
        <ListItemText primary={create_date} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>

      <TableCell>{user_create?.username}</TableCell>

      <TableCell>
        {data_ung?.map((item) => (
          <ListItemText
            primary={`${item?.name} - ${item?.total}`}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        ))}
      </TableCell>

      <TableCell align="left">
        <IconButton
          color="error"
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </TableCell>

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

export default LinhKienTableRow;
