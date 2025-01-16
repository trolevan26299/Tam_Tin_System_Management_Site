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
import { debounce } from 'lodash';
import { useState } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import { getLinhKienByName } from 'src/api/linhkien';
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
  _id: undefined,
});

export const optionStatus: option[] = [
  { label: 'Ứng', value: 'Ứng' },
  { label: 'Sửa chữa', value: 'Sửa chữa' },
  { label: 'Bổ sung', value: 'Bổ sung' },
];

function LinhKienTransactionInfo({
  open,
  onClose, // currentItem,
}: {
  open: boolean;
  onClose: () => void;
  // currentItem?: ILinhKienTransaction;
}) {
  const theme = useTheme();
  const { user } = useAuthContext();

  const [linhKien, setLinhKien] = useState<ILinhKien[]>([]);
  const [staff, setStaff] = useState<IStaff[]>([]);

  const NewLinhKienTransactionSchema = Yup.object().shape({
    name_linh_kien: Yup.string().required('Tên là bắt buộc'),
    nhan_vien: Yup.object()
      .required('Nhân viên là bắt buộc')
      .test('is-valid', 'Nhân viên là bắt buộc', (value) => value && (value as any).id !== ''),
    total: Yup.number().required().min(1, 'Số lượng là bắt buộc'),
    type: Yup.string().required('Loại bắt buộc'),
  });

  const methods = useForm<ILinhKienTransaction>({
    resolver: yupResolver(NewLinhKienTransactionSchema),
    defaultValues: initializeDefaultValues(),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: ILinhKienTransaction) => {
    const newData: ILinhKienTransaction = { ...data, nguoi_tao: user?.username };
    console.log(newData);
  };

  const handleInputChangeLinhKien = debounce(async (searchQuery: string) => {
    try {
      if (searchQuery !== '') {
        const response = await getLinhKienByName({ keyword: searchQuery });
        setLinhKien(response.data);
      } else {
        setLinhKien([]);
      }
    } catch (error) {
      console.error('Failed to search linh kien:', error);
    }
  }, 300);

  const handleInputChangeStaff = debounce(async (searchQuery: string) => {
    try {
      if (searchQuery !== '') {
        const response = await getStaffs({ keyword: searchQuery });
        setStaff(response.data);
      } else {
        setStaff([]);
      }
    } catch (error) {
      console.error('Failed to search linh kien:', error);
    }
  }, 300);

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
          mt: 15,
          overflow: 'unset',
        },
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ pb: 2 }}>Tạo mới</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              py: 1,
              px: 2,
              borderBottom: `solid 1px ${theme.palette.divider}`,
              height: '500px',
              overflow: 'auto',
            }}
          >
            <Grid container spacing={3}>
              <Grid xs={12}>
                <RHFAutocomplete
                  name="name_linh_kien"
                  label="Linh kiện"
                  options={linhKien.map((item) => item?._id)}
                  onInputChange={(_e: React.SyntheticEvent, value: string, reason: string) => {
                    if (reason === 'input') {
                      handleInputChangeLinhKien(value);
                    }
                  }}
                  getOptionLabel={(opt) =>
                    linhKien?.find((x) => x._id === opt)?.name_linh_kien || ''
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
                  onInputChange={(_e: React.SyntheticEvent, value: string, reason: string) => {
                    if (reason === 'input') {
                      handleInputChangeStaff(value);
                    }
                  }}
                  isOptionEqualToValue={(opt, value) => opt.id === value.id}
                  getOptionLabel={(opt: any) => staff?.find((x) => x._id === opt?.id)?.name || ''}
                />
              </Grid>

              <Grid xs={12}>
                <RHFTextField name="noi_dung" label="Ghi chú" multiline rows={4} />
              </Grid>
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
