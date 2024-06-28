import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import Iconify from 'src/components/iconify';
import { IOrder } from 'src/types/order';

function OrderDetailsInfoView({ currentOrder }: { currentOrder: IOrder }) {
  const renderCustomer = (
    <>
      <CardHeader
        title="Customer Info"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar
          alt={currentOrder?.customer?.name}
          src={currentOrder?.customer?.avatarUrl}
          sx={{ width: 48, height: 48, mr: 2 }}
        />

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{currentOrder?.customer?.name}</Typography>

          <Box sx={{ color: 'text.secondary' }}>{currentOrder?.customer?.email}</Box>

          <Box>
            IP Address:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {currentOrder?.customer?.address}
            </Box>
          </Box>

          <Button
            size="small"
            color="error"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ mt: 1 }}
          >
            Add to Blacklist
          </Button>
        </Stack>
      </Stack>
    </>
  );

  const renderDelivery = (
    <>
      <CardHeader
        title="Delivery"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Ship by
          </Box>
          {currentOrder?.delivery?.shipBy}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Delivery date
          </Box>
          {currentOrder?.delivery_date}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Tracking No.
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
      <CardHeader
        title="Shipping"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Address
          </Box>
          {currentOrder?.customer?.address}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Phone number
          </Box>
          {currentOrder?.customer?.phone}
        </Stack>
      </Stack>
    </>
  );

  //  const renderPayment = (
  //    <>
  //      <CardHeader
  //        title="Payment"
  //        action={
  //          <IconButton>
  //            <Iconify icon="solar:pen-bold" />
  //          </IconButton>
  //        }
  //      />
  //      <Stack direction="row" alignItems="center" sx={{ p: 3, typography: 'body2' }}>
  //        <Box component="span" sx={{ color: 'text.secondary', flexGrow: 1 }}>
  //          Phone number
  //        </Box>

  //        {payment.cardNumber}
  //        <Iconify icon="logos:mastercard" width={24} sx={{ ml: 0.5 }} />
  //      </Stack>
  //    </>
  //  );
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
