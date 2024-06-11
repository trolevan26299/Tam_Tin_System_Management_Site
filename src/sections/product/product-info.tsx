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
import { debounce } from 'lodash';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import { getListCustomer } from 'src/api/customer';
import { createDevice, updateDeviceById } from 'src/api/product';
import { RHFAutocomplete, RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { ISubCategory } from 'src/types/category';
import { ICustomer } from 'src/types/customer';
import { IDevice } from 'src/types/product';
import uuidv4 from 'src/utils/uuidv4';
import * as Yup from 'yup';

export type deviceInfo = {
  _id?: string;
  name: string;
  sub_category_id: string;
  price: number;
  warranty: number;
  quantity: number;

  id_device?: string;
  belong_to?: string;
  note?: string;
};

export default function DeviceInfo({
  currentDevice,
  getDeviceList,
  open,
  onClose,
  listSubCategory,
}: {
  currentDevice?: IDevice;
  open: boolean;
  onClose: () => void;
  getDeviceList: () => void;
  listSubCategory: ISubCategory[];
}) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [customers, setCustomers] = useState<ICustomer[]>([]);

  const initializeDefaultValues = (): DefaultValues<deviceInfo> => ({
    _id: undefined,
    name: '',
    id_device: uuidv4() as string,
    warranty: undefined,
    belong_to: '',
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

    price: Yup.number().required('Price is required !'),
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
    const newDate: IDevice = {
      _id: data?._id,
      name: data?.name,
      id_device: data?.id_device as string,
      sub_category_id: data?.sub_category_id,
      belong_to: data?.belong_to as string,
      price: data?.price,
      note: data?.note,
      warranty: data?.warranty,
      status: [
        {
          status: 'inventory',
          quantity: data?.quantity,
        },
      ],
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

  const handleInputChangeCustomer = debounce(async (searchQuery: string) => {
    try {
      const response = await getListCustomer({ keyword: searchQuery });
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to search devices:', error);
    }
  }, 300);

  useEffect(() => {
    if (currentDevice) {
      const temp = { ...(currentDevice as IDevice & { belong_to: ICustomer }) };
      Object.keys(temp).forEach((key: any) => {
        setValue(key, (temp as any)?.[key]);
      });
      setValue('quantity', temp?.status?.[0]?.quantity);
      setValue('belong_to', (temp?.belong_to as any)?._id);
      setCustomers([temp?.belong_to]);
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
                <RHFAutocomplete
                  name="belong_to"
                  label="Belong to"
                  options={customers.map((item: ICustomer) => item?._id)}
                  onInputChange={(_e: React.SyntheticEvent, value: string, reason: string) => {
                    if (reason === 'input') {
                      handleInputChangeCustomer(value);
                    }
                  }}
                  getOptionLabel={(option) =>
                    (customers?.find((x: ICustomer) => x._id === option)?.name || '') as any
                  }
                />
              </Grid>

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
