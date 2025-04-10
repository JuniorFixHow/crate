'use client'

import { useEffect, useState } from "react"
import SingleAssignmentDetails from "./SingleAssignmentDetails";
import SingleAssignmentTable from "./SingleAssignmentTable";
import { IRegistration } from "@/lib/database/models/registration.model";
import { IGroup } from "@/lib/database/models/group.model";
import { useSearchParams } from "next/navigation";
import { getGroup } from "@/lib/actions/group.action";
import { getReg } from "@/lib/actions/registration.action";
import { IRoom } from "@/lib/database/models/room.model";
import { IEvent } from "@/lib/database/models/event.model";


const SingleAssignmentContent = ({id}:{id:string}) => {
    const [currentGroup, setCurrentGroup] = useState<IGroup|null>(null);
    const [currentRoom, setCurrentRoom] = useState<IRoom|null>(null);
    const [currentRegistration, setCurrentRegistration] = useState<IRegistration|null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [eventId, setEventId] = useState<string>('');
    const searchParams = useSearchParams();
    const type = searchParams.get('type');

    useEffect(()=>{
      const fetchData = async()=>{
        if(id && type){
          try {
            if(type === 'Group'){
              const res:IGroup = await getGroup(id);
              setCurrentGroup(res);
              if(res.eventId)
              {
                const event = res?.eventId as IEvent;
                setEventId(event?._id);
              }
            }else{
              const res:IRegistration = await getReg(id);
              setCurrentRegistration(res);
              if(res.eventId){
                const event = res?.eventId as IEvent;
                setEventId(event?._id);
              }
            }
          } catch (error) {
            console.log(error);
          }finally{
            setLoading(false);
          }
        }
      }

      fetchData();
        
    },[id, type])


  return (
    <div className="flex flex-col w-full pb-10 gap-12 lg:gap-6 lg:flex-row items-start lg:items-stretch bg-white p-5 rounded border dark:bg-[#0F1214]" >
        <SingleAssignmentDetails currentRoom={currentRoom!} loading={loading} type={type!} GroupData={currentGroup!} MemberData={currentRegistration!} />
        <SingleAssignmentTable currentRegistration={currentRegistration!} currentGroup={currentGroup!} eventId={eventId} type={type!} currentRoom={currentRoom!} setCurrentRoom={setCurrentRoom} />
    </div>
  )
}

export default SingleAssignmentContent