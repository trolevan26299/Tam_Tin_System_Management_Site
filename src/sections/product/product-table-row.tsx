import { format } from 'date-fns';
// @mui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
// utils
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
// types
import { IDevice } from 'src/types/product';
import { renderMoney } from 'src/utils/format-number';

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
  const { name, id_device, sub_category_id, belong_to, note, warranty, price, status } = row;

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
          maxHeight: '3.6em', // 2 lines * line-height (1.8em)
        }}
      >
        {text}
      </div>
    </Tooltip>
  );

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <ListItemText
            primary={renderCellWithTooltip(name)}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={renderCellWithTooltip(id_device)}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={renderCellWithTooltip(sub_category_id)}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={renderCellWithTooltip(String(warranty))}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={renderCellWithTooltip(belong_to)}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={renderCellWithTooltip(renderMoney(String(price)))}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={renderCellWithTooltip(
              String(status?.find((x) => x.status === 'inventory')?.quantity || '')
            )}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={renderCellWithTooltip(
              String(status?.find((x) => x.status === 'sold')?.quantity || 0)
            )}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={renderCellWithTooltip(String(note))}
            primaryTypographyProps={{ typography: 'body2' }}
          />
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
