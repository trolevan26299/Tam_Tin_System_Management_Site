import { Button, IconButton, ListItemText, MenuItem, TableCell, TableRow } from '@mui/material';
import React from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { IPropRow } from 'src/types/staff';

function StaffTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }: IPropRow) {
  const { name, address, age, salary, position, exp, phone, user_id_telegram,username_telegram, note } = row;

  const confirm = useBoolean();


  const popover = usePopover();
  return (
    <TableRow hover selected={selected}>
      <TableCell>
        <ListItemText primary={name} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      <TableCell>
        <ListItemText primary={address} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      <TableCell>
        <ListItemText primary={age} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      <TableCell>
        <ListItemText   primary={new Intl.NumberFormat('vi-VN').format(salary || 0)}  primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      <TableCell>
        <ListItemText primary={position} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      <TableCell>
        <ListItemText primary={exp} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      <TableCell>
        <ListItemText primary={phone} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      <TableCell>
        <ListItemText primary={`${username_telegram ? `@${username_telegram}` : ''}`} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      <TableCell>
        <ListItemText primary={user_id_telegram} primaryTypographyProps={{ typography: 'body2' }} />
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
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Xóa
          </Button>
        }
      />
    </TableRow>
  );
}

export default StaffTableRow;
