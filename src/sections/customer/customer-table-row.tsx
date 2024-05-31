import { Button, IconButton, ListItemText, MenuItem, TableCell, TableRow } from '@mui/material';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { ICustomer } from 'src/types/customer';

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: ICustomer;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function CustomerTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { name, address, phone, type, email, note } = row;

  const confirm = useBoolean();

  const popover = usePopover();
  return (
    <TableRow>
      <TableCell>
        <ListItemText primary={name} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      <TableCell>
        <ListItemText primary={address} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      <TableCell>
        <ListItemText primary={phone} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      <TableCell>
        <ListItemText primary={type} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      <TableCell>
        <ListItemText primary={email} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      <TableCell>
        <ListItemText primary={note} primaryTypographyProps={{ typography: 'body2' }} />
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
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </TableRow>
  );
}
