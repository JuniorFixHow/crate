import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ComponentProps } from 'react';

export default function BasicDatePicker({className, ...props}:ComponentProps<'div'>) {
  return (
    <div {...props} className={`${className}`}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker label="Basic date picker" />
            </DemoContainer>
        </LocalizationProvider>
    </div>
  );
}