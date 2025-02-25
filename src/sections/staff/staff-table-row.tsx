import { Box, Button, IconButton, ListItemText, MenuItem, Stack, TableCell, TableRow, Typography } from '@mui/material';
import React from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { IPropRow } from 'src/types/staff';

function StaffTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }: IPropRow) {
  const { name, address, age, salary, position, exp, phone, user_id_telegram,username_telegram, note, linh_kien_ung } = row;

  const confirm = useBoolean();
  const popover = usePopover();
  const partsPopover = usePopover();

    // Tính tổng số lượng linh kiện > 0
    const totalParts = linh_kien_ung?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;

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
        {totalParts !== 0 && (
          <>
            <Button
              size="small"
              color="info"
              onClick={partsPopover.onOpen}
              startIcon={<Iconify icon="mdi:tools" />}
            >
              Đã ứng ({totalParts})
            </Button>

            <CustomPopover
              open={partsPopover.open}
              onClose={partsPopover.onClose}
              sx={{ width: 280 }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Chi tiết linh kiện đã ứng</Typography>
                <Stack spacing={1}>
                  {linh_kien_ung
                    ?.filter(item => item.total !== 0) // Chỉ lọc ra những item khác 0
                    ?.map((item, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ py: 0.5 }}
                      >
                        <Typography variant="body2">{item.name_linh_kien}</Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: item.total < 0 ? 'error.main' : 'success.main'
                          }}
                        >
                          {item.total}
                        </Typography>
                      </Stack>
                    ))}
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: '1px dashed',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="subtitle2">Tổng cộng:</Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: totalParts < 0 ? 'error.main' : 'success.main'
                    }}
                  >
                    {totalParts}
                  </Typography>
                </Stack>
              </Box>
            </CustomPopover>
          </>
        )}
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
