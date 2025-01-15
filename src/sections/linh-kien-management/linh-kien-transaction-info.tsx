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
import FormProvider, { RHFAutocomplete, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { ILinhKien, ILinhKienTransaction } from 'src/types/linh-kien';
import * as Yup from 'yup';
import { option } from '../user/user-info';

const initializeDefaultValues = (): DefaultValues<ILinhKienTransaction> => ({
  name_linh_kien: '',
  nhan_vien: {
    id: '',
    name: '',
  },
  total: 0,
  type: 'Ứng',
  noi_dung: undefined,
  nguoi_tao: undefined,
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

  const [linhKien, setLinhKien] = useState<ILinhKien[]>([]);

  const NewLinhKienTransactionSchema = Yup.object().shape({
    name_linh_kien: Yup.string().required('Tên là bắt buộc'),
    nhan_vien: Yup.object().shape({
      id: Yup.string().required('id là bắt buột'),
      name: Yup.string().required('Tên là bắt buột'),
    }),
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
    console.log(data);
  };

  const handleInputChangeLinhKien = debounce(async (searchQuery: string) => {
    try {
      const response = await getLinhKienByName({ keyword: searchQuery });
      setLinhKien(response);
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
                <RHFTextField name="total" label="Tổng" />
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
