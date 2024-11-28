import { Alert } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { ComponentProps } from 'react';

type CircularIndeterminateProps = {
    error?:string | null,
} & ComponentProps<'div'>

export default function CircularIndeterminate({error, className, ...props}:CircularIndeterminateProps) {
  return (
    <div {...props}  className={`${className} grow w-full h-[20rem]`} >
    {
        error ?
        <Alert severity='error' >{error}</Alert>
        :
        <CircularProgress size={'4rem'} />
    }
    </div>
  );
}