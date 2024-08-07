/* eslint-disable react/no-this-in-sfc */
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
import { useEffect, useState } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import { createUser, updateUserById } from 'src/api/user';
import { useAuthContext } from 'src/auth/hooks';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify';
import { ROLE } from 'src/types/user';
import * as Yup from 'yup';
import { useSnackbar } from '../../components/snackbar';

export type userInfo = {
  username: string;
  password?: string;
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

const initializeDefaultValues = (): DefaultValues<userInfo> => ({
  username: '',
  password: '',
  status: '',
});

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
    password: Yup.string().test({
      name: 'password',
      test(value) {
        if (currentAccount) {
          if (this.parent.oldPassword && !value) {
            return this.createError({
              path: 'password',
              message: 'Password is required',
            });
          }
        }
        return true;
      },
    }),
    oldPassword: Yup.string().test({
      name: 'oldPassword',
      test(value) {
        if (currentAccount) {
          if (this.parent.password && !value) {
            return this.createError({
              path: 'oldPassword',
              message: 'Old Password is required',
            });
          }
        }
        return true;
      },
    }),
    status: Yup.string(),
  });

  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState<{
    usePwd: boolean;
    useOldPwd: boolean;
  }>({
    usePwd: false,
    useOldPwd: false,
  });

  const methods = useForm<userInfo>({
    resolver: yupResolver(NewAccount),
    defaultValues: initializeDefaultValues(),
  });

  const {
    setValue,
    handleSubmit,
    clearErrors,
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
      const updateAccount = await updateUserById(
        String(currentAccount?._id),
        data,
        enqueueSnackbar
      );
      if (updateAccount) {
        handleGetWhenCreateAndUpdateSuccess(!!currentAccount);
      }
    } else {
      const newData: userInfo = {
        username: data?.username,
        password: data?.password,
        status: '',
      };
      const createAccount = await createUser(newData);
      if (createAccount) {
        handleGetWhenCreateAndUpdateSuccess(!currentAccount);
      }
    }
  });

  useEffect(() => {
    if (currentAccount) {
      setValue('username', currentAccount?.username);
      setValue('oldPassword', '');
      setValue('password', '');
      setValue('status', currentAccount?.status);
    } else {
      const newDefaultValues = initializeDefaultValues();
      setValue('username', newDefaultValues?.username as string);
      setValue('password', newDefaultValues?.password as string);
      setValue('status', newDefaultValues?.status as string);
    }
    clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount, open]);
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
        <DialogTitle sx={{ pb: 2 }}>{!currentAccount ? 'Tạo mới' : 'Cập nhật'}</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 3, borderBottom: `solid 1px ${theme.palette.divider}` }}>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <RHFTextField name="username" label="Tên tài khoản" disabled={!!currentAccount} />
              </Grid>
              {currentAccount ? (
                <>
                  <Grid xs={12}>
                    <RHFTextField
                      name="oldPassword"
                      label="Mật khẩu cũ"
                      type={state.useOldPwd ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                setState({ ...state, useOldPwd: !state.useOldPwd });
                              }}
                              edge="end"
                            >
                              <Iconify
                                icon={state.useOldPwd ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
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
                      label="Mật khẩu mới"
                      type={state.usePwd ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                setState({ ...state, usePwd: !state.usePwd });
                              }}
                              edge="end"
                            >
                              <Iconify
                                icon={state.usePwd ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
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
                      label="Trạng thái"
                      disabled={!(user?.role === ROLE.superadmin)}
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
                    label="Mật khẩu"
                    type={state.usePwd ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              setState({ ...state, usePwd: !state.usePwd });
                            }}
                            edge="end"
                          >
                            <Iconify
                              icon={state.usePwd ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
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
