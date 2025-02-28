/* eslint-disable react/no-danger */
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Divider,
  Link,
  Stack,
  Typography
} from '@mui/material';
import { IOrder } from 'src/types/order';

function OrderDetailsInfoView({ currentOrder }: { currentOrder?: IOrder }) {
  const renderCustomer = (
    <>
      <CardHeader title="Thông tin khách hàng" />
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar
          alt={currentOrder?.customer?.name}
          src= ''
          sx={{ width: 48, height: 48, mr: 2 }}
        />

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{currentOrder?.customer?.name}</Typography>

          <Box>
            Loại:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {currentOrder?.type_customer === 'private' ? 'Khách lẻ' : 'Ngân hàng'}
            </Box>
          </Box>
          <Box>
            Email:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {currentOrder?.customer?.email}
            </Box>
          </Box>
          <Box>
            SDT:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {currentOrder?.customer?.phone}
            </Box>
          </Box>

          <Box>
            Địa chỉ:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {currentOrder?.customer?.address}
            </Box>
          </Box>
        </Stack>
      </Stack>
    </>
  );

  const renderDelivery = (
    <>
      <CardHeader title="Vận chuyển" />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Vận chuyển bởi :
          </Box>
          {currentOrder?.shipBy}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Ngày giao hàng :
          </Box>
          {currentOrder?.delivery_date}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Mã đơn hàng :
          </Box>
          <Link underline="always" color="inherit">
            {currentOrder?._id}
          </Link>
        </Stack>
      </Stack>
    </>
  );

  const renderShipping = (
    <>
      <CardHeader title="Ghi chú" />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <div
          dangerouslySetInnerHTML={{ __html: String(currentOrder?.note) }}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
              maxHeight: '3.6em',
            }}
          />
      </Stack>
    </>
  );

  return (
    <Card>
      {renderCustomer}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderDelivery}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderShipping}
    </Card>
  );
}

export default OrderDetailsInfoView;
