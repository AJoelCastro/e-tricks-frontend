import { useFormContext, Controller } from 'react-hook-form';
import MuiTextField from '@mui/material/TextField';

// ==============================================================

// ==============================================================

export default function TextField({
  name,
  helperText,
  type,
  ...other
}) {
  const {
    control
  } = useFormContext();
  return <Controller name={name} control={control} render={({
    field,
    fieldState: {
      error
    }
  }) => <MuiTextField {...field} type={type} value={field.value} onChange={field.onChange} error={Boolean(error)} helperText={error?.message || helperText} {...other} />} />;
}