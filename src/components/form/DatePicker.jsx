import { useFormContext, Controller } from 'react-hook-form';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';

// ==============================================================

// ==============================================================

export default function DatePicker({
  name,
  label
}) {
  const {
    control
  } = useFormContext();
  return <Controller name={name} control={control} render={({
    field,
    fieldState: {
      error
    }
  }) => <MuiDatePicker {...field} label={label} value={field.value} slotProps={{
    textField: {
      name,
      fullWidth: true,
      onBlur: field.onBlur,
      error: Boolean(error),
      helperText: error?.message
    }
  }} />} />;
}