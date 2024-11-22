'use client'

import AddButton from "@/features/AddButton"
import SearchSelectEvent from "@/features/SearchSelectEvent"
import { MemberProps, QRProps } from "@/types/Types"
import { Alert } from "@mui/material"
import { useSearchParams } from "next/navigation"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { IoCloseSharp } from "react-icons/io5"

type PrintDetailsProps = {
    qrdata:MemberProps,
    setQrdata:Dispatch<SetStateAction<MemberProps|null>>,
    onTap:()=>void
}

const PrintDetails = ({qrdata, setQrdata, onTap}:PrintDetailsProps) => {
    const searchParams = useSearchParams();
    // const data = searchParams.get('id')
    // searchParams.
    // const data = router.
    const [value, setValue] = useState<boolean>(false);
    const [selected, setSelected] = useState<string>('');
    const [hasRegistered, setHasRegistered] = useState<boolean>(false);
    useEffect(()=>{
        const data = Object.fromEntries(searchParams.entries()) as MemberProps
        if (
            data.id &&
            data.photo &&
            data.email &&
            data.name &&
            data.ageRange &&
            data.church &&
            data.registerType &&
            data.registeredBy &&
            data.dateOfReg &&
            data.gender &&
            data.country &&
            data.status
        ) {
            setQrdata(data);
        } else {
            console.error('Invalid data structure:', data);
        }
    },[searchParams])
    // USE THE ENTIRE EVENT REGISTRATION DATA TO PASS TO THE QR CODE PAYLOAD, AND NOT THE MEMBER DATA
  return (
    <div className="flex flex-col gap-8 flex-1" >

        <div className="flex flex-row relative w-fit">
            {
                value &&
                <IoCloseSharp className="text-red-700 cursor-pointer absolute -top-4 right-0 z-50" onClick={()=>setValue(false)} />
            }
            <SearchSelectEvent value={value} setValue={setValue} setText={setSelected} text={selected} />
        </div>

      <div className="flex flex-col gap-4 w-full">
        <span className="text-[0.9rem] font-bold" >Member Info</span>
        <div className="flex flex-row items-center  justify-start ml-8">
            <span className="text-[0.8rem] font-semibold flex flex-1" >Name:</span>
            <span className="text-[0.8rem] text-slate-500 font-semibold flex flex-1" >Name</span>
        </div>
        <div className="flex flex-row items-center  justify-start ml-8">
            <span className="text-[0.8rem] font-semibold flex flex-1" >Email:</span>
            <span className="text-[0.8rem] text-slate-500 font-semibold flex flex-1" >Name</span>
        </div>
        <div className="flex flex-row items-center  justify-start ml-8">
            <span className="text-[0.8rem] font-semibold flex flex-1" >Phone:</span>
            <span className="text-[0.8rem] text-slate-500 font-semibold flex flex-1" >+16283909343</span>
        </div>
        <div className="flex flex-row items-center  justify-start ml-8">
            <span className="text-[0.8rem] font-semibold flex flex-1" >Marital Status:</span>
            <span className="text-[0.8rem] text-slate-500 font-semibold flex flex-1" >Name</span>
        </div>
        <div className="flex flex-row items-center  justify-start ml-8">
            <span className="text-[0.8rem] font-semibold flex flex-1" >Status:</span>
            <span className="text-[0.8rem] text-slate-500 font-semibold flex flex-1" >Name</span>
        </div>
        <div className="flex flex-row items-center  justify-start ml-8">
            <span className="text-[0.8rem] font-semibold flex flex-1" >Group:</span>
            <span className="text-[0.8rem] text-left text-blue-500 cursor-pointer hover:underline font-semibold flex flex-1" >Group 4</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <span className="text-[0.9rem] font-bold" >Room Info</span>
        <div className="flex flex-row items-center  justify-start ml-8">
            <span className="text-[0.8rem] font-semibold flex flex-1" >Floor:</span>
            <span className="text-[0.8rem] text-slate-500 font-semibold flex flex-1" >3</span>
        </div>
        <div className="flex flex-row items-center  justify-start ml-8">
            <span className="text-[0.8rem] font-semibold flex flex-1" >Name / Number:</span>
            <span className="text-[0.8rem] text-left text-blue-500 cursor-pointer hover:underline font-semibold flex flex-1" >7834</span>
        </div>
        <div className="flex flex-row items-center  justify-start ml-8">
            <span className="text-[0.8rem] font-semibold flex flex-1" >Type:</span>
            <span className="text-[0.8rem] text-slate-500 font-semibold flex flex-1" >Name</span>
        </div>
        <div className="flex flex-row items-center  justify-start ml-8">
            <span className="text-[0.8rem] font-semibold flex flex-1" >Bed:</span>
            <span className="text-[0.8rem] text-slate-500 font-semibold flex flex-1" >Queen</span>
        </div>
        <div className="flex flex-row items-center  justify-start ml-8">
            <span className="text-[0.8rem] font-semibold flex flex-1" >Number of beds:</span>
            <span className="text-[0.8rem] text-slate-500 font-semibold flex flex-1" >Name</span>
        </div>
      </div>
        {/* Don't forget to add the event payload to the badge data */}


      <div className="flex flex-col gap-2">
        <Alert severity='warning' onClose={()=>{}} >
            The member hasn&apos;t been registered for this event yet. Press the button to register them.
        </Alert>
        <AddButton noIcon className="rounded w-fit px-2 py-1" smallText text="Register Member" />
        <AddButton onClick={onTap} noIcon className="rounded w-fit px-2 py-1" smallText text="Print Badge" />
      </div>
      
    </div>
  )
}

export default PrintDetails
