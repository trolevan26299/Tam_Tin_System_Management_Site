/* eslint-disable react/no-danger */
import {
  Avatar,
  Box,
  Button,
  Collapse,
  IconButton,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { sumBy } from 'lodash';
import { useState } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { IOrder } from 'src/types/order';
import { renderMoney } from 'src/utils/format-number';

type Props = {
  row: IOrder;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
};

function OrderTableRow({ row, selected, onSelectRow, onDeleteRow, onEditRow, onViewRow }: Props) {
  const { items, shipBy, delivery_date, customer, totalAmount, note, _id, priceSaleOff } = row;

  const confirm = useBoolean();
  const collapse = useBoolean();
  const popover = usePopover();

  const detailsPopover = usePopover();
  const [selectedDetails, setSelectedDetails] = useState<string[]>([]);

  const itemCounts = sumBy(items, (item) => (item.details as string[]).length);

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={9}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {items?.map((item, index) => (
              <Stack
                key={item?.device?._id}
                direction="row"
                alignItems="center"
                sx={{
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                  },
                }}
              >
                {item?.device?.coverUrl && (
                  <Avatar
                    src={item?.device?.coverUrl}
                    variant="rounded"
                    sx={{ width: 48, height: 48, mr: 2 }}
                  />
                )}

                <ListItemText
                  primary={item?.device?.name}
                  primaryTypographyProps={{
                    typography: 'body2',
                  }}
                />

                <Button
                 size="small"
                 variant='contained'
                 color="primary"
                 onClick={(event) => {
                   setSelectedDetails(item?.details || []);
                   detailsPopover.onOpen(event);
                 }}
                 startIcon={<Iconify icon="eva:list-fill" />}
                 sx={{
                   display: 'flex',
                   alignItems: 'center',
                   gap: 0.5,
                   '& .MuiButton-startIcon': {
                     margin: 0,
                     '& > *:nth-of-type(1)': {
                       fontSize: 20,
                     },
                   },
                   typography: 'body2',
                   mr:2
                 }}
                >
                  Chi tiết ID
                </Button>
                <Box sx={{ minWidth: 150 }}>
                  <span>
                    {' '}
                    <b>Bảo hành : </b>
                    {`${item?.warranty} Tháng` || 'Không có'}{' '}
                  </span>
                </Box>

                <Box sx={{ minWidth: 150 }}>
                  <span>
                    {' '}
                    <b>Giá : </b>
                    {`${renderMoney(String(item?.price))} VNĐ` || 'Không có'}{' '}
                  </span>
                </Box>

                <Box sx={{ minWidth: 150 }}>
                  <span>
                    {' '}
                    <b>Số lượng : </b>
                    {`${item?.details?.length}` || 'Không có'}{' '}
                  </span>
                </Box>

                <Box sx={{ minWidth: 150 }}>
                  <span>
                    {' '}
                    <b>Tổng tiền : </b>
                    {`${renderMoney(String(Number(item?.price) * Number(item.details?.length)))} VNĐ` ||
                      'Không có'}{' '}
                  </span>
                </Box>
              </Stack>
            ))}
            <CustomPopover
              open={detailsPopover.open}
              onClose={detailsPopover.onClose}
              arrow="right-top"
              sx={{
                width: 300,
                p: 2,
              }}
            >
              <Box sx={{ typography: 'subtitle2', mb: 1.5 }}>Danh sách ID</Box>
              {selectedDetails.map((detail, index) => (
                <Box
                  key={index}
                  sx={{
                    py: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="body2">{detail}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      navigator.clipboard.writeText(detail);
                    }}
                  >
                    <Iconify icon="solar:copy-bold" width={16} />
                  </IconButton>
                </Box>
              ))}
            </CustomPopover>
          </Stack>
        </Collapse>
      </TableCell>
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
        <TableCell
          sx={{
            maxWidth: '100px',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <ListItemText
              primary={renderCellWithTooltip(String(_id))}
              primaryTypographyProps={{ typography: 'body2' }}
              onClick={onViewRow}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            />
            <Tooltip title="Copy ID">
              <IconButton
                size="small"
                onClick={() => {
                  navigator.clipboard.writeText(String(_id));
                }}
              >
                <Iconify icon="solar:copy-bold" width={20} />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
        <TableCell>
          <ListItemText primary={shipBy} primaryTypographyProps={{ typography: 'body2' }} />
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          {customer?.avatarUrl && (
            <Avatar alt={customer.name} src={customer?.avatarUrl} sx={{ mr: 2 }} />
          )}

          <ListItemText
            primary={customer?.name}
            secondary={customer?.email || customer?.phone || ''}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={format(new Date(delivery_date), 'dd/MM/yyyy')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell align="center">{itemCounts}</TableCell>

        <TableCell>{renderMoney(String(totalAmount))}</TableCell>

        <TableCell>{renderMoney(String(priceSaleOff || 0))}</TableCell>
        <TableCell>
          <div
            dangerouslySetInnerHTML={{ __html: String(note) }}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxHeight: '3.6em',
            }}
          />
        </TableCell>

        <TableCell align="left">
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
            Chỉnh sửa
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
          title="Xóa đơn hàng"
          content="Bạn có chắc chắn muốn xóa đơn hàng này không?"
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                onDeleteRow();
                confirm.onFalse();
              }}
            >
              Xóa
            </Button>
          }
        />
      </TableRow>
      {renderSecondary}
    </>
  );
}

export default OrderTableRow;
