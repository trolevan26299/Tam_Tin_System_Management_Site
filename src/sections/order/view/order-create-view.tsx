'use client';

import { useTheme } from '@mui/material/styles';
import { Card, Container, MenuItem, Stack, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid/Grid';
import React, { Fragment, useState } from 'react';
import { RHFAutocomplete, RHFEditor, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { IOrderCreateOrUpdate } from 'src/types/order';
import { Controller, DefaultValues, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers';
import { ICustomer } from 'src/types/customer';
import { debounce } from 'lodash';
import { getListCustomer } from 'src/api/customer';
import FormProvider from 'src/components/hook-form/form-provider';
import { LoadingButton } from '@mui/lab';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { IDetailDevice, IDevice } from 'src/types/product';
import { getListDevice } from 'src/api/product';

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
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [deviceOptions, setDeviceOptions] = useState<{ [key: number]: IDevice[] }>({});
  console.log('🚀 ~ OrderCreateView ~ deviceOptions:', deviceOptions);

  const NewOrderSchema = Yup.object().shape({
    delivery_date: Yup.string().required('Delivery date is required'),
    totalAmount: Yup.number().required('Total amount is required'),
    shipBy: Yup.string().required('ShipBy is required'),
    customer: Yup.string().required('Customer is required'),
    items: Yup.array()
      .of(
        Yup.object().shape({
          device: Yup.string().required('Device is required'),
          details: Yup.array()
            .of(Yup.string().required('Detail is required'))
            .required('Details are required'),
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

  console.log('🚀 ~ OrderCreateView ~ fields:', fields);
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
                      (customers?.find((x) => x._id === option)?.name || '') as any
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

                    {fields?.map((item, index) => {
                      console.log(deviceOptions?.[index]);
                      return (
                        <Fragment key={item?.id}>
                          <Grid container spacing={2}>
                            {' '}
                            <Grid xs={4}>
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
                            <Grid xs={4}>
                              <RHFAutocomplete
                                key={item?.id}
                                multiple
                                name={`items?.${index}.details`}
                                label="Chi tiết"
                                options={deviceOptions?.[index]?.[0]?.detail || []}
                              />
                            </Grid>
                          </Grid>
                        </Fragment>
                      );
                    })}
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

          <Grid
            xs={12}
            md={8}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}
          >
            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {'Tạo mới'}
            </LoadingButton>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
