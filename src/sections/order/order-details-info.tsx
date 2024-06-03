import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/system/Unstable_Grid/Grid';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { Fragment, useEffect } from 'react';
import { Controller, DefaultValues, useFieldArray, useForm } from 'react-hook-form';
import { createOrder } from 'src/api/order';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify';
import { ICustomer } from 'src/types/customer';
import { IOrder, IOrderCreateOrUpdate } from 'src/types/order';
import { IDevice } from 'src/types/product';
import { renderMoney } from 'src/utils/format-number';
import * as Yup from 'yup';

const initializeDefaultValues = (): DefaultValues<IOrderCreateOrUpdate> => ({
  _id: undefined,
  delivery_date: '',
  totalAmount: undefined,
  customer: '',
  items: [
    {
      device: '',
      quantity: 0,
    },
  ],
  delivery: {
    shipBy: '',
    trackingNumber: '',
  },
  note: '',
});

export default function OrderDetailsInfo({
  currentOrder,
  open,
  onClose,
  listCustomer,
  listDevice,
  getAllOrder,
}: {
  currentOrder?: IOrder;
  open: boolean;
  onClose: VoidFunction;
  listCustomer: ICustomer[];
  listDevice: IDevice[];
  getAllOrder: VoidFunction;
}) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const NewOrderSchema = Yup.object().shape({
    delivery_date: Yup.string().required('Delivery date is required'),
    totalAmount: Yup.number().required('Total amount is required'),
    delivery: Yup.object().shape({
      shipBy: Yup.string().required('ShipBy is required'),
      trackingNumber: Yup.string().required('Tracking number is required'),
    }),
    customer: Yup.string().required('Customer is required'),
    items: Yup.array()
      .of(
        Yup.object().shape({
          device: Yup.string().required('Device is required'),
          quantity: Yup.number()
            .required('Quantity is required')
            .min(1, 'Quantity must be at least 1'),
        })
      )
      .required(),
  });

  const methods = useForm<IOrderCreateOrUpdate>({
    resolver: yupResolver(NewOrderSchema),
    defaultValues: initializeDefaultValues(),
  });

  const {
    setValue,
    handleSubmit,
    clearErrors,
    control,
    watch,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const totalAmount = watch('items')?.reduce((total, orderItem) => {
    const device = listDevice?.find((d: IDevice) => d._id === orderItem.device);
    if (device) {
      return total + device.price * Number(orderItem.quantity);
    }
    return total;
  }, 0);

  const handleGetWhenCreateAndUpdateSuccess = (value: boolean) => {
    getAllOrder();
    enqueueSnackbar(value ? 'Update success!' : 'Create success!', {
      variant: 'success',
    });
    onClose();
  };

  const onSubmit = async (data: IOrderCreateOrUpdate) => {
    const newData: IOrderCreateOrUpdate = {
      ...data,
      delivery_date: format(new Date(data.delivery_date), 'yyyy-MM-dd'),
      totalAmount,
    };
    if (newData?._id) {
      // update
    } else {
      const newOrder = await createOrder(newData);
      if (newOrder) {
        handleGetWhenCreateAndUpdateSuccess(!currentOrder);
      }
    }
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    if (currentOrder) {
      //
    } else {
      setValue('_id', undefined);
      setValue('totalAmount', 0);
      setValue('delivery_date', '');
      setValue('delivery.shipBy', '');
      setValue('delivery.trackingNumber', '');
      setValue('customer', '');
      setValue('items', [
        {
          device: '',
          quantity: 0,
        },
      ]);
      setValue('note', '');
    }
    clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrder, open]);
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      transitionDuration={{
        enter: theme.transitions.duration.shortest,
        exit: 0,
      }}
      PaperProps={{
        sx: {
          overflow: 'unset',
          minWidth: 750,
        },
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ pb: 2 }}>{!currentOrder ? 'Tạo mới' : 'Cập nhật'} đơn hàng</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              p: 3,
              borderBottom: `solid 1px ${theme.palette.divider}`,
              height: '600px',
              overflow: 'auto',
            }}
          >
            <Grid container spacing={3}>
              <Grid xs={12}>
                <Controller
                  name="delivery_date"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      value={new Date(String(field?.value) || '')}
                      label="Delivery date"
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid xs={12}>
                <RHFSelect name="customer" label="Customer">
                  {listCustomer?.map((item) => (
                    <MenuItem key={item?._id} value={item?._id}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
              <Grid xs={6}>
                <RHFTextField name="delivery.shipBy" label="Ship By" />
              </Grid>
              <Grid xs={6}>
                <RHFTextField name="delivery.trackingNumber" label="Tracking Number" />
              </Grid>

              {fields.map((item, index) => (
                <Fragment key={item?.id}>
                  <Grid xs={5}>
                    <Controller
                      name={`items.${index}.device`}
                      control={control}
                      render={({ field }) => (
                        <RHFSelect {...field} label="Device">
                          {listDevice?.map((device) => (
                            <MenuItem key={device._id} value={device._id}>
                              {device.name}
                            </MenuItem>
                          ))}
                        </RHFSelect>
                      )}
                    />
                  </Grid>
                  <Grid xs={4}>
                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field }) => (
                        <RHFTextField
                          {...field}
                          label="Quantity"
                          type="number"
                          onKeyDown={(evt) =>
                            ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={1.5}>
                    <Button
                      variant="outlined"
                      onClick={() => handleRemove(index)}
                      color="error"
                      sx={{ height: '55px' }}
                      disabled={fields?.length === 1}
                    >
                      <Iconify icon="eva:trash-2-outline" />
                    </Button>
                  </Grid>
                  {index === 0 && (
                    <Grid xs={1.5}>
                      <Button
                        variant="outlined"
                        color="inherit"
                        onClick={() => append({ device: '', quantity: 0 })}
                        sx={{ height: '55px' }}
                      >
                        <Iconify icon="mingcute:add-line" />
                      </Button>
                    </Grid>
                  )}
                </Fragment>
              ))}
              <Grid xs={12}>
                <Divider sx={{ flex: 1, border: `solid 1px ${theme.palette.divider}` }} />
              </Grid>

              <Grid xs={12} display="flex" justifyContent="space-between">
                <Box>Tổng:</Box>
                <Box>{renderMoney(String(totalAmount))}</Box>
              </Grid>

              <Grid xs={12}>
                <RHFTextField name="note" label="Note" multiline rows={4} />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <LoadingButton color="inherit" type="submit" variant="contained" loading={isSubmitting}>
            Save
          </LoadingButton>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
