import { SessionProps } from "@/types/Types"
import { ComponentProps } from "react"

export type SelectSessionScanItemProps = ComponentProps<'div'> & {
    session:SessionProps
}

const SelectSessionScanItem = ({className, session, ...props}:SelectSessionScanItemProps) => {
  return (
    <div {...props}  className={`bg-[#F4F4F4] dark:bg-black border rounded px-2 flex flex-col py-1 cursor-pointer w-60 ${className}`} >
        <span className="font-medium whitespace-nowrap w-full text-ellipsis overflow-hidden" >{session?.name}</span>
        <div className="flex flex-row gap-2">
            <small className="font-medium" >Status:</small>
            <small className="font-normal text-gray-400" >{session?.status}</small>
        </div>
        <div className="flex flex-row gap-2">
            <small className="font-medium" >Duration:</small>
            <small className="font-normal text-gray-400" >{session?.startTime} - {session?.endTime}</small>
        </div>
    </div>
  )
}

export default SelectSessionScanItem