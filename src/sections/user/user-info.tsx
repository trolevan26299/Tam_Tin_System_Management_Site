/* eslint-disable import/no-cycle */
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
import { DefaultValues, useForm } from 'react-hook-form';
import { createUser, updateUserById } from 'src/api/user';
import { useAuthContext } from 'src/auth/hooks';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import * as Yup from 'yup';
import { useSnackbar } from '../../components/snackbar';

export type userInfo = {
  username: string;
  password: string;
  status?: string;
  oldPassword?: string;
  _id?: string;
};

export type option = {
  [key: string]: string | undefined;
};

const optionStatus: option[] = [
  { label: 'active', value: 'active' },
  { label: 'suspend', value: 'suspend' },
];

export default function UserInfo({
  currentAccount,
  getUserList,
  open,
  onClose,
}: {
  currentAccount?: userInfo;
  open: boolean;
  onClose: () => void;
  getUserList: () => void;
}) {
  const { user } = useAuthContext();
  const theme = useTheme();
  const NewAccount = Yup.object().shape({
    username: Yup.string().required('Name is required'),
    password: Yup.string().required('Password is required'),
    status: Yup.string(),
  });
  const password = useBoolean();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues: DefaultValues<userInfo> = {
    username: '',
    password: '',
    status: '',
  };

  const methods = useForm<userInfo>({
    resolver: yupResolver(NewAccount),
    defaultValues,
  });
  console.log(!(user?.role === optionStatus?.[2]?.value));

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleGetWhenCreateAndUpdateSuccess = (value: boolean) => {
    getUserList();
    enqueueSnackbar(value ? 'Update success!' : 'Create success!', {
      variant: 'success',
    });
    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    if (currentAccount) {
      const updateAccount = await updateUserById(String(currentAccount?._id), data);

      if (updateAccount !== 'error') {
        handleGetWhenCreateAndUpdateSuccess(!!currentAccount);
      } else {
        enqueueSnackbar('Update fail!', {
          variant: 'error',
        });
      }
    } else {
      const createAccount = await createUser(data);
      if (createAccount) {
        handleGetWhenCreateAndUpdateSuccess(!currentAccount);
      }
    }
  });

  useEffect(() => {
    setValue('username', currentAccount?.username || '');
    setValue('password', currentAccount?.password || '');
    setValue('status', currentAccount?.status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount]);
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
        <DialogTitle sx={{ pb: 2 }}>{!currentAccount ? 'Create User' : 'Update User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 3, borderBottom: `solid 1px ${theme.palette.divider}` }}>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <RHFTextField name="username" label="User Name" disabled={!!currentAccount} />
              </Grid>
              {currentAccount ? (
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
                    <RHFSelect
                      name="status"
                      label="Status"
                      disabled={!(user?.role === 'superadmin')}
                    >
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
