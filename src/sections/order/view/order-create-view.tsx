'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Container, InputAdornment, Stack, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid/Grid';
import { DatePicker } from '@mui/x-date-pickers';
import { debounce } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { Fragment, useState } from 'react';
import { Controller, DefaultValues, useFieldArray, useForm } from 'react-hook-form';
import { getListCustomer } from 'src/api/customer';
import { getListDevice } from 'src/api/product';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { RHFAutocomplete, RHFEditor, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { ICustomer } from 'src/types/customer';
import { IOrderCreateOrUpdate } from 'src/types/order';
import { IDetailDevice, IDevice } from 'src/types/product';
import * as Yup from 'yup';

type IItems = {
  device: string;
  details?: string[];
  quantity?: number;
};

const initializeDefaultValues = (): DefaultValues<IOrderCreateOrUpdate> => ({
  _id: undefined,
  delivery_date: '',
  totalAmount: 0,
  customer: '',
  items: [
    {
      device: '',
      details: [],
    },
  ],
  shipBy: '',
  note: '',
});

export default function OrderCreateView() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [deviceOptions, setDeviceOptions] = useState<{ [key: number]: IDevice[] }>({});
  const [price, setPrice] = useState<{ priceTotal: number; priceSale: number; priceTax: number }>({
    priceTotal: 0,
    priceSale: 0,
    priceTax: 0,
  });

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

  const onSubmit = async (data: IOrderCreateOrUpdate) => {
    console.log('🚀 ~ onSubmit ~ data:', data);
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

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Tạo order"
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
                            <RHFTextField
                              name={`items.${index}.quantity`}
                              label="Số lượng"
                              type="number"
                              onKeyDown={(evt) =>
                                ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                              }
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                const device = deviceOptions?.[index]?.find(
                                  (x: IDevice) => x._id === item.device
                                );
                                setValue(`items.${index}.quantity`, value);

                                const checkInventoryInDevice = device?.detail?.filter(
                                  (x: IDetailDevice) => x.status === 'inventory'
                                ).length;
                                if (value > Number(checkInventoryInDevice)) {
                                  setError(`items.${index}.quantity`, {
                                    message: `Product ${device?.name} only has ${checkInventoryInDevice} left in stock, enter quantity <= ${checkInventoryInDevice}`,
                                  });
                                } else {
                                  clearErrors(`items.${index}.quantity`);
                                }
                              }}
                            />
                          </Grid>

                          <Grid xs={3}>
                            <RHFTextField name="" label="Tổng tiền" />
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
                                onClick={() => append({ device: '', details: [] })}
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
                  <RHFTextField name="totalAmount" label="Tổng tiền" type="number" />
                </Grid>
                <Grid xs={12}>
                  <RHFTextField
                    name=""
                    label="Giảm giá"
                    placeholder="Nhập giá giảm"
                    type="number"
                    value={price.priceSale || ''}
                    onChange={(e) => {
                      setPrice({ ...price, priceSale: Number(e.target.value) });
                    }}
                  />
                </Grid>
                <Grid xs={12}>
                  <RHFTextField
                    name=""
                    label="Thuế (%)"
                    placeholder="0.00"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <Box component="span" sx={{ color: 'text.disabled' }}>
                            %
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                    value={price?.priceTax || ''}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setPrice({ ...price, priceTax: value });
                    }}
                  />
                </Grid>

                <Grid
                  xs={12}
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}
                >
                  <Typography>Tổng: {watch('totalAmount')}</Typography>
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
              Tạo mới
            </LoadingButton>
            <Button component={RouterLink} href={paths.dashboard.order.new} variant="contained">
              Hủy
            </Button>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
