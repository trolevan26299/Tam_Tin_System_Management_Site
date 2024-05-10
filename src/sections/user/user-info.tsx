import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import * as Yup from 'yup';

export type userInfo = {
  username: string;
  password: string;
  status?: string;
  oldPassword?: string;
};

export default function UserInfo({ currentProduct }: { currentProduct?: userInfo }) {
  const NewAccount = Yup.object().shape({
    username: Yup.string().required('Name is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = useMemo(
    () => ({
      username: currentProduct?.username || '',
      password: currentProduct?.password || '',
      status: currentProduct?.status,
      oldPassword: currentProduct?.oldPassword,
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewAccount),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    //
  });

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <RHFTextField name="username" label="User Name" />
        </Grid>
        <Grid xs={12}>
          <RHFTextField name="password" label="Password" />
        </Grid>
      </Grid>
    </FormProvider>
  );
}
