'use client'
import { IoCheckmarkCircleOutline  } from "react-icons/io5";
import { ComponentProps, Dispatch, SetStateAction } from "react";
import { useFetchEvents } from "@/hooks/fetch/useEvent";
import { useFetchRegistrations } from "@/hooks/fetch/useRegistration";
import { checkCheckedIn } from "./fxn";
// import SearchSelectEvents from "@/components/features/SearchSelectEvents";
import SearchSelectEventsV2 from "@/components/features/SearchSelectEventsV2";
import { IEvent } from "@/lib/database/models/event.model";

type ArrivalTopProps = {
    eventId:string,
    setEventId:Dispatch<SetStateAction<string>>,
    setCurrentEvent:Dispatch<SetStateAction<IEvent|null>>
} & ComponentProps<'div'>

const ArrivalTop = ({ setEventId, setCurrentEvent, eventId, className, ...props}:ArrivalTopProps) => {
    // const [value, setValue] = useState<boolean>(false);
    // const [selected, setSelected] = useState<string>('');
    const {events} = useFetchEvents();
    const {registrations} = useFetchRegistrations();
    const {regs, checkValue} = checkCheckedIn(eventId, registrations, events);
    if(!events.length || !registrations.length) return null;
  return (
    <div {...props}  className={`flex flex-col md:flex-row md:items-end gap-8 ${className}`}>
        <div className="flex flex-row relative">
            <SearchSelectEventsV2 setCurrentEvent={setCurrentEvent} setSelect={setEventId}  />
            {/* {
                value &&
                <IoCloseSharp className="text-red-700 cursor-pointer absolute -top-4 right-0 z-50" onClick={()=>setValue(false)} />
            } */}
        </div>
        <div className="flex flex-row items-center gap-4 px-4 py-[0.4rem] bg-white dark:bg-[#0F1214] border w-fit">
            <IoCheckmarkCircleOutline className='text-blue-700' />
            <div className="flex flex-row">
            <span className='text-red-700 font-medium' >{checkValue}</span>
            <span className='font-medium' >/{regs}</span>
            </div>
        </div>
        {/* <div className="flex flex-row gap-6">
        </div> */}
    </div>
  )
}

export default ArrivalTop