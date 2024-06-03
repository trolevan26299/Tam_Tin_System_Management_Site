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
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { Controller, DefaultValues, useForm } from 'react-hook-form';
import { createDevice, updateDeviceById } from 'src/api/product';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { ISubCategory } from 'src/types/category';
import { ICustomer } from 'src/types/customer';
import { IDevice } from 'src/types/product';
import uuidv4 from 'src/utils/uuidv4';
import * as Yup from 'yup';
import { option } from '../user/user-info';

export type deviceInfo = {
  _id?: string;
  name: string;
  sub_category_id: string;
  price: number;
  status?: string;
  warranty: number;
  quantity: number;

  id_device?: string;
  belong_to?: string;
  delivery_date?: string;
  note?: string;
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
  listSubCategory,
  listCustomer,
}: {
  currentDevice?: IDevice;
  open: boolean;
  onClose: () => void;
  getDeviceList: () => void;
  listSubCategory: ISubCategory[];
  listCustomer: ICustomer[];
}) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const initializeDefaultValues = (): DefaultValues<deviceInfo> => ({
    _id: undefined,
    name: '',
    id_device: uuidv4() as string,
    status: '',
    warranty: undefined,
    belong_to: '',
    delivery_date: '',
    note: '',
    sub_category_id: '',
    price: undefined,
    quantity: undefined,
  });

  const NewDevice = Yup.object().shape({
    name: Yup.string().required('Name is required !'),
    sub_category_id: Yup.string().required('Sub category is required !'),
    warranty: Yup.number().required('warranty is required !'),
    quantity: Yup.number().required('quantity is required !'),
    delivery_date: Yup.string().when('status', {
      is: 'sold',
      then: (schema) => schema.required('Delivery date is required when the status is sold!'),
      otherwise: (schema) => schema.notRequired(),
    }),
    price: Yup.number().required('Price is required !'),
    status: Yup.string(),
    id_device: Yup.string(),
  });

  const methods = useForm<deviceInfo>({
    resolver: yupResolver(NewDevice),
    defaultValues: initializeDefaultValues(),
  });
  const {
    setValue,
    handleSubmit,
    clearErrors,
    watch,
    control,
    formState: { isSubmitting },
  } = methods;

  const handleGetWhenCreateAndUpdateSuccess = (value: boolean) => {
    getDeviceList();
    enqueueSnackbar(value ? 'Update success!' : 'Create success!', {
      variant: 'success',
    });
    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    const deliveryDate = data?.delivery_date
      ? format(new Date(data.delivery_date), 'yyyy-MM-dd')
      : '';
    const newDate = {
      ...data,
      delivery_date: deliveryDate,
      status: 'inventory',
    };
    if (newDate?._id) {
      const updateDevice = await updateDeviceById(newDate?._id, newDate as IDevice);
      if (updateDevice) {
        handleGetWhenCreateAndUpdateSuccess(!!currentDevice);
      }
    } else {
      const newDevice = await createDevice(newDate as IDevice);
      if (newDevice) {
        handleGetWhenCreateAndUpdateSuccess(!currentDevice);
      }
    }
  });

  useEffect(() => {
    if (currentDevice) {
      Object.keys(currentDevice).forEach((key: any) => {
        setValue(key, (currentDevice as any)?.[key]);
      });
    } else {
      const newDefaultValues = initializeDefaultValues();
      Object.keys(newDefaultValues).forEach((key: any) => {
        setValue(key, (newDefaultValues as any)?.[key]);
      });
    }
    clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDevice, open]);
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
        <DialogTitle sx={{ pb: 2 }}>
          {!currentDevice ? 'Create Device' : 'Update Device'}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              p: 3,
              borderBottom: `solid 1px ${theme.palette.divider}`,
              height: '600px',
              overflow: 'auto',
            }}
          >
            <Grid container spacing={3}>
              <Grid xs={12}>
                <RHFTextField name="name" label="Name" />
              </Grid>
              <Grid xs={12}>
                <RHFTextField name="id_device" label="Id Device" disabled />
              </Grid>
              <Grid xs={12}>
                <RHFTextField
                  name="warranty"
                  label="Warranty"
                  type="number"
                  onKeyDown={(evt) =>
                    ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                  }
                />
              </Grid>
              <Grid xs={12}>
                <RHFSelect name="belong_to" label="Belong to">
                  {listCustomer?.map((item: ICustomer) => (
                    <MenuItem value={item._id} key={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
              {watch('status') === 'sold' && (
                <Grid xs={12}>
                  <Controller
                    name="delivery_date"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        {...field}
                        value={new Date(String(field?.value) || '')}
                        label="Delivery date"
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
              )}
              <Grid xs={12}>
                <RHFSelect name="sub_category_id" label="Sub Category">
                  {listSubCategory?.map((item: ISubCategory) => (
                    <MenuItem value={item?._id} key={item?._id}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
              <Grid xs={12}>
                <RHFTextField
                  name="price"
                  label="Price"
                  type="number"
                  onKeyDown={(evt) =>
                    ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                  }
                />
              </Grid>
              <Grid xs={12}>
                <RHFTextField
                  name="quantity"
                  label="Quantity"
                  type="number"
                  onKeyDown={(evt) =>
                    ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                  }
                />
              </Grid>
              <Grid xs={12}>
                <RHFTextField name="note" label="Note" multiline rows={4} />
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
