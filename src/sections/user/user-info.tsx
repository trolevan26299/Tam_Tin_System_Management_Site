import { yupResolver } from '@hookform/resolvers/yup';
import { MenuItem } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
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

export default function UserInfo({ currentProduct }: { currentProduct?: userInfo }) {
  const NewAccount = Yup.object().shape({
    username: Yup.string().required('Name is required'),
    password: Yup.string().required('Password is required'),
    status: Yup.string(),
  });

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
    watch,
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
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <RHFTextField name="username" label="User Name" />
        </Grid>
        <Grid xs={12}>
          <RHFTextField name="password" label="Password" />
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
    </FormProvider>
  );
}
