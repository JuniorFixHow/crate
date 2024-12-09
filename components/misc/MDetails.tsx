'use client'
import AddButton from "@/components/features/AddButton"
import Image from "next/image"
import { useEffect, useState } from "react"
import MRegisteration from "./MRegisteration"
import RegisterForEvent from "@/components/shared/RegisterForEvent"
import { IMember } from "@/lib/database/models/member.model"
import { deleteMember, getMember } from "@/lib/actions/member.action"
import { useRouter } from "next/navigation"
import CircularIndeterminate from "./CircularProgress"
import { ErrorProps } from "@/types/Types"
import { createRegistration } from "@/lib/actions/registration.action"
import { IRegistration } from "@/lib/database/models/registration.model"
import { addMemberToGroup, getEventGroups } from "@/lib/actions/group.action"
import { IGroup } from "@/lib/database/models/group.model"
import { useFetchEvents } from "@/hooks/fetch/useEvent"

export type MDetailsProps = {
  id:string
}
const MDetails = ({id}:MDetailsProps) => {
  const [hasOpen, setHasOpen] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false);
  const [eventId, setEventId] = useState<string>('');
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [error, setError] = useState<string|null>(null);
  const [currentMember, setCurrentMember] = useState<IMember|null>(null);

  const [openG, setOpenG] = useState<boolean>(false);
  const [openV, setOpenV] = useState<boolean>(false);
  const [regLoading, setRegLoading] = useState<boolean>(false);
  const [regError, setRegError] = useState<ErrorProps>(null);
  const [groupId, setGroupId] = useState<string>('');

  const router = useRouter();
  const {events} = useFetchEvents();

    useEffect(() => {
        const fetchChurch = async () => {
          try {
            if (id) {
              const member: IMember = await getMember(id); // Await the promise
              setCurrentMember(member);
              setError(null);
            } 
          } catch (error) {
            console.log(error)
            setError('Error occured fetching member data')
          }finally{
            setFetchLoading(false)
          }
        };
      
        fetchChurch(); // Call the async function
      }, [id]);

      const handleDeleteMember = async()=>{
        if(currentMember){
          try {
            await deleteMember(currentMember._id);
            router.push('/dashboard/members');
          } catch (error) {
            console.log(error)
          }
        }
      }

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
            if(currentMember){
                setRegLoading(true);
                const data:Partial<IRegistration> = {
                    memberId:currentMember._id,
                    eventId,
                    badgeIssued:'No',
                } 
                const res:ErrorProps = await createRegistration(currentMember._id, eventId, data);
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
            if(currentMember){
                setRegLoading(true);
                const res:ErrorProps = await addMemberToGroup(groupId, currentMember._id, eventId)
                setRegError(res);
            }
        } catch (error) {
            console.log(error);
            setRegError({message:'Error occured registering the member for the event', error:true});
        }finally{
            setRegLoading(false);
        }
    }

      if(fetchLoading) return <CircularIndeterminate className={`${fetchLoading ? 'flex-center':'hidden'}`}  error={error} />

  return (
    <>
    {
      hasOpen ? 
      <MRegisteration setHasOpen={setHasOpen} currentMemeber={currentMember!} setCurrentMember={setCurrentMember} />
      :
      <div className="px-8 py-4 flex-col dark:bg-black dark:border dark:border-t-0 flex md:flex-row gap-6 items-start bg-white" >
        {
          currentMember &&
          <div className="flex items-center bg-[#f1f1f1] p-3 justify-center rounded-full">
            <Image height={100} width={100} src={currentMember?.photo} className="object-contain rounded-full" alt="member photo" />
          </div>
        }
        
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

        <div className="flex flex-col gap-3 items-start">
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Name:</span>
              <span className="text-[0.8rem] text-slate-400" >{currentMember?.name}</span>
            </div>
            {
              currentMember?.email &&
              <div className="flex flex-row items-center gap-4">
                <span className="text-[0.8rem] font-semibold" >Email:</span>
                <span className="text-[0.8rem] text-slate-400" >{currentMember?.email}</span>
              </div>
            }
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Number:</span>
              <span className="text-[0.8rem] text-slate-400" >{currentMember?.phone}</span>
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Gender:</span>
              <span className="text-[0.8rem] text-slate-400" >{currentMember?.gender}</span>
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Age Group:</span>
              <span className="text-[0.8rem] text-slate-400" >{currentMember?.ageRange}</span>
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Status:</span>
              <span className="text-[0.8rem] text-slate-400" >{currentMember?.status}</span>
            </div>
            {/* <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Group/Family:</span>
              <span className="text-[0.8rem] text-slate-400" >Yes <Link className="text-blue-800 hover:underline font-bold" href={`/dashboard/group/${member?.groupId}`} >({member?.groupId})</Link></span>
            </div> */}
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Voice:</span>
              <span className="text-[0.8rem] text-slate-400" >{currentMember?.voice}</span>
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Marital status:</span>
              <span className="text-[0.8rem] text-slate-400" >{currentMember?.marital}</span>
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Dietary restrictions:</span>
              <span className="text-[0.8rem] text-slate-400" >{currentMember?.dietary} {currentMember?.allergy && `(${currentMember?.allergy})`}</span>
            </div>
            {
              currentMember?.note &&
              <div className="flex flex-row items-start gap-4">
                <span className="text-[0.8rem] font-semibold" >Registration note:</span>
                <span className="text-[0.8rem] md:w-[30rem] text-slate-400" >{currentMember?.note}</span>
              </div>
            }
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Registered By:</span>
              <span className="text-[0.8rem] text-slate-400" >{typeof currentMember?.registeredBy === 'object' && 'name' in currentMember?.registeredBy && currentMember?.registeredBy.name}</span>
            </div>
            {
              currentMember ?
              <div className="flex flex-row items-center gap-4">
                <span className="text-[0.8rem] font-semibold" >Registered On:</span>
                <span className="text-[0.8rem] text-slate-400" >{new Date(currentMember.createdAt!)?.toDateString()}</span>
              </div>
              :
              null
            }

            <div className="flex flex-row items-center gap-8 mt-4">
              <AddButton onClick={()=>setHasOpen(true)} noIcon className="rounded" smallText text="Edit" />
                {
                  events.length &&
                  <AddButton isCancel onClick={openEventReg} noIcon className="rounded" smallText text="Register Event" />
                }
              <AddButton onClick={handleDeleteMember}  isDanger noIcon className="rounded" smallText text="Delete" />
            </div>
          </div>
      </div>
    }
    </>
  )
}

export default MDetails