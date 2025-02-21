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
import { Box, Collapse, Paper, Popover, Stack } from '@mui/material';
import { formatDate } from 'src/utils/format-time';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
import { useState } from 'react';
import { RepairHistoryPopover } from './repairHistoryPopup';

// ----------------------------------------------------------------------

type Props = {
  row: IDevice;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onDeleteDevice?: (id: string) => void;
};

export default function ProductTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onDeleteDevice
}: Props) {
  const { name, sub_category_id, note, cost, detail } = row;

  const { copy } = useCopyToClipboard();
  const confirm = useBoolean();
  const collapse = useBoolean();
  const popover = usePopover();

  const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLElement | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string>('');

  const handleOpenDeletePopover = (event: React.MouseEvent<HTMLElement>, itemId: string) => {
    setDeleteAnchorEl(event.currentTarget);
    setDeletingItemId(itemId);
  };

  const handleCloseDeletePopover = () => {
    setDeleteAnchorEl(null);
    setDeletingItemId('');
  };

  const handleConfirmDelete = () => {
    if (onDeleteDevice && deletingItemId) {
      onDeleteDevice(deletingItemId);
    }
    handleCloseDeletePopover();
  };
  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse in={collapse.value} timeout="auto" unmountOnExit>
          <Box component={Paper} sx={{ m: 1, bgcolor: 'background.neutral' }}>
            {detail?.map((item) => (
              <Box
                key={item.deviceInfo._id}
                sx={{
                  p: 2,
                  py: 1,
                  position: 'relative',
                  '&:not(:last-of-type)': {
                    borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  },
                }}
              >
                  <IconButton
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'error.main',
                  }}
                  onClick={(e) => handleOpenDeletePopover(e, item.id_device)}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
                {/* Thông tin cơ bản */}
                <Stack direction="row" spacing={2} mb={0}   flexWrap="wrap"    sx={{ gap: 1 }}>
                  <Box sx={{ minWidth: 200 }}>
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ typography: 'subtitle2' }}>ID:</Box>
                      <Box sx={{ typography: 'body2' }}>{item.id_device}</Box>
                      <Tooltip title="Copy ID">
                        <IconButton
                          size="small"
                          onClick={() => copy(item.id_device)}
                        >
                          <Iconify icon="solar:copy-bold" width={20} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>

                  <Box sx={{ minWidth: 200 }}>
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ typography: 'subtitle2' }}>Trạng thái:</Box>
                      <Box sx={{ typography: 'body2' }}>{item.status === 'inventory' ? 'Tồn kho' : 'Đã bán'}</Box>
                    </Stack>
                  </Box>

                  {item.deviceInfo.type_customer && (
                    <Box sx={{ minWidth: 200 }}>
                      <Stack direction="row" spacing={1}>
                        <Box sx={{ typography: 'subtitle2' }}>Loại KH:</Box>
                        <Box sx={{ typography: 'body2' }}>{item.deviceInfo.type_customer}</Box>
                      </Stack>
                    </Box>
                  )}

                  {item.deviceInfo.name_customer && (
                    <Box sx={{ minWidth: 200 }}>
                      <Stack direction="row" spacing={1}>
                        <Box sx={{ typography: 'subtitle2' }}>Tên KH:</Box>
                        <Box sx={{ typography: 'body2' }}>{item.deviceInfo.name_customer}</Box>
                      </Stack>
                    </Box>
                  )}
                  {item.deviceInfo.warranty && (
                    <Box sx={{ minWidth: 200 }}>
                      <Stack direction="row" spacing={1}>
                        <Box sx={{ typography: 'subtitle2' }}>Bảo hành:</Box>
                        <Box sx={{ typography: 'body2' }}>{item.deviceInfo.warranty} tháng</Box>
                      </Stack>
                    </Box>
                  )}

                  {item.deviceInfo.date_buy && (
                    <Box sx={{ minWidth: 200 }}>
                      <Stack direction="row" spacing={1}>
                        <Box sx={{ typography: 'subtitle2' }}>Ngày mua:</Box>
                        <Box sx={{ typography: 'body2' }}>{formatDate(item.deviceInfo.date_buy || '')}</Box>
                      </Stack>
                    </Box>
                  )}
                </Stack>



                {item.deviceInfo.history_repair && item.deviceInfo.history_repair.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ typography: 'subtitle1', mb: 1 }}>Lịch sử sửa chữa :</Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      {item.deviceInfo.history_repair.map((history, index) => (
                        <RepairHistoryPopover key={index} history={history} />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Collapse>
      </TableCell>
      <Popover
        open={Boolean(deleteAnchorEl)}
        anchorEl={deleteAnchorEl}
        onClose={handleCloseDeletePopover}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, maxWidth: 280 }}>
          <Stack spacing={2}>
            <Box sx={{ typography: 'subtitle1' }}>
              Bạn có chắc chắn muốn xóa thiết bị này?
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleCloseDeletePopover}>
                Hủy
              </Button>
              <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                Xóa
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Popover>
    </TableRow>
  );



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
            primary={renderCellWithTooltip(sub_category_id)}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>{renderMoney(String(cost))}</TableCell>
        <TableCell>{detail?.filter((x) => x.status === 'inventory').length}</TableCell>
        <TableCell>{detail?.filter((x) => x.status === 'sold').length}</TableCell>
        <TableCell>
          <ListItemText
            primary={renderCellWithTooltip(String(note))}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>


        <TableCell align="right" sx={{ pr: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
            <IconButton
              color={collapse.value ? 'inherit' : 'default'}
              onClick={collapse.onToggle}
              sx={{
                ...(collapse.value && {
                  bgcolor: 'action.hover',
                }),
              }}
            >
              <Iconify icon="eva:arrow-ios-downward-fill" />
            </IconButton>

            <IconButton
              color="error"
              onClick={() => {
                confirm.onTrue();
              }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>
      {renderSecondary}


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
