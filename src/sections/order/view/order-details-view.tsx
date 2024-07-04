'use client';

import { Container, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import { getOrderById } from 'src/api/order';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { IOrder, Items } from 'src/types/order';
import OrderDetailsItems from '../order-details-item';
import OrderDetailsToolbar from '../order-details-toolbar';
import OrderDetailsInfo from '../order-details-info';
import OrderDetailsInfoView from '../order-details-info-view';

function OrderDetailsView({ id }: { id: string }) {
  const settings = useSettingsContext();

  const [selectedItem, setSelectedItem] = useState<IOrder | undefined>(undefined);

  const handleEditRow = async () => {
    try {
      const currentOrder = await getOrderById(id);
      setSelectedItem(currentOrder);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      handleEditRow();
    }
  }, [id]);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <OrderDetailsToolbar
        backLink={paths.dashboard.order.root}
        orderNumber={selectedItem?._id as string}
        createdAt={selectedItem?.regDt as any}
        statusOptions={ORDER_STATUS_OPTIONS}
        onChangeStatus={(newValue) => {
          //
        }}
        status="complete"
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems
              items={selectedItem?.items as Items[]}
              totalAmount={Number(selectedItem?.totalAmount)}
            />
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          {/* <OrderDetailsInfoView currentOrder={selectedItem} /> */}
        </Grid>
      </Grid>
    </Container>
  );
}

export default OrderDetailsView;
