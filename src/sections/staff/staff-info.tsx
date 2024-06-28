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
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { IStaff } from 'src/types/staff';
import * as Yup from 'yup';

const initializeDefaultValues = (): DefaultValues<IStaff> => ({
  name: '',
  address: '',
  age: undefined,
  salary: undefined,
  position: '',
  exp: undefined,
  phone: '',
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
    address: Yup.string().required('Address is required'),
    age: Yup.number().required('Age is required !'),
    salary: Yup.number().required('Salary is required'),
    position: Yup.string().required('Position is required'),
    exp: Yup.number().required('Exp is required'),
    phone: Yup.string().required('Phone is required'),
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
        <DialogTitle sx={{ pb: 2 }}>{!currentStaff ? 'Tạo mới' : 'Cập nhật'}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              p: 3,
              borderBottom: `solid 1px ${theme.palette.divider}`,
              height: '710px',
              overflow: 'auto',
            }}
          >
            <Grid container spacing={3}>
              <Grid xs={12}>
                <RHFTextField name="name" label="Tên nhân viên" />
              </Grid>

              <Grid xs={12}>
                <RHFTextField name="address" label="Địa chỉ" />
              </Grid>

              <Grid xs={12}>
                <RHFTextField
                  name="age"
                  label="Tuổi"
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

              <Grid xs={12}>
                <RHFTextField name="position" label="Vị trí" />
              </Grid>

              <Grid xs={12}>
                <RHFTextField
                  name="exp"
                  label="Kinh nghiệm"
                  type="number"
                  onKeyDown={(evt) =>
                    ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                  }
                />
              </Grid>

              <Grid xs={12}>
                <RHFTextField name="phone" label="Phone" />
              </Grid>

              <Grid xs={12}>
                <RHFTextField name="note" label="Ghi chú" multiline rows={4} />
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
