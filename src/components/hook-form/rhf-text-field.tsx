/* eslint-disable no-nested-ternary */
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import TextField, { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
};

export default function RHFTextField({ name, helperText, type, ...other }: Props) {
  const { control } = useFormContext();

  const formatCurrency = (value: string | number) => {
    // Loại bỏ tất cả các ký tự không phải số
    const number = String(value).replace(/[^\d]/g, '');
    return number ? new Intl.NumberFormat('vi-VN').format(Number(number)) : '';
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={name === 'cost' ? 'text' : type} // Đổi type thành text cho trường cost
          value={
            name === 'cost'
              ? formatCurrency(field.value || '')
              : type === 'number' && field.value === 0
              ? ''
              : field.value
          }
          onChange={(event) => {
            if (name === 'cost') {
              // Lấy giá trị số từ chuỗi nhập vào
              const numericValue = event.target.value.replace(/[^\d]/g, '');
              // Cập nhật giá trị dưới dạng chuỗi số
              field.onChange(numericValue);
            } else if (type === 'number') {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          InputProps={
            name === 'cost'
              ? {
                  ...other.InputProps,
                  endAdornment: <span style={{ marginLeft: 8 }}>VND</span>,
                }
              : other.InputProps
          }
          {...other}
        />
      )}
    />
  );
}
