import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import { createStaff, updateStaffById } from 'src/api/staff';
import { RHFSwitch, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { IStaff } from 'src/types/staff';
import * as Yup from 'yup';

const initializeDefaultValues = (): DefaultValues<IStaff> => ({
  name: '',
  address: '',
  active: true,
  age: undefined,
  salary: undefined,
  position: '',
  exp: undefined,
  phone: '',
  username_telegram: '',
  user_id_telegram: '',
  note: '',
});

function StaffInfo({
  currentStaff,
  getStaffList,
  open,
  onClose,
}: {
  currentStaff?: IStaff;
  open: boolean;
  onClose: () => void;
  getStaffList: () => void;
}) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const NewStaff = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    address: Yup.string(),
    active: Yup.boolean(),
    age: Yup.number(),
    salary: Yup.number(),
    position: Yup.string(),
    exp: Yup.number(),
    phone: Yup.string(),
    username_telegram: Yup.string(),
    user_id_telegram: Yup.string(),
    note: Yup.string(),
  });

  const methods = useForm<IStaff>({
    resolver: yupResolver(NewStaff),
    defaultValues: initializeDefaultValues(),
  });

  const {
    setValue,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting },
  } = methods;

  const handleGetWhenCreateAndUpdateSuccess = (value: boolean) => {
    getStaffList();
    enqueueSnackbar(value ? 'Update success!' : 'Create success!', {
      variant: 'success',
    });
    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    if (currentStaff) {
      const updateStaff = await updateStaffById(String(data?._id), data);
      if (updateStaff) {
        handleGetWhenCreateAndUpdateSuccess(!!currentStaff);
      }
    } else {
      const newStaff = await createStaff(data as IStaff);
      if (newStaff) {
        handleGetWhenCreateAndUpdateSuccess(!currentStaff);
      }
    }
  });

  useEffect(() => {
    if (currentStaff) {
      Object.keys(currentStaff).forEach((key: any) => {
        setValue(key, (currentStaff as any)?.[key]);
      });
    } else {
      const newDefaultValues = initializeDefaultValues();
      Object.keys(newDefaultValues).forEach((key: any) => {
        setValue(key, (newDefaultValues as any)?.[key]);
      });
    }
    clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStaff, open]);
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
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle sx={{ pb: 0 ,pl:5}}>{!currentStaff ? 'Tạo mới' : 'Cập nhật'}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              p: 2,
              borderBottom: `solid 1px ${theme.palette.divider}`,
              height: '620px',
              overflow: 'auto',
            }}
          >
            <Grid container spacing={2}>
            <Grid xs={12} display="flex" className="" justifyContent="flex-start">
                <RHFSwitch name="active" label="Hoạt động" />
              </Grid>
              <Grid xs={12}>
                <RHFTextField name="name" label="Tên nhân viên" />
              </Grid>

              <Grid xs={6}>
                <RHFTextField
                  name="age"
                  label="Tuổi"
                  type="number"
                  onKeyDown={(evt) =>
                    ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                  }
                />
              </Grid>

              <Grid xs={6}>
                <RHFTextField name="phone" label="Số điện thoại" />
              </Grid>

              <Grid xs={12}>
                <RHFTextField name="address" label="Địa chỉ" />
              </Grid>

              {/* Thông tin công việc */}
              <Grid xs={6}>
                <RHFTextField name="position" label="Vị trí" />
              </Grid>

              <Grid xs={6}>
                <RHFTextField
                  name="exp"
                  label="Kinh nghiệm (năm)"
                  type="number"
                  onKeyDown={(evt) =>
                    ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                  }
                />
              </Grid>

              <Grid xs={12}>
                <RHFTextField
                  name="salary"
                  label="Lương"
                  type="number"
                  onKeyDown={(evt) =>
                    ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                  }
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              {/* Thông tin Telegram */}
              <Grid xs={6}>
                <RHFTextField name="username_telegram" label="Username Telegram" />
              </Grid>

              <Grid xs={6}>
                <RHFTextField name="user_id_telegram" label="UserId Telegram" />
              </Grid>

              <Grid xs={12}>
                <RHFTextField name="note" label="Ghi chú" multiline rows={3} />
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

export default StaffInfo;
