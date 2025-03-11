'use client'
import AddButton from "@/components/features/AddButton"
import Image from "next/image"
import {  useState } from "react"
import MRegisteration from "./MRegisteration"
import RegisterForEvent from "@/components/shared/RegisterForEvent"
import { IMember } from "@/lib/database/models/member.model"
import { deleteMember } from "@/lib/actions/member.action"
import { useRouter } from "next/navigation"
// import CircularIndeterminate from "./CircularProgress"
import { ErrorProps } from "@/types/Types"
import { createRegistration } from "@/lib/actions/registration.action"
import { IRegistration } from "@/lib/database/models/registration.model"
import { addMemberToGroup, getEventGroups } from "@/lib/actions/group.action"
import { IGroup } from "@/lib/database/models/group.model"
import { useFetchEvents } from "@/hooks/fetch/useEvent"
import { IChurch } from "@/lib/database/models/church.model"
import Link from "next/link"
// import { useFetchMemberRelationships } from "@/hooks/fetch/useRelationship"
// import Subtitle from "../features/Subtitle";
import '@/components/features/customscroll.css';
import { IVendor } from "@/lib/database/models/vendor.model"

export type MDetailsProps = {
  currentMember:IMember
}
const MDetails = ({currentMember}:MDetailsProps) => {
  const [hasOpen, setHasOpen] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false);
  const [eventId, setEventId] = useState<string>('');
  // const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string|null>(null);
  // const [currentMember, setCurrentMember] = useState<IMember|null>(null);

  const [openG, setOpenG] = useState<boolean>(false);
  const [openV, setOpenV] = useState<boolean>(false);
  const [regLoading, setRegLoading] = useState<boolean>(false);
  const [regError, setRegError] = useState<ErrorProps>(null);
  const [groupId, setGroupId] = useState<string>('');

  const church = currentMember?.church as IChurch || undefined;
  const registerer = currentMember?.registeredBy as unknown as IVendor;

  const router = useRouter();
  const {events} = useFetchEvents();


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
            setRegError({message:'Error occured registering the member for the group', error:true});
        }finally{
            setRegLoading(false);
        }
    }

      // if(fetchLoading) return <CircularIndeterminate className={`${fetchLoading ? 'flex-center':'hidden'}`}  error={error} />

  return (
    <>
    {
      hasOpen ? 
      <MRegisteration setHasOpen={setHasOpen} currentMemeber={currentMember!} />
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

        <div className="flex w-full h-full flex-col gap-8 lg:gap-0 lg:flex-row">
          <div className="flex flex-col gap-3 items-start flex-1">
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
                <span className="text-[0.8rem] font-semibold" >Phone:</span>
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
              {
                church &&
                <div className="flex flex-row items-start gap-4">
                  <span className="text-[0.8rem] font-semibold" >Church:</span>
                  <Link  href={{pathname:'/dashboard/churches', query:{id:church._id}}}  className="table-link" >{church?.name}</Link>
                </div>
              }
              {/* <div className="flex flex-row items-center gap-4">
                <span className="text-[0.8rem] font-semibold" >Group/Family:</span>
                <span className="text-[0.8rem] text-slate-400" >Yes <Link className="text-blue-800 hover:underline font-bold" href={`/dashboard/group/${member?.groupId}`} >({member?.groupId})</Link></span>
              </div> */}
              <div className="flex flex-row items-center gap-4">
                <span className="text-[0.8rem] font-semibold" >Role:</span>
                <span className="text-[0.8rem] text-slate-400" >{currentMember?.role}</span>
              </div>
              <div className="flex flex-row items-center gap-4">
                <span className="text-[0.8rem] font-semibold" >Employment Status:</span>
                <span className="text-[0.8rem] text-slate-400" >{currentMember?.employ}</span>
              </div>
              <div className="flex flex-row items-center gap-4">
                <span className="text-[0.8rem] font-semibold" >Marital status:</span>
                <span className="text-[0.8rem] text-slate-400" >{currentMember?.marital}</span>
              </div>
              {/* <div className="flex flex-row items-center gap-4">
                <span className="text-[0.8rem] font-semibold" >Dietary restrictions:</span>
                <span className="text-[0.8rem] text-slate-400" >{currentMember?.dietary} {currentMember?.allergy && `(${currentMember?.allergy})`}</span>
              </div> */}
              {
                currentMember?.note &&
                <div className="flex flex-row items-start gap-4">
                  <span className="text-[0.8rem] font-semibold" >Member note:</span>
                  <span className="text-[0.8rem] md:w-[30rem] text-slate-400" >{currentMember?.note}</span>
                </div>
              }
              {
                registerer &&
                <div className="flex flex-row items-center gap-4">
                  <span className="text-[0.8rem] font-semibold" >Registered By:</span>
                  <span className="text-[0.8rem] text-slate-400" >{registerer?.name}</span>
                </div>
              }
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
                    events.length>0 &&
                    <AddButton isCancel onClick={openEventReg} noIcon className="rounded" smallText text="Register Event" />
                  }
                <AddButton onClick={handleDeleteMember}  isDanger noIcon className="rounded" smallText text="Delete" />
              </div>
          </div>
          
          {/* <div className="flex flex-1 flex-col gap-4 h-full overflow-y-scroll scrollbar-custom">
            <Subtitle text="Relationships" />
            {
              relationships?.map((relationship)=>{
                const members = relationship?.members as unknown as IMember[];
                return(
                  <div key={relationship?._id} className="flex flex-col gap-1">
                    <span className="font-semibold" >{relationship?.type}</span>

                    <div className="flex flex-col gap-2 ml-8">
                      {
                        members
                        ?.filter((item)=>item?._id !== currentMember?._id)
                        ?.map((member)=>(
                          <Link key={member?._id} className="table-link" href={`/dashboard/members/${member?._id}`} >{member?.name}</Link>
                        ))
                      }
                    </div>
                  </div>
                )
              })
            }
          </div> */}
        </div>

      </div>
    }
    </>
  )
}

export default MDetails