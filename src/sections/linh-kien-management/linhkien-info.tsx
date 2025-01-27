import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { DefaultValues, useForm } from 'react-hook-form';
import { ILinhKienInfo } from 'src/types/linh-kien';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Unstable_Grid2';
import { LoadingButton } from '@mui/lab';
import { createLinhKien } from 'src/api/linhkien';
import { useSnackbar } from 'notistack';

const initializeDefaultValues = (): DefaultValues<ILinhKienInfo> => ({
  name_linh_kien: '',
  total: 0,
});

function LinhKienInfo({ open, onClose }: { open: boolean; onClose: () => void }) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const NewLinhKien = Yup.object().shape({
    name_linh_kien: Yup.string().required('Name is required'),
    total: Yup.number().required().min(1, 'Total amount is required'),
  });

  const methods = useForm<ILinhKienInfo>({
    resolver: yupResolver(NewLinhKien),
    defaultValues: initializeDefaultValues(),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    createLinhKien(data, enqueueSnackbar);
    onClose();
  });

  useEffect(() => {
    reset();
  }, [open, reset]);
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
        <DialogTitle sx={{ pb: 2 }}> Tạo mới</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 3, borderBottom: `solid 1px ${theme.palette.divider}` }}>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <RHFTextField name="name_linh_kien" label="Tên linh kiện" />
              </Grid>
              <Grid xs={12}>
                <RHFTextField
                  name="total"
                  label="Số lượng"
                  type="number"
                  onKeyDown={(evt) =>
                    ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                  }
                />
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

export default LinhKienInfo;
