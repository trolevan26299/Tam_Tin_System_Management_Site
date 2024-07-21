import React from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { useFormContext, Controller } from 'react-hook-form';
import { TextFieldProps, TextField } from '@mui/material';

type NumberFormatCustomProps = {
  inputRef: (instance: HTMLInputElement | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
} & Omit<NumericFormatProps, 'getInputRef' | 'onValueChange'>;

type Props = TextFieldProps & {
  name: string;
};

const NumberFormatCustom: React.FC<NumberFormatCustomProps> = ({
  inputRef,
  onChange,
  ...other
}) => {
  const { clearErrors, setError } = useFormContext();

  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: other.name,
            value: values.floatValue ? values.floatValue.toString() : '',
          },
        });

        if (values.floatValue) {
          clearErrors(other.name);
        } else {
          setError(other.name, { message: 'price is required' });
        }
      }}
      thousandSeparator
      suffix="₫"
    />
  );
};

const NumberFormatCustomForToTalAmount: React.FC<NumberFormatCustomProps> = ({
  inputRef,
  onChange,
  ...other
}) => {
  const { clearErrors, setError } = useFormContext();

  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: other.name,
            value: values.floatValue ? values.floatValue.toString() : '',
          },
        });

        if (values.floatValue) {
          clearErrors(other.name);
        } else {
          setError(other.name, { message: 'total amount is required' });
        }
      }}
      thousandSeparator
      suffix="₫"
    />
  );
};

const NumberFormatCustomForPriceSale: React.FC<NumberFormatCustomProps> = ({
  inputRef,
  onChange,
  ...other
}) => (
  <NumericFormat
    {...other}
    getInputRef={inputRef}
    onValueChange={(values) => {
      onChange({
        target: {
          name: other.name,
          value: values.floatValue ? values.floatValue.toString() : '',
        },
      });
    }}
    thousandSeparator
    suffix="₫"
  />
);

export default function RHFTextFieldFormatVnd({ name, helperText, type, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          error={!!error}
          helperText={error ? error?.message : helperText}
          InputProps={{
            inputComponent:
              // eslint-disable-next-line no-nested-ternary
              name === 'totalAmount'
                ? (NumberFormatCustomForToTalAmount as any)
                : name === 'priceSaleOff'
                ? (NumberFormatCustomForPriceSale as any)
                : (NumberFormatCustom as any),
          }}
          value={field.value === 0 ? '' : field.value}
          {...other}
        />
      )}
    />
  );
}
