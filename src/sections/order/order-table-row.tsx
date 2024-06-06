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
} from '@mui/material';
import { format } from 'date-fns';
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
};

function OrderTableRow({ row, selected, onSelectRow, onDeleteRow, onEditRow }: Props) {
  const { items, delivery, delivery_date, customer, totalAmount, note } = row;

  const totalQuantity = items?.reduce((total, item) => total + Number(item.quantity), 0);

  const confirm = useBoolean();
  const collapse = useBoolean();
  const popover = usePopover();

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {items?.map((item) => (
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
                  secondary={item?.device?.id_device}
                  primaryTypographyProps={{
                    typography: 'body2',
                  }}
                  secondaryTypographyProps={{
                    component: 'span',
                    color: 'text.disabled',
                    mt: 0.5,
                  }}
                />

                <Box>x{item.quantity}</Box>

                <Box sx={{ width: 110, textAlign: 'right' }}>
                  {renderMoney(String(item?.device?.price))}
                </Box>
              </Stack>
            ))}
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <TableRow>
        <TableCell>
          <Box
            // onClick={onViewRow}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {delivery?.trackingNumber}
          </Box>
          {/* <ListItemText
          primary={delivery?.trackingNumber}
          primaryTypographyProps={{ typography: 'body2' }}
        /> */}
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          {customer?.avatarUrl && (
            <Avatar alt={customer.name} src={customer?.avatarUrl} sx={{ mr: 2 }} />
          )}

          <ListItemText
            primary={customer?.name}
            secondary={customer?.email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={format(new Date(delivery_date), 'dd MMM yyyy')}
            secondary={format(new Date(delivery_date), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell align="center">{totalQuantity}</TableCell>

        <TableCell>{renderMoney(String(totalAmount))}</TableCell>

        <TableCell>
          <ListItemText primary={note} primaryTypographyProps={{ typography: 'body2' }} />
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
      {renderSecondary}
    </>
  );
}

export default OrderTableRow;
