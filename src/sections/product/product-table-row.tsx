import { format } from 'date-fns';
// @mui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
// utils
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
// types
import { IDevice } from 'src/types/product';

// ----------------------------------------------------------------------

type Props = {
  row: IDevice;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function ProductTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
}: Props) {
  const { name, id_device, category_id, status, belong_to, delivery_date, note, warranty } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <ListItemText primary={name} primaryTypographyProps={{ typography: 'body2' }} />
        </TableCell>
        <TableCell>
          <ListItemText primary={id_device} primaryTypographyProps={{ typography: 'body2' }} />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={category_id.name}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>
        <TableCell>
          <ListItemText primary={warranty} primaryTypographyProps={{ typography: 'body2' }} />
        </TableCell>
        <TableCell>
          <ListItemText primary={status} primaryTypographyProps={{ typography: 'body2' }} />
        </TableCell>
        <TableCell>
          <ListItemText primary={delivery_date} primaryTypographyProps={{ typography: 'body2' }} />
        </TableCell>
        <TableCell>
          <ListItemText primary={belong_to} primaryTypographyProps={{ typography: 'body2' }} />
        </TableCell>
        <TableCell>
          <ListItemText primary={note} primaryTypographyProps={{ typography: 'body2' }} />
        </TableCell>

        <TableCell align="right">
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

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
    </>
  );
}
