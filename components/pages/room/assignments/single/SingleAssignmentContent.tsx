'use client'

import { EventRegistrations } from "@/components/Dummy/Data";
import { EventRegProps } from "@/types/Types"
import { useEffect, useState } from "react"
import SingleAssignmentDetails from "./SingleAssignmentDetails";
import SingleAssignmentTable from "./SingleAssignmentTable";

const SingleAssignmentContent = ({id}:{id:string}) => {
    const [currentAssignment, setCurrentAssignment] = useState<EventRegProps|null>(null);
    useEffect(()=>{
        if(id){
            setCurrentAssignment(EventRegistrations.filter(item=>item.id === id)[0]);
        }
    },[id])
  return (
    <div className="flex flex-col pb-10 gap-6 lg:flex-row items-start lg:items-stretch bg-white p-5 rounded border dark:bg-black" >
        <SingleAssignmentDetails data={currentAssignment!} />
        <SingleAssignmentTable data={currentAssignment!} />
    </div>
  )
}

export default SingleAssignmentContent