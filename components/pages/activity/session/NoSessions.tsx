import { CircularProgress } from "@mui/material"

type NoSessionsProps ={
    loading:boolean
}

const NoSessions = ({loading}:NoSessionsProps) => {
  return (
    <div className="flex-center max-w-[90vw] lg:max-w-[92vw] xl:max-w-[80vw] px-4 flex-col h-[20rem] bg-white shadow dark:bg-[#0F1214] dark:border" >
        {
            loading ? 
            <CircularProgress size='3rem' />
            :
            <span className="text-3xl font-bold text-center" >No Session yet. Select or Create a new one to see attendance</span>
        }
    </div>
  )
}

export default NoSessions