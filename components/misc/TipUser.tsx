import { Alert, AlertTitle } from "@mui/material";
import { useState } from "react"

type TipUserProps = {
    text:string;
}

const TipUser = ({text}:TipUserProps) => {
    const [open, setOpen] = useState<boolean>(true);
    const handleClose = ()=>setOpen(false);
  return (
    // <Snackbar anchorOrigin={{vertical:'top', horizontal:'right'}} autoHideDuration={60000} open={open} onClose={handleClose} >
    // </Snackbar>
    <>
    {
        open &&
        <Alert onClose={handleClose} severity="info">
            <AlertTitle>Tip</AlertTitle>
            {text}
        </Alert>
    }
    </>
  )
}

export default TipUser