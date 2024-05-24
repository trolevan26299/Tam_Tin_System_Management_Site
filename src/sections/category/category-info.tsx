import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/system/Unstable_Grid/Grid';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import { createCategory, updateCategoryById } from 'src/api/allCategory';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { ICategory } from 'src/types/category';
import * as Yup from 'yup';

export default function CategoryInfo({
  currentCategory,
  getCategoryList,
  open,
  onClose,
}: {
  currentCategory?: ICategory;
  open: boolean;
  onClose: () => void;
  getCategoryList: () => void;
}) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const NewCategory = Yup.object().shape({
    name: Yup.string().required('Name is required !'),
  });

  const initializeDefaultValues = (): DefaultValues<ICategory> => ({
    _id: undefined,
    name: '',
  });
  const methods = useForm<ICategory>({
    resolver: yupResolver(NewCategory),
    defaultValues: initializeDefaultValues(),
  });
  const {
    setValue,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting },
  } = methods;

  const handleGetWhenCreateAndUpdateSuccess = (value: boolean) => {
    getCategoryList();
    enqueueSnackbar(value ? 'Update success!' : 'Create success!', {
      variant: 'success',
    });
    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    if (data?._id) {
      const updateCategory = await updateCategoryById(data?._id, data as ICategory);
      if (updateCategory) {
        handleGetWhenCreateAndUpdateSuccess(!!currentCategory);
      }
    } else {
      const createSubCat = await createCategory(data as ICategory);
      if (createSubCat) {
        handleGetWhenCreateAndUpdateSuccess(!!currentCategory);
      }
    }
  });

  useEffect(() => {
    setValue('name', currentCategory?.name || '');
    clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory, open]);
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
          {!currentCategory ? 'Create Category' : 'Update Category'}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              p: 3,
              borderBottom: `solid 1px ${theme.palette.divider}`,
            }}
          >
            <Grid container spacing={3}>
              <Grid xs={12}>
                <RHFTextField name="name" label="Name" />
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
