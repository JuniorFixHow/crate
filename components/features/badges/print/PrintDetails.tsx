'use client'

import AddButton from "@/components/features/AddButton"
import { Alert, CircularProgress } from "@mui/material"
import {  useSearchParams } from "next/navigation"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import SearchSelectEvents from "../../SearchSelectEvents"
import { IRegistration } from "@/lib/database/models/registration.model"
import { ErrorProps } from "@/types/Types"
import { checkMemberRegistration } from "@/lib/actions/event.action"
import Link from "next/link"
import { createRegistration } from "@/lib/actions/registration.action"
import { IRoom } from "@/lib/database/models/room.model"
import { IVenue } from "@/lib/database/models/venue.model"

type PrintDetailsProps = {
    setCurrentReg:Dispatch<SetStateAction<IRegistration|null>>,
    currentReg:IRegistration|null,
    setHasRegistered:Dispatch<SetStateAction<boolean>>,
    hasRegistered:boolean,
}

const PrintDetails = ({setCurrentReg, currentReg, setHasRegistered, hasRegistered}:PrintDetailsProps) => {
    const searchParams = useSearchParams();
    const [eventId, setEventId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<ErrorProps>(null);
    const [regError, setRegError] = useState<ErrorProps>(null);
    const [regLoading, setRegLoading] = useState<boolean>(false);
    const memberId = searchParams.get('memberId');

    const rooms = currentReg?.roomIds as IRoom[];

    useEffect(()=>{
        const fetchRegistrationData = async()=>{
            const controller = new AbortController();
            if(eventId && memberId){
                setLoading(true);
                try {
                    const {truth, data} = await checkMemberRegistration(memberId, eventId);
                    if(data){
                        setCurrentReg(data)
                    }
                    setHasRegistered(truth);
                } catch (error) {
                    console.log(error);
                    setError({message:'Error occured fetching registration data.', error:true});
                }finally{
                    setLoading(false);
                }
            }
            return ()=>controller.abort()
        }
        fetchRegistrationData();
    },[memberId, eventId, setCurrentReg, setHasRegistered])

    const handleRegisration = async()=>{
        setRegError(null);
        try {
            setRegLoading(true);
            if(memberId){
                const data:Partial<IRegistration> ={
                    eventId, memberId, badgeIssued:'No',
                } 
                const res = await createRegistration(memberId, eventId, data);
                setCurrentReg(res);
                setRegError({message:'Member registered successfully', error:false});
                window.location.reload();
            }
        } catch (error) {
            setRegError({message:'Error occured registering member.',error:true })
            console.log(error);  
        }finally{
            setRegLoading(false)
        }
    }

  return (
    <div className="flex flex-col gap-8 flex-1" >

        <div className="flex gap-4 items-center">
            <div className="flex gap-4 items-end">
                <SearchSelectEvents className="w-fit" isGeneric setSelect={setEventId} />
                {
                    loading &&
                    <CircularProgress size='30px' />
                }
            </div>
            {
                error?.message &&
                <small className="text-[0.7rem] text-red-600" >{error?.message}</small>
            }
        </div>
        {
            hasRegistered ?
            <>
                <div className="flex flex-col gap-4 w-full">
                    <span className="text-[0.9rem] font-bold" >Member Info</span>
                    <div className="flex flex-row items-center  justify-start ml-8">
                        <span className="text-[0.8rem] font-semibold flex flex-1" >Name:</span>
                        <span className="text-[0.8rem] text-slate-500 font-semibold flex flex-1" >{typeof currentReg?.memberId === 'object' && 'name' in currentReg?.memberId && currentReg?.memberId?.name}</span>
                    </div>
                    <div className="flex flex-row items-center  justify-start ml-8">
                        <span className="text-[0.8rem] font-semibold flex flex-1" >Email:</span>
                        <span className="text-[0.8rem] text-slate-500 font-semibold flex flex-1" >{typeof currentReg?.memberId === 'object' && 'email' in currentReg?.memberId && currentReg?.memberId?.email}</span>
                    </div>
                    <div className="flex flex-row items-center  justify-start ml-8">
                        <span className="text-[0.8rem] font-semibold flex flex-1" >Phone:</span>
                        <span className="text-[0.8rem] text-slate-500 font-semibold flex flex-1" >{typeof currentReg?.memberId === 'object' && 'phone' in currentReg?.memberId && currentReg?.memberId?.phone}</span>
                    </div>
                    <div className="flex flex-row items-center  justify-start ml-8">
                        <span className="text-[0.8rem] font-semibold flex flex-1" >Marital Status:</span>
                        <span className="text-[0.8rem] text-slate-500 font-semibold flex flex-1" >{typeof currentReg?.memberId === 'object' && 'marital' in currentReg?.memberId && currentReg?.memberId?.marital}</span>
                    </div>
                    <div className="flex flex-row items-center  justify-start ml-8">
                        <span className="text-[0.8rem] font-semibold flex flex-1" >Status:</span>
                        <span className="text-[0.8rem] text-slate-500 font-semibold flex flex-1" >{typeof currentReg?.memberId === 'object' && 'status' in currentReg?.memberId && currentReg?.memberId?.status}</span>
                    </div>
                    {
                        currentReg?.groupId &&
                        <div className="flex flex-row items-center  justify-start ml-8">
                            <span className="text-[0.8rem] font-semibold flex flex-1" >Group:</span>
                            <Link href={`/dashboard/groups/${typeof currentReg?.groupId === 'object' && '_id' in currentReg?.groupId && currentReg?.groupId?._id}`}  className="table-link w-fit flex-1" >{typeof currentReg?.groupId === 'object' && 'name' in currentReg?.groupId && currentReg?.groupId?.name}</Link>
                        </div>
                    }
                </div>
                    {
                        currentReg?.roomIds &&
                        currentReg?.roomIds?.length > 0 &&
                        <div className="flex flex-col gap-4 w-full">
                            <span className="text-[0.9rem] font-bold" >Room(s)</span>
                            {
                                 rooms?.map((item)=>{
                                    const venue = item?.venueId as IVenue;
                                    return(
                                        <Link className="table-link w-fit" href={{pathname:`/dashboard/rooms`, query:{id:item?._id}}} key={item?._id} >{`${venue?.name} - ${item?.number}`}</Link>
                                    )
                                })
                            }
                        </div>
                    }
            </>
            :
            <div className="flex flex-col gap-2">
                <Alert severity='error'  >
                    {
                        !eventId ? 
                        'No event selected yet'
                        :
                        "The member hasn't been registered for this event yet. Press the button to register them."
                    }
                </Alert>
                {
                    regError?.message &&
                    <Alert severity={regError.error ? 'error':'success'} onClose={()=>setRegError(null)} >{regError.message}</Alert>
                }
                {
                    eventId &&
                    <AddButton disabled={regLoading} onClick={handleRegisration} noIcon className="rounded w-fit px-2 py-1" smallText text={regLoading ? 'loading...':"Register Member"} />
                }
            </div>
        }


      
    </div>
  )
}

export default PrintDetails
