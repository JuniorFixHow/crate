'use client'
import AddButton from "../AddButton"
import Subtitle from "../Subtitle"
import { MdOutlineEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { ComponentProps, Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { IMember } from "@/lib/database/models/member.model";
import { ErrorProps } from "@/types/Types";
import { addMemberToGroup, getEventGroups } from "@/lib/actions/group.action";
import { IGroup } from "@/lib/database/models/group.model";
import { IChurch } from "@/lib/database/models/church.model";
import { IoMdGlobe } from "react-icons/io";
import { IZone } from "@/lib/database/models/zone.model";
import { IRegistration } from "@/lib/database/models/registration.model";
import { createRegistration, updateReg } from "@/lib/actions/registration.action";
import RegisterForEvent from "@/components/shared/RegisterForEvent";
import { enqueueSnackbar } from "notistack";

export type BadgeSearchItemProps = {
    member:IMember,
    setResponse?:Dispatch<SetStateAction<ErrorProps>>,
    currentGroup?:IGroup;
    currentRegistration?:IRegistration;
    isGroupItem?:boolean;
    isCheckItem?:boolean;
    isRegisterItem?:boolean;
} & ComponentProps<'div'>

const BadgeSearchItem = ({member, isRegisterItem, setResponse, currentRegistration, currentGroup, isCheckItem,  isGroupItem, ...props}:BadgeSearchItemProps ) => {
    const [loading, setLoading] = useState<boolean>(false);
    const church = member?.church as IChurch;
    const zone = church?.zoneId as IZone;


    // Event Registrations

    const [open, setOpen] = useState<boolean>(false);
    const [openG, setOpenG] = useState<boolean>(false);
    const [openV, setOpenV] = useState<boolean>(false);
    const [regLoading, setRegLoading] = useState<boolean>(false);
    const [regError, setRegError] = useState<ErrorProps>(null);
    // const [loading, setLoading] = useState<boolean>(false);
    const [eventId, setEventId] = useState<string>('');
    const [groupId, setGroupId] = useState<string>('');

    const openEventReg = ()=>{
        setOpen(true);
        setOpenV(true);
        setOpenG(false);
    }

    const openGroupReg = ()=>{
        setOpenV(false);
        setOpenG(true);
    }


    const handleEventReg = async()=>{
            setRegError(null);
            try {
                if(member){
                    setRegLoading(true);
                    const data:Partial<IRegistration> = {
                        memberId:member._id,
                        eventId,
                        badgeIssued:'No',
                    } 
                    const res:ErrorProps = await createRegistration( member._id, eventId, data);
                    setRegError(res);
                    if(res?.code === 201){
                        const groups:IGroup[] = await getEventGroups(eventId);
                        if(groups.length){
                            openGroupReg();
                        }
                    }
                }
            } catch (error) {
                console.log(error);
                setRegError({message:'Error occured registering the member for the event', error:true});
            }finally{
                setRegLoading(false);
            }
        }
    
        const handleGroupReg = async()=>{
            setRegError(null);
            try {
                if(member){
                    setRegLoading(true);
                    const res:ErrorProps = await addMemberToGroup(groupId, member._id, eventId)
                    setRegError(res);  
                }
            } catch (error) {
                console.log(error);
                setRegError({message:'Error occured registering the member for the group', error:true});
            }finally{
                setRegLoading(false);
            }
        }



    const handleAddToGroup = async()=>{
        setResponse!(null);
        try {
            setLoading(true);
            if(currentGroup){
                const eventId = typeof currentGroup?.eventId === 'object' && '_id' in currentGroup?.eventId && currentGroup?.eventId._id;
                const res:ErrorProps =  await addMemberToGroup(currentGroup._id, member._id, eventId.toString());
                setResponse!(res);
            }
        } catch (error) {
            console.log(error);
            setResponse!({message:'Error occured add member to group', error:true})
        }finally{
            setLoading(false);
        }
    }

    const checkInMember = async()=>{
        // setResponse!(null);
        try {
            setLoading(true);
            if(currentRegistration){

                const data:Partial<IRegistration> = {
                    ...currentRegistration,
                    checkedIn:{
                        checked:true,
                        date:new Date().toISOString()
                    }
                }
                const res = await updateReg(currentRegistration._id, data);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured processing check-in', {variant:'error'});
        }finally{
            setLoading(false);
        }
    }
   
  return (
    <div {...props}  className="flex w-full flex-col gap-4 md:flex-row dark:bg-[#0F1214] justify-between items-start md:items-center bg-[#d6d6d6] p-2 rounded border-slate-400 border" >
        <div className="flex flex-col gap-2">
            <Link className="table-link" href={`/dashboard/members/${member?._id}`} >
                <Subtitle isLink text={member?.name} />
            </Link>
            <div className="flex flex-row gap-1 items-center">
                <MdOutlineEmail className="text-slate-500" />
                    <span className="text-[0.7rem] text-slate-500" >{member?.email}</span>
            </div>
            <div className="flex flex-row gap-1 items-center">
                <FaPhone size={14}  className="text-slate-500" />
                <span className="text-[0.7rem] text-slate-500" > {member?.phone}</span>
            </div>
            <div className="flex flex-row gap-1 items-center">
                <IoMdGlobe size={14}  className="text-slate-500" />
                <span className="text-[0.7rem] text-slate-500" >{church?.name} - {zone?.name}</span>
            </div>
        </div>


        <RegisterForEvent  
            eventId={eventId} 
            setSelect={setEventId} 
            open={open} 
            setOpen={setOpen} 
            showEvent={openV}
            handleGroup={handleGroupReg}
            setShowEvent={setOpenV}
            showGroup={openG}
            handleEvent={handleEventReg}
            setSelectGroupId={setGroupId}
            groupId={groupId}
            setShowGroup={setOpenG}
            loading={regLoading}
            error={regError}
        />


        {
            isRegisterItem?
            <AddButton disabled={loading} onClick={openEventReg} text={loading ? "processing...":"Register for an event"} noIcon smallText className="rounded w-fit justify-center py-1 md:py-2 self-end md:self-center" />
            :
            isCheckItem?
            <AddButton disabled={loading} onClick={checkInMember} text={loading ? "processing...":"Check-in"} noIcon smallText className="rounded w-fit justify-center py-1 md:py-2 self-end md:self-center" />
            :
            isGroupItem ?
            <AddButton disabled={loading} onClick={handleAddToGroup} text={loading ? "adding...":"Add to group"} noIcon smallText className="rounded w-fit justify-center py-1 md:py-2 self-end md:self-center" />
            :
            <Link className="flex self-end md:self-center" href={{pathname:'/dashboard/events/badges/new/print', query:{memberId:member._id}}} >
                <AddButton text="Open" noIcon smallText className="rounded w-fit justify-center" />
            </Link>
        }
    </div>
  )
}

export default BadgeSearchItem