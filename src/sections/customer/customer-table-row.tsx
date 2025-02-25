import { Box, Button, Collapse, IconButton, ListItemText, MenuItem, Paper, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { ICustomer } from 'src/types/customer';
import { formatDate } from 'src/utils/format-time';

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
  const { name, address, phone, type, email, note, history_repair } = row;

  const confirm = useBoolean();
  const collapse = useBoolean();
  const popover = usePopover();
  const partsPopover = usePopover();
  const renderRepairHistory = (item: any) => (
      <Box
        key={item._id}
        sx={{
          p: 1.5,
          '&:not(:last-of-type)': {
            borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
          },
        }}
      >
        <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={2}>
          <Box>
            <Box component="span" sx={{ typography: 'subtitle2' }}>Loại:</Box>{' '}
            <Box component="span" sx={{ typography: 'body2' }}>{item.type_repair}</Box>
          </Box>

          <Box>
            <Box component="span" sx={{ typography: 'subtitle2' }}>Ngày:</Box>{' '}
            <Box component="span" sx={{ typography: 'body2' }}>{formatDate(item.date_repair)}</Box>
          </Box>

          <Box>
            <Box component="span" sx={{ typography: 'subtitle2' }}>Nhân viên:</Box>{' '}
            <Box component="span" sx={{ typography: 'body2' }}>{item.staff_repair}</Box>
          </Box>

          {item.note && (
            <Box>
              <Box component="span" sx={{ typography: 'subtitle2' }}>Ghi chú:</Box>{' '}
              <Box component="span" sx={{ typography: 'body2' }}>{item.note}</Box>
            </Box>
          )}

          {item.linh_kien.length > 0 && (
            <>
              <Button
                size="small"
                color="info"
                onClick={partsPopover.onOpen}
                startIcon={<Iconify icon="mdi:tools" />}
              >
                Linh kiện ({item.linh_kien.length})
              </Button>

              <CustomPopover
                open={partsPopover.open}
                onClose={partsPopover.onClose}
                sx={{ width: 320 }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Chi tiết linh kiện</Typography>
                  <Stack spacing={1}>
                    {item.linh_kien.map((part: any) => (
                      <Box key={part._id}>
                        <Typography variant="body2">
                          - {part.name} (Số lượng: {part.total})
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </CustomPopover>
            </>
          )}
        </Stack>
      </Box>
    );
  return (
    <>
    {/* Main Row */}
    <TableRow hover selected={selected}>
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



      {/* Actions Cell */}
      <TableCell align="right">
      {history_repair && history_repair.length > 0 && (
          <IconButton
            color={collapse.value ? 'primary' : 'default'}
            onClick={collapse.onToggle}
          >
            <Iconify icon="eva:arrow-ios-downward-fill" />
          </IconButton>
        )}
        <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>

    {/* Collapse Row */}
    {history_repair && history_repair.length > 0 && (
      <TableRow>
        <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
          <Collapse in={collapse.value} timeout="auto" unmountOnExit>
            <Box
              component={Paper}
              sx={{
                m: 1,
                bgcolor: 'background.neutral',
                maxHeight: 400,
                overflow: 'auto',
              }}
            >
              {history_repair.map(renderRepairHistory)}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    )}


    {/* Popover Menu */}
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

    {/* Confirm Dialog */}
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
