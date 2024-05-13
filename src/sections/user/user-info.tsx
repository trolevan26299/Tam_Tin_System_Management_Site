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
  MenuItem,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import * as Yup from 'yup';

export type userInfo = {
  username: string;
  password: string;
  status?: string;
  oldPassword?: string;
};

export type option = {
  [key: string]: string | undefined;
};

const optionStatus: option[] = [
  { label: 'active', value: 'active' },
  { label: 'suspend', value: 'suspend' },
];

export default function UserInfo({
  currentProduct,
  open,
  onClose,
}: {
  currentProduct?: userInfo;
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme();
  const NewAccount = Yup.object().shape({
    username: Yup.string().required('Name is required'),
    password: Yup.string().required('Password is required'),
    status: Yup.string(),
  });
  const password = useBoolean();

  const defaultValues = {
    username: '',
    password: '',
    status: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewAccount),
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
    //
  });

  useEffect(() => {
    if (!currentProduct) {
      reset(defaultValues);
    } else {
      setValue('username', currentProduct?.username);
      setValue('password', currentProduct?.password);
      setValue('status', currentProduct?.status);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProduct]);

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
        <DialogTitle sx={{ pb: 2 }}>{!currentProduct ? 'Create User' : 'Update User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 3, borderBottom: `solid 1px ${theme.palette.divider}` }}>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <RHFTextField name="username" label="User Name" />
              </Grid>
              {currentProduct ? (
                <>
                  <Grid xs={12}>
                    <RHFTextField
                      name="oldPassword"
                      label="Old Password"
                      type={password.value ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={password.onToggle} edge="end">
                              <Iconify
                                icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <RHFTextField
                      name="password"
                      label="Password"
                      type={password.value ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={password.onToggle} edge="end">
                              <Iconify
                                icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <RHFSelect name="status" label="Status" disabled>
                      {optionStatus?.map((item: option, index) => (
                        <MenuItem value={item?.value} key={index}>
                          {item?.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>
                </>
              ) : (
                <Grid xs={12}>
                  <RHFTextField
                    name="password"
                    label="Password"
                    type={password.value ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={password.onToggle} edge="end">
                            <Iconify
                              icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          {/* <Button variant="contained">Save</Button> */}
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
