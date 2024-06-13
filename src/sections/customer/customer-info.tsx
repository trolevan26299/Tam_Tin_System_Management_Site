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
import Grid from '@mui/system/Unstable_Grid/Grid';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import { createCustomer, updateCustomerById } from 'src/api/customer';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { ICustomer } from 'src/types/customer';
import * as Yup from 'yup';
import { option } from '../user/user-info';

const initializeDefaultValues = (): DefaultValues<ICustomer> => ({
  _id: undefined,
  name: '',
  address: '',
  phone: '',
  type: '',
  email: '',
  note: '',
});

export const optionStatus: option[] = [
  { label: 'Ngân hàng', value: 'bank' },
  { label: 'Cá nhân', value: 'private' },
];

function CustomerInfo({
  currentCustomer,
  getCustomerList,
  open,
  onClose,
}: {
  currentCustomer?: ICustomer;
  open: boolean;
  onClose: () => void;
  getCustomerList: () => void;
}) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const NewCategory = Yup.object().shape({
    name: Yup.string().required('Name is required !'),
    address: Yup.string().required('Address is required !'),
    phone: Yup.string().required('Phone is required !'),
    type: Yup.string().required('Type is required !'),
    email: Yup.string().required('Email is required !'),
    note: Yup.string(),
  });

  const handleGetWhenCreateAndUpdateSuccess = (value: boolean) => {
    getCustomerList();
    enqueueSnackbar(value ? 'Update success!' : 'Create success!', {
      variant: 'success',
    });
    onClose();
  };

  const methods = useForm<ICustomer>({
    resolver: yupResolver(NewCategory),
    defaultValues: initializeDefaultValues(),
  });
  const {
    setValue,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (data?._id) {
      const updateCustomer = await updateCustomerById(data?._id, data, enqueueSnackbar);
      if (updateCustomer) {
        handleGetWhenCreateAndUpdateSuccess(!currentCustomer);
      }
    } else {
      const newCustomer = await createCustomer(data, enqueueSnackbar);
      if (newCustomer) {
        handleGetWhenCreateAndUpdateSuccess(!currentCustomer);
      }
    }
  });

  useEffect(() => {
    if (currentCustomer) {
      Object.keys(currentCustomer).forEach((key: any) => {
        setValue(key, (currentCustomer as any)?.[key]);
      });
    } else {
      const newDefaultValues = initializeDefaultValues();
      Object.keys(newDefaultValues).forEach((key: any) => {
        setValue(key, (newDefaultValues as any)?.[key]);
      });
    }
    clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCustomer]);
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
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle sx={{ pb: 2 }}>{!currentCustomer ? 'Tạo mới' : 'Cập nhật'}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              p: 3,
              borderBottom: `solid 1px ${theme.palette.divider}`,
            }}
          >
            <Grid container spacing={3}>
              <Grid xs={12}>
                <RHFTextField name="name" label="Tên" />
              </Grid>
              <Grid xs={12}>
                <RHFTextField name="address" label="Địa chỉ" />
              </Grid>
              <Grid xs={12}>
                <RHFTextField name="phone" label="Phone" />
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
                <RHFTextField name="email" label="Email" />
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

export default CustomerInfo;
