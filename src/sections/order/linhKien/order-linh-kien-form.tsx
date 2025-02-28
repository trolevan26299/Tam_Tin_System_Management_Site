import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/system/Unstable_Grid/Grid';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getListCustomer } from 'src/api/customer';
import { getListLinhKien } from 'src/api/linhkien';
import { createOrderLinhKien, updateOrderLinhKien } from 'src/api/order-linh-kien';
import { RHFEditor, RHFTextField, RHFTextFieldFormatVnd } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { ICustomer } from 'src/types/customer';
import { ILinhKienInfo } from 'src/types/linh-kien';
import {
  ICreateOrderLinhKienDto,
  IOrderLinhKien,
  IUpdateOrderLinhKienDto,
} from 'src/types/order-linh-kien';
import * as Yup from 'yup';

type Props = {
  currentOrder?: IOrderLinhKien;
  isEdit?: boolean;
  open: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
};

export default function OrderLinhKienForm({
  currentOrder,
  isEdit = false,
  open,
  onClose,
  onSuccess,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<ICustomer[]>([]);
  const [linhKiens, setLinhKiens] = useState<ILinhKienInfo[]>([]);
  const [filteredLinhKiens, setFilteredLinhKiens] = useState<ILinhKienInfo[]>([]);
  const [customerLoaded, setCustomerLoaded] = useState(false);
  const [soLuongInput, setSoLuongInput] = useState('');

  const OrderLinhKienSchema = Yup.object().shape({
    id_linh_kien: Yup.string().required('Vui lòng chọn linh kiện'),
    so_luong: Yup.number().required('Vui lòng nhập số lượng').min(1, 'Số lượng phải lớn hơn 0'),
    id_khach_hang: Yup.string().required('Vui lòng chọn khách hàng'),
    tong_tien: Yup.number().required('Vui lòng nhập tổng tiền').min(1, 'Tổng tiền phải lớn hơn 0'),
    ghi_chu: Yup.string(),
  });

  const defaultValues = {
    id_linh_kien: '',
    so_luong: 1,
    id_khach_hang: '',
    ghi_chu: '',
    tong_tien: 0,
  };

  const methods = useForm({
    resolver: yupResolver(OrderLinhKienSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: ICreateOrderLinhKienDto | IUpdateOrderLinhKienDto) => {
    try {
      if (isEdit && currentOrder) {
        const updated = await updateOrderLinhKien(currentOrder._id, data, enqueueSnackbar);
        if (updated) {
          enqueueSnackbar('Cập nhật đơn hàng thành công', { variant: 'success' });
          onSuccess();
          onClose();
        }
      } else {
        const created = await createOrderLinhKien(data as ICreateOrderLinhKienDto, enqueueSnackbar);
        if (created) {
          enqueueSnackbar('Tạo đơn hàng thành công', { variant: 'success' });
          onSuccess();
          onClose();
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleInputChangeCustomer = (searchQuery: string) => {
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleInputChangeLinhKien = (searchQuery: string) => {
    const filtered = linhKiens.filter((linhKien) =>
      linhKien.name_linh_kien.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLinhKiens(filtered);
  };

  const handleGetAllCustomer = useCallback(async () => {
    if (customerLoaded) return;

    try {
      const customersList = await getListCustomer({ page: 0, items_per_page: 1000 });
      setCustomers(customersList.data);
      setFilteredCustomers(customersList.data);
      setCustomerLoaded(true);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  }, [customerLoaded]);

  const handleGetAllLinhKien = useCallback(async () => {
    try {
      const linhKienList = await getListLinhKien({ page: 0, items_per_page: 1000 });
      setLinhKiens(linhKienList.data);
      setFilteredLinhKiens(linhKienList.data);
    } catch (error) {
      console.error('Failed to fetch linh kien:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open === true]);

  useEffect(() => {
    if (open === true) {
      if (!customerLoaded) {
        handleGetAllCustomer();
      }
      if (isEdit && currentOrder) {
        reset({
          id_linh_kien: currentOrder.id_linh_kien._id,
          so_luong: currentOrder.so_luong,
          id_khach_hang: currentOrder.id_khach_hang._id,
          ghi_chu: currentOrder.ghi_chu || '',
          tong_tien: currentOrder.tong_tien,
        });
      } else {
        reset(defaultValues);
      }

      if (isEdit && currentOrder) {
        setSoLuongInput(String(currentOrder.so_luong));
      } else {
        setSoLuongInput('1');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentOrder, reset, open, customerLoaded]);

  useEffect(() => {
    if (open === true) {
      handleGetAllLinhKien();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open === true]);

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>{isEdit ? 'Chỉnh sửa đơn hàng' : 'Tạo đơn hàng mới'}</DialogTitle>

      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Typography variant="h6">Thông tin đơn hàng</Typography>

                  <Stack spacing={2}>
                    <Autocomplete
                      fullWidth
                      options={filteredLinhKiens.map((item) => item._id)}
                      getOptionLabel={(option) =>
                        linhKiens.find((x) => x._id === option)?.name_linh_kien || ''
                      }
                      value={watch('id_linh_kien') || null}
                      onChange={(_, value) => {
                        setValue('id_linh_kien', value || '');
                      }}
                      onInputChange={(_, value, reason) => {
                        if (reason === 'input') {
                          handleInputChangeLinhKien(value);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Linh kiện"
                          error={!!methods.formState.errors.id_linh_kien}
                          helperText={methods.formState.errors.id_linh_kien?.message}
                        />
                      )}
                    />

                    <TextField
                      fullWidth
                      label="Số lượng"
                      type="number"
                      value={soLuongInput}
                      onChange={(e) => {
                        setSoLuongInput(e.target.value);

                        if (e.target.value === '') {
                          // Không cập nhật giá trị form khi đang xóa
                        } else {
                          const value = parseInt(e.target.value, 10);
                          if (!Number.isNaN(value) && value > 0) {
                            setValue('so_luong', value);
                          }
                        }
                      }}
                      onBlur={() => {
                        const value = soLuongInput === '' ? 0 : parseInt(soLuongInput, 10);
                        const validValue = value > 0 ? value : 1;
                        setSoLuongInput(String(validValue));
                        setValue('so_luong', validValue);
                      }}
                      onKeyDown={(evt) =>
                        ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                      }
                      error={!!methods.formState.errors.so_luong}
                      helperText={methods.formState.errors.so_luong?.message}
                    />

                    <Autocomplete
                      fullWidth
                      options={filteredCustomers.map((item) => item._id)}
                      getOptionLabel={(option) =>
                        customers.find((x) => x._id === option)?.name || ''
                      }
                      value={watch('id_khach_hang') || null}
                      onChange={(_, value) => {
                        setValue('id_khach_hang', value || '');
                      }}
                      onInputChange={(_, value, reason) => {
                        if (reason === 'input') {
                          handleInputChangeCustomer(value);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Khách hàng"
                          error={!!methods.formState.errors.id_khach_hang}
                          helperText={methods.formState.errors.id_khach_hang?.message}
                        />
                      )}
                    />

                    <RHFTextFieldFormatVnd
                      name="tong_tien"
                      label="Tổng tiền"
                      onChange={(e) => {
                        const value = Number(e.target.value) || 0;
                        setValue('tong_tien', value);
                      }}
                    />

                    <RHFEditor simple name="ghi_chu" />
                  </Stack>
                </Stack>
              </Card>
            </Grid>

            <Grid xs={12} md={4}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Typography variant="h6">Thông tin linh kiện</Typography>

                  {watch('id_linh_kien') && (
                    <Stack spacing={2}>
                      {(() => {
                        const selectedLinhKien = linhKiens.find(
                          (lk) => lk._id === watch('id_linh_kien')
                        );
                        return (
                          <>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2">Tên linh kiện:</Typography>
                              <Typography variant="subtitle2">
                                {selectedLinhKien?.name_linh_kien}
                              </Typography>
                            </Stack>

                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2">Số lượng trong kho:</Typography>
                              <Typography variant="subtitle2">{selectedLinhKien?.total}</Typography>
                            </Stack>
                          </>
                        );
                      })()}
                    </Stack>
                  )}
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Hủy
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          {isEdit ? 'Cập nhật' : 'Tạo mới'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
