import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ComponentProps, Dispatch, SetStateAction } from 'react';

type BasicDatePickerProps = {
  setDate:Dispatch<SetStateAction<string>>
} & ComponentProps<'div'>

export default function BasicDatePicker({setDate, className, ...props}:BasicDatePickerProps) {
  return (
    <div {...props} className={`${className}`}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker onChange={(e)=>setDate(e ? e?.toString():'')} label="Basic date picker" />
            </DemoContainer>
        </LocalizationProvider>
    </div>
  );
}