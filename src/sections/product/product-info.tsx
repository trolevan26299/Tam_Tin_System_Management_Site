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
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import { createDevice } from 'src/api/product';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { ISubCategory } from 'src/types/category';
import { IDevice } from 'src/types/product';
import * as Yup from 'yup';

export type deviceInfo = {
  _id?: string;
  name: string;
  sub_category_id: string;
  cost: number;
  quantity: number;
  note?: string;
};

export default function DeviceInfo({
  getDeviceList,
  open,
  onClose,
  listSubCategory,
}: {
  open: boolean;
  onClose: () => void;
  getDeviceList: () => void;
  listSubCategory: ISubCategory[];
}) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const initializeDefaultValues = (): DefaultValues<deviceInfo> => ({
    _id: undefined,
    name: '',
    note: '',
    sub_category_id: '',
    cost: undefined,
    quantity: undefined,
  });

  const NewDevice = Yup.object().shape({
    name: Yup.string().required('Name is required !'),
    sub_category_id: Yup.string().required('Sub category is required !'),
    quantity: Yup.number().required('quantity is required !'),
    cost: Yup.number().required('Price is required !'),
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

  const handleGetWhenCreateAndUpdateSuccess = () => {
    getDeviceList();
    enqueueSnackbar('Create success!', {
      variant: 'success',
    });
    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    const newDate: IDevice = {
      _id: data?._id,
      name: data?.name,
      sub_category_id: data?.sub_category_id,
      quantity: data.quantity,
      cost: data?.cost,
      note: data?.note,
    };

    const newDevice = await createDevice(newDate as IDevice);
    if (newDevice) {
      handleGetWhenCreateAndUpdateSuccess();
    }
  });

  useEffect(() => {
    const newDefaultValues = initializeDefaultValues();
    Object.keys(newDefaultValues).forEach((key: any) => {
      setValue(key, (newDefaultValues as any)?.[key]);
    });

    clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
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
        <DialogTitle textAlign="center">Tạo mới</DialogTitle>
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
                <RHFTextField name="name" label="Tên thiết bị" />
              </Grid>

              <Grid xs={12}>
                <RHFSelect name="sub_category_id" label="Thuộc danh mục">
                  {(listSubCategory || [])?.map((item: ISubCategory) => (
                    <MenuItem value={item?._id} key={item?._id}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
              <Grid xs={12}>
                <RHFTextField
                  name="cost"
                  label="Giá"
                  type="number"
                  onKeyDown={(evt) =>
                    ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                  }
                />
              </Grid>
              <Grid xs={12}>
                <RHFTextField
                  name="quantity"
                  label="Số lượng"
                  type="number"
                  onKeyDown={(evt) =>
                    ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                  }
                />
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
