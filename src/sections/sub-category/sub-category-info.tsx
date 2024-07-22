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
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/system/Unstable_Grid/Grid';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { ICategory, ISubCategory } from 'src/types/category';
import * as Yup from 'yup';
import { createSubCategory, updateSubCategoryById } from 'src/api/allCategory';
import { option } from '../user/user-info';

export default function SubCategoryInfo({
  currentSubCategory,
  getSubCategoryList,
  open,
  onClose,
  listCategory,
}: {
  currentSubCategory?: ISubCategory;
  open: boolean;
  onClose: () => void;
  getSubCategoryList: () => void;
  listCategory: ICategory[];
}) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const NewSubCategory = Yup.object().shape({
    name: Yup.string().required('Name is required !'),
    category_id: Yup.string().required('Category is required !'),
  });

  const initializeDefaultValues = (): DefaultValues<ISubCategory> => ({
    _id: undefined,
    name: '',
    category_id: '',
  });
  const methods = useForm<ISubCategory>({
    resolver: yupResolver(NewSubCategory),
    defaultValues: initializeDefaultValues(),
  });
  const {
    setValue,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting },
  } = methods;

  const handleGetWhenCreateAndUpdateSuccess = (value: boolean) => {
    getSubCategoryList();
    enqueueSnackbar(value ? 'Update success!' : 'Create success!', {
      variant: 'success',
    });
    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    if (data?._id) {
      const updateSubCatById = await updateSubCategoryById(data?._id, data as ISubCategory);
      if (updateSubCatById) {
        handleGetWhenCreateAndUpdateSuccess(!!currentSubCategory);
      }
    } else {
      const createSubCat = await createSubCategory(data as ISubCategory);
      if (createSubCat) {
        handleGetWhenCreateAndUpdateSuccess(!!currentSubCategory);
      }
    }
  });

  useEffect(() => {
    if (currentSubCategory) {
      Object.keys(currentSubCategory).forEach((key: any) => {
        setValue(key, (currentSubCategory as any)?.[key]);
      });
    } else {
      const newDefaultValues = initializeDefaultValues();
      Object.keys(newDefaultValues).forEach((key: any) => {
        setValue(key, (newDefaultValues as any)?.[key]);
      });
    }
    clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSubCategory, open]);
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
        <DialogTitle sx={{ pb: 2 }}>{!currentSubCategory ? 'Tạo mới' : 'Cập nhật'}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              p: 3,
              borderBottom: `solid 1px ${theme.palette.divider}`,
            }}
          >
            <Grid container spacing={3}>
              <Grid xs={12}>
                <RHFTextField name="name" label="Tên" />
              </Grid>

              <Grid xs={12}>
                <RHFSelect name="category_id" label="Danh mục">
                  {listCategory?.map((item: option, index) => (
                    <MenuItem value={item?._id} key={index}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
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
