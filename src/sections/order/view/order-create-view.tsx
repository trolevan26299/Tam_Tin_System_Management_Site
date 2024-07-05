'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  AutocompleteGetTagProps,
  Box,
  Button,
  Card,
  Chip,
  Container,
  InputAdornment,
  Stack,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
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
import { IDevice } from 'src/types/product';
import * as Yup from 'yup';

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

const styles: { [key: string]: SxProps<Theme> } = {
  tag: {
    cursor: 'pointer',
    height: '26px',
    borderRadius: '6px',

    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '& span': {
      maxWidth: '220px',
    },
  },
};

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
          details: Yup.array()
            .min(1, 'At least one detail is required')
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

  const renderTags = (value: string[], getTagProps: AutocompleteGetTagProps) => {
    return value.map((option, index) => (
      <Chip variant="outlined" label={option} {...getTagProps({ index })} sx={styles.tag} />
    ));
  };

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
                      return (
                        <Fragment key={item?.id}>
                          <Grid container spacing={2}>
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
                            <Grid xs={6}>
                              <RHFAutocomplete
                                key={item?.id}
                                multiple
                                name={`items.${index}.details`}
                                label="Chi tiết"
                                options={
                                  (deviceOptions?.[index]?.[0]?.detail
                                    ?.filter((x) => x.status === 'inventory')
                                    ?.map((y) => y.id_device) as string[]) || []
                                }
                                noOptionsText="Vui lòng nhập cụm từ tìm kiếm của bạn."
                                renderTags={renderTags}
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
                                  onClick={() => append({ device: '', details: [] })}
                                  sx={{ height: '55px' }}
                                >
                                  <Iconify icon="mingcute:add-line" />
                                </Button>
                              </Grid>
                            )}
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
              {'Tạo mới'}
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
