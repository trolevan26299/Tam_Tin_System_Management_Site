import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DefaultValues, useForm } from 'react-hook-form';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { IDevice } from 'src/types/product';
import * as Yup from 'yup';
import { option } from '../user/user-info';

export type deviceInfo = {
  name: string;
  id_device: string;
  warranty?: string;
  belong_to?: string;
  delivery_date?: string;
  note?: string;
  status: 'inventory' | 'sold';
  category_id?: string;
};

const defaultValues: DefaultValues<deviceInfo> = {
  name: '',
  id_device: '',
  category_id: '',
  status: 'inventory',
};

const optionStatus: option[] = [
  { label: 'inventory', value: 'inventory' },
  { label: 'sold', value: 'sold' },
];

export default function DeviceInfo({
  currentDevice,
  getDeviceList,
  open,
  onClose,
}: {
  currentDevice?: IDevice;
  open: boolean;
  onClose: () => void;
  getDeviceList: () => void;
}) {
  const theme = useTheme();
  const NewDevice = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    id_device: Yup.string().required('id_device is required'),
  });

  const methods = useForm<deviceInfo>({
    resolver: yupResolver(NewDevice),
    defaultValues,
  });
  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('🚀 ~ onSubmit ~ data:', data);
  });
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
        <DialogTitle sx={{ pb: 2 }}>
          {!currentDevice ? 'Create Device' : 'Update Device'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 3, borderBottom: `solid 1px ${theme.palette.divider}` }}>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <RHFTextField name="name" label="Name" />
              </Grid>
              <Grid xs={12}>
                <RHFTextField name="id_device" label="Id Device" />
              </Grid>
              <Grid xs={12}>
                <RHFSelect name="status" label="Status">
                  {optionStatus?.map((item: option, index) => (
                    <MenuItem value={item?.value} key={index}>
                      {item?.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <LoadingButton color="inherit" type="submit" variant="contained" loading={isSubmitting}>
            Save
          </LoadingButton>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
