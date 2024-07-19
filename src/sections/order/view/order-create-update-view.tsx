'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Card, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid/Grid';
import { DatePicker } from '@mui/x-date-pickers';
import { debounce } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { Fragment, useEffect, useState } from 'react';
import { Controller, DefaultValues, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { getListCustomer } from 'src/api/customer';
import { createOrder, updateOrderById } from 'src/api/order';
import { getListDevice } from 'src/api/product';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  RHFAutocomplete,
  RHFEditor,
  RHFTextField,
  RHFTextFieldFormatVnd,
} from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { ICustomer } from 'src/types/customer';
import { IOrder, IOrderCreateOrUpdate } from 'src/types/order';
import { IDetailDevice, IDevice } from 'src/types/product';
import { renderMoney } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
import * as Yup from 'yup';
import { useRouter } from 'src/routes/hooks';

interface IItems {
  device: string;
  details: string[];
  quantity: number;
  price: number;
}

const initializeDefaultValues = (): DefaultValues<IOrderCreateOrUpdate> => ({
  _id: undefined,
  delivery_date: '',
  totalAmount: 0,
  customer: '',
  items: [
    {
      device: '',
      details: [],
      quantity: undefined,
      price: undefined,
    },
  ],
  shipBy: '',
  note: '',
  priceSaleOff: 0,
});

export default function OrderCreateView({ currentOrder }: { currentOrder?: IOrder }) {
  const router = useRouter();
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [deviceOptions, setDeviceOptions] = useState<{ [key: number]: IDevice[] }>({});

  const NewOrderSchema = Yup.object().shape({
    delivery_date: Yup.string().required('Delivery date is required'),
    totalAmount: Yup.number().required().min(1, 'Total amount is required'),
    shipBy: Yup.string().required('ShipBy is required'),
    customer: Yup.string().required('Customer is required'),
    items: Yup.array()
      .of(
        Yup.object().shape({
          device: Yup.string().required('Device is required'),
          details: Yup.array(),
          quantity: Yup.number()
            .min(1, 'Quantity is required')
            .test('check-inventory', 'Quantity exceeds inventory', function (value) {
              const index = this.path.split('.')[1]; // Get the index of the item in the array
              const deviceId = this.parent.device;
              console.log('🚀 ~ deviceId:', deviceId);
              console.log('🚀 ~ index:', index);
              return false;
            }),
          price: Yup.number().required('price is required').min(1, 'price is required'),
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
    setError,
    control,
    watch,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = useWatch({
    control,
    name: 'items',
  });

  const handleWatchQuantityForItems = (
    items: {
      device: string;
      details?: string[];

      quantity: number;
      price: number;
    }[]
  ) => {
    let hasError = false;

    items.forEach((item, index) => {
      const value = item.quantity;
      const device = deviceOptions?.[index]?.find((x) => x._id === watch(`items.${index}.device`));
      const checkInventoryInDevice = device?.detail?.filter((x) => x.status === 'inventory') || [];

      if (currentOrder) {
        const id_deviceIncludedInOrder = currentOrder?.items?.[index]?.details || [];
        const remainingNeeded = value - id_deviceIncludedInOrder.length;
        if (remainingNeeded > checkInventoryInDevice.length) {
          setError(`items.${index}.quantity`, {
            message: `Product ${device?.name} only has ${
              checkInventoryInDevice.length
            } left in stock, enter quantity <= ${
              id_deviceIncludedInOrder.length + checkInventoryInDevice.length
            }`,
          });
          hasError = true;
        } else {
          clearErrors(`items.${index}.quantity`);
        }
      } else if (value > checkInventoryInDevice.length) {
        setError(`items.${index}.quantity`, {
          message: `Product ${device?.name} only has ${checkInventoryInDevice.length} left in stock, enter quantity <= ${checkInventoryInDevice.length}`,
        });
        hasError = true;
      } else if (value) {
        clearErrors(`items.${index}.quantity`);
      } else {
        setError(`items.${index}.quantity`, { message: 'quantity is required' });
      }
    });

    return hasError;
  };

  const handleGetWhenCreateAndUpdateSuccess = (value: boolean) => {
    enqueueSnackbar(value ? 'Update success!' : 'Create success!', {
      variant: 'success',
    });
    router.push(paths.dashboard.order.root);
  };

  const onSubmit = async (data: IOrderCreateOrUpdate) => {
    const newData: IOrderCreateOrUpdate = {
      ...data,
      delivery_date: fDateTime(data?.delivery_date, 'yyyy-MM-dd HH:mm'),
      items: data?.items.map((item) => ({
        details: item.details,
        device: item.device,
        price: item.price,
      })) as any,
      totalAmount: watch('totalAmount') - (watch('priceSaleOff') || 0),
    };

    // if (newData?._id) {
    //   const updateOrder = await updateOrderById(newData?._id, newData, enqueueSnackbar);
    //   if (updateOrder) {
    //     handleGetWhenCreateAndUpdateSuccess(!!currentOrder);
    //   }
    // } else {
    //   const newOrder = await createOrder(newData, enqueueSnackbar);
    //   if (newOrder) {
    //     handleGetWhenCreateAndUpdateSuccess(false);
    //   }
    // }
  };

  const handleInputChangeCustomer = debounce(async (searchQuery: string) => {
    try {
      const response = await getListCustomer({ keyword: searchQuery });
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to search devices:', error);
    }
  }, 300);

  const handleSearchDevice = debounce(async (index: number, searchQuery: string) => {
    try {
      const response = await getListDevice({ keyword: searchQuery });
      setDeviceOptions((prevState) => ({
        ...prevState,
        [index]: response?.data,
      }));
    } catch (error) {
      console.error('Failed to search devices:', error);
    }
  }, 300);

  const calculateTotalAmount = (
    items: {
      device: string;
      details?: string[];

      quantity: number;
      price: number;
    }[]
  ) =>
    items.reduce((acc, item) => {
      if (item.price && item.quantity) {
        return acc + item.price * item.quantity;
      }
      return acc;
    }, 0);

  const handleSetDataToForm = () => {
    if (currentOrder?._id) {
      setValue('_id', currentOrder?._id);
      setValue('totalAmount', Number(currentOrder?.totalAmount));
      setValue('delivery_date', currentOrder?.delivery_date);
      setValue('shipBy', String(currentOrder?.shipBy));
      setValue('customer', String(currentOrder?.customer?._id));
      setValue('note', currentOrder?.note);

      const items = currentOrder?.items?.map((item) => ({
        device: item.device?._id as string,
        details: item.details,

        quantity: item.details?.length,
        price: item?.price as number,
      }));

      const deviceOption: { [key: number]: IDevice[] } = {};

      currentOrder?.items?.forEach((item, index) => {
        (deviceOption[index] as any) = [item.device];
      });

      setValue('items', items as IItems[]);
      setDeviceOptions(deviceOption);
      setCustomers([currentOrder?.customer as ICustomer]);
    } else {
      const newDflValues = initializeDefaultValues();
      Object.keys(newDflValues).forEach((key: any) => {
        setValue(key, (newDflValues as any)?.[key]);
      });
      setValue('_id', undefined);
    }
  };

  useEffect(() => {
    const totalAmount = calculateTotalAmount(watchedItems);
    setValue('totalAmount', totalAmount);
  }, [watchedItems, setValue]);

  useEffect(() => {
    handleSetDataToForm();
    clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrder?._id]);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={currentOrder ? 'Chỉnh sửa' : 'Tạo mới'}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Order',
            href: paths.dashboard.order.root,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} justifyContent="center">
          <Grid xs={12} md={8}>
            <Card>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Typography variant="subtitle2">Thông tin</Typography>
                <Grid xs={12}>
                  <Controller
                    name="delivery_date"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        {...field}
                        value={new Date(String(field?.value) || '')}
                        label="Ngày giao"
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
                  <RHFAutocomplete
                    name="customer"
                    label="Khách hàng"
                    options={customers.map((item) => item?._id)}
                    onInputChange={(_e: React.SyntheticEvent, value: string, reason: string) => {
                      if (reason === 'input') {
                        handleInputChangeCustomer(value);
                      }
                    }}
                    getOptionLabel={(option) =>
                      customers?.find((x) => x._id === option)?.name || ''
                    }
                  />
                </Grid>

                <Grid xs={12}>
                  <RHFTextField name="shipBy" label="Giao bởi" />
                </Grid>

                <Grid xs={12}>
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Thiết bị</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Chức năng và thuộc tính
                    </Typography>

                    {fields?.map((item, index) => (
                      <Fragment key={item?.id}>
                        <Grid container spacing={2}>
                          <Grid xs={3}>
                            <RHFAutocomplete
                              key={item?.id}
                              name={`items.${index}.device`}
                              label="Sản phẩm"
                              options={
                                deviceOptions?.[index]?.map((itemDevice) => itemDevice?._id) || []
                              }
                              onInputChange={(
                                _e: React.SyntheticEvent,
                                value: string,
                                reason: string
                              ) => {
                                if (reason === 'input') {
                                  handleSearchDevice(index, value);
                                }
                              }}
                              getOptionLabel={(option) =>
                                (deviceOptions?.[index]?.find((x: IDevice) => x._id === option)
                                  ?.name || '') as any
                              }
                            />
                          </Grid>

                          <Grid xs={3}>
                            <RHFTextFieldFormatVnd
                              name={`items.${index}.price`}
                              label="Giá tiền"
                              onChange={(e) => {
                                const value = Number(e.target.value) || 0;
                                setValue(`items.${index}.price`, value);
                              }}
                              disabled={!watch(`items.${index}.device`)}
                            />
                          </Grid>

                          <Grid xs={3}>
                            <RHFTextField
                              name={`items.${index}.quantity`}
                              label="Số lượng"
                              type="number"
                              disabled={!watch(`items.${index}.price`)}
                              onKeyDown={(evt) =>
                                ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                              }
                            />
                          </Grid>

                          <Grid xs={1}>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                remove(index);
                                const clonedDeviceOptions = { ...deviceOptions };
                                delete clonedDeviceOptions[index];
                                const newData = Object.values(clonedDeviceOptions).reduce(
                                  (acc: any, value, indexData) => {
                                    acc[indexData] = value;
                                    return acc;
                                  },
                                  {}
                                );
                                setDeviceOptions(newData);
                              }}
                              color="error"
                              sx={{ height: '55px' }}
                              disabled={fields?.length === 1}
                            >
                              <Iconify icon="eva:trash-2-outline" />
                            </Button>
                          </Grid>

                          {index === 0 && (
                            <Grid xs={1}>
                              <Button
                                variant="outlined"
                                color="inherit"
                                onClick={() =>
                                  append({
                                    device: '',
                                    details: [],
                                    quantity: 0,
                                    price: 0,
                                  })
                                }
                                sx={{ height: '55px' }}
                              >
                                <Iconify icon="mingcute:add-line" />
                              </Button>
                            </Grid>
                          )}
                        </Grid>
                      </Fragment>
                    ))}
                  </Stack>
                </Grid>

                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Ghi chú</Typography>
                  <Grid xs={12}>
                    <RHFEditor simple name="note" />
                  </Grid>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          <Grid xs={12} md={8}>
            <Card>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Typography variant="subtitle2">Định giá</Typography>
                <Grid xs={12}>
                  <RHFTextField
                    name="totalAmount"
                    label="Tổng tiền"
                    type="number"
                    onKeyDown={(evt) =>
                      ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                    }
                  />
                </Grid>
                <Grid xs={12}>
                  <RHFTextField
                    name="priceSaleOff"
                    label="Giảm giá"
                    placeholder="Nhập giá giảm"
                    type="number"
                    onKeyDown={(evt) =>
                      ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                    }
                  />
                </Grid>

                <Grid
                  xs={12}
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}
                >
                  <Typography>
                    Tổng: {renderMoney(String(watch('totalAmount') - (watch('priceSaleOff') || 0)))}
                  </Typography>
                </Grid>
              </Stack>
            </Card>
          </Grid>

          <Grid
            xs={12}
            md={8}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right', gap: '5px' }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
              sx={{ height: '36px' }}
            >
              Lưu
            </LoadingButton>
            <Button component={RouterLink} href={paths.dashboard.order.root} variant="contained">
              Hủy
            </Button>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
