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
  Divider,
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
import { RHFEditor, RHFTextFieldFormatVnd } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { ICustomer } from 'src/types/customer';
import { ILinhKienInfo } from 'src/types/linh-kien';
import {
  ICreateOrderLinhKienDto,
  IOrderLinhKien,
  IUpdateOrderLinhKienDto,
} from 'src/types/order-linh-kien';
import { renderMoney } from 'src/utils/format-number';
import * as Yup from 'yup';

type Props = {
  currentOrder?: IOrderLinhKien;
  isEdit?: boolean;
  open: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
};

interface ILinhKienRow {
  id_linh_kien: string;
  so_luong: number;
}

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
  const [linhKienRows, setLinhKienRows] = useState<ILinhKienRow[]>([
    { id_linh_kien: '', so_luong: 1 },
  ]);

  const OrderLinhKienSchema = Yup.object().shape({
    chi_tiet_linh_kien: Yup.array().of(
      Yup.object().shape({
        id_linh_kien: Yup.string().required('Vui lòng chọn linh kiện'),
        so_luong: Yup.number().required('Vui lòng nhập số lượng').min(1, 'Số lượng phải lớn hơn 0'),
      })
    ),
    id_khach_hang: Yup.string().required('Vui lòng chọn khách hàng'),
    tong_tien: Yup.number().required('Vui lòng nhập tổng tiền').min(1, 'Tổng tiền phải lớn hơn 0'),
    loi_nhuan: Yup.number().required('Vui lòng nhập lợi nhuận').min(0, 'Lợi nhuận không được âm'),
    ghi_chu: Yup.string(),
  });

  /* eslint-disable react-hooks/exhaustive-deps */
  const defaultValues = {
    chi_tiet_linh_kien: [{ id_linh_kien: '', so_luong: 1 }],
    id_khach_hang: '',
    ghi_chu: '',
    tong_tien: 0,
    loi_nhuan: 0,
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

  const handleAddRow = () => {
    setLinhKienRows([...linhKienRows, { id_linh_kien: '', so_luong: 1 }]);
    setValue(`chi_tiet_linh_kien.${linhKienRows.length}`, { id_linh_kien: '', so_luong: 1 });
  };

  const handleRemoveRow = (index: number) => {
    if (linhKienRows.length > 1) {
      const newRows = [...linhKienRows];
      newRows.splice(index, 1);
      setLinhKienRows(newRows);

      const currentChiTiet = watch('chi_tiet_linh_kien');
      if (currentChiTiet) {
        currentChiTiet.splice(index, 1);
        setValue('chi_tiet_linh_kien', currentChiTiet);
      }
    }
  };

  const onSubmit = async (data: ICreateOrderLinhKienDto | IUpdateOrderLinhKienDto) => {
    try {
      // Thêm giá vào chi tiết linh kiện trước khi gửi API
      const chiTietWithPrice = data?.chi_tiet_linh_kien?.map((item) => {
        const linhKien = linhKiens.find((lk) => lk._id === item.id_linh_kien);
        return {
          ...item,
          price: linhKien?.price || 0,
        };
      });
  
      const dataToSubmit = {
        ...data,
        chi_tiet_linh_kien: chiTietWithPrice
      };
      
      if (isEdit && currentOrder) {
        const updated = await updateOrderLinhKien(currentOrder._id, dataToSubmit);
        if (updated) {
          enqueueSnackbar('Cập nhật đơn hàng thành công', { variant: 'success' });
          onSuccess();
          onClose();
        }
      } else {
        const created = await createOrderLinhKien(dataToSubmit as ICreateOrderLinhKienDto);
        if (created) {
          enqueueSnackbar('Tạo đơn hàng thành công', { variant: 'success' });
          onSuccess();
          onClose();
        }
      }
    } catch (error: any) {
      console.log('error', error);
      enqueueSnackbar(error?.response?.data?.error || 'Có lỗi xảy ra', {
        variant: 'error',
      });
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
  }, []);
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (open === true) {
      if (!customerLoaded) {
        handleGetAllCustomer();
      }
      handleGetAllLinhKien();

      if (isEdit && currentOrder) {
        const chiTietRows = currentOrder.chi_tiet_linh_kien.map((item) => ({
          id_linh_kien: item.id_linh_kien._id,
          so_luong: item.so_luong,
        }));
        setLinhKienRows(chiTietRows);

        reset({
          chi_tiet_linh_kien: chiTietRows,
          id_khach_hang: currentOrder.id_khach_hang._id,
          ghi_chu: currentOrder.ghi_chu || '',
          tong_tien: currentOrder.tong_tien,
          loi_nhuan: currentOrder.loi_nhuan || 0,
        });
      } else {
        setLinhKienRows([{ id_linh_kien: '', so_luong: 1 }]);
        reset(defaultValues);
      }
    }
  }, [ // eslint-disable-next-line react-hooks/exhaustive-deps
    isEdit,
    currentOrder,
    reset,
    open,
    customerLoaded,
    handleGetAllLinhKien,
    handleGetAllCustomer,
  ]);

  useEffect(() => {
    let tongGiaGoc = 0;
    linhKienRows.forEach((row) => {
      const selectedLinhKien = linhKiens.find((lk) => lk._id === row.id_linh_kien);
      if (selectedLinhKien) {
        tongGiaGoc += selectedLinhKien.price * row.so_luong;
      }
    });

    const tongTien = watch('tong_tien');
    if (tongTien && tongGiaGoc) {
      const loiNhuan = tongTien - tongGiaGoc;
      setValue('loi_nhuan', loiNhuan > 0 ? loiNhuan : 0);
    }
  }, [watch('tong_tien'), linhKienRows, linhKiens, setValue]); // eslint-disable-line react-hooks/exhaustive-deps

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
                    {linhKienRows.map((row, index) => (
                      <Grid container spacing={2} key={index}>
                        <Grid xs={5}>
                          <Autocomplete
                            fullWidth
                            size="small"
                            options={filteredLinhKiens.map((item) => item._id)}
                            getOptionLabel={(option) =>
                              linhKiens.find((x) => x._id === option)?.name_linh_kien || ''
                            }
                            value={row.id_linh_kien || null}
                            onChange={(_, value) => {
                              const newRows = [...linhKienRows];
                              newRows[index].id_linh_kien = value || '';
                              setLinhKienRows(newRows);
                              setValue(`chi_tiet_linh_kien.${index}.id_linh_kien`, value || '');
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
                                error={
                                  !!methods.formState.errors.chi_tiet_linh_kien?.[index]
                                    ?.id_linh_kien
                                }
                                helperText={
                                  methods.formState.errors.chi_tiet_linh_kien?.[index]?.id_linh_kien
                                    ?.message
                                }
                              />
                            )}
                          />
                        </Grid>
                        <Grid xs={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Số lượng"
                            type="number"
                            value={row.so_luong === 0 ? '' : row.so_luong} // Thay đổi ở đây
                            onChange={(e) => {
                              const { value } = e.target;
                              const newRows = [...linhKienRows];

                              if (value === '') {
                                newRows[index].so_luong = 0;
                                setLinhKienRows(newRows);
                                setValue(`chi_tiet_linh_kien.${index}.so_luong`, 0);
                                return;
                              }

                              const numValue = parseInt(value, 10);
                              if (!Number.isNaN(numValue) && numValue >= 0) {
                                newRows[index].so_luong = numValue;
                                setLinhKienRows(newRows);
                                setValue(`chi_tiet_linh_kien.${index}.so_luong`, numValue);
                              }
                            }}
                            onBlur={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (!value || value <= 0) {
                                const newRows = [...linhKienRows];
                                newRows[index].so_luong = 1;
                                setLinhKienRows(newRows);
                                setValue(`chi_tiet_linh_kien.${index}.so_luong`, 1);
                              }
                            }}
                            error={!!methods.formState.errors.chi_tiet_linh_kien?.[index]?.so_luong}
                            helperText={
                              methods.formState.errors.chi_tiet_linh_kien?.[index]?.so_luong
                                ?.message
                            }
                          />
                        </Grid>

                        <Grid xs={2}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="error"
                            onClick={() => handleRemoveRow(index)}
                            disabled={linhKienRows.length === 1}
                          >
                            Xóa
                          </Button>
                        </Grid>
                        {index === linhKienRows.length - 1 && (
                          <Grid xs={2}>
                            <Button
                              fullWidth
                              variant="contained"
                              color="primary"
                              onClick={handleAddRow}
                            >
                              Thêm
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    ))}

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

                    <RHFTextFieldFormatVnd
                      name="loi_nhuan"
                      label="Lợi nhuận"
                      value={renderMoney(String(watch('loi_nhuan')))}
                      InputProps={{
                        readOnly: true,
                      }}
                    />

                    <RHFEditor simple name="ghi_chu" />
                  </Stack>
                </Stack>
              </Card>
            </Grid>

            <Grid xs={12} md={4}>
              <Card sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Typography variant="h6">Thông tin linh kiện</Typography>
                  {linhKienRows.map((row, index) => {
                    const selectedLinhKien = linhKiens.find((lk) => lk._id === row.id_linh_kien);
                    if (!selectedLinhKien) return null;

                    return (
                      <Stack spacing={1} key={index}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2">Tên linh kiện:</Typography>
                          <Typography variant="subtitle2">
                            {selectedLinhKien.name_linh_kien}
                          </Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2">Số lượng trong kho:</Typography>
                          <Typography variant="subtitle2">{selectedLinhKien.total}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2">Giá linh kiện:</Typography>
                          <Typography variant="subtitle2">
                            {renderMoney(String(selectedLinhKien.price))}
                          </Typography>
                        </Stack>
                        {index < linhKienRows.length - 1 && <Divider />}
                      </Stack>
                    );
                  })}
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
