import { BooleanStateProp } from '@/types/Types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export type DeleteDialogProps = {
    title:string,
    message:string,
    loading?:boolean;
    onTap:()=>Promise<void>
} & BooleanStateProp

export default function DeleteDialog({value, loading, setValue, title, message, onTap}:DeleteDialogProps) {


  return (
 
      <Dialog
        // className=''
        open={value}
        onClose={()=>setValue(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={()=>setValue(false)}>Cancel</Button>
          <Button disabled={loading} onClick={onTap}>
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
  );
}
