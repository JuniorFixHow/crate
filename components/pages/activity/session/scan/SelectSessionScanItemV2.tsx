import { formatTimeRange, getActivityStatus } from "@/components/pages/session/fxn"
import { IClasssession } from "@/lib/database/models/classsession.model"
import { ComponentProps } from "react"

export type SelectSessionScanItemV2Props = ComponentProps<'div'> & {
    session:IClasssession
}

const SelectSessionScanItemV2 = ({className, session, ...props}:SelectSessionScanItemV2Props) => {
  return (
    <div {...props}  className={`bg-[#F4F4F4] dark:bg-[#0F1214] border rounded px-2 flex flex-col py-1 cursor-pointer w-60 ${className}`} >
        <span className="font-medium whitespace-nowrap w-full text-ellipsis overflow-hidden" >{session?.name}</span>
        <div className="flex flex-row gap-2">
            <small className="font-medium" >Status:</small>
            <small className="font-normal text-gray-400" >{session?.from && session?.to && getActivityStatus(session?.from, session?.to)}</small>
        </div>
        <div className="flex flex-row gap-2">
            <small className="font-medium" >Duration:</small>
            <small className="font-normal text-gray-400" >{session?.from && session?.to && formatTimeRange(session?.from, session?.to)}</small>
        </div>
    </div>
  )
}

export default SelectSessionScanItemV2