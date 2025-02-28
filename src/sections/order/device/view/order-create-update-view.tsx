/* eslint-disable no-unsafe-optional-chaining */

'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, Card, Chip, Container, Stack, TextField, Typography } from '@mui/material';
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
  price: number;
  warranty: number;
}

const initializeDefaultValues = (): DefaultValues<IOrderCreateOrUpdate> => ({
  _id: undefined,
  delivery_date: '',
  totalAmount: 0,
  customer: '',
  type_customer: 'bank',
  items: [
    {
      device: '',
      details: [],
      price: undefined,
      warranty: undefined,
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
  const [filteredCustomers, setFilteredCustomers] = useState<ICustomer[]>([]);
  const [deviceOptions, setDeviceOptions] = useState<{ [key: number]: IDevice[] }>({});

  const NewOrderSchema = Yup.object().shape({
    delivery_date: Yup.string().required('Vui lòng chọn ngày giao'),
    totalAmount: Yup.number().required("Vui lòng chọn sản phẩm").min(1, 'Tổng tiền phải lớn hơn 0'),
    shipBy: Yup.string().required('Vui lòng chọn người giao'),
    customer: Yup.string().required('Vui lòng chọn khách hàng'),
    items: Yup.array()
      .of(
        Yup.object().shape({
          device: Yup.string().required('Vui lòng chọn sản phẩm'),
          details: Yup.array(),
          price: Yup.number().required('Giá bán là bắt buộc').min(1, 'Giá bán phải lớn hơn 0'),
          warranty: Yup.number().required('Bảo hành là bắt buộc').min(1, 'Bảo hành phải lớn hơn 0'),
        })
      )
      .required(),
    type_customer: Yup.string().required('Loại khách hàng là bắt buộc'),
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

  const handleGetWhenCreateAndUpdateSuccess = (value: boolean) => {
    enqueueSnackbar(value ? 'Cập nhật thành công!' : 'Tạo mới thành công!', {
      variant: 'success',
    });
    router.push(paths.dashboard.order.device);
  };

  const onSubmit = async (data: IOrderCreateOrUpdate) => {
    const newData: IOrderCreateOrUpdate = {
      ...data,
      type_customer: data?.type_customer,
      delivery_date: fDateTime(data?.delivery_date, 'yyyy-MM-dd HH:mm'),
      items: data?.items.map((item) => ({
        details: item.details,
        device: item.device,
        price: item.price,
        quantity: item.details?.length || 0,
        warranty: item.warranty,
      })) as any,
      totalAmount: watch('totalAmount') - (watch('priceSaleOff') || 0),
      priceSaleOff: watch('priceSaleOff'),
    };

    if (newData?._id) {
      const updateOrder = await updateOrderById(newData?._id, newData, enqueueSnackbar);
      if (updateOrder) {
        handleGetWhenCreateAndUpdateSuccess(!!currentOrder);
      }
    } else {
      const newOrder = await createOrder(newData, enqueueSnackbar);
      if (newOrder) {
        handleGetWhenCreateAndUpdateSuccess(false);
      }
    }
  };

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
      price: number;
    }[]
  ) =>
    items.reduce((acc, item) => {
      if (item.price && item.details?.length) {
        return acc + item.price * item.details?.length;
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
      setValue('type_customer', currentOrder?.type_customer || 'bank');
      setValue('note', currentOrder?.note);
      setValue('priceSaleOff', currentOrder?.priceSaleOff);

      const items = currentOrder?.items?.map((item) => ({
        device: item.device?._id as string,
        details: item.details,
        warranty: item.warranty,
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

  const handleInputChangeCustomer = (searchQuery: string) => {
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(filtered);
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
  const handleGetAllCustomer = async () => {
    const customersList = await getListCustomer({ page: 0, items_per_page: 1000 });
    setCustomers(customersList.data);
    setFilteredCustomers(customersList.data);
  };
  useEffect(() => {
    handleGetAllCustomer();
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>


      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} justifyContent="center">
          <Grid xs={12} md={10}>
          <CustomBreadcrumbs
        heading={currentOrder ? 'Chỉnh sửa' : 'Tạo mới'}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Order',
            href: paths.dashboard.order.device,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
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
                  <Stack spacing={1.5} direction="row" width="100%">
                    <RHFAutocomplete
                      name="customer"
                      label="Khách hàng"
                      options={filteredCustomers.map((item) => item?._id)}
                      onInputChange={(_e: React.SyntheticEvent, value: string, reason: string) => {
                        if (reason === 'input') {
                          handleInputChangeCustomer(value);
                        }
                      }}
                      getOptionLabel={(option) =>
                        customers?.find((x) => x._id === option)?.name || ''
                      }
                      sx={{ width: '70%' }}
                    />
                    <RHFAutocomplete
                      sx={{ width: '30%' }}
                      name="type_customer"
                      label="Loại khách hàng"
                      options={['bank', 'private']}
                      getOptionLabel={(option) => (option === 'bank' ? 'Ngân hàng' : 'Tư nhân')}
                    />
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <RHFTextField name="shipBy" label="Giao bởi" />
                </Grid>

                <Grid xs={12}>
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Thiết bị</Typography>


                    {fields?.map((item, index) => (
                     <Fragment key={item?.id}>
                     <Grid container spacing={1} xs={12}>
                       <Grid xs={2}>
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
                           onChange={(e, value) => {
                             setValue(`items.${index}.device`, value as string);
                             setValue(`items.${index}.details`, []);
                           }}
                         />
                       </Grid>

                       <Grid xs={2}>
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

                       <Grid xs={4}>
                         <Controller
                           name={`items.${index}.details`}
                           control={control}
                           render={({ field, fieldState: { error } }) => {
                             const selectedDevice = deviceOptions?.[index]?.find(
                               (x) => x._id === watch(`items.${index}.device`)
                             );

                             const inventoryItems = selectedDevice?.detail
                               ?.filter((x) => x.status === 'inventory')
                               .map((x) => x.id_device) || [];

                             return (
                               <Autocomplete
                                 multiple
                                 value={field.value || []}
                                 onChange={(e, newValue) => {
                                   field.onChange(newValue);
                                 }}
limitTags={1}
                                 options={inventoryItems}
                                 renderInput={(params) => (
                                   <TextField
                                     {...params}
                                     label="ID Sản phẩm"
                                     error={!!error}
                                     helperText={error?.message}
                                     fullWidth
                                   />
                                 )}

                                 disabled={!watch(`items.${index}.device`)}
                                 renderTags={(selected, getTagProps) =>
                                   selected.map((option, i) => (
                                     <Chip
                                       {...getTagProps({ index: i })}
                                       key={option}
                                       label={option}
                                       size="small"

                                     />
                                   ))
                                 }
                               />
                             );
                           }}
                         />
                       </Grid>

                       <Grid xs={2}>
                         <RHFTextField
                           name={`items.${index}.warranty`}
                           label="Bảo hành"
                           type="number"
                           disabled={!watch(`items.${index}.device`)}
                           onKeyDown={(evt) =>
                             ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                           }
                         />
                       </Grid>

                       <Grid xs={1}>
                         <Button
                           variant="contained"
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
                           sx={{ height: '55px' ,width:'100%'}}
                           disabled={fields?.length === 1}
                         >
                           <Iconify icon="eva:trash-2-outline" />
                         </Button>
                       </Grid>

                       {index === 0 && (
                         <Grid xs={1}>
                           <Button
                             variant="contained"
                             color="primary"
                             onClick={() =>
                               append({
                                 device: '',
                                 details: [],
                                 price: 0,
                                 warranty: 0,
                               })
                             }
                             sx={{ height: '55px' ,width:'100%'}}
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
                    <RHFEditor simple name="note"/>
                  </Grid>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          <Grid xs={12} md={10}>
            <Card>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Typography variant="subtitle2">Giá tiền</Typography>
                <Grid xs={12}>
                  <RHFTextFieldFormatVnd
                    name="totalAmount"
                    label="Tổng tiền"
                    onChange={(e) => {
                      const value = Number(e.target.value) || 0;
                      setValue(`totalAmount`, value);
                    }}
                  />
                </Grid>
                <Grid xs={12}>
                  <RHFTextFieldFormatVnd
                    name="priceSaleOff"
                    label="Giảm giá"
                    placeholder="Nhập giá giảm"
                    onChange={(e) => {
                      const value = Number(e.target.value) || 0;
                      setValue(`priceSaleOff`, value);
                    }}
                  />
                </Grid>

                <Grid
                  xs={12}
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}
                >
                  <Typography>
                    Tổng tiền:{' '}
                    {renderMoney(String(watch('totalAmount') - (watch('priceSaleOff') || 0)))}
                  </Typography>
                </Grid>
              </Stack>
            </Card>
          </Grid>

          <Grid
            xs={12}
            md={10}
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
            <Button component={RouterLink} href={paths.dashboard.order.device} variant="contained">
              Hủy
            </Button>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
