import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import {
  createTransactionLinhKien,
  updateTransactionLinhKien,
  useGetLinhKien,
} from 'src/api/linhkien';
import { getStaffs } from 'src/api/staff';
import { useAuthContext } from 'src/auth/hooks';
import FormProvider, { RHFAutocomplete, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { ILinhKien, ILinhKienTransaction } from 'src/types/linh-kien';
import { IStaff } from 'src/types/staff';
import * as Yup from 'yup';
import { option } from '../user/user-info';

const initializeDefaultValues = (): DefaultValues<ILinhKienTransaction> => ({
  name_linh_kien: '',
  nhan_vien: {
    id: '',
  },
  total: 0,
  type: 'Ứng',
  noi_dung: undefined,
  passcode: undefined,
  _id: undefined,
});

export const optionStatus: option[] = [
  { label: 'Ứng', value: 'Ứng' },
  { label: 'Sửa chữa', value: 'Sửa chữa' },
  { label: 'Bổ sung', value: 'Bổ sung' },
];

function LinhKienTransactionInfo({
  open,
  onClose,
  currentItem,
  onSearch,
}: {
  open: boolean;
  onClose: () => void;
  currentItem?: ILinhKienTransaction;
  onSearch: () => void;
}) {
  const theme = useTheme();

  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const [staff, setStaff] = useState<IStaff[]>([]);

  const NewLinhKienTransactionSchema = Yup.object().shape({
    name_linh_kien: Yup.string().required('Tên là bắt buộc'),
    nhan_vien: Yup.object()
      .required('Nhân viên là bắt buộc')
      .test('is-valid', 'Nhân viên là bắt buộc', (value) => value && (value as any).id !== ''),
    total: Yup.number().required().min(1, 'Số lượng là bắt buộc'),
    type: Yup.string().required('Loại bắt buộc'),
    passcode: Yup.number().when('_id', {
      is: (id: string) => !!id,
      then: (schema) => schema.required('Passcode là bắt buộc').min(4, 'Passcode ít nhất 4 ký tự'),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const methods = useForm<ILinhKienTransaction>({
    resolver: yupResolver(NewLinhKienTransactionSchema),
    defaultValues: initializeDefaultValues(),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    clearErrors,
    setValue,
  } = methods;

  const onSubmit = async (data: ILinhKienTransaction) => {
    const newData: ILinhKienTransaction = { ...data, nguoi_tao: user?.username };
    if (newData._id) {
      await updateTransactionLinhKien(newData, enqueueSnackbar);
    } else {
      await createTransactionLinhKien(newData, enqueueSnackbar);
    }
    onSearch();
    onClose();
  };

  const handleSetDataToForm = () => {
    if (currentItem) {
      setValue('_id', currentItem._id);
      setValue('total', currentItem.total);
      setValue('noi_dung', currentItem.noi_dung);
      setValue('type', currentItem.type);
      setValue('name_linh_kien', currentItem.name_linh_kien);
      if (currentItem?.nhan_vien) {
        setValue('nhan_vien', { id: currentItem.nhan_vien?.id, name: currentItem.nhan_vien?.name });
      }
      setValue('passcode', undefined);
    } else {
      reset();
    }
  };

  useEffect(() => {
    handleSetDataToForm();
    clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem, clearErrors, open]);

  const { data: linhKienList, mutate } = useGetLinhKien();
  const getStaff = async () => {
    const response = await getStaffs({ is_all: true });
    setStaff(response.data);
  };

  useEffect(() => {
    if (open) {
      mutate();
      getStaff();
    }
  }, [open, mutate]);
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
        },
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ pb: 2 }}>{currentItem ? 'Cập nhật' : 'Tạo mới'}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              py: 1,
              px: 2,
              borderBottom: `solid 1px ${theme.palette.divider}`,
              height: currentItem ? '530px' : '455px',
              overflow: 'auto',
            }}
          >
            <Grid container spacing={3}>
              <Grid xs={12}>
                <RHFAutocomplete
                  name="name_linh_kien"
                  label="Linh kiện"
                  options={linhKienList?.map((item: ILinhKien) => item?.name_linh_kien) || []}
                  getOptionLabel={(opt) => (typeof opt === 'string' ? opt : '')}
                  filterOptions={(options, { inputValue }) =>
                    options.filter((opt: any) =>
                      opt.toLowerCase().includes(inputValue.toLowerCase())
                    )
                  }
                />
              </Grid>

              <Grid xs={12}>
                <RHFSelect name="type" label="Kiểu">
                  {optionStatus?.map((item: option, index: number) => (
                    <MenuItem value={item?.value} key={index}>
                      {item?.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>

              <Grid xs={12}>
                <RHFTextField
                  name="total"
                  label="Tổng"
                  type="number"
                  onKeyDown={(evt) =>
                    ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                  }
                />
              </Grid>

              <Grid xs={12}>
                <RHFAutocomplete
                  name="nhan_vien"
                  label="Nhân viên"
                  options={staff.map((item) => ({ id: item?._id, name: item?.name }))}
                  getOptionLabel={(opt: any) => staff?.find((x) => x._id === opt?.id)?.name || ''}
                  filterOptions={(options, { inputValue }) =>
                    options.filter((opt: any) =>
                      opt.name.toLowerCase().includes(inputValue.toLowerCase())
                    )
                  }
                />
              </Grid>

              <Grid xs={12}>
                <RHFTextField name="noi_dung" label="Ghi chú" multiline rows={4} />
              </Grid>

              {currentItem?._id && (
                <Grid xs={12}>
                  <RHFTextField
                    name="passcode"
                    label="Pass code"
                    type="number"
                    onKeyDown={(evt) =>
                      ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                    }
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <LoadingButton color="inherit" type="submit" variant="contained" loading={isSubmitting}>
            Lưu
          </LoadingButton>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Hủy
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

export default LinhKienTransactionInfo;
