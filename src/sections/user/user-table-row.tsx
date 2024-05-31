// @mui
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IUserList } from 'src/types/user';
// components
import { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
//

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: IUserList;
  onSelectRow: VoidFunction;
};

export default function UserTableRow({ row, selected, onEditRow, onSelectRow }: Props) {
  const { status, username } = row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <TableRow hover selected={selected}>
      <TableCell>
        <ListItemText primary={username} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'active' && 'success') || (status === 'banned' && 'error') || 'default'
          }
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Tooltip title="Quick Edit" placement="top" arrow>
          <IconButton
            color={quickEdit.value ? 'inherit' : 'default'}
            onClick={() => {
              quickEdit.onTrue();
              onEditRow();
            }}
          >
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>
        {/*
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
      </TableCell>
    </TableRow>
  );
}
